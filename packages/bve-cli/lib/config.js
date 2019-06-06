const home = require('user-home')
const path = require('path')

// 存放模板地址：/Users/user/.bve-templates/
exports.templateLocalPath = path.join(home, '.bve-templates')
