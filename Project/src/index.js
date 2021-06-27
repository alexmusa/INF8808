'use strict'

import Viz1 from './scripts/viz1/main'
// import Viz2 from './scripts/viz2/main'
import Time from './scripts/viz1/time'
import * as checkboxes from './scripts/checkboxes'
import * as preprocess from './scripts/preprocess'
import Viz3 from './scripts/viz3/main'

(function (d3) {
  d3.csv('./telefilmCanada.csv').then((data) => {
    const dataHandler = new preprocess.DataHandler(data)
    const checkboxesHandler = new checkboxes.CheckBoxesHandler(dataHandler)
    const viz1 = new Viz1(dataHandler)
    const time = new Time(dataHandler)
  })
})(d3)
