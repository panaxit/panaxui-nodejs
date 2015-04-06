/**
 * XML Util functions
 */
var libxmljs = require('libxslt').libxmljs;

/**
 * JSON to XML DataTaable
 */
exports.buildDataTable = function(oDataTable) {
	var xml_doc = new libxmljs.Document();

	var dataTable = xml_doc.node('dataTable');

	dataTable.attr({ name: oDataTable.tableName });
	if (oDataTable.primaryKey)
		dataTable.attr({ primaryKey: oDataTable.primaryKey });
	if (oDataTable.identityKey)
		dataTable.attr({ identityKey: oDataTable.identityKey });

	var rows  = [];
	var rowName = 'dataRow';
	if(oDataTable.dataRows)
		rows = oDataTable.dataRows;
	else if (oDataTable.deleteRows) {
		rows = oDataTable.deleteRows;
		rowName = 'deleteRow';
	}

	rows.forEach(function(oDataRow) {
		var dataRow = dataTable.node(rowName);

		dataRow.attr({
			primaryValue: oDataRow[oDataTable.primaryKey] || 'NULL',
			identityValue: oDataRow[oDataTable.identityKey] || 'NULL'
		});

		for (var dataFieldName in oDataRow) {
			// Don't send primaryKey as DataField
			if(dataFieldName!==oDataTable.primaryKey) {
				// Get value
				var value = oDataRow[dataFieldName];
				// Double quotes for strings
				var dblQuote = (typeof(value) === 'string') ? "\'\'" : '';
				// 1/0 for booleans
				value = (typeof(value) === 'boolean') ? (value ? 1 : 0) : value;
				// Don't send DataFields with Falsy values
				if(!!value) {
					// Create DataField node
					var dataField = dataRow.node('dataField', dblQuote + value + dblQuote);
					// Set name attribute
					dataField.attr({
						name: dataFieldName
					});
					// if(dataFieldName===oDataTable.primaryKey) {
					// 	dataField.attr({
					// 		isPk: 'true'
					// 		//previousValue: ...
					// 	});
					// }
				}
			}
		}
	});

	return xml_doc.toString();
}