
export class DataHandler {
  constructor (data) {
    this.data = this.cleanUpData(data)

    // Compute all attributes
    this.attributes = new Map()
    this.data.columns.forEach(attr => {
      this.attributes.set(attr, this.getAll(attr))
    })
  }

  cleanUpData (data) {
    const columns = data.columns // save columns

    data = data.filter(d => {
      // remove contracts with missing attributes
      return data.columns.every(attr => d[attr] !== '') &&
            // remove contracts with malformed genre
            !['N/A', '0'].includes(d.Genre) &&
            // remove contracts with malformed language
            !['0'].includes(d.Language)
    })

    data.forEach(d => {
      // Parse numbers
      d['Final Value'] = parseFloat(d['Final Value'])
      d['Original Value'] = parseFloat(d['Original Value'])

      // Parse dates
      d.Date = new Date(d.Date + 'T00:00')

      // Trim and replace illegal characters. Ex: replace ' Montréal' by 'Montreal'
      const cleanString = (s) => { return s.trim().replace('é', 'e') }
      ['City', 'Province', 'Country', 'Type', 'Purpose', 'Genre'].forEach(attr => { d[attr] = cleanString(d[attr]) })
    })

    data.columns = columns // restore columns
    return data
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
   * @returns {*} an Array of categories for all combinations of 'attributesNames' in the 'timeRange'
   * @param {*} timeRange The time range to find categories
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
