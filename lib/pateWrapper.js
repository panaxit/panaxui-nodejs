var fs = require('fs');
var mime = require('mime');
var pate = require('node-pate');
var formatter = require('./pateFormat');

exports.parse = function(xml, template_path, callback) { 
  try {
    pate.parse({
      tpl: fs.readFileSync(template_path),
      xml: xml,
      xpath: '/*/px:data/px:dataRow',
      ns: {
        px: 'urn:panax'
      },
      format_lib: formatter
    }, function (err, result) {
      callback(null, result, mime.lookup(template_path));
    });
  } catch (e) {
    return callback({
      message: '[Server Exception] ' + e.name + ': ' + e.message,
      stack: e.stack
    });
  }
};