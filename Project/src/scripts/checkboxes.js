
/**
 * This class handles all the checkboxes.
 * It is responsible for:
 * - displaying the checkboxes
 * - holding the current user selection
 * - registering all checkboxes events
 */
export class CheckBoxesHandler {
  constructor () {
    this.selectedBoxes = ['Language'] // Attributes currently selected by the user
    CheckBoxesHandler.selectedAttributes = new Map()
  }

  /**
   * Draws the checkboxes and binds all needed events.
   * 
   * @param {Map} attributes A map of all available attributes
   * @param {Function} onSelectionChange The function to call when a checkbox is selected
   */
  setCheckboxes (attributes, onSelectionChange) {
    const attr = [...attributes.entries()]
      .filter(att => !['Period', 'Title', 'Date', 'Final Value', 'Original Value', 'Comments'].includes(att[0]))

    d3.select('#checkboxes').selectAll()
      .data(attr).enter()
      .append('div')
      .attr('class', 'checkbox')
      .text(d => d[0])
      .append('input')
      .attr('type', 'checkbox')
      .attr('name', d => d[0])
      .attr('class', 'attr-checkbox')
      .property('checked', (d) => this.selectedBoxes.includes(d[0]))
      .on('change.forSelection', (event) => {
        this.updateSelection(event.srcElement.name, event.srcElement.checked)
        onSelectionChange()
      })

    this.setDropdowns(attr, onSelectionChange)
  }

  /**
   * Updates the current user selecion model.
   * 
   * @param {string} attrName The name of the attribute whose selection is being changed
   * @param {boolean} selected True if the attribute is selected
   */
  updateSelection (attrName, selected) {
    if (!selected) this.selectedBoxes.splice(this.selectedBoxes.indexOf(attrName), 1)
    else this.selectedBoxes.push(attrName)
  }

  /**
   * Creates the dropdowns that contain the attributes options.
   * 
   * @param {Map} attributes A map of all available attributes
   * @param {Function} onSelectionChange The function to call when an option is selected
   */
  setDropdowns (attributes, onSelectionChange) {
    this.fillAttributes(attributes)

    const container = this.getDropDownContainer()
    this.setDropDownIcon(container)

    const dropdownMenu = this.setDropDownMenu(container)
    this.setAllChecksOptions(dropdownMenu, onSelectionChange)
    this.setAllOptions(dropdownMenu, onSelectionChange)

    this.registerDropdownsDisplay()
  }

  /**
   * Fills the current options selection model with the available attributes.
   * 
   * @param {Map} attributes A map of all available attributes
   */
  fillAttributes (attributes) {
    attributes.forEach(attr => {
      CheckBoxesHandler.selectedAttributes.set(attr[0], new Set(attr[1]))
    })
  }

  /**
   * Creates a container for the dropdowns.
   * 
   * @returns {*} A d3 selecion of the container
   */
  getDropDownContainer () {
    return d3.selectAll('.checkbox')
      .insert('div', ':first-child')
      .attr('class', 'dropdown')
      .style('display', 'inline-block')
  }

  /**
   * Creates the icons for all available attributes.
   * 
   * @param {*} container The d3 Selection of the drop down container
   */
  setDropDownIcon (container) {
    container.append('span')
      .attr('id', (d) => d[0])
      .attr('data-bs-toggle', 'dropdown')
      .attr('aria-expande', false)
      .attr('class', 'dropdown-label')
      .attr('data-bs-auto-close', 'outside')
      .text('ˇ')
      .style('visibility', function () {
        return d3.select(this.parentNode.nextSibling).property('checked') ? 'visible' : 'hidden'
      })
  }

  /**
   * Creates the dropdown menu for each attribute.
   * 
   * @param {*} container The d3 Selection of the drop down container
   * @returns {*} A d3 selecion of the drop down menus
   */
  setDropDownMenu (container) {
    return container.append('ul')
      .attr('class', 'dropdown-menu')
      .attr('aria-labelledby', (d) => d[0])
  }

  /**
   * Creates the options that allow the user to select or de-select every other option.
   * 
   * @param {*} dropdownMenu The d3 Selection of the drop down menus
   * @param {Function} onSelectionChange The function to call when an option is selected
   */
  setAllChecksOptions (dropdownMenu, onSelectionChange) {
    const options = [{ text: 'Check all', checkAll: true }, { text: 'Uncheck all', checkAll: false }]
    options.forEach(opt => {
      dropdownMenu
        .append('li')
        .append('a')
        .attr('class', 'dropdown-item')
        .attr('href', '#')
        .text(opt.text)
        .on('click.forDropdown', function (e, d) {
          if (opt.checkAll) {
            CheckBoxesHandler.selectedAttributes.set(d[0], new Set([...CheckBoxesHandler.selectedAttributes.get(d[0]), ...d[1]]))
          } else {
            CheckBoxesHandler.selectedAttributes.get(d[0]).clear()
          }
          d3.select(this.parentNode.parentNode)
            .selectAll('.dropdown-checkbox')
            .property('checked', opt.checkAll)
          onSelectionChange()
        })
    })
  }

  /**
   * Creates all available options for each attribute.
   * 
   * @param {*} dropdownMenu The d3 Selection of the drop down menu
   * @param {Function} onSelectionChange The function to call when an option is selected
   */
  setAllOptions (dropdownMenu, onSelectionChange) {
    dropdownMenu.datum(function (d) {
      d[1].forEach(option => {
        const li = d3.select(this).append('li')
        li.append('input')
          .attr('type', 'checkbox')
          .property('checked', true)
          .attr('data-attrName', d[0])
          .attr('data-attrVal', option)
          .attr('class', 'dropdown-checkbox')
          .on('change', (e) => {
            const elem = d3.select(e.srcElement)
            const selection = CheckBoxesHandler.selectedAttributes.get(elem.attr('data-attrName'))
            const val = elem.attr('data-attrVal')
            if (elem.property('checked')) selection.add(val)
            else selection.delete(val)
            onSelectionChange()
          })
        li.append('label')
          .text(option)
      })
    })
  }

  /**
   * Registers an event that enables/disables the drop down icon based on the attribute selection.
   */
  registerDropdownsDisplay () {
    d3.selectAll('.attr-checkbox')
      .on('change.forDropdown', function (e) {
        const elem = d3.select(e.srcElement)
        const dropdownHidden = elem.property('checked') ? 'visible' : 'hidden'
        d3.select(this.previousSibling).select('.dropdown-label').style('visibility', dropdownHidden)
      })
  }

  /**
   * Filters out all the categories that have not been selected by the user.
   * 
   * @param {Map} categories A map of all available categories
   */
  filterByAttributesSelection (categories) {
    if (!CheckBoxesHandler.selectedAttributes.size) return categories

    for (const c of categories.keys()) {
      const attributes = JSON.parse(c)
      for (const attrName of Object.keys(attributes)) {
        if (!CheckBoxesHandler.selectedAttributes.get(attrName).has(attributes[attrName])) {
          categories.delete(c)
          break
        }
      }
    }
  }
}
