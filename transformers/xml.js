/**
 * XML Util functions
 */
var libxmljs = require('libxslt').libxmljs;

/**
 * JSON to XML DataTable
 */
exports.dataTable = function(dataTable) {
  
  // iterate through insertRows / updateRows / deleteRows
  var dataRowIterator = function (dataTable, type, XMLDataTable) {
    var dataRows;
    if(type === 'insertRow')
      dataRows = dataTable.insertRows;
    else if(type === 'updateRow')
      dataRows = dataTable.updateRows;
    else if(type === 'deleteRow')
      dataRows = dataTable.deleteRows;
    else if(type === 'dataRow')
      dataRows = dataTable.dataRows;

    dataRows.forEach(function (dataRow) {
      // dataRow XML node
      var XMLDataRow = XMLDataTable.node(type);
      // add add identity value if present
      if (dataRow[dataTable.identityKey]) {
        XMLDataRow.attr({ identityValue: dataRow[dataTable.identityKey] });
        // remove it from object to avoid sending it as field
        delete dataRow[dataTable.identityKey];
      }
      // fkey
      if(dataTable.foreignReference) {
        // fkey XML node
        var XMLFKey = XMLDataRow.node('fkey');
        XMLFKey.attr({ name: dataTable.foreignReference });
        // when fkey is primaryKey
        if(dataTable.foreignReference===dataTable.primaryKey) {
          XMLFKey.attr({
            // set isPk attribute
            isPK: 'true'
            // ToDo: currentValue
            // if value changed
            //currentValue: ...
          });
          // maps attr
          XMLFKey.attr({ 'maps': dataTable.foreignReference });
        }
      }
      // iterate through fields
      for (var fieldName in dataRow) {
        var value = dataRow[fieldName];
        // Don't send DataFields with Falsy values
        if(!!value) {
          if(typeof(value) === 'string') {
            // Double quotes for strings
            value = "\'\'" + value + "\'\'";
          } else if(typeof(value) === 'boolean') {
            // 1/0 for booleans
            value = !!value ? 1 : 0;
          } else if(typeof(value) === 'object') {
            // nested dataTable
            dataTableGenerator(XMLDataRow, dataRow[fieldName]);
            // break to avoid sending it as field
            break;
          } else {
            // ...
          }
          // field XML node
          var XMLField = XMLDataRow.node('field');
          XMLField.attr({ name: fieldName });
          XMLField.text(value);
          // when field is primaryKey
          if(fieldName===dataTable.primaryKey) {
            XMLField.attr({
              // set isPk attribute
              isPK: 'true'
              // ToDo: currentValue
              // if value changed
              //currentValue: ...
            });
          }
          // ToDo: out attribute
          // set out attribute
          // if(dataRow.outAttr) {
          //  XMLField.attr({ out: true });
          // }
        }
      }
    });
  };

  var dataTableGenerator = function(xml_doc, dataTable) {
    // dataTable XML root node
    var XMLDataTable = xml_doc.node('dataTable');
    XMLDataTable.attr({ name: dataTable.tableName });
    if (dataTable.identityKey) {
      XMLDataTable.attr({ identityKey: dataTable.identityKey });
    }
    if(dataTable.insertRows)
      dataRowIterator(dataTable, 'insertRow', XMLDataTable);
    if(dataTable.updateRows)
      dataRowIterator(dataTable, 'updateRow', XMLDataTable);
    if(dataTable.deleteRows)
      dataRowIterator(dataTable, 'deleteRow', XMLDataTable);
    if(dataTable.dataRows)
      dataRowIterator(dataTable, 'dataRow', XMLDataTable);
  }
  // XML document
  var xml_doc = new libxmljs.Document();

  dataTableGenerator(xml_doc, dataTable);
  
  return xml_doc.toString();
};