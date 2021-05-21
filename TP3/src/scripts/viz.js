
/**
 * Sets the domain of the color scale
 *
 * @param {*} colorScale The color scale used in the heatmap
 * @param {object[]} data The data to be displayed
 */
export function setColorScaleDomain (colorScale, data) {
  // DONE : Set domain of color scale
  const counts = [...data.reduce((acc, curr) => {
    acc.add(curr.Counts)
    return acc
  }, new Set())]

  colorScale.domain([Math.min.apply(Math, counts), Math.max.apply(Math, counts)])
}

/**
 * For each data element, appends a group 'g' to which an SVG rect is appended
 *
 * @param {object[]} data The data to use for binding
 */
export function appendRects (data) {
  // DONE : Append SVG rect elements
  d3.select('#graph-g')
    .selectAll()
    .data(data)
    .enter()
    .append('g')
    .append('rect')
    .attr('class', 'heatmap-rect')
}

/**
 * Updates the domain and range of the scale for the x axis
 *
 * @param {*} xScale The scale for the x axis
 * @param {object[]} data The data to be used
 * @param {number} width The width of the diagram
 * @param {Function} range A utilitary funtion that could be useful to generate a list of numbers in a range
 */
export function updateXScale (xScale, data, width, range) {
  // DONE : Update X scale
  const years = data.reduce((acc, curr) => {
    acc.add(curr.Plantation_Year)
    return acc
  }, new Set())

  xScale.domain([...years].sort().reverse()).range([width, 0])
}

/**
 * Updates the domain and range of the scale for the y axis
 *
 * @param {*} yScale The scale for the y axis
 * @param {string[]} neighborhoodNames The names of the neighborhoods
 * @param {number} height The height of the diagram
 */
export function updateYScale (yScale, neighborhoodNames, height) {
  // DONE : Update Y scale
  // Make sure to sort the neighborhood names alphabetically
  yScale.domain(neighborhoodNames.sort()).range([0, height])
}

/**
 *  Draws the X axis at the top of the diagram.
 *
 *  @param {*} xScale The scale to use to draw the axis
 */
export function drawXAxis (xScale) {
  // DONE : Draw X axis
  d3.select('.x')
    .style('font-size', 10)
    .call(d3.axisTop(xScale))
}

/**
 * Draws the Y axis to the right of the diagram.
 *
 * @param {*} yScale The scale to use to draw the axis
 * @param {number} width The width of the graphic
 */
export function drawYAxis (yScale, width) {
  // DONE : Draw Y axis
  d3.select('.y')
    .style('font-size', 10)
    .attr('transform', 'translate(' + width + ',0)')
    .call(d3.axisRight(yScale).tickSize(0))
}

/**
 * Rotates the ticks on the X axis 45 degrees towards the left.
 */
export function rotateXTicks () {
  // DONE : Rotate X axis' ticks
  d3.select('.x').selectAll('text')
    .attr('transform', 'rotate(-45)')
}

/**
 * After the rectangles have been appended, this function dictates
 * their position, size and fill color.
 *
 * @param {*} xScale The x scale used to position the rectangles
 * @param {*} yScale The y scale used to position the rectangles
 * @param {*} colorScale The color scale used to set the rectangles' colors
 */
export function updateRects (xScale, yScale, colorScale) {
  // DONE : Set position, size and fill of rectangles according to bound data
  d3.select('#graph-g')
    .selectAll('.heatmap-rect')
    .attr('x', (d) => xScale(d.Plantation_Year))
    .attr('y', (d) => yScale(d.Arrond_Nom))
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .style('fill', (d) => colorScale(d.Counts))
}
