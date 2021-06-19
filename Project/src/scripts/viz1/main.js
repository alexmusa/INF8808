import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz.js'
import * as tooltip from './tooltip.js'
import * as sliders from './sliders.js'

export default class Viz1 {
  constructor (dataHandler, checkBoxesHandler) {
    // Initialize members
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
    this.slider = new sliders.Slider()
    this.svgSize = { width: 1100, height: 600 }
    this.margin = { top: 30, right: 10, bottom: 100, left: 70 }

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

    this.xScale = scales.setXScale(this.graphSize.width, categories)
    this.yScale = scales.setYScale(this.graphSize.height, categories)

    helper.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.update(categories, this.xScale, this.yScale, this.tip)
  }

  getCategories () {
    return this.dataHandler.getCategoryData(this.slider.range, this.checkBoxesHandler.selectedBoxes)
  }
}
