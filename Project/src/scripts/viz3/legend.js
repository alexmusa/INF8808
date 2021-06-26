import * as tooltip from './tooltip.js'

export function init (categories) {
  const legend = d3.select('#lc-legend')
  legend.selectAll('div:not([class=d3-tip]').remove()

  const tip = tooltip.init(legend)

  legend.selectAll('div:not([class=d3-tip]')
    .data(categories).join('div')
    .attr('class', category => 'selection' + category.selectionId)
    .on('mouseover', (event, category) => {
      const target = d3.select(event.target)
      const selections = legend.selectAll('[class*=selection]')

      let targetIndex = 0
      selections.each((category, index) => {
        if (category.selectionId === target.data()[0].selectionId) {
          targetIndex = index
        }
      })

      tip.html(tooltip.getContents(category))
        .style('opacity', 1.0)
        .style('margin-left', (50 + targetIndex * 70) + 'px')
    })
    .on('mouseout', () => tip.style('opacity', 0.0))

  legend.append('div')
    .attr('class', 'title')
    .text('Selections').lower()
}
