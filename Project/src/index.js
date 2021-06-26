'use strict'

import Viz1 from './scripts/viz1/main'
import Viz2 from './scripts/viz2/main'
import * as checkboxes from './scripts/checkboxes'
import * as preprocess from './scripts/preprocess'
import * as walkthrough from './scripts/walkthrough'
import Viz3 from './scripts/viz3/main'

(function (d3) {
  d3.csv('./telefilmCanada.csv').then((data) => {
    const dataHandler = new preprocess.DataHandler(data)
    const checkBoxesHandler = new checkboxes.CheckBoxesHandler()

    const viz2 = new Viz2(dataHandler, checkBoxesHandler)
    const viz1 = new Viz1(dataHandler, checkBoxesHandler, viz2, new Viz3())

    checkBoxesHandler.setCheckboxes(dataHandler.attributes, () => viz1.update())

    var wt = walkthrough.init()
    d3.select('header > h2 > text').on('click', () => wt.start())
    wt.start()
  })
})(d3)
