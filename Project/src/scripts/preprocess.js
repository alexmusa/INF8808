import cleanUpData from './cleanup'
import { compare } from './helper'

/**
 * This class is responsible for parsing the dataset, and holding all the contracts during a session.
 */
export class DataHandler {
  constructor (data) {
    // Set defaults
    this.state = {
      selectedAttributes: { value: ['Language'], callbacks: [] },
      timeRange1: { value: null, callbacks: [] },
      timeRange2: { value: null, callbacks: [] },
      financingRange: { value: null, callbacks: [] },
      numberContractsRange: { value: null, callbacks: [] }
    }

    this.data = cleanUpData(data)

    // Compute univers of all possible attributes
    this.univers = new Map()
    this.data.columns.forEach(attr => {
      this.univers.set(attr, this.computeAllPossible(attr))
    })
    console.log(this.data)
    console.log(this.univers)

    this.state.timeRange1.value = {
      start: this.getTimeScale()[0], end: this.getTimeScale()[this.getTimeScale().length - 1]
    }
    this.state.timeRange2.value = {
      start: null, end: null
    }
    this.state.financingRange.value = { start: 0, end: Number.MAX_SAFE_INTEGER }
    this.state.numberContractsRange.value = { start: 0, end: Number.MAX_SAFE_INTEGER }
  }

  register (variable, callback) {
    if (this.state[variable] === undefined) {
      throw new Error()
    }

    this.state[variable].callbacks.push(callback)
  }

  update (variable, value) {
    if (this.state[variable] === undefined) {
      throw new Error()
    }

    this.state[variable].value = value
    this.state[variable].callbacks.forEach(c => c.update())
    console.log(this.state)
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
  _prefilter1 (data) {
    const isIncluded = (contract) => {
      return compare({ period: contract.Period, quarter: contract.Quarter }, this.state.timeRange1.value.start) >= 0 &&
        compare({ period: contract.Period, quarter: contract.Quarter }, this.state.timeRange1.value.end) <= 0
    }
    return data.filter(isIncluded)
  }

  _prefilter2 (data) {
    const isIncluded = (contract) => {
      return compare({ period: contract.Period, quarter: contract.Quarter }, this.state.timeRange2.value.start) >= 0 &&
        compare({ period: contract.Period, quarter: contract.Quarter }, this.state.timeRange2.value.end) <= 0
    }
    return data.filter(isIncluded)
  }

  _postfilter (categories) {
    const filtered = new Map()
    for (const c of categories.keys()) {
      const category = categories.get(c)
      if (!(this.state.numberContractsRange.value.start <= category.numberOfContracts &&
            category.numberOfContracts <= this.state.numberContractsRange.value.end)) {
        continue
      }
      if (!(this.state.financingRange.value.start <= category.totalFinancing &&
            category.totalFinancing <= this.state.financingRange.value.end)) {
        continue
      }
      filtered.set(c, categories.get(c))
    }
    return filtered
  }

  getScatterPlot () {
    const plots = []

    plots.push(
      this._postfilter(
        this.generateCategoryPermutationsData(
          this._prefilter1(this.data),
          this.state.selectedAttributes.value)
      )
    )

    if (!(this.state.timeRange2.value.start === null || this.state.timeRange2.value.end === null)) {
      plots.push(
        this._postfilter(
          this.generateCategoryPermutationsData(
            this._prefilter2(this.data),
            this.state.selectedAttributes.value)
        )
      )
    }
    
    return plots
  }

  /*
   *
   * CHECKBOX SECTION
   *
   */
  getAttributes () {
    const attributes = this.data.columns
      .filter(att => !['Period', 'Title', 'Date', 'Final Value', 'Original Value', 'Comments'].includes(att))
    return attributes
  }

  /*
   *
   * TIME SELECTION TOOL
   *
   */
  getTimeScale () {
    if (this._cached_timescale === undefined) {
      const quarters = this.univers.get('Quarter')
      const periods = this.univers.get('Period')

      const permutations = []
      let i = 0
      periods.forEach(p => {
        quarters.forEach(q => {
          permutations.push({
            id: i,
            period: p,
            quarter: q
          })
          i++
        })
      })
      this._cached_timescale = permutations
    }
    return this._cached_timescale
  }
}
