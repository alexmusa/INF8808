import * as helper from './helper'
import d3Tip from 'd3-tip'

export function getContents (category) {
  const content = d3.create()

  // Attributes
  category.attributes.forEach(attr => {
    const key = Object.keys(attr)[0]; const value = attr[key]
    content.append('div')
      .append('b').text(key + ' : ')
      .append('text')
      .attr('class', 'tooltip-value')
      .text(value)
  })

  content.append('hr')

  // Number of contracts
  content.append('div')
    .append('b').text('Number of contracts : ')
    .append('text')
    .attr('class', 'tooltip-value')
    .text(category.numberOfContracts)

  // Total financing
  content.append('div')
    .append('b').text('Total financing : ')
    .append('text')
    .attr('class', 'tooltip-value')
    .text(d3.format('$,')(category.totalFinancing) + '$')

  return content.html()
}

export function init (margin) {
  const g = helper.generateG(margin)
  const tip = d3Tip().attr('class', 'd3-tip').html(function (event, data) { return getContents(data) })
  g.call(tip)
  return { g, tip }
}
