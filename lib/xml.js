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

	oDataTable.dataRows.forEach(function(oDataRow) {
		var dataRow = dataTable.node('dataRow');

		dataRow.attr({
			primaryValue: oDataTable.primaryValue || 'NULL',
			identityValue: oDataTable.identityValue || 'NULL'
		});

		for (var dataFieldName in oDataRow) {
			var value = oDataRow[dataFieldName];
			var dblQuote = (typeof(value) === 'string') ? "\'\'" : '';
			value = (typeof(value) === 'boolean') ? (value ? 1 : 0) : value;
			var dataField = dataRow.node('dataField', dblQuote + value + dblQuote);
			dataField.attr({
				name: dataFieldName
				//isPk: 'true',
				//previousValue: ...
			});
		}
	});

	return xml_doc.toString();
}