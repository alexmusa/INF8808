export class CheckBoxesHandler {
  constructor () {
    this.selectedBoxes = ['Language'] // Attributes currently selected by the user
    CheckBoxesHandler.selectedAttributes = new Map()
  }

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

  updateSelection (attrName, selected) {
    if (!selected) this.selectedBoxes.splice(this.selectedBoxes.indexOf(attrName), 1)
    else this.selectedBoxes.push(attrName)
  }

  setDropdowns (attributes, onSelectionChange) {
    this.fillAttributes(attributes)

    const container = this.getDropDownContainer()
    this.setDropDownIcon(container)

    const dropdownMenu = this.setDropDownMenu(container)
    this.setAllChecksOptions(dropdownMenu, onSelectionChange)
    this.setAllOptions(dropdownMenu, onSelectionChange)

    this.registerDropdownsDisplay()
  }

  fillAttributes (attributes) {
    attributes.forEach(attr => {
      CheckBoxesHandler.selectedAttributes.set(attr[0], new Set(attr[1]))
    })
  }

  getDropDownContainer () {
    return d3.selectAll('.checkbox')
      .insert('div', ':first-child')
      .attr('class', 'dropdown')
      .style('display', 'inline-block')
  }

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

  setDropDownMenu (container) {
    return container.append('ul')
      .attr('class', 'dropdown-menu')
      .attr('aria-labelledby', (d) => d[0])
  }

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

  registerDropdownsDisplay () {
    d3.selectAll('.attr-checkbox')
      .on('change.forDropdown', function (e) {
        const elem = d3.select(e.srcElement)
        const dropdownHidden = elem.property('checked') ? 'visible' : 'hidden'
        d3.select(this.previousSibling).select('.dropdown-label').style('visibility', dropdownHidden)
      })
  }

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
