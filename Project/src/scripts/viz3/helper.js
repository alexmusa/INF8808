/**
 * @param margin
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
 * @param width
 * @param height
 */
export function setCanvasSize (width, height) {
  d3.select('#line-chart')
    .attr('width', width)
    .attr('height', height)
}

/**
 * @param g
 */
export function appendAxes (g) {
  g.append('g')
    .attr('class', 'x axis')
  g.append('g')
    .attr('class', 'y axis')
}

/**
 * @param g
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
 * @param g
 * @param xScale
 * @param yScale
 * @param height
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
