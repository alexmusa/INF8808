
/**
 * Computes the content to display on the tooltip (while the user hovers a category legend).
 *
 * @param {*} category The category being hovered
 * @returns {*} The tooltip content
 */
export function getContents (category) {
  const content = d3.create()

  // Attributes
  const categoryAttributes = JSON.parse(category.label)
  Object.entries(categoryAttributes).forEach(attr => {
    const key = attr[0]; const value = attr[1]
    content.append('div')
      .append('b').text(key + ' : ')
      .append('text')
      .attr('class', 'tooltip-value')
      .text(value)
  })

  return content.html()
}

/**
 * Initializes the tooltip.
 *
 * @param {*} parent The tooltip container
 * @returns {*} A d3 Selection of the tooltip
 */
export function init (parent) {
  return parent.append('div')
    .attr('class', 'd3-tip')
    .attr('id', 'lc-tip')
}
