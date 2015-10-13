var expect = require('chai').expect;
var Catalog = require('../../../../transformers/ng/json.catalog');

describe('JSON Catalog', function() {

	it('should get catalog attributes', function() {
		var xml = '<Entity xmlns:px="urn:panax" ' +
							'   xml:lang="es" ' + 
							'		dbId="Demo" ' +
							'		pageSize="1" ' +
							'		pageIndex="1" ' +
							'		totalRecords="1" ' +
							'		Table_Name="TestTable" ' +
							'		Table_Schema="TestSchema" ' +
							'		identityKey="Id" ' +
							'		primaryKey="Id" ' +
							'		supportsInsert="1" ' +
							'		disableInsert="0" ' +
							'		supportsUpdate="1" ' +
							'		disableUpdate="0" ' +
							'		supportsDelete="1" ' +
							'		disableDelete="0" ' +
							'		controlType="formView" ' +
							'		mode="edit" ' +
							'>' +
							'</Entity>';
		var result = Catalog.Transform(xml);
		expect(result).to.be.ok;
		expect(result).to.to.deep.equal({
			"dbId": 'Demo',
			"catalogName": 'TestSchema.TestTable',
			"schemaName": 'TestSchema',
			"tableName": 'TestTable',
			"mode": 'edit',
			"controlType": 'formView',
			"lang": 'es',
			"primaryKey": 'Id',
			"identityKey": 'Id',
			"foreignReference": undefined,
			"totalItems": '1',
			"pageSize": '1',
			"pageIndex": '1',
			"metadata": {
				"supportsInsert": '1',
				"supportsUpdate": '1',
				"supportsDelete": '1',
				"disableInsert": '0',
				"disableUpdate": '0',
				"disableDelete": '0'
			}
		});
	});

	it('should get custom attributes');

});