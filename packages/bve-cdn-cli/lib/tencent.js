/**
 * 支持腾讯云
 */
const COS = require('cos-nodejs-sdk-v5')
const fs = require('fs');
const logger = require('./logger')

module.exports = ({
  SecretId,
  SecretKey,
  Bucket,
  Region,
}) => {
  const cos = new COS({
    SecretId,
    SecretKey
  })

  return (Key, LocalFile) => new Promise((resolve, reject) => {
    // 上传文件
    cos.putObject(
      {
        Bucket,
        Region,
        Key,
        Body: fs.createReadStream(LocalFile),
      },
      (err, data) => {
        if(err) {
          reject(err)
        } else {
          resolve(data)
        }
      }
    )
  })
}
