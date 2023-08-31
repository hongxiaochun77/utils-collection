import {uploadByPieces} from './index'
uploadByPieces({
  file: file, // 文件实体
  pieceSize: 5, // 单位是1M,数值默认是5，,大小即是5M
  sigleFileUplad: () => {
    // 当传入的文件不需要分片上传，执行这里
    // 如项目的文件上传的逻辑
  },
  splitupload: ({chunkInfo, fileHash}) => {
    // chunkInfo ：文件chunk化后的信息对象
    // fileHash ：分片文件计算出来的hash值
    // 这里一般是文件单片上传的请求
    // 重要！！！
    // *********这里必须返回一个promise对象，提供合并请求前调用promise.all*********
  },
  overallupload: ({fileHash, totalShards}) => {
    // fileHash ：分片文件计算出来的hash值
    // totalShards ：文件的总片数
    // 这里写一般是文件合并上传
  },
  cancelPartUpload: (fileHash) => {
   // fileHash ：分片文件计算出来的hash值
    // 这里取消文件的上传
  }
})