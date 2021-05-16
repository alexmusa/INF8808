
/**
 * Sets the domain and range of the X scale.
 *
 * @param {*} scale The x scale
 * @param {object[]} data The data to be used
 * @param {number} width The width of the graph
 */
export function updateGroupXScale (scale, data, width) {
  // DONE : Set the domain and range of the groups' x scale
  const acts = []
  data.forEach(group => acts.push(group.Act))
  scale.domain(acts).range([0, width])
}

/**
 * Sets the domain and range of the Y scale.
 *
 * @param {*} scale The Y scale
 * @param {object[]} data The data to be used
 * @param {number} height The height of the graph
 */
export function updateYScale (scale, data, height) {
  // DONE : Set the domain and range of the graph's y scale
  var maxLines = 0
  data.forEach(group => {
    group.Players.forEach(player => {
      maxLines = player.Count > maxLines ? player.Count : maxLines
    })
  })
  scale.domain([0, maxLines]).range([height, 0])
}

/**
 * Creates the groups for the grouped bar chart and appends them to the graph.
 * Each group corresponds to an act.
 *
 * @param {object[]} data The data to be used
 * @param {*} x The graph's x scale
 */
export function createGroups (data, x) {
  // DONE : Create the groups
  d3.select('#graph-g')
    .selectAll('.group').data(data).join('g')
    .attr('class', 'group')
    .attr('transform', group => 'translate(' + x(group.Act) + ')')
}

/**
 * Draws the bars inside the groups
 *
 * @param {*} y The graph's y scale
 * @param {*} xSubgroup The x scale to use to position the rectangles in the groups
 * @param {string[]} players The names of the players, each corresponding to a bar in each group
 * @param {number} height The height of the graph
 * @param {*} color The color scale for the bars
 * @param {*} tip The tooltip to show when each bar is hovered and hide when it's not
 */
export function drawBars (y, xSubgroup, players, height, color, tip) {
  // DONE : Draw the bars
  d3.select('#graph-g')
    .selectAll('.group')
    .selectAll('rect').data(act => act.Players).join('rect')
    .attr('width', xSubgroup(players[1]) - xSubgroup(players[0]))
    .attr('height', player => height - y(player.Count))
    .attr('x', player => xSubgroup(player.Player))
    .attr('y', player => y(player.Count))
    .style('fill', player => color(player.Player))
}
