import cleanUpData from './cleanup'

/**
 * This class is responsible for parsing the dataset, and holding all the contracts during a session.
 */
export class DataHandler {
  constructor (data) {
    // Set defaults
    this.selectedAttributes = ['Genre', 'Type']
    this.timeRange = null // TODO
    this.financingRange = { start: 5000, end: 1000000 }
    this.numberContractsRange = { start: 0, end: 1000 }

    this.data = cleanUpData(data)

    // Compute univers of all possible attributes
    this.univers = new Map()
    this.data.columns.forEach(attr => {
      this.univers.set(attr, this.computeAllPossible(attr))
    })
    console.log(this.data)
    console.log(this.univers)
  }

  /**
   * Computes all possible values for a given attribute.
   * Ex: For `Language`, possible values may be: `French` and `English`.
   *
   * @param {*} attributeName The name of the targeted attribute
   * @returns {object[]} All possible values for the given attribute name
   */
  computeAllPossible (attributeName) {
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
   *  }
   *
   * @param {object[]} contracts Contracts in which the categories should be found
   * @param {string[]} attributesNames The names of all selected attributes
   * @returns {Map} A Map of categories for all combinations of 'attributesNames'
   */
  generateCategoryPermutationsData (contracts, attributesNames) {
    const categories = new Map()

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

  /*
   *
   * SCATTER PLOT SECTION
   *
   */

  _prefilter (data) {
    return data.filter(contract => {
      // return !timeRange || (contract.Date >= timeRange.startDate && contract.Date <= timeRange.endDate)
      return true
    })
  }

  _postfilter (categories) {
    const filtered = new Map()
    for (const c of categories.keys()) {
      const category = categories.get(c)
      if (!(this.numberContractsRange.start < category.numberOfContracts &&
            category.numberOfContracts < this.numberContractsRange.end)) {
        continue
      }
      if (!(this.financingRange.start < category.totalFinancing &&
            category.totalFinancing < this.financingRange.end)) {
        continue
      }
      filtered.set(c, categories.get(c))
    }
    return filtered
  }

  getScatterPlot () {
    const data = this._prefilter(this.data)
    const permutations = this.generateCategoryPermutationsData(data, this.selectedAttributes)
    const categories = this._postfilter(permutations)
    return categories
  }
}
