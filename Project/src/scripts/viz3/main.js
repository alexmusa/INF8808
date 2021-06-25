import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz'
import Slider from './slider.js'
import * as legend from './legend.js'

export default class Viz3 {
  constructor () {
    // Initialize members
    this.slider = new Slider()
    this.svgSize = { width: 1100, height: 600 }
    this.margin = { top: 30, right: 10, bottom: 100, left: 70 }

    this.setSizing()

    const g = helper.generateG(this.margin)
    this.g = g

    helper.appendAxes(g)
    helper.appendGraphLabels(g)

    viz.positionLabels(g, this.graphSize.width, this.graphSize.height)
  }

  setSizing () {
    this.graphSize = {
      width: this.svgSize.width - this.margin.right - this.margin.left,
      height: this.svgSize.height - this.margin.bottom - this.margin.top
    }
    helper.setCanvasSize(this.svgSize.width, this.svgSize.height)
  }

  init (categoriesMap) {
    this.categories = this.extractCategories(categoriesMap)
    this.update(this.categories)
    this.slider.init(this.graphSize.width, this.categories, (r) => { this.updateFromSlider(r) })
  }

  extractCategories (categoriesMap) {
    const categories = [] // [{label, date, totalFinancing}, ...]
    categoriesMap.forEach(categoryData => {
      // Sort contracts by date. TODO: check if this is really necessary.
      const contracts = categoryData[1][0].contracts
      contracts.sort((a, b) => a.Date - b.Date)

      // Compute financing evolution for this category.
      const category = { label: categoryData[0], contracts: [] }
      let totalFinancing = 0
      contracts.forEach(d => {
        totalFinancing += d['Final Value']
        category.contracts.push({ date: d.Date, totalFinancing: totalFinancing })
      })

      // Save category data
      categories.push(category)
    })
    return categories
  }

  getCategoriesInRange (categories, range) {
    const categoriesInRange = []
    categories.forEach(c => {
      categoriesInRange.push({
        label: c.label,
        contracts: c.contracts.filter(contract => contract.date >= range.startDate && contract.date <= range.endDate)
      })
    })
    return categoriesInRange
  }

  // This method is called whenever the user changes their selection
  update (categories, range) {
    if (range) categories = this.getCategoriesInRange(categories, range)

    this.xScale = scales.setXScale(this.graphSize.width, categories)
    this.yScale = scales.setYScale(this.graphSize.height, categories)
    helper.drawAxis(this.g, this.xScale, this.yScale, this.graphSize.height)
    viz.update(this.g, categories, this.xScale, this.yScale, this.tip)
    legend.draw(categories, this.graphSize, this.margin)
  }

  updateFromSlider (range) {
    this.update(this.categories, range)
  }

  onCategorySelection (timedCategoriesSelected) {
    d3.select('#history-btn').attr('disabled', timedCategoriesSelected ? null : 'true')
  }
}
