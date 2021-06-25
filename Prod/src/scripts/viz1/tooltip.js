import * as helper from './helper'
import d3Tip from 'd3-tip'

export function getContents (category) {
  const content = d3.create()

  const categoryAttributes = JSON.parse(category[0])
  category = category[1]

  // Period
  if (category.period !== undefined) {
    const startDate = category.period.startDate.toISOString().slice(0, 10)
    const endDate = category.period.endDate.toISOString().slice(0, 10)

    content.append('div')
      .append('b').text('Period: ')
      .append('text')
      .attr('class', 'tooltip-value')
      .text(startDate + ' to ' + endDate)

    content.append('hr')
  }

  // Attributes
  Object.entries(categoryAttributes).forEach(attr => {
    const key = attr[0]; const value = attr[1]
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