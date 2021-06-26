import introJs from 'intro.js'

/**
 * Initialize the walkthrough content.
 *
 * @returns {object} corresponding to the walkthrough object
 */
export function init () {
  var intro = introJs()

  /* STEPS TEXT */
  const introText = 'Discover patterns in Telefilm Canada financing strategy ' +
    'by comparing and observing tendancies on the contracts and amounts allocated ' +
    'to different recipients regrouped by specific categories and observing tendancies ' +
    'through time.'
  var title = d3.select('header > h2')
    .attr('data-intro', introText).attr('data-step', 1)

  const categoriesText = 'Select the attributes to consider for regrouping ' +
    'financing contracts into categories. For example: contracts by "Language" & "Province".'
  d3.select('#checkboxes-container')
    .attr('data-intro', categoriesText).attr('data-step', 2)

  const checkboxText = 'Click on the attribute\'s checkbox to consider or unconsider it for ' +
    'the categories.'
  d3.select('.checkbox:nth-child(6) > input')
    .attr('data-intro', checkboxText).attr('data-step', 3)

  const dropdownText = 'Open the dropdown menu to filter values to consider for a selected ' +
    'attribute.'
  var dropdown = d3.select('.checkbox:nth-child(6) > .dropdown')
    .attr('data-intro', dropdownText).attr('data-step', 4)

  var dropdownMenu = dropdown.select('.dropdown-menu')

  const dropdownMenuText = 'Select or unselect the values to consider.'
  dropdownMenu.attr('data-intro', dropdownMenuText).attr('data-step', 5)

  const scatterPlot = d3.select('#graph-1-g')

  const unselectedCircleText = 'Analyze the generated dots in the scatter plot and put the ' +
    'mouse over a dot to detect the category associated to it with its total fundings and ' +
    'contracts.'
  scatterPlot.select('circle:not([class*=selection])')
    .attr('data-intro', unselectedCircleText).attr('data-step', 6)

  const xAxisText = 'Observe the number of contracts on the X axis.'
  scatterPlot.select('.x.axis')
    .attr('data-intro', xAxisText).attr('data-step', 7)

  const yAxisText = 'Observe the total amount in fundings on the Y axis.'
  scatterPlot.select('.y.axis')
    .attr('data-intro', yAxisText).attr('data-step', 8)

  const selectedCircleText = 'Single click on a dot to select it or unselect it if already' +
    'selected, a maximum of 10 dots can be selected. Double click on a dot to open a list of ' +
    'all contracts associated with the category.'
  scatterPlot.select('[class*=selection]')
    .attr('data-intro', selectedCircleText).attr('data-step', 9)

  var legendText = 'Observe the selections and unselect some or all.'
  d3.select('#sp-legend')
    .attr('data-intro', legendText).attr('data-step', 10)

  const spSliderText = 'Change the time range to analyze an evolution between two periods ' +
    'for each selected category.'
  d3.select('#time-slider-container')
    .attr('data-intro', spSliderText).attr('data-step', 11)

  const seeEvolutionText = 'Click to switch the visualization to a line chart in order to ' +
    'analyze the evolution in time of the selected categories.'
  var historyBtn = d3.select('#history-btn')
    .attr('data-intro', seeEvolutionText).attr('data-step', 12)

  const returnToCategoriesText = 'Click to switch the visualization back to the scatter plot.'
  var categoryBtn = d3.select('#categories-btn')
    .attr('data-intro', returnToCategoriesText).attr('data-step', 13)

  const lineChartText = 'Observe the evolution in time of the selected categories.'
  d3.select('#graph-3-g')
    .attr('data-intro', lineChartText).attr('data-step', 14)

  legendText = 'Put the mouse over each color to detect the category associated with each line.'
  d3.select('#lc-legend')
    .attr('data-intro', legendText).attr('data-step', 15)

  const lcSliderText = 'Change the time range to analyze the evolution over a shorter period ' +
    'in time.'
  d3.select('#lc-time-slider-cont')
    .attr('data-intro', lcSliderText).attr('data-step', 16)

  const helpText = 'Click on the title to restart this walkthrough at anytime.'
  title.select('text')
    .attr('data-intro', helpText).attr('data-step', 17)

  /* ACTION LISTENERS */
  intro.onbeforechange((element) => {
    const step = parseInt(element.attributes['data-step'].nodeValue)
    dropdownMenu.classed('show', step === 5)

    if (step >= 13 && step <= 16 && historyBtn.attr('hidden') === null) {
      historyBtn.dispatch('click')
    } else if ((step <= 12 || step >= 17) && categoryBtn.attr('hidden') === null) {
      categoryBtn.dispatch('click')
    }
  })
  intro.onexit(() => dropdownMenu.classed('show', false))

  return intro
}
