import { compare } from '../helper'

export default class Time {
  /**
   * Sets the dimensions of the object.
   */
  computeSizing () {
    const bounds = d3.select('#time').node().getBoundingClientRect()

    this.margin = { top: 50, right: 10, bottom: 20, left: 70 }
    this.dimension = {
      width: bounds.width,
      height: 150
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

    const g = generateG(this.margin,
      this.dimension.width,
      this.dimension.height)

    const quarters = this.dataHandler.univers.get('Quarter')
    const periods = this.dataHandler.univers.get('Period')

    this.xScale = d3.scaleBand().padding(0.05)
    updateXScale(this.xScale, periods, this.graphSize.width)
    this.yScale = d3.scaleBand().padding(0.2)
    updateYScale(this.yScale, quarters, this.graphSize.height)

    appendRects(periods, quarters, (event) => { onClick(this, event) })
    updateRects(this.xScale, this.yScale)
  }

  _set (timeRange) {
    this.dataHandler.update('timeRange', timeRange)
  }

  _get () {
    return this.dataHandler.state.timeRange.value
  }

  update () {
    const isIncluded = (newPeriod, newQuarter) => {
      return compare({ period: newPeriod, quarter: newQuarter }, this._get().start) >= 0 &&
        compare({ period: newPeriod, quarter: newQuarter }, this._get().end) <= 0
    }

    d3.select('#time-g')
      .selectAll('.heatmap-rect')
      .each(function (d, i) {
        const newQuarter = d
        const newPeriod = d3.select(this.parentNode).attr('value')
        if (isIncluded(newPeriod, newQuarter)) {
          d3.select(this).style('fill', 'black')
        } else {
          d3.select(this).style('fill', 'gray')
        }
      })
  }
}

let a = 0

function onClick (self, event) {
  const newQuarter = d3.select(event.target).attr('value')
  const newPeriod = d3.select(event.target.parentNode).attr('value')

  const range = self._get()

  if (a === 0) {
    const newStart = { period: newPeriod, quarter: newQuarter }
    if (compare(newStart, range.end) > 0) { range.start = range.end; range.end = newStart }
    else { range.start = newStart }

  } else if (a === 1) {
    const newEnd = { period: newPeriod, quarter: newQuarter }
    if (compare(newEnd, range.start) < 0) { range.end = range.start; range.start = newEnd }
    else { range.end = newEnd }
  }

  self._set(range)
  self.update()

  a++
  a = a % 2
}

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {object[]} data The data to be used
 * @param {number} width The width of the diagram
 * @param {Function} range A utilitary funtion that could be useful to generate a list of numbers in a range
 */
 export function updateXScale (xScale, data, width) {
  xScale.domain(data.sort()).range([0, width])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {string[]} neighborhoodNames The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale (yScale, data, height) {
  yScale.domain(data.sort()).range([0, height])
}

export function generateG (margin, width, height) {
  return d3.select('div#time')
    .append('svg')
    .attr('id', 'time-canvas')
    .style('width', width + 'px')
    .style('height', height + 'px')
    .append('g')
    .attr('id', 'time-g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
}

export function appendRects (period, quarter, onClick) {
  d3.select('#time-g')
    .selectAll()
    .data(period)
    .enter()
    .append('g')
    .classed('period', true)
    .attr('value', d => d)

  d3.select('#time-g')
    .selectAll('.period')
    .selectAll()
    .data(quarter)
    .enter()
    .append('rect')
    .attr('class', 'heatmap-rect')
    .attr('value', d => d)
    .on('click', onClick)
}

export function updateRects (xScale, yScale) {
  d3.select('#time-g')
    .selectAll('.period')
    .attr('transform', (d) => 'translate(' + xScale(d) + ', 0)')
    .style('fill', 'black')
    .append('text')
    .attr('transform', 'rotate(-25)')
    .style('font-size', '12px')
    .text(d => d)

  d3.select('#time-g')
    .selectAll('.heatmap-rect')
    .attr('y', (d) => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', 'black')
}
