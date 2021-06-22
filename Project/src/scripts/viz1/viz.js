import { schemeDark2 } from "d3"

export function positionLabels (g, width, height) {
  g.selectAll('.y.axis-text')
    .attr('x', -50)
    .attr('y', height / 2)

  g.selectAll('.x.axis-text')
    .attr('x', width / 2)
    .attr('y', height + 50)
}

export function update (categories, timedCategories, xScale, yScale, tip, onCircleClick) {
  var svg = d3.select('#graph-1-g')

  svg.selectAll('.currTimeCircle')
    .data(categories).join('circle')
    .classed('currTimeCircle', true)
    .attr('r', 7)
    .style('cursor', 'pointer')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .on('click', onCircleClick)
    .transition().duration(1000)
    .attr('cx', category => xScale(category.numberOfContracts))
    .attr('cy', category => yScale(category.totalFinancing))

  if (timedCategories.size === 0) {
    svg.selectAll('line').remove()
    svg.selectAll('.prevTimeCircle').remove()
    svg.selectAll('circle').attr('class', 'currTimeCircle')
  }

  timedCategories.forEach(categories => {
    var prevTimedCategories = categories.slice(1)
    var currTimedCategory = categories[0]

    svg.selectAll('line.line' + currTimedCategory.selectionId)
      .data(prevTimedCategories).join(
        enter => {
          enter.append('line')
            .attr('class', category => 'line line' + category.selectionId)
            .attr('x1', (category, index) => xScale(categories[index].numberOfContracts))
            .attr('x2', (category, index) => xScale(categories[index].numberOfContracts))
            .attr('y1', (category, index) => yScale(categories[index].totalFinancing))
            .attr('y2', (category, index) => yScale(categories[index].totalFinancing))
            .transition().delay(1000).duration(1000)
            .attr('x2', category => xScale(category.numberOfContracts))
            .attr('y2', category => yScale(category.totalFinancing))
        },
        update => {
          update
            .raise()
            .transition().duration(1000)
            .attr('x1', (category, index) => xScale(categories[index].numberOfContracts))
            .attr('x2', category => xScale(category.numberOfContracts))
            .attr('y1', (category, index) => yScale(categories[index].totalFinancing))
            .attr('y2', category => yScale(category.totalFinancing))
        },
        exit => exit.remove())

    svg.selectAll('.prevTimeCircle.selection' + currTimedCategory.selectionId)
      .data(prevTimedCategories).join(
        enter => {
          enter.append('circle')
            .attr('class', category => 'prevTimeCircle selection' + category.selectionId)
            .style('visibility', 'hidden')
            .attr('r', 6)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr('cx', (category, index) => xScale(categories[index].numberOfContracts))
            .attr('cy', (category, index) => yScale(categories[index].totalFinancing))
            .transition().delay(1000).duration(1000)
            .on('start', (category, index, circles) => {
              d3.select(circles[index]).style('visibility', 'visible')
            })
            .attr('cx', category => xScale(category.numberOfContracts))
            .attr('cy', category => yScale(category.totalFinancing))
        },
        update => {
          update
            .raise()
            .transition().duration(1000)
            .attr('cx', category => xScale(category.numberOfContracts))
            .attr('cy', category => yScale(category.totalFinancing))
        },
        exit => exit.remove())
  })
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
