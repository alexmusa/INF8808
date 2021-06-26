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
    const categories = new Map()
    const contracts = this.data.filter(contract => {
      return !timeRange || (contract.Date >= timeRange.startDate && contract.Date <= timeRange.endDate)
    })

    contracts.forEach(contract => {
      const categoryKey = JSON.stringify(Object.fromEntries(attributesNames.map(attributeName => {
        return [attributeName, contract[attributeName]]
      })))

      const category = categories.get(categoryKey) || {}
      category.numberOfContracts = (category.numberOfContracts || 0) + 1
      category.totalFinancing = (category.totalFinancing || 0.0) + contract['Final Value']
      category.contracts = (category.contracts || []).concat(contract)

      categories.set(categoryKey, category)
    })

    return categories
  }
}
