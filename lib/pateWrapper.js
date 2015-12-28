var fs = require('fs')
var mime = require('mime')
var pate = require('node-pate')
var formatter = require('./pateFormat')

exports.parse = function(xml, templatePath, callback) {
  try {
    pate.parse({
      tpl: fs.readFileSync(templatePath),
      xml: xml,
      xpath: '/*/px:data/px:dataRow',
      ns: {
        px: 'urn:panax',
      },
      format_lib: formatter, // eslint-disable-line camelcase
    }, function(err, result) {
      callback(null, result, mime.lookup(templatePath))
    })
  } catch (e) {
    return callback({
      message: '[Server Exception] ' + e.name + ': ' + e.message,
      stack: e.stack,
    })
  }
}
