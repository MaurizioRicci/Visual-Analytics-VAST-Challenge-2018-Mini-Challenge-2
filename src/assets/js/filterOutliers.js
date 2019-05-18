function getOutliers (groupedData, devStFilter) {
  // filtro gli outliers (z(4) = 99.99% e rimuovo annidamento)
  var filterOutliers = function (startDict, outliers) {
    outliers = outliers || []
    startDict.forEach(el => {
      if (el.values) outliers = filterOutliers(el.values, outliers)
      else if (el.value) {
        var f = el.value.measures.filter(d => Math.abs(d.normVal) >= devStFilter)
        outliers = outliers.concat(f)
      }
    })
    return outliers
  }
  return filterOutliers(groupedData, [])
}

export default getOutliers
