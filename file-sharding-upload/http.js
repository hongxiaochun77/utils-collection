const request = ({ url, method, data, headers, requestList }) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open(method || 'post', url)
    Object.keys(headers || {}).forEach(key =>
        xhr.setRequestHeader(key, headers[key])
      )
    xhr.send(data)
    xhr.onload = e => {
      resolve({ data: e.target.response })
    }
  })
}
export default request
