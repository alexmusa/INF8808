import { schemeDark2 } from 'd3'

export function positionLabels (g, width, height) {
  g.selectAll('.y.axis-text')
    .attr('x', -50)
    .attr('y', height / 2)

  g.selectAll('.x.axis-text')
    .attr('x', width / 2)
    .attr('y', height + 50)
}

export function init (g, width, height, onMouseMove, onScroll) {
  positionLabels(g, width, height)
  d3.select('#scatter-plot').on('mousemove', onMouseMove)
  d3.select(window).on('scroll', onScroll)
}

export function registerEvolutionButtons(viz1, viz3) {
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

export function update (categories, timedCategories, xScale, yScale, tip, onCircleClick) {
  var svg = d3.select('#graph-1-g')

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
    d3.select('#legend').selectAll('div').remove()
  }

  timedCategories = Array.from(timedCategories.entries())
  timedCategories.forEach(categories => {
    categories = categories[1].map(category => [categories[0], category])
    var prevTimedCategories = categories.slice(1)
    var currTimedCategory = categories[0]

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

export function updateFromSelection (event, selectionId, isSelected) {
  var circle = d3.select(event.target)
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

export function selectFirst () {
  d3.select('#graph-1-g').select('circle').dispatch('click')
}

export function updateFromZoom (xScale, yScale) {
  console.log(xScale, yScale)
}