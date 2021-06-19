
export function positionLabels (g, width, height) {
  g.selectAll('.y.axis-text')
    .attr('x', -50)
    .attr('y', height / 2)

  g.selectAll('.x.axis-text')
    .attr('x', width / 2)
    .attr('y', height + 50)
}

export function update (categories, xScale, yScale, tip) {
  d3.select('#graph-1-g').selectAll('circle')
    .data(categories).join('circle')
    .attr('r', 7)
    .style('fill', '#888') // TODO: Set color by rank
    .style('cursor', 'pointer')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .transition().duration(2000)
    .attr('cx', (category) => xScale(category.numberOfContracts))
    .attr('cy', (category) => yScale(category.totalFinancing))
}
