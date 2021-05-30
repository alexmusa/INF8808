/**
 * Defines the contents of the tooltip. See CSS for tooltip styling. The tooltip
 * features the country name, population, GDP, and CO2 emissions, preceded
 * by a label and followed by units where applicable.
 *
 * @param {object} d The data associated to the hovered element
 * @returns {string} The tooltip contents
 */
export function getContents (d) {
  // DONE : Generate tooltip contents

  const toFixed = (num) => parseFloat(num).toFixed(2)
  const data = [
    { label: 'Country : ', value: d['Country Name'] },
    { label: 'Population : ', value: d.Population },
    { label: 'GDP : ', value: toFixed(d.GDP) + ' $ (USD)' },
    { label: 'CO2 emissions : ', value: toFixed(d.CO2) + ' metric tonnes' }
  ]

  const content = d3.create()
  data.forEach(element => {
    content.append('div')
      .text(element.label)
      .append('span')
      .text(element.value)
      .attr('class', 'tooltip-value')
  })

  return content.html()
}
