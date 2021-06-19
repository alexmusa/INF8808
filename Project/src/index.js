'use strict'

import Viz1 from './scripts/viz1/main'
//import Viz2 from './scripts/viz2/export.js'
import * as checkboxes from './scripts/checkboxes'
import * as preprocess from './scripts/preprocess'

(function (d3) {
  d3.csv('./telefilmCanada.csv').then((data) => {
    const dataHandler = new preprocess.DataHandler(data)
    const checkBoxesHandler = new checkboxes.CheckBoxesHandler()

    const viz1 = new Viz1(dataHandler, checkBoxesHandler)
    //const viz2 = new Viz2(dataHandler, checkBoxesHandler)

    checkBoxesHandler.setCheckboxes(dataHandler.attributes, () => viz1.update())
  })
})(d3)
