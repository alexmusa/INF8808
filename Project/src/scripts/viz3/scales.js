/**
 * @param width
 * @param categories
 */
export function setXScale (width, categories) {
  const minAccessor = category => category.contracts[0]?.date
  const maxAccessor = category => category.contracts[category.contracts.length - 1]?.date
  return d3.scaleTime()
    .domain([d3.min(categories, minAccessor), d3.max(categories, maxAccessor)])
    .range([0, width])
}

/**
 * @param height
 * @param categories
 */
export function setYScale (height, categories) {
  const minAccessor = category => category.contracts[0]?.totalFinancing
  const maxAccessor = category => category.contracts[category.contracts.length - 1]?.totalFinancing
  return d3.scaleLinear()
    .domain([d3.min(categories, minAccessor), d3.max(categories, maxAccessor)])
    .range([height, 0])
}
