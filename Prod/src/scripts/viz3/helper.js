/**
 * Generates the group that contains the chart.
 *
 * @param {object} margin The line chart margin
 * @returns {*} The generated svg group
 */
export function generateG (margin) {
  return d3.select('.graph-3')
    .select('svg')
    .append('g')
    .attr('id', 'graph-3-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Sets the canvas dimensions.
 *
 * @param {number} width The canvas width
 * @param {number} height The canvas height
 */
export function setCanvasSize (width, height) {
  d3.select('#line-chart')
    .attr('width', width)
    .attr('height', height)
}

/**
 * Adds the axes.
 *
 * @param {*} g The svg group that contains the chart
 */
export function appendAxes (g) {
  g.append('g')
    .attr('class', 'x axis')
  g.append('g')
    .attr('class', 'y axis')
}

/**
 * Adds the graph labels.
 *
 * @param {*} g The svg group that contains the chart
 */
export function appendGraphLabels (g) {
  g.append('text')
    .text('Total financing')
    .attr('class', 'y axis-text')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', 12)

  g.append('text')
    .text('Time')
    .attr('class', 'x axis-text')
    .attr('font-size', 12)
}

/**
 * Draws both X and Y axis.
 *
 * @param {*} g The svg group that contains the chart
 * @param {*} xScale The d3 Scales to use on the X axis
 * @param {*} yScale The d3 Scales to use on the Y axis
 * @param {number} height The canvas height
 */
export function drawAxis (g, xScale, yScale, height) {
  g.select('.x.axis')
    .transition().duration(1000)
    .attr('transform', 'translate( 0, ' + height + ')')
    .call(d3.axisBottom(xScale).tickSizeOuter(0).tickArguments(12))
  g.select('.y.axis')
    .transition().duration(2000)
    .call(d3.axisLeft(yScale).tickSizeOuter(0).tickArguments([5, '.0s']))
}
