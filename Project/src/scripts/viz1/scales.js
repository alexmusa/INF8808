
export function setXScale (width, categories) {
  const accessor = category => category.numberOfContracts
  return d3.scaleLinear()
    .domain([d3.min(categories, accessor), d3.max(categories, accessor)])
    .range([0, width])
}

export function setYScale (height, categories) {
  const accessor = category => category.totalFinancing
  return d3.scaleLinear()
    .domain([d3.min(categories, accessor), d3.max(categories, accessor)])
    .range([height, 0])
}
