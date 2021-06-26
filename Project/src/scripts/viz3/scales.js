/**
 * Initializes the X scales
 *
 * @param {number} width The canvas width
 * @param {object[]} categories All categories to display
 * @returns {*} The d3 Scale
 */
export function setXScale (width, categories) {
  const minAccessor = category => category.contracts[0]?.date
  const maxAccessor = category => category.contracts[category.contracts.length - 1]?.date
  return d3.scaleTime()
    .domain([d3.min(categories, minAccessor), d3.max(categories, maxAccessor)])
    .range([0, width])
}

/**
 * Initializes the Y scales
 *
 * @param {number} height The canvas height
 * @param {object[]} categories All categories to display
 * @returns {*} The d3 Scale
 */
export function setYScale (height, categories) {
  const minAccessor = category => category.contracts[0]?.totalFinancing
  const maxAccessor = category => category.contracts[category.contracts.length - 1]?.totalFinancing
  return d3.scaleLinear()
    .domain([d3.min(categories, minAccessor), d3.max(categories, maxAccessor)])
    .range([height, 0])
}
