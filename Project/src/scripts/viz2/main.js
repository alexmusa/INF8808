import * as viz from './viz'

export default class Viz2 {
  constructor (dataHandler, checkBoxesHandler) {
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
  }

  // This method is called whenever the user changes their selection
  update (category) {
    viz.update(category)
    d3.select('#graph-2-modal-toggle').dispatch('click')
  }
}
