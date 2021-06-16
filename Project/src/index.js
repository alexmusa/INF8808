'use strict'

import * as viz1 from './scripts/viz1/export.js'
import * as viz2 from './scripts/viz2/export.js'

(function (d3) {
  d3.csv('./telefilmCanada.csv').then((data) => {
    console.log(data)
  })
})(d3)
