import encodeParams from './encodeParams'

function getOutliersCountPerStation (paramsDict) {
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest()
    var url = encodeParams('http://localhost:3000/outliersCount', paramsDict)
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

export default getOutliersCountPerStation
