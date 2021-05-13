
/**
 * Sanitizes the names from the data in the "Player" column.
 *
 * Ensures each word in the name begins with an uppercase letter followed by lowercase letters.
 *
 * @param {object[]} data The dataset with unsanitized names
 * @returns {object[]} The dataset with properly capitalized names
 */
export function cleanNames (data) {
  // DONE: Clean the player name data
  data.forEach(line => {
    line.Player = line.Player.toLowerCase()
    line.Player = line.Player[0].toUpperCase() + line.Player.substr(1)
  })
  return data
}

/**
 * Finds the names of the 5 players with the most lines in the play.
 *
 * @param {object[]} data The dataset containing all the lines of the play
 * @returns {string[]} The names of the top 5 players with most lines
 */
export function getTopPlayers (data) {
  // DONE: Find the five top players with the most lines in the play
  const N = 5

  // Find occurences for all players
  let occ = data.reduce((occurences, line) => {
    const occurence = occurences.get(line.Player)
    occurences.set(line.Player, occurence? occurence + 1: 1)
    return occurences
  }, new Map())

  // Transform the corresponding map entries to an array
  occ = [...occ.entries()]

  // Sort players by occurence
  occ.sort((entryA, entryB) => entryB[1] - entryA[1])

  // Get top N players
  const topN = []
  occ.slice(0,N).forEach(entry => topN.push(entry[0]))

  return topN
}

/**
 * Transforms the data by nesting it, grouping by act and then by player, indicating the line count
 * for each player in each act.
 *
 * The resulting data structure ressembles the following :
 *
 * [
 *  { Act : ___,
 *    Players : [
 *     {
 *       Player : ___,
 *       Count : ___
 *     }, ...
 *    ]
 *  }, ...
 * ]
 *
 * The number of the act (starting at 1) follows the 'Act' key. The name of the player follows the
 * 'Player' key. The number of lines that player has in that act follows the 'Count' key.
 *
 * @param {object[]} data The dataset
 * @returns {object[]} The nested data set grouping the line count by player and by act
 */
export function summarizeLines (data) {
  // DONE : Generate the data structure as defined above
  const summary = []

  data.forEach(line => {
    let act = summary.find(actObj => actObj.Act === line.Act)

    // Add the act if it is new
    if (!act) {
      act = {Act: line.Act, Players: []}
      summary.push(act)
    }

    const player = act.Players.find(playerObj => playerObj.Player === line.Player)
    if (!player) { // Add the player if it is new
      act.Players.push({
        Player: line.Player,
        Count: 1
      })
    } else { // Update the player count
      player.Count++
    }
  })

  return summary
}

/**
 * For each act, replaces the players not in the top 5 with a player named 'Other',
 * whose line count corresponds to the sum of lines uttered in the act by players other
 * than the top 5 players.
 *
 * @param {object[]} data The dataset containing the count of lines of all players
 * @param {string[]} top The names of the top 5 players with the most lines in the play
 * @returns {object[]} The dataset with players not in the top 5 summarized as 'Other'
 */
export function replaceOthers (data, top) {
  // TODO : For each act, sum the lines uttered by players not in the top 5 for the play
  // and replace these players in the data structure by a player with name 'Other' and
  // a line count corresponding to the sum of lines
  return []
}
