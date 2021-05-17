/**
 * Draws a legend in the area at the bottom of the screen, corresponding to the bars' colors
 *
 * @param {string[]} data The data to be used to draw the legend elements
 * @param {*} color The color scale used throughout the visualisation
 */
export function draw (data, color) {
  // DONE : Generate the legend in the div with class "legend". Each SVG rectangle
  // should have a width and height set to 15.
  // Tip : Append one div per legend element using class "legend-element".
  function drawRectangle (element, player) {
    element.append('svg')
      .attr('width', 15)
      .attr('height', 16)
      .append('rect')
      .attr('y', 1) // TODO: Is there a better way to line up text and rectangles?
      .attr('width', 15)
      .attr('height', 15)
      .style('fill', color(player))
      .style('stroke', 'black')
      .style('stroke-width', 1)
  }

  data.forEach(player => {
    const element = d3.select('.legend')
      .append('div')
      .attr('class', 'legend-element')

    drawRectangle(element, player)
    element.append('text').text(player)
      .style('padding-left', '2px') // TODO: Is there a better way to line up text and rectangles?
  })
}
