/**
 * Sets the domain of the color scale. Each type of site should have its own corresponding color.
 *
 * @param {*} color The color scale to be used
 * @param {object[]} data The data to be displayed
 */
export function colorDomain (color, data) {
  // Set the color domain
  color.domain(data.features.map(feature => feature.properties.TYPE_SITE_INTERVENTION))
}

/**
 * Draws the map base of Montreal. Each neighborhood should display its name when hovered.
 *
 * @param {object[]} data The data for the map base
 * @param {*} path The path associated with the current projection
 * @param {Function} showMapLabel The function to call when a neighborhood is hovered
 */
export function mapBackground (data, path, showMapLabel) {
  // DONE : Generate the map background and set the hover handlers
  const boroughs = d3.select('.main-svg')
    .select('#map-g')
    .selectAll('g')
    .data(data.features)
    .enter()
    .append('g')
    .attr('class', 'borough')

  boroughs.append('path')
    .attr('d', path)
    .attr('stroke-width', 1)
    .attr('fill', '#cdd1c4')
    .attr('stroke', '#fff')
    .on('mouseover', (d) => showMapLabel(d, path))
    .on('mouseout', () => d3.select('#marker-g').selectAll('text').remove())
}

/**
 * When a neighborhood is hovered, displays its name. The center of its
 * name is positioned at the centroid of the shape representing the neighborhood
 * on the map. Called when the neighborhood is hovered.
 *
 * @param {object[]} d The data to be displayed
 * @param {*} path The path used to draw the map elements
 */
export function showMapLabel (d, path) {
  // DONE : Show the map label at the center of the neighborhood
  // by calculating the centroid for its polygon
  d3.select('#marker-g')
    .append('text')
    .attr('x', path.centroid(d)[0])
    .attr('y', path.centroid(d)[1])
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)
    .text(d.properties.NOM)
}

/**
 * Displays the markers for each street on the map.
 *
 * @param {object[]} data The street data to be displayed
 * @param {*} color The color scaled used to determine the color of the circles
 * @param {*} panel The display panel, which should be dislayed when a circle is clicked
 */
export function mapMarkers (data, color, panel) {
  // TODO : Display the map markers.
  // Their color corresponds to the type of site and their outline is white.
  // Their radius is 5 and goes up to 6 while hovered by the cursor.
  // When clicked, the panel is displayed.
  d3.select('#marker-g').selectAll('circle')
    .data(data.features)
    .enter()
    .append('circle')
    .attr('class', 'marker')
    // The following attributes are not needed with the force layout
    // .attr('cx', d => d.x)
    // .attr('cy', d => d.y)
    .attr('r', 5)
    .style('fill', d => color(d.properties.TYPE_SITE_INTERVENTION))
    .style('stroke', 'white')
    .style('stroke-width', 1)
    .on('mouseover', function () { d3.select(this).attr('r', 6) })
    .on('mouseout', function () { d3.select(this).attr('r', 5) })
    .on('click', (d) => { panel.display(d, color) })
}
