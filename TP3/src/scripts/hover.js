/**
 * Sets up an event handler for when the mouse enters and leaves the squares
 * in the heatmap. When the square is hovered, it enters the "selected" state.
 *
 * The tick labels for the year and neighborhood corresponding to the square appear
 * in bold.
 *
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 * @param {Function} rectSelected The function to call to set the mode to "selected" on the square
 * @param {Function} rectUnselected The function to call to remove "selected" mode from the square
 * @param {Function} selectTicks The function to call to set the mode to "selected" on the ticks
 * @param {Function} unselectTicks The function to call to remove "selected" mode from the ticks
 */
export function setRectHandler (xScale, yScale, rectSelected, rectUnselected, selectTicks, unselectTicks) {
  // DONE : Select the squares and set their event handlers
  d3.select('#graph-g')
    .selectAll('.heatmap-rect')
    .each((data, rectIndex, rectangles) => {
      // Get the group corresponding to the rectangle
      const rect = rectangles[rectIndex]
      const group = d3.select(rect).node().parentNode

      // Add listeners to the group (not the rectangle because of bubbling effects when hovering the text)
      d3.select(group)
        .on('mouseenter', () => {
          rectSelected(d3.select(rect), xScale, yScale)
          selectTicks(data.Arrond_Nom, data.Plantation_Year)
        })
        .on('mouseleave', () => {
          rectUnselected(d3.select(rect), xScale, yScale)
          unselectTicks()
        })
    })
}

/**
 * The function to be called when one or many rectangles are in "selected" state,
 * meaning they are being hovered
 *
 * The text representing the number of trees associated to the rectangle
 * is displayed in the center of the rectangle and their opacity is lowered to 75%.
 *
 * @param {*} element The selection of rectangles in "selected" state
 * @param {*} xScale The xScale to be used when placing the text in the square
 * @param {*} yScale The yScale to be used when placing the text in the square
 */
export function rectSelected (element, xScale, yScale) {
  // DONE : Display the number of trees on the selected element
  // Make sure the nimber is centered. If there are 1000 or more
  // trees, display the text in white so it contrasts with the background.

  const data = element.data()[0]
  const numberOfTrees = data.Counts
  const group = d3.select(element.node().parentNode)

  const elementBox = element.node().getBBox()
  const transaltionX = elementBox.width * 0.5
  const translationY = elementBox.height * 0.5

  const textColor = numberOfTrees >= 1000 ? 'white' : 'black'

  group
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('fill', textColor)
    .text(numberOfTrees)
    .attr('x', () => xScale(data.Plantation_Year))
    .attr('y', () => yScale(data.Arrond_Nom))
    .attr('transform', 'translate(' + transaltionX + ', ' + translationY + ')')

  element.select('rect')
    .style('opacity', 0.75)
    .style('font-weight', 'bold')
}

/**
 * The function to be called when the rectangle or group
 * of rectangles is no longer in "selected state".
 *
 * The text indicating the number of trees is removed and
 * the opacity returns to 100%.
 *
 * @param {*} element The selection of rectangles in "selected" state
 */
export function rectUnselected (element) {
  // DONE : Unselect the element
  const group = d3.select(element.node().parentNode)

  group.selectAll('text').remove()

  element
    .style('opacity', 1)
    .style('font-weight', 'normal')
}

/**
 * Makes the font weight of the ticks texts with the given name and year bold.
 *
 * @param {string} name The name of the neighborhood associated with the tick text to make bold
 * @param {number} year The year associated with the tick text to make bold
 */
export function selectTicks (name, year) {
  // DONE : Make the ticks bold
  d3.selectAll('.x')
    .selectAll('text')
    .filter((text) => text === year)
    .style('font-weight', 'bold')

  d3.selectAll('.y')
    .selectAll('text')
    .filter((text) => text === name)
    .style('font-weight', 'bold')
}

/**
 * Returns the font weight of all ticks to normal.
 */
export function unselectTicks () {
  // DONE : Unselect the ticks
  d3.select('.x')
    .selectAll('text')
    .style('font-weight', 'normal')

  d3.select('.y')
    .selectAll('text')
    .style('font-weight', 'normal')
}
