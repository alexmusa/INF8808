import * as helper from './helper.js'
import * as scales from './scales.js'
import * as viz from './viz.js'
import * as tooltip from './tooltip.js'
import * as legend from './legend.js'
import * as sliders from './sliders.js'

export default class Viz2 {
    svgSize = { width: 1100, height: 600 }
    margin = { top: 30, right: 10, bottom: 100, left: 70 }

    constructor(dataHandler, checkBoxesHandler) {
        this.dataHandler = dataHandler
        this.checkBoxesHandler = checkBoxesHandler

        this.setSizing()
    }

    setSizing() {
        this.graphSize = {
          width: this.svgSize.width - this.margin.right - this.margin.left,
          height: this.svgSize.height - this.margin.bottom - this.margin.top
        }
        helper.setCanvasSize(this.svgSize.width, this.svgSize.height)
    }

    // This method is called whenever the user changes their selection
    update(categories) {
    }
}
