import cleanUpData from './cleanup'

export class DataHandler {
  constructor (data) {
    this.data = cleanUpData(data)

    // Compute all attributes
    this.attributes = new Map()
    this.data.columns.forEach(attr => {
      this.attributes.set(attr, this.getAll(attr))
    })
  }

  getAll (attributeName) {
    return [...this.data.reduce((acc, curr) => {
      acc.add(curr[attributeName])
      return acc
    }, new Set())]
  }

  /**
   * Returns a map that contains objects that look like this:
   * { Attr1: ValueAttr1, ...} -> {
   *   numberOfContracts: 1,
   *   totalFinancing: 10,
   *   contracts: [...],
   *   }
   *
   * @returns {object[]} an Map of categories for all combinations of 'attributesNames' in the 'timeRange'
   * @param {number} timeRange The time range to find categories
   * @param {string[]} attributesNames The names of all selected attributes
   */
  getCategoryData (timeRange, attributesNames) {
    var categories = new Map()

    this.data.forEach(contract => {
      const categoryKey = JSON.stringify(Object.fromEntries(attributesNames.map(attributeName => {
        return [attributeName, contract[attributeName]]
      })))

      var category = categories.get(categoryKey) || {
        numberOfContracts: 0,
        totalFinancing: 0.0,
        contracts: []
      }
      const contractIsInTimeRange = !timeRange || (contract.Date >= timeRange.startDate &&
                                                   contract.Date <= timeRange.endDate)
      category.numberOfContracts += (contractIsInTimeRange ? 1 : 0)
      category.totalFinancing += (contractIsInTimeRange ? contract['Final Value'] : 0.0)
      category.contracts = category.contracts.concat(contractIsInTimeRange ? contract : [])

      categories.set(categoryKey, category)
    })

    return categories
  }
}
