var libxmljs = require('libxslt').libxmljs

/*
Helpers
 */
var _attr = require('./helpers').attr
var _el = require('./helpers').el

/*
Main namespace
 */
var _Main = exports

/*
Main async function
 */
_Main.transform = function(XMLFilters, callback) {
  var Doc, DataTable

  if (!XMLFilters) {
    return callback({
      message: 'Error: No XMLFilters provided',
    })
  }

  Doc = libxmljs.parseXmlString(XMLFilters)
  DataTable = Doc.root()

  return callback(null, _Main.filters(DataTable))
}

_Main.filters = function(DataTable) {
  var xmlDoc = new libxmljs.Document()
  var dataTable = xmlDoc.node('dataTable')
  var DataRows = _el.find(DataTable, '*')

  // Copy all attrs
  _attr.copyAll(DataTable, dataTable)

  // Add Data Rows
  DataRows.forEach(function(DataRow) {
    dataTable.addChild(_Main.dataRow(xmlDoc, DataRow))
  })

  return xmlDoc.toString()
}

_Main.dataRow = function(xmlDoc, DataRow) {
  var Fields = _el.find(DataRow, '*')
  var filterGroup = new libxmljs.Element(xmlDoc, 'filterGroup')
  
  filterGroup.attr({
    operator: 'AND',
  })

  Fields.forEach(function(Field) {
    filterGroup.addChild(_Main.dataField(xmlDoc, Field))
  })

  return filterGroup
}

_Main.dataField = function(xmlDoc, DataField) {
  var dataField = new libxmljs.Element(xmlDoc, 'dataField')
  var value = DataField.text()
  var filterGroup = new libxmljs.Element(xmlDoc, 'filterGroup')
  var attrObject = {}

  // Copy all attrs
  _attr.copyAll(DataField, dataField)

  // string or number?
  attrObject.operator = value.indexOf("''") === 0 ? 'LIKE' : '='
  filterGroup.attr(attrObject)

  filterGroup.addChild(_Main.dataValue(xmlDoc, DataField))

  dataField.addChild(filterGroup)

  return dataField
}

_Main.dataValue = function(xmlDoc, DataField) {
  var dataValue = new libxmljs.Element(xmlDoc, 'dataValue')
  var value = DataField.text()

  dataValue.text(value)

  return dataValue
}
