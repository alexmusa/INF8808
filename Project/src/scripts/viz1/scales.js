
/**
 * Initializes the X scales
 *
 * @param {number} width The canvas width
 * @param {object[]} categories All categories to display
 * @returns {*} The d3 Scale
 */
export function setXScale (width, categories) {
  const accessor = category => category.numberOfContracts
  return d3.scaleLinear()
    .domain([d3.min(categories, accessor), d3.max(categories, accessor)])
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
  const accessor = category => category.totalFinancing
  return d3.scaleLinear()
    .domain([d3.min(categories, accessor), d3.max(categories, accessor)])
    .range([height, 0])
}
