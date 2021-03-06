/**
 * XML Util functions
 */
var libxmljs = require('libxslt').libxmljs

/**
 * JSON to XML DataTable
 * @param  {Object} dataTable Data Table Object
 * @return {String}           XML Result
 */
exports.dataTable = function(dataTable) {

  // XML document
  var xmlDoc = new libxmljs.Document()

  dataTableGenerator(xmlDoc, dataTable)

  return xmlDoc.toString()

  // iterate through insertRows / updateRows / deleteRows
  function dataRowIterator(dataTable, type, XMLDataTable) {
    var dataRows = dataTable[type]

    dataRows.forEach(function(dataRow) {
      var XMLFKey, fieldName, XMLField, value
      // dataRow XML node
      var XMLDataRow = XMLDataTable.node(type.slice(0, -1))
      // add add identity value if present
      if (dataRow[dataTable.identityKey]) {
        XMLDataRow.attr({
          identityValue: dataRow[dataTable.identityKey],
        })
        // remove it from object to avoid sending it as field
        delete dataRow[dataTable.identityKey]
      }
      // fkey
      if (dataTable.foreignReference) {
        // fkey XML node
        XMLFKey = XMLDataRow.node('fkey')
        XMLFKey.attr({
          name: dataTable.foreignReference,
        })
        // when fkey is primaryKey
        if (dataTable.foreignReference === dataTable.primaryKey) {
          XMLFKey.attr({
            // set isPk attribute
            isPK: 'true',
            // ToDo: currentValue
            // if value changed
            //currentValue: ...
          })
          // maps attr
          XMLFKey.attr({
            maps: dataTable.foreignReference,
          })
        }
      }
      // iterate through fields
      for (fieldName in dataRow) {
        value = dataRow[fieldName]
        // Don't send DataFields with Falsy values
        if (!!value) {
          if (typeof (value) === 'string') {
            // Double quotes for strings
            value = "\'\'" + value + "\'\'"
          } else if (typeof (value) === 'boolean') {
            // 1/0 for booleans
            value = !!value ? 1 : 0
          } else if (typeof (value) === 'object') {
            // nested dataTable
            dataTableGenerator(XMLDataRow, dataRow[fieldName])
            // break to avoid sending it as field
            break
          } else {
            // ...
          }
          // field XML node
          XMLField = XMLDataRow.node('field')
          XMLField.attr({
            name: fieldName,
          })
          XMLField.text(value)
          // when field is primaryKey
          if (fieldName === dataTable.primaryKey) {
            XMLField.attr({
              // set isPk attribute
              isPK: 'true',
              // ToDo: currentValue
              // if value changed
              //currentValue: ...
            })
          }
          // ToDo: out attribute
          // set out attribute
          // if(dataRow.outAttr) {
          //  XMLField.attr({ out: true });
          // }
        }
      }
    })
  }

  function dataTableGenerator(xmlDoc, dataTable) {
    var hasRows
    // dataTable XML root node
    var XMLDataTable = xmlDoc.node('dataTable')
    XMLDataTable.attr({
      name: dataTable.tableName,
    })
    if (dataTable.identityKey) {
      XMLDataTable.attr({
        identityKey: dataTable.identityKey,
      })
    }
    // Generate data rows for each possible type
    hasRows = false;
    ['insertRows', 'updateRows', 'deleteRows', 'dataRows'].forEach(function(type) {
      // Check for non-empty-ish array
      if (dataTable[type] && dataTable[type].length && Object.keys(dataTable[type][0]).length) {
        dataRowIterator(dataTable, type, XMLDataTable)
        hasRows = true
      }
    })
    // Remove datatable completely if no rows present
    if (!hasRows) {
      XMLDataTable.remove()
    }
  }
}
