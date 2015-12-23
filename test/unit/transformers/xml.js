/*
ToDo: As tests Payloads are the same as integration/persist.js, make mock files (after sql mocks)
 */
var expect = require('chai').expect;
var xml = require('../../../transformers/xml.js');
var libxmljs = require('libxslt').libxmljs;

describe('xml #dataTable', function() {

  describe('case 1: with primaryKey', function() {

  	it('should create multiple (2) entities');

  	it('should update one (1) entity');

  	it('should delete one (1) entity');

  });

	describe('case 2: with identityKey', function() {

		it('should create multiple (2) entities', function() {
		  var payload = {
		  	tableName: 'dbo.CONTROLS_Basic',
		  	identityKey: 'Id',
		  	insertRows: [{
				  "ShortTextField": "Texto corto",
				  "IntegerReq": 32,
				  "Float": 72,
				  "Combobox": "MX",
				  "RadioGroup": "1",
				  "Boolean": true,
				  "Money": null,
				  "Date": "2014-04-25 00:00:00"
				}, {
				  "ShortTextField": "Tmp",
				  "IntegerReq": 10
				}]
		  };

		  var output = '<?xml version="1.0" encoding="UTF-8"?>' + 
				'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id">' + 
				  '<insertRow>' + 
				  '<field name="ShortTextField">\'\'Texto corto\'\'</field>' + 
				    '<field name="IntegerReq">32</field>' + 
				    '<field name="Float">72</field>' + 
				    '<field name="Combobox">\'\'MX\'\'</field>' + 
				    '<field name="RadioGroup">\'\'1\'\'</field>' + 
				    '<field name="Boolean">1</field>' + 
				    '<field name="Date">\'\'2014-04-25 00:00:00\'\'</field>' + 
				  '</insertRow>' + 
				  '<insertRow>' + 
				    '<field name="ShortTextField">\'\'Tmp\'\'</field>' + 
				    '<field name="IntegerReq">10</field>' + 
				  '</insertRow>' + 
				'</dataTable>';

		  var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
		  var xmlOutput = libxmljs.parseXml(output);

		  expect(xml_doc.toString()).to.equal(xmlOutput.toString());
		});

		it('should update one (1) entity', function() {
		  var payload = {
		  	tableName: 'dbo.CONTROLS_Basic',
		  	identityKey: 'Id',
		  	updateRows: [{
			  	"Id": '1',
				  "Float": 41.5
				}]
		  };

		  var output = '<?xml version="1.0" encoding="UTF-8"?>' +
				'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id">' +
				  '<updateRow identityValue="1">' +
				    '<field name="Float">41.5</field>' +
				  '</updateRow>' +
				'</dataTable>';

		  var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
		  var xmlOutput = libxmljs.parseXml(output);

		  expect(xml_doc.toString()).to.equal(xmlOutput.toString());
		});

		it('should delete one (1) entity', function() {
		  var payload = {
		  	tableName: 'dbo.CONTROLS_Basic',
		  	identityKey: 'Id',
		  	deleteRows: [{
			  	"Id": '1'
				}]
		  };

		  var output = '<?xml version="1.0" encoding="UTF-8"?>' +
				'<dataTable name="dbo.CONTROLS_Basic" identityKey="Id">' +
				  '<deleteRow identityValue="1"/>' +
				'</dataTable>';

		  var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
		  var xmlOutput = libxmljs.parseXml(output);

		  expect(xml_doc.toString()).to.equal(xmlOutput.toString());
		});

	});

  describe('case 3: with primaryKey & identityKey', function() {

  	it('should create multiple (2) entities');

  	it('should update one (1) entity');

  	it('should delete one (1) entity');

  });

  describe('case 4: nested (1:1)', function() {

    describe('basic', function() {

      it('should not include nested entities with no rows', function() {
        var payload = {
          "tableName":"[Inmuebles].[Inmueble]",
          "primaryKey":"Id",
          "identityKey":"Id",
          "updateRows":[{
            "Nombre":"M12  L17a",
            "Valores":{
              "tableName":
              "[Inmuebles].[Valores]",
              "primaryKey":"IdInmueble",
              "foreignReference":"IdInmueble",
              "updateRows":[{
                // NOTHING / Empty Obj
              }]
            },
            "Id":"1"
          }]
        };

        var output = '<?xml version="1.0" encoding="UTF-8"?>' +
          '<dataTable name="[Inmuebles].[Inmueble]" identityKey="Id">' +
            '<updateRow identityValue="1">' + 
              '<field name="Nombre">\'\'M12  L17a\'\'</field>' + 
            '</updateRow>' +
          '</dataTable>';

        var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
        var xmlOutput = libxmljs.parseXml(output);

        expect(xml_doc.toString()).to.equal(xmlOutput.toString());

      });

    });

  	it('should create a nested entity', function() {
  		var payload = {
		  	tableName: 'dbo.CONTROLS_NestedForm',
		  	primaryKey: 'Id',
		  	identityKey: 'Id',
		  	insertRows: [{
				  "TextLimit10Chars": "Txto corto",
				  "CONTROLS_NestedGrid": {
				  	tableName: 'dbo.CONTROLS_NestedGrid',
				  	primaryKey: 'Id',
				  	foreignReference: 'Id',
				  	insertRows: [{
				  		"TextLimit255": "Corto Anidado"
				  	}]
				  }
				}]
  		};

  		var output = '<?xml version="1.0" encoding="UTF-8"?>' +
  			'<dataTable name="dbo.CONTROLS_NestedForm" identityKey="Id">' +
  				'<insertRow>' + 
  					'<field name="TextLimit10Chars">\'\'Txto corto\'\'</field>' + 
  					'<dataTable name="dbo.CONTROLS_NestedGrid">' + 
  						'<insertRow>' + 
								'<fkey name="Id" isPK="true" maps="Id" />' +
  							'<field name="TextLimit255">\'\'Corto Anidado\'\'</field>' + 
  						'</insertRow>' +
  					'</dataTable>' + 
  				'</insertRow>' +
  			'</dataTable>';

		  var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
		  var xmlOutput = libxmljs.parseXml(output);

		  expect(xml_doc.toString()).to.equal(xmlOutput.toString());
  	});

  	it('should update a nested entity', function() {
		  var payload = {
		  	tableName: 'dbo.CONTROLS_NestedForm',
		  	primaryKey: 'Id',
		  	identityKey: 'Id',
		  	updateRows: [{
			  	"Id": '1',
				  "TextLimit10Chars": "Texto corto 2",
				  "CONTROLS_NestedGrid": {
				  	tableName: 'dbo.CONTROLS_NestedGrid',
				  	primaryKey: 'Id',
				  	foreignReference: 'Id',
				  	updateRows: [{
				  		"TextLimit255": "Corto Anidado 2"
				  	}]
				  }
				}]
		  };

  		var output = '<?xml version="1.0" encoding="UTF-8"?>' +
  			'<dataTable name="dbo.CONTROLS_NestedForm" identityKey="Id">' +
  				'<updateRow identityValue="1">' + 
  					'<field name="TextLimit10Chars">\'\'Texto corto 2\'\'</field>' + 
  					'<dataTable name="dbo.CONTROLS_NestedGrid">' + 
  						'<updateRow>' + 
								'<fkey name="Id" isPK="true" maps="Id" />' +
  							'<field name="TextLimit255">\'\'Corto Anidado 2\'\'</field>' + 
  						'</updateRow>' +
  					'</dataTable>' + 
  				'</updateRow>' +
  			'</dataTable>';

		  var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
		  var xmlOutput = libxmljs.parseXml(output);

		  expect(xml_doc.toString()).to.equal(xmlOutput.toString());
  	});

  	it('should delete a nested entity', function() {
		  var payload = {
		  	tableName: 'dbo.CONTROLS_NestedForm',
		  	primaryKey: 'Id',
		  	identityKey: 'Id',
		  	deleteRows: [{
			  	"Id": '1'
				}]
		  };

  		var output = '<?xml version="1.0" encoding="UTF-8"?>' +
  			'<dataTable name="dbo.CONTROLS_NestedForm" identityKey="Id">' +
  				'<deleteRow identityValue="1">' + 
  				'</deleteRow>' +
  			'</dataTable>';

		  var xml_doc = libxmljs.parseXml(xml.dataTable(payload));
		  var xmlOutput = libxmljs.parseXml(output);

		  expect(xml_doc.toString()).to.equal(xmlOutput.toString());
  	});

  });

});