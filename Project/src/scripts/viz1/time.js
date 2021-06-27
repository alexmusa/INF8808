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

    appendRects(periods, quarters)
    updateRects(this.xScale, this.yScale)
  }
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
  // DONE : Update X scale
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
  // DONE : Update Y scale
  // Make sure to sort the neighborhood names alphabetically
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

export function appendRects (period, quarter) {
  d3.select('#time-g')
    .selectAll()
    .data(period)
    .enter()
    .append('g')
    .classed('period', true)
    .attr('name', d => d)

  d3.select('#time-g')
    .selectAll('.period')
    .selectAll()
    .data(quarter)
    .enter()
    .append('rect')
    .attr('class', 'heatmap-rect')
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
