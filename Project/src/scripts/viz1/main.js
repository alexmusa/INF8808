import * as viz from './viz.js'
import * as scales from './scales.js'
import * as tooltip from './tooltip.js'
import * as legend from './legend.js'

/**
 * This class represents the scatter plot.
 * It is responsible for displaying the categories that correspond to the current user selecions.
 */
export default class Viz1 {
  /**
   * Sets the dimensions of the plot.
   */
  computeSizing () {
    this.margin = { top: 30, right: 10, bottom: 70, left: 70 }
    this.dimension = {
      width: document.getElementById('scatter-plot').offsetWidth,
      height: 9 * document.getElementById('scatter-plot').offsetWidth / 16
    }
    this.graphSize = {
      width: this.dimension.width - this.margin.right - this.margin.left,
      height: this.dimension.height - this.margin.bottom - this.margin.top
    }
  }

  constructor (dataHandler) {
    // Initialize members
    this.dataHandler = dataHandler
    this.computeSizing()

    const g = viz.generateG(this.margin,
      this.dimension.width,
      this.dimension.height)

    this.tip = tooltip.init(g)
    viz.appendAxes(g)
    viz.appendGraphLabels(g)
    viz.positionLabels(g, this.graphSize.width, this.graphSize.height)

    this.update()

    this.dataHandler.register('selectedAttributes', this)
    this.dataHandler.register('timeRange1', this)
    this.dataHandler.register('timeRange2', this)
    this.dataHandler.register('financingRange', this)
    this.dataHandler.register('numberContractsRange', this)
  }

  /**
   * Updates the scatter plot.
   * This method is called whenever the user changes his attributes selection.
   *
   * @param {Map} categories All categories to display
   */
  update () {
    const categories = this.dataHandler.getScatterPlot()

    let values = []
    if (categories[1] !== undefined) {
      values = values.concat(
        Array.from(categories[0].values()),
        Array.from(categories[1].values())
      )
    } else {
      values = Array.from(categories[0].values())
    }

    this.xScale = scales.setXScale(this.graphSize.width, values)
    this.yScale = scales.setYScale(this.graphSize.height, values)

    viz.drawAxis(this.xScale, this.yScale, this.graphSize.height)

    viz.updatePlot(categories,
      this.xScale, this.yScale, this.tip, this.onCircleClick)
  }
}
