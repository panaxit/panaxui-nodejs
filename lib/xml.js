/**
 * XML Util functions
 */
var libxmljs = require('libxslt').libxmljs;

/**
 * JSON to XML DataTaable
 */
exports.buildDataTable = function(oDataTable) {
	// XML document
	var xml_doc = new libxmljs.Document();

	// dataTable XML root node
	var dataTable = xml_doc.node('dataTable');
	dataTable.attr({ name: oDataTable.tableName });
	if (oDataTable.identityKey) {
		dataTable.attr({ identityKey: oDataTable.identityKey });
	}
	
	// iterate through insertRows / updateRows / deleteRows
	if(oDataTable.insertRows) /////////////////////////
	oDataTable.insertRows.foreach(function (oInsertRow) {
		// insertRow XML node
		var insertRow = dataTable.node('insertRow');
		if (oDataRow[oDataTable.identityKey]) {
			insertRow.attr({ identityValue: oDataRow[oDataTable.identityKey] });
		}
		// iterate through fields
		for (var fieldName in oDataRow) {
			var value = oDataRow[fieldName];
			// Don't send DataFields with Falsy values
			if(!!value) {
				if(typeof(value) === 'string') {
					// Double quotes for strings
					value = "\'" + value + "\'";
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
				var field = dataRow.node('field', value);
				// Set name attribute
				field.attr({ name: fieldName });
				// when field is primaryKey
				if(field===oDataTable.primaryKey) {
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
				// if(oDataRow.outAttr) {
				// 	field.attr({ out: true });
				// }
			}
		}
	});

	return xml_doc.toString();
};