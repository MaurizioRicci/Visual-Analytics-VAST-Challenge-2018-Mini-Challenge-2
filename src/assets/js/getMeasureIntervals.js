import encodeParams from './encodeParams'

function getMeasureIntervals (paramsDict) {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest()
    var url = encodeParams('http://localhost:3000/measuresGrouped2', paramsDict)
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          var myArr = JSON.parse(this.responseText)
          resolve(myArr)
        } else {
          reject(this.statusText)
        }
      }
    }
    xmlhttp.open('GET', url, true)
    xmlhttp.send()
  })
}

export default getMeasureIntervals
