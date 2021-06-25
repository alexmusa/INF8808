
/**
 * @param categories
 * @param graphSize
 * @param margin
 */
export function draw (categories, graphSize, margin) {
  const g = d3.select('#lc-legeng-cont')
    .select('svg')
    .attr('width', graphSize.width)
    .attr('height', (categories.length + 2) * 20 + 10)
    .attr('transform', 'translate(' + margin.left + ',' + 10 + ')')

  g.selectAll('circle').remove()
  g.selectAll('text').remove()

  g.selectAll('dots')
    .data(categories)
    .enter()
    .append('circle')
    .attr('cx', 10)
    .attr('cy', function (d, i) { return 10 + i * 25 })
    .attr('r', 7)
    .attr('class', (d, i) => `selection${10 - i}`)

  g.selectAll('labels')
    .data(categories)
    .enter()
    .append('text')
    .attr('x', 20)
    .attr('y', function (d, i) { return 10 + i * 25 })
    .attr('class', (d, i) => `line${10 - i}`)
    .text(c => getAttributesTextFromLabel(c.label))
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
}

/**
 * @param label
 */
function getAttributesTextFromLabel (label) {
  let attributes = ''; let isFirstAttr = true
  label = JSON.parse(label)
  Object.keys(label).forEach(key => {
    const seperator = isFirstAttr ? '' : ', and'
    attributes += `${seperator} ${key}: ${label[key]}`
    isFirstAttr = false
  })
  return attributes
}
