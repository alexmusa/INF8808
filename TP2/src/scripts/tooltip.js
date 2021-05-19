/**
 * Defines the contents of the tooltip.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  /* DONE : Define and return the tooltip contents including :
      + A title stating the hovered element's group, with:
        - Font family: Grenze Gotish
        - Font size: 24px
        - Font weigth: normal
      + A bold label for the player name followed
        by the hovered elements's player's name
      + A bold label for the player's line count
        followed by the number of lines
  */
  const element = d3.create()

  // Title
  element.append('div').style('margin-bottom', '1em')
    .append('label')
    .attr('id', 'tooltip-title')
    .text('Act ' + d.act)

  // Player name
  element.append('div')
    .append('b').text('Player : ')
    .append('text')
    .attr('class', 'tooltip-value')
    .text(d.player)

  // Player's line count
  element.append('div')
    .append('b').text('Count : ')
    .append('text')
    .attr('class', 'tooltip-value')
    .text(d.count)

  return element.html()
}
