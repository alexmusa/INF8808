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

  _set1 (timeRange) {
    this.dataHandler.update('timeRange1', timeRange)
  }

  _set2 (timeRange) {
    this.dataHandler.update('timeRange2', timeRange)
  }

  _get1 () {
    return this.dataHandler.state.timeRange1.value
  }

  _get2 () {
    return this.dataHandler.state.timeRange2.value
  }

  update () {
    const isBlue = (newPeriod, newQuarter) => {
      return compare({ period: newPeriod, quarter: newQuarter }, this._get1().start) >= 0 &&
        compare({ period: newPeriod, quarter: newQuarter }, this._get1().end) <= 0
    }

    const isRed = (newPeriod, newQuarter) => {
      if (this._get2().start === null || this._get2().end === null) {
        return false
      } else {
        return compare({ period: newPeriod, quarter: newQuarter }, this._get2().start) >= 0 &&
          compare({ period: newPeriod, quarter: newQuarter }, this._get2().end) <= 0
      }
    }

    d3.select('#time-g')
      .selectAll('.heatmap-rect')
      .each(function (d, i) {
        const newQuarter = d
        const newPeriod = d3.select(this.parentNode).attr('value')
        if (isBlue(newPeriod, newQuarter)) {
          d3.select(this).style('fill', 'blue')
        } else if (isRed(newPeriod, newQuarter)) {
          d3.select(this).style('fill', 'red')
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

  const range1 = self._get1()
  const range2 = self._get2()

  if (a === 0) {
    const newStart = { period: newPeriod, quarter: newQuarter }
    range1.start = newStart; range1.end = newStart
    self._set1(range1)
    self._set2({ start: null, end: null })
  } else if (a === 1) {
    const newEnd = { period: newPeriod, quarter: newQuarter }
    if (compare(newEnd, range1.start) < 0) { range1.end = range1.start; range1.start = newEnd }
    else { range1.end = newEnd }
    self._set1(range1)
  } else if (a === 2) {
    const newStart = { period: newPeriod, quarter: newQuarter }
    range2.start = newStart; range2.end = newStart
    self._set2(range2)
  } else if (a === 3) {
    const newEnd = { period: newPeriod, quarter: newQuarter }
    if (compare(newEnd, range2.start) < 0) { range2.end = range2.start; range2.start = newEnd }
    else { range2.end = newEnd }
    self._set2(range2)
  }

  self.update()

  a++
  a = a % 4
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
    .append('text')
    .attr('transform', 'rotate(-25)')
    .style('font-size', '12px')
    .text(d => d)

  d3.select('#time-g')
    .selectAll('.heatmap-rect')
    .attr('y', (d) => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', 'blue')
}
