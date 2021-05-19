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

  // TODO: CSS and HTML gurus, is it the proper way to lay this out?
  const line1 = element.append('div').style('margin-bottom', '1em')
  line1.append('label')
    .attr('id', 'tooltip-title')
    .text('Act' + d.act)

  const line2 = element.append('div')
  line2.append('b').text('Player : ')
  line2.append('text')
    .attr('class', 'tooltip-value')
    .text(d.player)

  const line3 = element.append('div')
  line3.append('b').text('Count : ')
  line3.append('text')
    .attr('class', 'tooltip-value')
    .text(d.count)

  return element.html()
}
