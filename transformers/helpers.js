/*
Variable helpers
 */

var namespaces = {
  px: 'urn:panax',
  custom: 'http://www.panaxit.com/custom',
}

/*
Attributes helpers
 */

module.exports.attr = {}

module.exports.attr.val = function(el, name) {
  return el && el.attr(name) ? el.attr(name).value() : undefined
}

module.exports.attr.name = function(el, name) {
  return el && el.attr(name) ? el.attr(name).name() : undefined
}

// copy attributes between two XML Elements
module.exports.attr.copyAll = function(Src, Dst) {
  Src.attrs().forEach(function(attr) {
    var attrObj = {}
    attrObj[attr.name()] = attr.value()
    Dst.attr(attrObj)
  })
}

/*
Element helpers
 */

module.exports.el = {}

module.exports.el.get = function(el, xpath) {
  return el && el.get(xpath, namespaces) || undefined
}

module.exports.el.find = function(el, xpath) {
  return el && el.find(xpath, namespaces) || undefined
}

module.exports.el.name = function(el) {
  return el && el.name() || undefined
}

module.exports.el.customAttrs = function(el) {
  var attrs = {
    customAttrs: {},
  }
  el.attrs().forEach(function(attr) {
    var name = attr.name()
    var namespace = attr.namespace()
    if (namespace && namespace.prefix() === 'custom') {
      attrs.customAttrs[name] = attr.value()
    } else {
      attrs[name] = attr.value()
    }
  })
  return attrs
}

/*
Key Index helper
 */

module.exports.createKeyIndex = function(el, xpath, use) {
  var index = {}
  el.find(xpath, namespaces).forEach(function(child) {
    if (child) {
      index[child.attr(use).value()] = child
    }
  })
  return index
}

/*
Available Key Indexes
 */

module.exports.$keys = {}
