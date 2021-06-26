import * as viz from './viz'

/**
 * This class represents the table.
 * It is responsible for displaying all the details of the contracts under a given category. 
 */
export default class Viz2 {
  constructor (dataHandler, checkBoxesHandler) {
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
  }

  /**
   * This method is called whenever the user changes their selection
   * 
   * @param {object} category The category to display in the table
   */
  update (category) {
    viz.update(category)
    d3.select('#graph-2-modal-toggle').dispatch('click')
  }
}
