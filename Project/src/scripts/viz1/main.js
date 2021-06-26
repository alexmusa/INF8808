import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz.js'
import * as tooltip from './tooltip.js'
import * as legend from './legend.js'
import * as sliders from './sliders.js'

/**
 * This class represents the scatter plot.
 * It is responsible for displaying the categories that correspond to the current user selecions.
 */
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

    this.clickHandler = new ClickHandler(
      (event, category) => this.onCategoryClick(event, category),
      (event, category) => this.viz2.update(category))
    this.onCircleClick = (event, category) => this.clickHandler.onClick(event, category)

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

  /**
   * Sets the dimensions of the plot.
   */
  setSizing () {
    this.graphSize = {
      width: this.svgSize.width - this.margin.right - this.margin.left,
      height: this.svgSize.height - this.margin.bottom - this.margin.top
    }
    helper.setCanvasSize(this.svgSize.width, this.svgSize.height)
  }

  /**
   * Udpates the scatter to fit a new time range.
   * This method is called whenever the user changes their time range selection on the slider.
   */
  updateTimeRange () {
    const categories = this.getCategories()

    this.checkBoxesHandler.filterByAttributesSelection(categories)

    this.timedCategories.forEach((timedCategories, categoryKey) => {
      const lastTimedCategory = timedCategories[0]
      timedCategories.unshift(lastTimedCategory)

      const category = categories.get(categoryKey)
      category.period = this.slider.range
      category.selectionId = lastTimedCategory.selectionId
      timedCategories[0] = category
    })

    const timedCategories = Array.from(this.timedCategories.values())
    const allCategories = Array.from(categories.values()).concat([].concat(...timedCategories))

    this.xScale = scales.setXScale(this.graphSize.width, allCategories)
    this.yScale = scales.setYScale(this.graphSize.height, allCategories)

    helper.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.update(categories, this.timedCategories,
      this.xScale, this.yScale, this.tip, this.onCircleClick)
  }

  /**
   * Updates the scatter plot.
   * This method is called whenever the user changes his attributes selection.
   *
   * @param {Map} categories All categories to display
   */
  update (categories) {
    if (!categories) categories = this.getCategories()

    this.checkBoxesHandler.filterByAttributesSelection(categories)

    this.availSelectionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    this.timedCategories = new Map()

    const catValues = Array.from(categories.values())
    this.xScale = scales.setXScale(this.graphSize.width, catValues)
    this.yScale = scales.setYScale(this.graphSize.height, catValues)

    helper.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.update(categories, this.timedCategories,
      this.xScale, this.yScale, this.tip, this.onCircleClick)

    this.viz3.onCategorySelection(this.timedCategories.size > 0)
  }

  /**
   * Computes the categories that correspond to the current user selections.
   *
   * @returns {Map} The corresponding categories
   */
  getCategories () {
    return this.dataHandler.getCategoryData(this.slider.range, this.checkBoxesHandler.selectedBoxes)
  }

  /**
   * Registers a category when the user clicks the corresponding circle and updates history button accordingly.
   *
   * @param {*} event The event fired by the selecion
   * @param {*} category The category whose circle was clicked
   */
  onCategoryClick (event, category) {
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
}

/**
 * This class is responsible for detecting whether the user is performing
 * a single click or a double click on a category circle.
 */
class ClickHandler {
  constructor (doClickAction, doDoubleClickAction) {
    this.timer = 0
    this.delay = 200
    this.prevent = false

    this.doClickAction = doClickAction
    this.doDoubleClickAction = doDoubleClickAction
  }

  /**
   * Executes the click action handler that corresponds to the detected click type.
   *
   * @param {*} event The event fired by the click
   * @param {*} ob A parameter to pass to the click actions handlers
   */
  onClick (event, ob) {
    if (event.detail === null) {
      this.doClickAction(event, ob)
    } else if (event.detail === 1) {
      this.timer = setTimeout(() => {
        if (!this.prevent) {
          this.doClickAction(event, ob)
        }
        this.prevent = false
      }, this.delay)
    } else if (event.detail === 2) {
      clearTimeout(this.timer)
      this.prevent = true
      this.doDoubleClickAction(event, ob)
    }
  }
}
