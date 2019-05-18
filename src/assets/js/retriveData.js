const d3 = require('d3')

var load = function () {
  return d3.dsv(';', 'static/data/joinMeasureSmall.csv', (d) => {
    return {
      'id': d.id,
      'value': parseFloat(d.value),
      'location': d.location,
      'date': d.date, // parseDate(d.date),
      'measure': d.measure,
      'unit': d.unit
    }
  })
}

export default load
