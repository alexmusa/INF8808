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
 * Updates the displayed lines on the line chart.
 * 
 * @param {*} g A d3 Selection of the main svg group
 * @param {object[]} categories The categories to display
 * @param {*} xScale The d3 Scale to use on the X axis
 * @param {*} yScale The d3 Scale to use on the Y axis
 */
export function update (g, categories, xScale, yScale) {
  g.selectAll('.path').remove()
  categories.forEach((category, index) => {
    g.append('path')
      .attr('class', 'path line' + category.selectionId)
      .datum(category.contracts)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x(function (d) { return xScale(d.date) })
        .y(function (d) { return yScale(d.totalFinancing) })
      )
  })
}
