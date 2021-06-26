export function updateFromSelection (selectionId, isSelected) {
  const legend = d3.select('#sp-legend')

  if (isSelected) {
    legend.append('div')
      .attr('class', 'selection' + selectionId)
      .on('click', onClickSelection)

    const selectionsCount = legend.selectAll('[class*=selection]').size()
    if (selectionsCount === 1) {
      legend.append('div')
        .attr('class', 'title')
        .text('Selections').lower()
    } else if (selectionsCount === 2) {
      legend.append('div')
        .attr('class', 'reset')
        .text('Reset')
        .on('click', onResetSelection)
    } else if (selectionsCount > 2) {
      legend.selectAll('.reset').raise()
    }
  } else {
    legend.selectAll('.selection' + selectionId).remove()

    const selectionsCount = legend.selectAll('[class*=selection]').size()
    if (selectionsCount === 1) {
      legend.selectAll('.reset').remove()
    } else if (selectionsCount === 0) {
      legend.selectAll('.title').remove()
    }
  }
}

export function onResetSelection (event) {
  const legend = d3.select('#sp-legend')

  legend.selectAll('[class*=selection]').remove()
  legend.selectAll('.reset').remove()

  d3.select('#graph-1-g')
    .selectAll('.currTimeCircle')
    .filter('[class*=selection]').dispatch('click')
}

export function onClickSelection (event) {
  d3.select('#graph-1-g')
    .selectAll('.currTimeCircle')
    .filter('.' + d3.select(event.target).attr('class')).dispatch('click')
}
