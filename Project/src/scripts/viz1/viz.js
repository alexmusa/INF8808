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
  svg.selectAll('circle.plot1').remove()
  svg.selectAll('circle.plot2').remove()
  svg.selectAll('line.line').remove()

  const plot1 = Array.from(categories[0].entries())
  svg.selectAll('.plot1')
    .data(plot1).join('circle')
    .classed('plot1', true)
    .attr('r', 7)
    .style('fill', 'blue')
    .style('cursor', 'pointer')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', onCircleClick)
    .transition().duration(1000)
    .attr('cx', d => xScale(d[1].numberOfContracts))
    .attr('cy', d => yScale(d[1].totalFinancing))

  if (categories[1] !== undefined) {
    const plot2 = Array.from(categories[1].entries())
    svg.selectAll('.plot2')
      .data(plot2).join('circle')
      .classed('plot2', true)
      .attr('r', 7)
      .style('fill', 'red')
      .style('cursor', 'pointer')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', onCircleClick)
      .transition().duration(1000)
      .attr('cx', d => xScale(d[1].numberOfContracts))
      .attr('cy', d => yScale(d[1].totalFinancing))

    categories[0].forEach((value, key) => {
      if (categories[1].get(key) !== undefined) {
        console.log(value)
        console.log(categories[1].get(key))
        svg.append('line')
          .classed('line', true)
          .transition().duration(1000)
          .attr('x1', xScale(value.numberOfContracts))
          .attr('x2', xScale(categories[1].get(key).numberOfContracts))
          .attr('y1', yScale(value.totalFinancing))
          .attr('y2', yScale(categories[1].get(key).totalFinancing))
      }
    })

    svg.selectAll('circle').raise()
  }
}
