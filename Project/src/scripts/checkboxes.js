import { select } from "d3"

/**
 * This class handles all the checkboxes.
 * It is responsible for:
 * - displaying the checkboxes
 * - holding the current user selection
 * - registering all checkboxes events
 */
export class CheckBoxesHandler {
  constructor (dataHandler) {
    this.dataHandler = dataHandler
    this.generateCheckboxes(dataHandler.getAttributes())

    this.update = () => { d3.selectAll('#checkboxes').selectAll('.checkbox').remove(); this.generateCheckboxes(dataHandler.getAttributes()) }
    this.dataHandler.register('selectedAttributes', this)
  }

  _set (selectedAttributes) { 
    this.dataHandler.update('selectedAttributes', selectedAttributes)
  }

  _get () {
    return this.dataHandler.state.selectedAttributes.value
  }

  /**
   * Draws the checkboxes and binds all needed events.
   *
   * @param {Map} attributes A map of all available attributes
   * @param {Function} onSelectionChange The function to call when a checkbox is selected
   */
  generateCheckboxes (attributes, onSelectionChange) {
    d3.select('#checkboxes').selectAll()
      .data(attributes).enter()
      .append('div')
      .attr('class', 'checkbox')
      .text(d => d)
      .append('input')
      .attr('type', 'checkbox')
      .attr('name', d => d)
      .attr('class', 'attr-checkbox')
      .property('checked', (d) => this._get().includes(d))
      .on('change.forSelection', (event) => {
        this.updateSelection(event.srcElement.name, event.srcElement.checked)
        // onSelectionChange()
      })
  }

  /**
   * Updates the current user selecion model.
   *
   * @param {string} attrName The name of the attribute whose selection is being changed
   * @param {boolean} selected True if the attribute is selected
   */
  updateSelection (attrName, selected) {
    if (selected) {
      const array = this._get()
      array.push(attrName)
      this._set(array)
    } else {
      this._set(this._get().filter(att => att !== attrName))
    }
  }
}
