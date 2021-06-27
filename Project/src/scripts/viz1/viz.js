/**
 *
 * FUNCTIONS TO BUILD THE VIZUALISATION
 *
 */

/**
 * Generates the group that contains the plot.
 *
 * @param {object} margin The line chart margin
 * @returns {*} The generated svg group
 */
export function generateG (margin, width, height) {
  return d3.select('div#scatter-plot')
    .append('svg')
    .attr('id', 'scatter-plot-canvas')
    .style('width', width + 'px')
    .style('height', height + 'px')
    .append('g')
    .attr('id', 'scatter-plot-g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')')
}

/**
 * Adds the axes.
 *
 * @param {*} g The svg group that contains the plot
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
    .text('Financing')
    .attr('class', 'y axis-text')
    .attr('transform', 'rotate(-90)')
    .attr('font-size', 12)

  g.append('text')
    .text('Number of contracts')
    .attr('class', 'x axis-text')
    .attr('font-size', 12)
}

/**
 * Draws both X and Y axis.
 *
 * @param {*} xScale The d3 Scales to use on the X axis
 * @param {*} yScale The d3 Scales to use on the Y axis
 * @param {number} height The canvas height
 */
export function drawAxis (xScale, yScale, height) {
  d3.select('.x.axis')
    .transition().duration(1000)
    .attr('transform', 'translate( 0, ' + height + ')')
    .call(d3.axisBottom(xScale).tickSizeOuter(0).tickArguments([5, '.0r']))
  d3.select('.y.axis')
    .transition().duration(2000)
    .call(d3.axisLeft(yScale).tickSizeOuter(0).tickArguments([5, '.0s']))
}

/**
 *
 * FUNCTIONS MODIFYING THE VIZUALISATION
 *
 */

/**
 * Positions the axis labels.
 *
 * @param {*} g A d3 Selection of the main svg group
 * @param {number} width The canvas width
 * @param {number} height The canvas height
 */
export function positionLabels (g, width, height) {
  g.selectAll('.y.axis-text')
    .attr('x', -50)
    .attr('y', height / 2)

  g.selectAll('.x.axis-text')
    .attr('x', width / 2)
    .attr('y', height + 50)
}

/**
 * Updates the displayed categories on the scatter plot.
 * 
 * @param {Map} categories The categories to display
 * @param {Map} timedCategories The categories selected by the user (for the lines tracing)
 * @param {*} xScale The d3 Scale to use on the X axis
 * @param {*} yScale The d3 Scale to use on the Y axis
 * @param {*} tip The d3 Tip to use when the user hovers a category
 * @param {Function} onCircleClick The function to call when the user clicks on a category
 */
export function updatePlot (categories, xScale, yScale, tip, onCircleClick) {
  const svg = d3.select('#scatter-plot-g')

  categories = Array.from(categories.entries())
  svg.selectAll('.plottedCircle')
    .data(categories).join('circle')
    .classed('plottedCircle', true)
    .attr('r', 7)
    .style('cursor', 'pointer')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', onCircleClick)
    .transition().duration(1000)
    .attr('cx', category => xScale(category[1].numberOfContracts))
    .attr('cy', category => yScale(category[1].totalFinancing))
}
