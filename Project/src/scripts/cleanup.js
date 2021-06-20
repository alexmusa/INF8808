
/**
 * @param {object[]} data The initial (raw) data
 * @returns {object[]} The clean data
 */
export default function cleanUpData (data) {
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

    // Compute the 'Amendment' attribute (a comment in the 'Commments' attribute means that the contract has been amemded)
    labelOlderContractsVersions(data, d)

    // Remove unused attributes
    delete d.Comments
  })

  // Remove the labeled contracts
  data = data.filter(d => d.Amendment !== null)

  // Update the columns with the new attributes
  columns.push('Amendment')
  columns.splice(columns.indexOf('Comments'), 1)

  data.columns = columns // restore columns
  return data
}

/**
 * Finds all versions of the contract and labels the 'Amendment' attribute accordingly
 * Older versions are labeled as null and the most recent contract is labeled with a non empty string
 *
 * @param {object[]} data The data being processed
 * @param {object} d A contract
 */
function labelOlderContractsVersions (data, d) {
  d.Amendment = 'Never been amended'

  if (d.Comments.includes('Amended')) {
    const allInstances = sortInstancesByDate(data, findAllOtherInstancesIndexes(data, d))
    const mostRecentInstance = data[allInstances[0]]
    allInstances.splice(0, 1)

    if (allInstances.length) {
      const secondMostRecentInstance = data[allInstances[0]]

      if (mostRecentInstance['Final Value'] > secondMostRecentInstance['Final Value']) {
        mostRecentInstance.Amendment = 'Amended with more financing'
      } else if (mostRecentInstance['Final Value'] === secondMostRecentInstance['Final Value']) {
        mostRecentInstance.Amendment = 'Amended with the same financing'
      } else {
        mostRecentInstance.Amendment = 'Amended with less financing'
      }
    }

    allInstances.forEach(c => { data[c].Amendment = null })
  }
}

/**
 * @param {object[]} data The data being processed
 * @param {object} d A contract
 * @returns {number[]} Indexes of all contracts matching the contract
 */
function findAllOtherInstancesIndexes (data, d) {
  const indexes = []
  data.forEach((c, index) => {
    if (contractIsAnotherInstance(d, c)) indexes.push(index)
  })
  return indexes
}

/**
 * @param {object[]} data The data being processed
 * @param {number[]} indexes Contracts indexes
 * @returns {number[]} The sorted indexes
 */
function sortInstancesByDate (data, indexes) {
  return indexes.sort((a, b) => data[a].Date - data[b].Date)
}

/**
 * @returns {boolean} Whether the two instances are equivalent
 * @param {object} d A reference contract
 * @param {object} otherInstance Another contract that is a potential match
 */
function contractIsAnotherInstance (d, otherInstance) {
  return otherInstance.Title === d.Title &&
    otherInstance['Recipient Name'] === d['Recipient Name'] &&
    otherInstance['Original Value'] === d['Original Value'] &&
    otherInstance.Amendment !== null
}
