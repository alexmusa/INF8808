export class Zoom {
  constructor () {
    this.financingRange = undefined
    this.contractsRange = undefined
    this.ticksCount = 12
  }

  getAllTotalFinancings (categories) {
    const totalFinancings = new Set()
    categories.forEach(category => {
      totalFinancings.add(category.totalFinancing)
    })
    return Array.from(totalFinancings).sort((amount1, amount2) => amount1 - amount2)
  }

  init (width, height, categories, onNewRangeSelected) {
    const totalFinancings = this.getAllTotalFinancings(categories)
    this.financingRange = { start: 0, end: d3.max(totalFinancings) }

    // compute tick values
    const yInterval = (this.financingRange.end - this.financingRange.start) / this.ticksCount
    const tickValues = d3.range(0, this.ticksCount + 1).map((d) => {
      return this.financingRange.start + yInterval * d
    })

    const ySlider = d3.sliderVertical()
      .min(this.financingRange.start)
      .max(this.financingRange.end)
      .height(height - 60)
      .tickFormat(d3.format('.2s'))
      .tickValues(tickValues)
      .default([this.financingRange.start, this.financingRange.end])
      .fill('#2196f3')
      .on('onchange', val => {
        this.updateValue(val)
      })
      .on('end', val => {
        this.financingRange = { start: val[0], end: val[1] }
        this.updateValue(val)
        onNewRangeSelected(this.financingRange)
      })

    const gFinancing = d3.select('div#vertical-slider-container')
      .append('svg')
      .attr('width', 75)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(65,25)')

    gFinancing.call(ySlider)

    // d3.select('p#financing-zoom').text(
    //   ySlider.value()
    //     .map(v => v)
    //     .map(d3.format('.0s'))
    //     .join(' - ')
    // )
  }

  updateValue (value) {
    d3.select('p#financing-zoom').text(value.map(v => v)
      .map(d3.format('.0s'))
      .join(' - ')
    )
  }
}
