
/**
 * This class is responsible for displaying the slider and handling all interactions with the scatter plot.
 */
export class Slider {
  constructor () {
    this.range = undefined
    this.ticksCount = 12
  }

  /**
   * Extracts all dates (sorted in an ascending order) for all contracts from the given categories.
   * 
   * @param {object[]} categories All available categories
   * @returns {Date[]} All available dates
   */
  getAllDates (categories) {
    const dates = new Set()
    categories.forEach(category => {
      category.contracts.forEach(contract => dates.add(contract.Date))
    })
    return Array.from(dates).sort((date1, date2) => date1 - date2)
  }

  /**
   * Initializes the slider.
   * 
   * @param {number} width The canvas width
   * @param {object[]} categories All available categories
   * @param {Function} onNewRangeSelected The function to call when the slider range is changed by the user
   */
  init (width, categories, onNewRangeSelected) {
    const dates = this.getAllDates(categories)
    this.range = { startDate: d3.min(dates), endDate: d3.max(dates) }

    // compute tick values
    const datesInterval = (this.range.endDate.getTime() - this.range.startDate.getTime()) / this.ticksCount
    const tickValues = d3.range(0, this.ticksCount + 1).map((d) => {
      const tickDate = new Date(this.range.startDate)
      tickDate.setTime(tickDate.getTime() + datesInterval * d)
      return tickDate
    })

    const sliderTime = d3.sliderBottom()
      .min(this.range.startDate)
      .max(this.range.endDate)
      .width(width - 60)
      .tickFormat(d3.timeFormat('%Y'))
      .tickValues(tickValues)
      .default([this.range.startDate, this.range.endDate])
      .fill('#2196f3')
      .on('onchange', val => {
        this.updateValue(val)
      })
      .on('end', val => {
        this.range = { startDate: new Date(val[0]), endDate: new Date(val[1]) }
        this.updateValue(val)
        onNewRangeSelected(this.range)
      })

    const gTime = d3.select('div#time-slider')
      .append('svg')
      .attr('width', width + 25)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(70,10)')

    gTime.call(sliderTime)

    d3.select('p#time-value').text(
      sliderTime.value()
        .map(v => new Date(v))
        .map(d3.timeFormat('%B %d %Y'))
        .join(' - ')
    )
  }

  /**
   * Updates the displayed selected dates on the slider.
   * 
   * @param {Date[]} value The 2 dates to display
   */
  updateValue (value) {
    d3.select('p#time-value').text(value.map(v => new Date(v))
      .map(d3.timeFormat('%Y %B %d'))
      .join(' - ')
    )
  }
}
