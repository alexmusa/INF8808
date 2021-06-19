
export class CheckBoxesHandler {
  constructor () {
    this.selectedBoxes = ['Language'] // Attributes currently selected by the user
  }

  setCheckboxes (attributes, onSelectionChange) {
    const attr = [...attributes.entries()]
      .filter(att => !['Recipient Name', 'Title', 'Date', 'Final Value', 'Original Value', 'Comments'].includes(att[0]))

    d3.select('#checkboxes').selectAll()
      .data(attr).enter()
      .append('label')
      .attr('class', 'checkbox')
      .text(d => d[0])
      .append('input')
      .attr('type', 'checkbox')
      .attr('name', d => d[0])
      .property('checked', (d) => this.selectedBoxes.includes(d[0]))
      .on('change', (event) => {
        this.updateSelection(event.srcElement.name, event.srcElement.checked)
        onSelectionChange()
      })
  }

  updateSelection (attrName, selected) {
    if (!selected) this.selectedBoxes.splice(this.selectedBoxes.indexOf(attrName), 1)
    else this.selectedBoxes.push(attrName)
  }
}
