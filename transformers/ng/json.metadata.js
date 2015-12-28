/*
Helpers
 */
var _ = require('lodash')
var _el = require('../helpers').el

/*
Main namespace
 */
var _Main = exports

/*
Process _Metadata
 */
_Main.transform = function(Entity) {
  var attrs = _el.customAttrs(Entity)
  var result = {}

  _.assign(result,
    _Main.basicMetadata(attrs),
    _Main.paginationMetadata(attrs),
    _Main.keysRefsMetadata(attrs),
    _Main.cutomAttributesMetadata(attrs)
  )

  result.permissions = _Main.dataAccessMetadata(attrs)

  return result
}

/*
Basic Metadata
 */
_Main.basicMetadata = function(attrs) {
  var result = {}

  _.assign(result, _.pick(attrs, [
    'dbId', 'mode', 'controlType', 'lang',
  ]), {
    catalogName: '[' + attrs.Table_Schema + ']' + '.' + '[' + attrs.Table_Name + ']',
    schemaName: attrs.Table_Schema,
    tableName: attrs.Table_Name,
  })

  return result
}

/*
Pagination Metadata
 */
_Main.paginationMetadata = function(attrs) {
  var result = {}

  _.assign(result, _.pick({
    totalItems: parseInt(attrs.totalRecords, 10),
    pageSize: parseInt(attrs.pageSize, 10),
    pageIndex: parseInt(attrs.pageIndex, 10),
  }, function(val) {
    return !isNaN(val)
  }))

  return result
}

/*
Keys & References
 */
_Main.keysRefsMetadata = function(attrs) {
  var result = {}

  _.assign(result, _.pick(_.pick(attrs, [
    'primaryKey', 'identityKey', 'foreignReference',
  ]), function(val) {
    return val !== undefined
  }))

  return result
}

/*
Custom Attributes
 */
_Main.cutomAttributesMetadata = function(attrs) {
  var result = {}

  if (Object.keys(attrs.customAttrs).length) {
    result.customAttrs = attrs.customAttrs
  }

  return result
}

/*
Data Access Metadata
 */
_Main.dataAccessMetadata = function(attrs) {
  var result = {}

  _.assign(result, _.pick(_.pick(attrs, [
    'supportsInsert', 'supportsUpdate', 'supportsDelete',
    'disableInsert', 'disableUpdate', 'disableDelete',
  ]), function(val) {
    return val !== undefined
  }))

  return result
}
