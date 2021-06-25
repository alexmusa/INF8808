import * as viz from './viz'

export default class Viz2 {
  constructor (dataHandler, checkBoxesHandler) {
    this.dataHandler = dataHandler
    this.checkBoxesHandler = checkBoxesHandler
    this.doubleClickHandler = new DoubleClickHandler()
  }

  // This method is called whenever the user changes their selection
  update (category) {
    if (this.doubleClickHandler.isDoubleClick()) {
      viz.update(category)
      d3.select('#graph-2-modal-toggle').dispatch('click')
    }
  }
}

class DoubleClickHandler {
  constructor () {
    this.waitingSecondClick = false
  }

  isDoubleClick () {
    if (this.waitingSecondClick) {
      return true
    } else {
      this.waitingSecondClick = true
      setTimeout(() => {
        this.waitingSecondClick = false
      }, 500)
      return false
    }
  }
}
