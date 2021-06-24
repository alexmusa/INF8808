/**
 * @param {object} category The category being processed
 */
export function update (category) {
  const data = parseData(category)
  const rows = data.map(r => Object.values(r))

  showTitle(category)
  clearTable()

  if (rows.length) drawTable(Object.keys(data[0]), rows)
}

/**
 * @param {object} category The category being processed
 */
function showTitle (category) {
  d3.select('.table-label').remove()

  const title = d3.select('.graph-2')
    .insert('div', ':first-child')
    .attr('class', 'table-label')

  title.append('label')
    .text(category[1].contracts.length ? 'Showing contracts with:' : 'No contracts for:')
    .style('font-weight', 'bold')

  const attributes = title.append('p')
  let isFirstAttr = true
  Object.keys(JSON.parse(category[0])).forEach(attr => {
    const key = Object.keys(attr)[0]
    const seperator = isFirstAttr ? '' : ', and'
    attributes.append('text')
      .text(`${seperator} `)
    attributes.append('text')
      .text(`${key}: `)
      .style('font-weight', 'bold')
    attributes.append('text')
      .text(attr[key])
    isFirstAttr = false
  })
}

/**
 *  Removes the table
 */
function clearTable () {
  d3.select('#table').select('table').remove()
}

/**
 * @param {string[]} attributes All attributes to display in the table header
 * @param {string[][]} rows All rows corresponding to the attributes
 */
function drawTable (attributes, rows) {
  // table
  const table = d3.select('#table')
    .append('table')

  // headers
  table.append('thead').append('tr')
    .selectAll('th')
    .data(attributes)
    .enter().append('th')
    .text(d => d)

  // data
  table.append('tbody')
    .selectAll('tr').data(rows)
    .enter().append('tr')
    .selectAll('td')
    .data(d => d)
    .enter().append('td')
    .text(d => d)
}

/**
 * Removes the attributes that are in category.attributes from category.data and parses the dates
 *
 * @param {object} category The category to parse
 * @returns {object} The same category without the excluded attributes in its data
 */
function parseData (category) {
  const categoryAttrs = Object.keys(JSON.parse(category[0]))
  return category[1].contracts.map(contract => {
    const newContract = {}
    Object.keys(contract).forEach(contractAttr => {
      if (categoryAttrs.every(attr => contract !== Object.keys(attr)[0])) {
        newContract[contractAttr] = contract[contractAttr]
      }
    })
    newContract.Date = d3.timeFormat('%Y %b %d')(newContract.Date)
    return newContract
  })
}
