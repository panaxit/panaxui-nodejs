/*
Variable helpers
 */

var namespaces = {
	"px": "urn:panax"
};

/*
Attributes helpers
 */

module.exports.attr = {};

module.exports.attr.val = function(el, name) {
	return el.attr(name) ? el.attr(name).value() : undefined;
}

module.exports.attr.name = function(el, name) {
	return el.attr(name) ? el.attr(name).name() : undefined;
}

/*
Element helpers
 */

module.exports.el = {};

module.exports.el.get = function(el, xpath) {
	return el.get(xpath, namespaces) || undefined;
}

module.exports.el.find = function(el, xpath) {
	return el.find(xpath, namespaces) || undefined;
}

module.exports.el.name = function(el) {
	return el.name() || undefined;
}

/*
Key Index helper
 */

module.exports.keyIndex = function(el, xpath, use) {
	var index = {};
	el.find(xpath, namespaces).forEach(function(child, ix) {
		index[child.attr(use).value()] = child;
	});
	return index;
}