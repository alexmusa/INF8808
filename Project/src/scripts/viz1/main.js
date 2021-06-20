import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz.js'
import * as tooltip from './tooltip.js'
import * as sliders from './sliders.js'
import { color } from 'd3'

export default class Viz1 {
  constructor (dataHandler, checkBoxesHandler, synchronizedViz) {
    // Initialize members
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
    this.slider = new sliders.Slider()
    this.svgSize = { width: 1100, height: 600 }
    this.margin = { top: 30, right: 10, bottom: 100, left: 70 }
    this.availColors = d3.schemeCategory10
    this.synchronizedViz = synchronizedViz
    this.timedCategories = new Map()
    this.onCircleClick = (event, category) => this.onCategoryClick(event, category)

    this.setSizing()

    const { g, tip } = tooltip.init(this.margin)
    this.tip = tip

    helper.appendAxes(g)
    helper.appendGraphLabels(g)

    viz.positionLabels(g, this.graphSize.width, this.graphSize.height)

    const categories = this.getCategories()
    this.slider.init(this.graphSize.width, categories, () => this.update())
    this.update(categories)
  }

  setSizing () {
    this.graphSize = {
      width: this.svgSize.width - this.margin.right - this.margin.left,
      height: this.svgSize.height - this.margin.bottom - this.margin.top
    }
    helper.setCanvasSize(this.svgSize.width, this.svgSize.height)
  }

  // This method is called whenever the user changes their selection
  update (categories) {
    if (!categories) categories = this.getCategories()

    this.timedCategories.forEach((timedCategories, categoryKey) => {
      var lastTimedCategory = timedCategories[0]
      lastTimedCategory.isNew = false
      lastTimedCategory.isLast = true
      timedCategories.unshift(lastTimedCategory)

      categories.every(category => {
        if (JSON.stringify(category.attributes) === categoryKey) {
          category.period = this.slider.range
          category.color = lastTimedCategory.color
          category.isNew = true
          category.isLast = false
          timedCategories[0] = category
          return false // break loop
        }
        return true // continue loop
      })
      timedCategories.forEach((timedCategory, index) => {
        if (index > 0) categories.push(timedCategory)
      })
    })

    this.xScale = scales.setXScale(this.graphSize.width, categories)
    this.yScale = scales.setYScale(this.graphSize.height, categories)

    helper.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.update(categories, this.xScale, this.yScale, this.tip, this.onCircleClick)
  }

  getCategories () {
    return this.dataHandler.getCategoryData(this.slider.range, this.checkBoxesHandler.selectedBoxes)
  }

  onCategoryClick (event, category) {
    var circle = d3.select(event.target)
    const categoryColor = category.color
    const categoryKey = JSON.stringify(category.attributes)

    if (circle.attr('class') === 'selected') {
      circle.attr('class', '')
      this.availColors.unshift(categoryColor)
      category.period = null
      category.color = 'black'
      this.timedCategories.set(categoryKey, null)
    } else if (this.availColors.length > 0) {
      circle.attr('class', 'selected')
      category.period = this.slider.range
      category.color = this.availColors.pop()
      this.timedCategories.set(categoryKey, [category])
    }
    circle.style('fill', category.color)

    this.synchronizedViz.update(category)
  }
}
