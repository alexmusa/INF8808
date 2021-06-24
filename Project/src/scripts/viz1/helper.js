export function generateG (margin) {
  return d3.select('.graph-1')
    .select('svg')
    .append('g')
    .attr('id', 'graph-1-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}

export function setCanvasSize (width, height) {
  d3.select('#scatter-plot')
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

export function appendGraphLabels (g) {
  g.append('text')
    .text('Financing')
    .attr('class', 'y axis-text')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', 12)

  g.append('text')
    .text('Number of contracts')
    .attr('class', 'x axis-text')
    .attr('font-size', 12)
}

export function drawAxis (xScale, yScale, height) {
  d3.select('.x.axis')
    .transition().duration(1000)
    .attr('transform', 'translate( 0, ' + height + ')')
    .call(d3.axisBottom(xScale).tickSizeOuter(0).tickArguments([5, '.0r']))
  d3.select('.y.axis')
    .transition().duration(2000)
    .call(d3.axisLeft(yScale).tickSizeOuter(0).tickArguments([5, '.0s']))
}
