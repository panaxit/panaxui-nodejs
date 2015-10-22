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
_Main.Transform = function(XMLSitemap, callback) {
  if(!XMLSitemap)
    return callback({ message: "Error: No XMLSitemap provided" });

  var Doc = libxmljs.parseXmlString(XMLSitemap);
  var Sitemap = Doc.root();

  return callback(null, _Main.Sitemap(Sitemap));
};

_Main.Sitemap = function(Sitemap) {
  var Children = _el.find(Sitemap, '*');
  return _Main.Children(Children);
};

_Main.Children = function(Children) {
  var sitemap = [];

  Children.forEach(function (Child, index) {
    sitemap.push(_Main.Child(Child));
  });

  return sitemap;
};

_Main.Child = function(Child) {
  var result = {
    "label": _attr.val(Child, 'title'),
    "data": _Main.Attributes(Child)
  };

  var expanded = _attr.val(Child, 'expanded');
  if(expanded)
    result.expanded = _Main.BoolValue(expanded);
  var expandable = _attr.val(Child, 'expandable');
  if(expandable)
    result.expandable = _Main.BoolValue(expandable);

  if(_el.name(Child) === 'menu') {
    var Children = _el.find(Child, '*');
    result.children = _Main.Children(Children);
  }
  if(_el.name(Child) === 'catalog') {
    // var lang = _attr(Child.get('ancestor-or-self::*[@xml:lang]'), 'lang');
    // result.lang = lang;
  }

  return result;
};

_Main.Attributes = function(Child) {
  var result = {};
  var integerAttrs = [
    'pageSize', 
    'pageIndex'
  ];
  var stringAttrs = [
    'catalogName',
    'mode',
    'url',
    'description',
    'controlType',
    'primaryKey',
    'identityKey',
    'id',
    'filters'
  ];

  Child.attrs().forEach(function (attr, index) {
    var name = attr.name();
    var value = attr.value();
    if(integerAttrs.indexOf(name) >= 0) {
      result[name] = _Main.IntValue(value)
    } else if(stringAttrs.indexOf(name) >= 0) {
      result[name] = value;
    }
  });

  return result;
}

_Main.IntValue = function(value) {
  return isNaN(parseInt(value)) ? null : parseInt(value);
}

_Main.BoolValue = function(value) {
  return value === "true";
}