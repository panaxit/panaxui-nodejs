var libxmljs = require('libxslt').libxmljs

/*
Helpers
 */
var _attr = require('../helpers').attr
var _el = require('../helpers').el

/*
Main namespace
 */
var _Main = exports

/*
Main async function
 */
_Main.transform = function(XMLSitemap, callback) {
  var Doc, Sitemap

  if (!XMLSitemap) {
    return callback({
      message: 'Error: No XMLSitemap provided',
    })
  }

  Doc = libxmljs.parseXmlString(XMLSitemap)
  Sitemap = Doc.root()

  return callback(null, _Main.sitemap(Sitemap))
}

_Main.sitemap = function(Sitemap) {
  var Children = _el.find(Sitemap, '*')
  return _Main.children(Children)
}

_Main.children = function(Children) {
  var sitemap = []

  Children.forEach(function(Child) {
    sitemap.push(_Main.child(Child))
  })

  return sitemap
}

_Main.child = function(Child) {
  var result = {
    label: _attr.val(Child, 'title'),
    data: _Main.attributes(Child),
  }
  var expanded = _attr.val(Child, 'expanded')
  var expandable = _attr.val(Child, 'expandable')
  var Children

  if (expanded) {
    result.expanded = _Main.boolValue(expanded)
  }
  if (expandable) {
    result.expandable = _Main.boolValue(expandable)
  }
  if (_el.name(Child) === 'menu') {
    Children = _el.find(Child, '*')
    result.children = _Main.children(Children)
  }
  if (_el.name(Child) === 'catalog') {
    // var lang = _attr(Child.get('ancestor-or-self::*[@xml:lang]'), 'lang');
    // result.lang = lang;
  }

  return result
}

_Main.attributes = function(Child) {
  var result = {}
  var integerAttrs = [
    'pageSize',
    'pageIndex',
  ]
  var stringAttrs = [
    'catalogName',
    'mode',
    'url',
    'description',
    'controlType',
    'primaryKey',
    'identityKey',
    'id',
    'filters',
  ]

  Child.attrs().forEach(function(attr) {
    var name = attr.name()
    var value = attr.value()
    if (integerAttrs.indexOf(name) >= 0) {
      result[name] = _Main.intValue(value)
    } else if (stringAttrs.indexOf(name) >= 0) {
      result[name] = value
    }
  })

  return result
}

_Main.intValue = function(value) {
  return isNaN(parseInt(value, 10)) ? null : parseInt(value, 10)
}

_Main.boolValue = function(value) {
  return value === 'true'
}
