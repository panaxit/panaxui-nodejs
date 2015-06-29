/**
 * XML Util functions
 */
var libxmljs = require('libxslt').libxmljs;

/**
 * JSON to XML DataTaable
 */
exports.buildXMLDataTable = function(dataTable) {
	// XML document
	var xml_doc = new libxmljs.Document();

	// dataTable XML root node
	var XMLDataTable = xml_doc.node('dataTable');
	XMLDataTable.attr({ name: dataTable.tableName });
	if (dataTable.identityKey) {
		XMLDataTable.attr({ identityKey: dataTable.identityKey });
	}
	
	// iterate through insertRows / updateRows / deleteRows
	var dataRowIterator = function (dataRows, type) {
		dataRows.forEach(function (dataRow) {
			// dataRow XML node
			var XMLDataRow = XMLDataTable.node(type);
			// add add identity value if present
			if (dataRow[dataTable.identityKey]) {
				XMLDataRow.attr({ identityValue: dataRow[dataTable.identityKey] });
				// remove it from object to avoid sending it as field
				delete dataRow[dataTable.identityKey];
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
						// ToDo: nested dataTable
						// ToDo: fkey field
						// nested dataTable
					} else {
						// ...
					}
					// field XML node
					var XMLField = XMLDataRow.node('field');
					XMLField.text(value);
					// Set name attribute
					XMLField.attr({ name: fieldName });
					// when field is primaryKey
					if(XMLField===dataTable.primaryKey) {
						dataField.attr({
							// set isPk attribute
							isPk: 'true'
							// ToDo: currentValue
							// if value changed
							//currentValue: ...
						});
					}
					// ToDo: out attribute
					// set out attribute
					// if(dataRow.outAttr) {
					// 	XMLField.attr({ out: true });
					// }
				}
			}
		});
	};
	if(dataTable.insertRows)
		dataRowIterator(dataTable.insertRows, 'insertRow');
	if(dataTable.updateRows)
		dataRowIterator(dataTable.updateRows, 'updateRow');
	if(dataTable.deleteRows)
		dataRowIterator(dataTable.deleteRows, 'deleteRow');

	return xml_doc.toString();
};