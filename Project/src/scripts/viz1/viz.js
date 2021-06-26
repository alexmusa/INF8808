/**
 * Positions the axis labels.
 *
 * @param {*} g A d3 Selection of the main svg group
 * @param {number} width The canvas width
 * @param {number} height The canvas height
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
 * Registers the events responsible for the transitions between the scatter plot (viz1) and the line chart (viz2)
 *
 * @param {*} viz1 The scatter plot
 * @param {*} viz3 The line chart
 */
export function registerEvolutionButtons (viz1, viz3) {
  const historyBtn = d3.select('#history-btn')
  const catBtn = d3.select('#categories-btn')
  historyBtn.on('click', () => {
    historyBtn.attr('hidden', true)
    catBtn.attr('hidden', null)
    viz3.init([...viz1.timedCategories.entries()])
  })

  catBtn.on('click', () => {
    catBtn.attr('hidden', true)
    historyBtn.attr('hidden', null)
  })
}

/**
 * Updates the displayed categories on the scatter plot.
 *
 * @param {Map} categories The categories to display
 * @param {Map} timedCategories The categories selected by the user (for the lines tracing)
 * @param {*} xScale The d3 Scale to use on the X axis
 * @param {*} yScale The d3 Scale to use on the Y axis
 * @param {*} tip The d3 Tip to use when the user hovers a category
 * @param {Function} onCircleClick The function to call when the user clicks on a category
 */
export function update (categories, timedCategories, xScale, yScale, tip, onCircleClick) {
  const svg = d3.select('#graph-1-g')

  categories = Array.from(categories.entries())
  svg.selectAll('.currTimeCircle')
    .data(categories).join('circle')
    .classed('currTimeCircle', true)
    .attr('r', 7)
    .style('cursor', 'pointer')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', onCircleClick)
    .transition().duration(1000)
    .attr('cx', category => xScale(category[1].numberOfContracts))
    .attr('cy', category => yScale(category[1].totalFinancing))

  if (timedCategories.size === 0) {
    svg.selectAll('line').remove()
    svg.selectAll('.prevTimeCircle').remove()
    svg.selectAll('circle').attr('class', 'currTimeCircle')
    d3.select('#sp-legend').selectAll('div').remove()
  }

  timedCategories = Array.from(timedCategories.entries())
  timedCategories.forEach(categories => {
    categories = categories[1].map(category => [categories[0], category])
    const prevTimedCategories = categories.slice(1)
    const currTimedCategory = categories[0]

    svg.selectAll('line.line' + currTimedCategory[1].selectionId)
      .data(prevTimedCategories).join(
        enter => {
          enter.append('line')
            .attr('class', category => 'line line' + category[1].selectionId)
            .attr('x1', (category, index) => xScale(categories[index][1].numberOfContracts))
            .attr('x2', (category, index) => xScale(categories[index][1].numberOfContracts))
            .attr('y1', (category, index) => yScale(categories[index][1].totalFinancing))
            .attr('y2', (category, index) => yScale(categories[index][1].totalFinancing))
            .transition().delay(1000).duration(1000)
            .attr('x2', category => xScale(category[1].numberOfContracts))
            .attr('y2', category => yScale(category[1].totalFinancing))
        },
        update => {
          update.transition().duration(1000)
            .attr('x1', (category, index) => xScale(categories[index][1].numberOfContracts))
            .attr('x2', category => xScale(category[1].numberOfContracts))
            .attr('y1', (category, index) => yScale(categories[index][1].totalFinancing))
            .attr('y2', category => yScale(category[1].totalFinancing))
        },
        exit => exit.remove())

    svg.selectAll('.prevTimeCircle.selection' + currTimedCategory[1].selectionId)
      .data(prevTimedCategories).join(
        enter => {
          enter.append('circle')
            .attr('class', category => 'prevTimeCircle selection' + category[1].selectionId)
            .style('visibility', 'hidden')
            .attr('r', 6)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('cx', (category, index) => xScale(categories[index][1].numberOfContracts))
            .attr('cy', (category, index) => yScale(categories[index][1].totalFinancing))
            .transition().delay(1000).duration(1000)
            .on('start', (category, index, circles) => {
              d3.select(circles[index]).style('visibility', 'visible')
            })
            .attr('cx', category => xScale(category[1].numberOfContracts))
            .attr('cy', category => yScale(category[1].totalFinancing))
        },
        update => {
          update.transition().duration(1000)
            .attr('cx', category => xScale(category[1].numberOfContracts))
            .attr('cy', category => yScale(category[1].totalFinancing))
        },
        exit => exit.remove())
  })

  svg.selectAll('circle').raise()
}

/**
 * Updates the circle representing a category upon selecion.
 *
 * @param {*} event The event fired by the selection
 * @param {*} selectionId The id of the category whose selection has changed
 * @param {boolean} isSelected True if the category has been selected
 */
export function updateFromSelection (event, selectionId, isSelected) {
  const circle = d3.select(event.target)
  if (isSelected) {
    circle.classed('selection' + selectionId, true)
  } else {
    circle.attr('class', 'currTimeCircle')

    d3.select('#graph-1-g')
      .selectAll('line.line' + selectionId)
      .remove()

    d3.select('#graph-1-g')
      .selectAll('.prevTimeCircle.selection' + selectionId)
      .remove()
  }
}

/**
 * Selects the first circle.
 */
export function selectFirst () {
  d3.select('#graph-1-g').select('circle').dispatch('click')
}
