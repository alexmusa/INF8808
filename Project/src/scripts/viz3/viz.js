/**
 * @param g
 * @param width
 * @param height
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
 * @param g
 * @param categories
 * @param xScale
 * @param yScale
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
