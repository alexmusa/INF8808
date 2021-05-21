/**
 * Gets the names of the neighborhoods.
 *
 * @param {object[]} data The data to analyze
 * @returns {string[]} The names of the neighorhoods in the data set
 */
export function getNeighborhoodNames (data) {
  // DONE: Return the neihborhood names
  const neighborhoods = new Set()
  data.forEach(line => {
    neighborhoods.add(line.Arrond_Nom)
  })
  return [...neighborhoods]
}

/**
 * Filters the data by the given years.
 *
 * @param {object[]} data The data to filter
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @returns {object[]} The filtered data
 */
export function filterYears (data, start, end) {
  // DONE : Filter the data by years
  return data.filter(line => {
    const year = line.Date_Plantation.getFullYear()
    return start <= year && year <= end
  })
}

/**
 * Summarizes how any trees were planted each year in each neighborhood.
 *
 * @param {object[]} data The data set to use
 * @returns {object[]} A table of objects with keys 'Arrond_Nom', 'Plantation_Year' and 'Counts', containing
 * the name of the neighborhood, the year and the number of trees that were planted
 */
export function summarizeYearlyCounts (data) {
  // DONE : Construct the required data table
  const summaryMap = new Map()
  data.forEach(line => {
    const neighborhood = line.Arrond_Nom
    const year = line.Date_Plantation.getFullYear()

    const summaryObjectKey = neighborhood + year
    const summaryObject = summaryMap.get(summaryObjectKey)

    summaryMap.set(summaryObjectKey, {
      Arrond_Nom: neighborhood,
      Plantation_Year: year,
      Counts: summaryObject ? summaryObject.Counts + 1 : 1
    })
  })
  return Array.from(summaryMap.values())
}

/**
 * For the heat map, fills empty values with zeros where a year is missing for a neighborhood because
 * no trees were planted or the data was not entered that year.
 *
 * @param {object[]} data The datas set to process
 * @param {string[]} neighborhoods The names of the neighborhoods
 * @param {number} start The start year (inclusive)
 * @param {number} end The end year (inclusive)
 * @param {Function} range A utilitary function that could be useful to get the range of years
 * @returns {object[]} The data set with a new object for missing year and neighborhood combinations,
 * where the values for 'Counts' is 0
 */
export function fillMissingData (data, neighborhoods, start, end, range) {
  // DONE : Find missing data and fill with 0
  const emptyObjects = []
  neighborhoods.forEach(neighborhood => {
    range(start, end).forEach(year => {
      if (!data.find(d => d.Arrond_Nom === neighborhood && d.Plantation_Year === year)) {
        emptyObjects.push({ Arrond_Nom: neighborhood, Plantation_Year: year, Counts: 0 })
      }
    })
  })
  return data.concat(emptyObjects)
}
