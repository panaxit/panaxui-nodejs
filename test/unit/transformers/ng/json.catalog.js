var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var fs = require('fs');
var _Catalog = require('../../../../transformers/ng/json.catalog');

describe('JSON Catalog', function() {

  describe('real mocks', function() {

    var mocks = [
      'CONTROLS_NestedForm',
      'CONTROLS_Basic',
      'CONTROLS_Advanced'
    ];

    mocks.forEach(function (mock, index) {
      it(mock, function() {
        var xml = fs.readFileSync(__dirname + '/mocks/' + mock + '.xml');
        var catalog = JSON.parse(fs.readFileSync(__dirname + '/mocks/' + mock + '.catalog.json'));

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        var result = _Catalog.Transform(Entity);

        expect(result).to.be.ok;
        expect(result).to.deep.equal(catalog);
      });
    });

  });

  it('should get catalog attributes', function() {
    var xml = '<Entity xmlns:px="urn:panax" xmlns:custom="http://www.panaxit.com/custom"' +
              '   xml:lang="es" ' + 
              '   dbId="Demo" ' +
              '   pageSize="1" ' +
              '   pageIndex="1" ' +
              '   totalRecords="1" ' +
              '   Table_Name="TestTable" ' +
              '   Table_Schema="TestSchema" ' +
              '   identityKey="Id" ' +
              '   primaryKey="Id" ' +
              '   supportsInsert="1" ' +
              '   disableInsert="0" ' +
              '   supportsUpdate="1" ' +
              '   disableUpdate="0" ' +
              '   supportsDelete="1" ' +
              '   disableDelete="0" ' +
              '   controlType="formView" ' +
              '   mode="edit" ' +
              '   custom:titleField="Nombre" ' +
              '   custom:iconField="Imagen" ' +
              '   custom:descField1="Tipo" ' +
              '   custom:descField2="Direccion" ' +
              '>' +
              '</Entity>';

    var Doc = libxmljs.parseXmlString(xml);
    var Entity = Doc.root();
    var result = _Catalog.Transform(Entity);

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
      "totalItems": 1,
      "pageSize": 1,
      "pageIndex": 1,
      "metadata": {
        "supportsInsert": '1',
        "supportsUpdate": '1',
        "supportsDelete": '1',
        "disableInsert": '0',
        "disableUpdate": '0',
        "disableDelete": '0'
      },
      "customAttrs": {
        "titleField": "Nombre",
        "iconField": "Imagen",
        "descField1": "Tipo",
        "descField2": "Direccion"
      }
    });
  });

});