import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz.js'
import * as tooltip from './tooltip.js'
import * as legend from './legend.js'
import * as sliders from './sliders.js'
import { color } from 'd3'

export default class Viz1 {
  constructor (dataHandler, checkBoxesHandler, viz2, viz3) {
    // Initialize members
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
    this.slider = new sliders.Slider()
    this.svgSize = { width: 1500, height: 600 }
    this.margin = { top: 30, right: 210, bottom: 100, left: 270 }
    this.availSelectionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    this.timedCategories = new Map()
    this.viz2 = viz2
    this.viz3 = viz3
    viz.registerEvolutionButtons(this, viz3)
    this.selfViz = this
    this.onCircleClick = (event, category) => this.onCategoryClick(event, category)

    this.setSizing()

    const { g, tip } = tooltip.init(this.margin)
    this.tip = tip

    helper.appendAxes(g)
    helper.appendGraphLabels(g)

    this.coordinates = [0, 0]
    viz.init(g, this.graphSize.width, this.graphSize.height,
      (event, viz) => this.onCoordinatesChange(event, this),
      (event, coordinates) => this.onScrollDomain(event, this.coordinates))

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

      var category = categories.get(categoryKey)
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
      
    this.viz3.onCategorySelection(this.timedCategories.size > 0)
  }

  getCategories () {
    return this.dataHandler.getCategoryData(this.slider.range, this.checkBoxesHandler.selectedBoxes)
  }

  onCategoryClick (event, category) {
    this.viz2.update(category)

    const categoryKey = category[0]
    category = category[1]
    const categorySelId = category.selectionId

    if (category.selectionId !== undefined) {
      category.period = undefined
      category.selectionId = undefined
      this.availSelectionIds.unshift(categorySelId)
      this.timedCategories.delete(categoryKey)
      viz.updateFromSelection(event, categorySelId, false)
      legend.updateFromSelection(categorySelId, false)
    } else if (this.availSelectionIds.length > 0) {
      category.period = this.slider.range
      category.selectionId = this.availSelectionIds.pop()
      this.timedCategories.set(categoryKey, [category])
      viz.updateFromSelection(event, category.selectionId, true)
      legend.updateFromSelection(category.selectionId, true)
    }
    this.viz3.onCategorySelection(this.timedCategories.size > 0)
  }

  onCoordinatesChange (event, viz) {
    viz.coordinates = d3.pointer(event, event.target)
  }

  onScrollDomain (event, coordinates) {
    this.xScale = scales.setDomain(this.xScale, coordinates)
    this.yScale = scales.setDomain(this.yScale, coordinates)

    viz.updateFromZoom(this.xScale, this.yScale)
  }
}
