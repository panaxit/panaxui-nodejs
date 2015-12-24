var libxmljs = require('libxslt').libxmljs;

/*
Helpers
 */
var _attr = require('./helpers').attr;
var _el = require('./helpers').el;

/*
Main namespace
 */
var _Main = exports;

/*
Main async function
 */
_Main.Transform = function(XMLFilters, DataTable) {
  if(!XMLFilters)
    return callback({ message: "Error: No XMLFilters provided" });

  var Doc = libxmljs.parseXmlString(XMLFilters);
  var DataTable = Doc.root();

  return callback(null, _Main.Filters(DataTable));
};

_Main.Filters = function(DataTable) {
  var xml_doc = new libxmljs.Document();
  var dataTable = xml_doc.node('dataTable');

  // Copy all attrs 
  _attr.copyAll(DataTable, dataTable);

  // Add Data Rows
  var DataRows = _el.find(DataTable, '*');
  DataRows.forEach(function(DataRow, index) {
    dataTable.addChild(_Main.DataRow(xml_doc, DataRow));
  });

  return xml_doc.toString();
};

_Main.DataRow = function(xml_doc, DataRow) {
  var Fields = _el.find(DataRow, '*');

  var filterGroup = new libxmljs.Element(xml_doc, 'filterGroup');
  filterGroup.attr({'operator': 'AND'});

  Fields.forEach(function(Field, index) {
    filterGroup.addChild(_Main.DataField(xml_doc, Field));
  });

  return filterGroup;
};

_Main.DataField = function(xml_doc, DataField) {
  var dataField = new libxmljs.Element(xml_doc, 'dataField');
  var value = DataField.text();
  var filterGroup = new libxmljs.Element(xml_doc, 'filterGroup');
  var attrObject = {};

  // Copy all attrs 
  _attr.copyAll(DataField, dataField);

  // string or number?
  attrObject.operator = value.indexOf("''") === 0 ? 'LIKE' : '=';
  filterGroup.attr(attrObject);

  filterGroup.addChild(_Main.DataValue(xml_doc, DataField));

  dataField.addChild(filterGroup);

  return dataField;
};

_Main.DataValue = function(xml_doc, DataField) {
  var dataValue = new libxmljs.Element(xml_doc, 'dataValue');
  var value = DataField.text();

  dataValue.text(value);

  return dataValue;
};