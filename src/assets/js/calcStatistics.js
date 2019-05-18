const d3 = require('d3')

function calculateStatistics (d) { // cache statistics on data
  // group by location, year, measure and calc stDev,mean,N
  let dataStatistics = d3.nest()
    .key(d => d.location)
  // .key(d => parseDate(d.date).getFullYear())
    .key(d => d.measure)
    .rollup(function (d) {
      var mean = d3.mean(d, d => d.value)
      var stDev = d3.deviation(d, d => d.value)
      var N = d.length
      return {
        'sampleMean': mean,
        'sampleStDev': stDev,
        'N': N,
        'measures': d.map(function (el) {
          var el2 = Object.assign({}, el)// do a deep clone
          el2.normVal = stDev ? (el2.value - mean) / stDev : 0
          return el2
        })
      }
    })
    .entries(d)
  console.log('dati raggruppati per luogo-anno-misura', dataStatistics)
  return dataStatistics
}

export default calculateStatistics
