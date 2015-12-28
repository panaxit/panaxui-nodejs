/**
 * Util functions
 */
var crypto = require('crypto')
var fs = require('fs')

/**
 * md5 wrapper
 * @param  {String} str string
 * @return {String}     md5 hash
 */
exports.md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

/**
 * Sanitize JSON before parsing
 * @param  {String} jsonStr Serialized JSON
 * @return {String}          Sanitized JSON string
 */
exports.sanitizeJSONString = function(jsonStr) {
  //Remove newlines, tabs
  var tmp = jsonStr.split(/[\n\t]/)
  // HACK: Remove first "<?xml..." line manually for non-xml outputs
  if (jsonStr.indexOf('<?xml') === 0) {
    tmp.splice(0, 1)
  }
  jsonStr = tmp.join(' ')
  return jsonStr
}

/**
 * Delete folder recursively
 * @param  {String} path Folder path
 */
exports.deleteFolderRecursive = function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      var curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
