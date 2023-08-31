
export const uploadByPieces = ({ file, pieceSize = 5, progress, sigleFileUplad, splitupload, overallupload, cancelPartUpload }) => {
  let fileHash = ''// 文件hash值
  const partSize = pieceSize * 1024 * 1024 // 20MB一片
  const totalShards = Math.ceil(file.size / partSize) // 总片数
  const readFile = () => {
    // 读取文件
    let fileRederInstance = new FileReader()
    fileRederInstance.readAsBinaryString(file)
    fileRederInstance.onload = (e) => {
    fileHash = guid()
      if (totalShards === 1) { // 整体上传
        sigleFileUplad(file)
      } else { // 分片上传
        readChunkMD5()
      }
    }
  }
  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0
      let v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
  const getChunkInfo = (file, partNumber, partSize) => {
    let start = partNumber * partSize
    let end = Math.min(file.size, start + partSize)
    let chunk = file.slice(start, end)
    return { start, end, chunk }
  }
  // 针对每个文件进行chunk处理
  const readChunkMD5 = async () => {
    let requireList = []
    // 针对单个文件进行chunk上传
    for (var i = 0; i < totalShards; i++) {
      const { chunk } = getChunkInfo(file, i, partSize)
      let promise = splitupload({ chunkInfo: {chunk, partNumber: i}, fileHash })
      requireList.push(promise)
    }
    Promise.all([...requireList]).then((res) => {
      overallupload({fileHash, totalShards})
    }).catch((err) => {
      cancelPartUpload(fileHash)
      console.log(err)
    })
  }
  readFile()
}
