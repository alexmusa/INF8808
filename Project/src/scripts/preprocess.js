
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
   * Returns array that contains objects that look like this:
   * {
   * numberOfContracts: 1,
   * totalFinancing: 10,
   * data: [...],
   * attributes: [...]
   * }
   *
   * @returns {object[]} an Array of categories for all combinations of 'attributesNames' in the 'timeRange'
   * @param {number} timeRange The time range to find categories
   * @param {string[]} attributesNames The names of all selected attributes
   */
  getCategoryData (timeRange, attributesNames) {
    const selectedAttributes = attributesNames.map(name => this.attributes.get(name))
    let combinations = selectedAttributes.length ? selectedAttributes[0].map(a => [a]) : []

    // Get all combinations of attributes
    if (selectedAttributes.length > 1) {
      selectedAttributes.forEach((attributes, index) => {
        if (index > 0) {
          const newCombinations = []
          attributes.forEach(attr => {
            combinations.forEach(res => {
              newCombinations.push(res.concat(attr))
            })
          })
          combinations = newCombinations
        }
      })
    }

    const result = []
    combinations.forEach(combination => {
      let totalFinancing = 0

      // Get the data for the category
      const categoryData = this.data.filter(contract => {
        const contractIsWithinRange = timeRange ? (contract.Date >= timeRange.startDate && contract.Date <= timeRange.endDate) : true
        const contractIsValid = contractIsWithinRange && combination.every((attributeValue, index) => {
          const attributeName = attributesNames[index]
          return contract[attributeName] === attributeValue
        })
        if (contractIsValid) totalFinancing += contract['Final Value']
        return contractIsValid
      })

      // List all attributes for the category. Ex: [{Genre: 'Comedy', Contry: 'Canada'}]
      const attributes = combination.map((attrValue, index) => {
        const attrObj = {}
        const attrName = attributesNames[index]
        attrObj[attrName] = attrValue
        return attrObj
      })

      result.push({
        numberOfContracts: categoryData.length,
        totalFinancing: totalFinancing,
        data: categoryData,
        attributes: attributes
      })
    })

    return result
  }
}
