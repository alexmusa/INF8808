import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz'
import Slider from './slider.js'
import * as legend from './legend.js'

/**
 * This class represents the line chart.
 * It is responsible for displaying the evolution of the total financing for a given set of categories.
 */
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

  /**
   * Sets the dimensions of the chart.
   */
  setSizing () {
    this.graphSize = {
      width: this.svgSize.width - this.margin.right - this.margin.left,
      height: this.svgSize.height - this.margin.bottom - this.margin.top
    }
    helper.setCanvasSize(this.svgSize.width, this.svgSize.height)
  }

  /**
   * Initializes the chart.
   * 
   * @param {Map} categoriesMap All categories to display
   */
  init (categoriesMap) {
    this.categories = this.extractCategories(categoriesMap)
    this.update(this.categories)
    this.slider.init(this.graphSize.width, this.categories, (r) => { this.updateFromSlider(r) })
    legend.init(this.categories)
  }

  /**
   * Computes the total financing evlotion for each category.
   * 
   * @param {Map} categoriesMap All categories to display
   * @returns {object[]} The total financing evolution for the given categories
   */
  extractCategories (categoriesMap) {
    const categories = [] // [{label, date, totalFinancing}, ...]

    categoriesMap.forEach(categoryData => {
      // Sort contracts by date.
      const contracts = categoryData[1][0].contracts
      contracts.sort((a, b) => a.Date - b.Date)

      // Compute financing evolution for this category.
      const category = {
        label: categoryData[0],
        contracts: [],
        selectionId: categoryData[1][0].selectionId
      }
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

  /**
   * Filters out categories that are out of the given range.
   * 
   * @param {object[]} categories All categories to filter
   * @param {object} range The range within which the resulting categories should be
   * @returns {object[]} All categories that fit in the given range
   */
  getCategoriesInRange (categories, range) {
    const categoriesInRange = []
    categories.forEach(c => {
      categoriesInRange.push({
        label: c.label,
        selectionId: c.selectionId,
        contracts: c.contracts.filter(contract => contract.date >= range.startDate && contract.date <= range.endDate)
      })
    })
    return categoriesInRange
  }

  /**
   * Updates the line chart.
   * This method is called whenever the user changes their selection.
   * 
   * @param {object[]} categories All categories to display
   * @param {object} range The range within which all displayed categories should be
   */
  update (categories, range) {
    if (range) categories = this.getCategoriesInRange(categories, range)

    this.xScale = scales.setXScale(this.graphSize.width, categories)
    this.yScale = scales.setYScale(this.graphSize.height, categories)
    helper.drawAxis(this.g, this.xScale, this.yScale, this.graphSize.height)
    viz.update(this.g, categories, this.xScale, this.yScale, this.tip)
  }

  /**
   * This method is called whenever the slider range is changed by the user.
   * 
   * @param {object} range The range within which all displayed categories should be
   */
  updateFromSlider (range) {
    this.update(this.categories, range)
  }

  /**
   * Enables the history button according to the user times category selection.
   * This method is called whenever an attribute is selected/de-selected by the user.
   * 
   * @param {boolean} timedCategoriesSelected True if at least 1 timed category is selected.
   */
  onCategorySelection (timedCategoriesSelected) {
    d3.select('#history-btn').attr('disabled', timedCategoriesSelected ? null : 'true')
  }
}
