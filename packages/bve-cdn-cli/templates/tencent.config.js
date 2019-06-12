/**
 *  腾讯云 配置文件
 * @param {String} cdn cdn类型
 * @param {String} Bucket cdn服务配置（在cdn上可以查到）
 * @param {String} SecretId cdn服务配置（在cdn上可以查到）
 * @param {String} SecretKey cdn服务配置（在cdn上可以查到）
 * @param {String} Region cdn服务配置（在cdn上可以查到）
 * @param {String} info 打印日志
 * @param {Object} glob 上传文件配置
 * @param {String} glob.pattern 匹配要上传的文件
 * @param {Array||String} glob.ignore 匹配要排除的文件
 */

module.exports = {
  cdn: 'tencent',
  Bucket: '',
  SecretId: '',
  SecretKey: '',
  Region: '',
  glob: {
    pattern: '',
    ignore: [],
  }
}