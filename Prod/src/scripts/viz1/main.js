import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz.js'
import * as tooltip from './tooltip.js'
import * as legend from './legend.js'
import * as sliders from './sliders.js'
import { color } from 'd3'

export default class Viz1 {
  constructor (dataHandler, checkBoxesHandler, synchronizedViz) {
    // Initialize members
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
    this.slider = new sliders.Slider()
    this.svgSize = { width: 1500, height: 600 }
    this.margin = { top: 30, right: 210, bottom: 100, left: 270 }
    this.availSelectionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    this.timedCategories = new Map()
    this.synchronizedViz = synchronizedViz
    this.onCircleClick = (event, category) => this.onCategoryClick(event, category)

    this.setSizing()

    const { g, tip } = tooltip.init(this.margin)
    this.tip = tip

    helper.appendAxes(g)
    helper.appendGraphLabels(g)

    viz.positionLabels(g, this.graphSize.width, this.graphSize.height)

    const categories = this.getCategories()
    this.slider.init(this.graphSize.width, categories, () => this.updateTimeRange())
    this.update(categories)

    viz.selectFirst()
  }

  setSizing () {
    this.graphSize = {
      width: this.svgSize.width - this.margin.right - this.margin.left,
      height: this.svgSize.height - this.margin.bottom - this.margin.top
    }
    helper.setCanvasSize(this.svgSize.width, this.svgSize.height)
  }

  // This method is called whenever the user changes their selection
  updateTimeRange () {
    var categories = this.getCategories()

    this.timedCategories.forEach((timedCategories, categoryKey) => {
      var lastTimedCategory = timedCategories[0]
      timedCategories.unshift(lastTimedCategory)

      var category = categories.get(categoryKey) || {}
      if (Object.keys(category).length === 0) {
        category.numberOfContracts = 0
        category.totalFinancing = 0.0
        category.contracts = []
      }
      category.period = this.slider.range
      category.selectionId = lastTimedCategory.selectionId
      timedCategories[0] = category
    })

    var timedCategories = Array.from(this.timedCategories.values())
    var allCategories = Array.from(categories.values()).concat([].concat(...timedCategories))

    this.xScale = scales.setXScale(this.graphSize.width, allCategories)
    this.yScale = scales.setYScale(this.graphSize.height, allCategories)

    helper.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.update(categories, this.timedCategories,
      this.xScale, this.yScale, this.tip, this.onCircleClick)
  }

  // This method is called whenever the user changes his attributes selection
  update (categories) {
    if (!categories) categories = this.getCategories()

    this.availSelectionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    this.timedCategories = new Map()

    var catValues = Array.from(categories.values())
    this.xScale = scales.setXScale(this.graphSize.width, catValues)
    this.yScale = scales.setYScale(this.graphSize.height, catValues)

    helper.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.update(categories, this.timedCategories,
      this.xScale, this.yScale, this.tip, this.onCircleClick)
  }

  getCategories () {
    return this.dataHandler.getCategoryData(this.slider.range, this.checkBoxesHandler.selectedBoxes)
  }

  onCategoryClick (event, category) {
    //this.synchronizedViz.update(category)

    const categoryKey = category[0]
    category = category[1]
    const categorySelId = category.selectionId

    if (category.selectionId !== undefined) {
      category.period = undefined
      category.selectionId = undefined
      category.isSelected = undefined
      this.availSelectionIds.unshift(categorySelId)
      this.timedCategories.delete(categoryKey)
      viz.updateFromSelection(event, categorySelId, false)
      legend.updateFromSelection(categorySelId, false)
    } else if (this.availSelectionIds.length > 0) {
      category.period = this.slider.range
      category.selectionId = this.availSelectionIds.pop()
      category.isSelected = true
      this.timedCategories.set(categoryKey, [category])
      viz.updateFromSelection(event, category.selectionId, true)
      legend.updateFromSelection(category.selectionId, true)
    }
  }
}
