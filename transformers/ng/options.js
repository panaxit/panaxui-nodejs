var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('../helpers').attr;
var _el = require('../helpers').el;

/*
Main namespace
 */
var _Main = exports;

/*
Main async function
 */
_Main.Transform = function(XMLOptions, callback) {
  if(!XMLOptions)
    return callback({ message: "Error: No XMLOptions provided" });

  var Doc = libxmljs.parseXmlString(XMLOptions);
  var Options = Doc.root();

  return callback(null, _Main.Options(Options));
};

_Main.Options = function(Options) {
  var result = [];

  var allowNulls = _attr.val(Options, 'allowNulls');
  if(allowNulls && allowNulls === 'true') {
    result.push({
      "value": null,
      "label": "- -"
    });
  }

  _el.find(Options, '*').forEach(function (Option, index) {
    var value = _attr.val(Option, 'value');
    var text = _attr.val(Option, 'text');
    result.push({
      "value": value,
      "label": text
    })
  });

  return result;
};