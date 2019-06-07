function encodeParams (baseUrl, paramDict) {
  let params = '?'
  if (paramDict) {
    for (let key in paramDict) {
      let val = paramDict[key]
      if (typeof val !== 'undefined') {
        params += `${key}=${JSON.stringify(val)}&`
      }
    }
  }
  params = params.substring(0, params.length - 1)
  return baseUrl + params
}

export default encodeParams
