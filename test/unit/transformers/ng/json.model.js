var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var fs = require('fs');
var _initKeyIndexes = require('../../../../transformers/ng/json').initKeyIndexes;
var _Model = require('../../../../transformers/ng/json.model');

describe('JSON Model', function() {

  describe('real mocks', function() {

    var mocks = [
      'CONTROLS_NestedForm',
      'CONTROLS_Basic',
      'CONTROLS_Advanced'
    ];

    mocks.forEach(function (mock, index) {
      it(mock, function() {
        var xml = fs.readFileSync(__dirname + '/mocks/' + mock + '.xml');
        var model = JSON.parse(fs.readFileSync(__dirname + '/mocks/' + mock + '.model.json'));

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);

        expect(result).not.to.be.empty;
        expect(result).to.deep.equal(model);
      });
    });

  });

	describe('table', function() {

		describe('basic', function() {

      it('no data should return an empty array', function() {
        var xml = '<Entity xmlns:px="urn:panax">' +
                  '</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);

        expect(result).to.be.empty;
      });

      it('empty data should return an empty array', function() {
        var xml = '<Entity xmlns:px="urn:panax">' +
                  ' <px:data>' +
                  ' </px:data>' +
                  '</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);

        expect(result).to.be.empty;
      });

			it('empty dataRow should return an empty object', function() {
				var xml = '<Entity xmlns:px="urn:panax">' +
									'	<px:data>' +
									'		<px:dataRow>' +
									'		</px:dataRow>' +
									'	</px:data>' +
									'</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);
									
				expect(result).not.to.be.empty;
				expect(result[0]).to.be.empty;
			});

			it('N dataRow\'s should return multiple objects', function() {
				var xml = '<Entity xmlns:px="urn:panax">' +
									'	<px:fields>' +
									'		<FieldA fieldId="ID0" dataType="unknown" />' +
									'		<FieldB fieldId="ID1" dataType="unknown" />' +
									'	</px:fields>px:fields>' +
									'	<px:data>' +
									'		<px:dataRow>' +
									'			<FieldA fieldId="ID0" value="a" text="a" />' +
									'			<FieldB fieldId="ID1" value="1" text="1" />' +
									'		</px:dataRow>' +
									'		<px:dataRow>' +
									'			<FieldA fieldId="ID0" value="b" text="b" />' +
									'			<FieldB fieldId="ID1" value="2" text="2" />' +
									'		</px:dataRow>' +
									'	</px:data>' +
									'</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);
									
				expect(result).not.to.be.empty;
				expect(result[0]).to.to.deep.equal({"FieldA": "a", "FieldB": "1"});
				expect(result[1]).to.to.deep.equal({"FieldA": "b", "FieldB": "2"});
			});

		});

		describe('keys', function() {

			it('N dataRow\'s should return primaryKey / identityKey', function() {
				var xml = '<Entity xmlns:px="urn:panax" identityKey="Id" primaryKey="Id">' +
									'	<px:fields>' +
									'		<Id fieldId="ID0" dataType="identity" />' +
									'		<FieldA fieldId="ID1" dataType="unknown" />' +
									'		<FieldB fieldId="ID2" dataType="unknown" />' +
									'	</px:fields>px:fields>' +
									'	<px:data>' +
									'		<px:dataRow identity="1" primaryValue="1">' +
									'			<FieldA fieldId="ID1" value="a" text="a" />' +
									'			<FieldB fieldId="ID2" value="1" text="1" />' +
									'		</px:dataRow>' +
									'		<px:dataRow identity="2" primaryValue="2">' +
									'			<FieldA fieldId="ID1" value="b" text="b" />' +
									'			<FieldB fieldId="ID2" value="2" text="2" />' +
									'		</px:dataRow>' +
									'	</px:data>' +
									'</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);
									
				expect(result).not.to.be.empty;
				expect(result[0]).to.to.deep.equal({"Id": "1", "FieldA": "a", "FieldB": "1"});
				expect(result[1]).to.to.deep.equal({"Id": "2", "FieldA": "b", "FieldB": "2"});
			});

		});

		describe('data types', function() {

			it('fields should guess the right data types', function() {
				var xml = '<Entity xmlns:px="urn:panax">' +
									'	<px:fields>' +
									'		<Int fieldId="ID0" dataType="int" />' +
									'		<Float fieldId="ID1" dataType="float" />' +
									'		<Money fieldId="ID2" dataType="money" />' +
									'		<Bit fieldId="ID3" dataType="bit" />' +
									'		<Date fieldId="ID4" dataType="date" />' +
									'		<Time fieldId="ID5" dataType="time" />' +
									'		<DateTime fieldId="ID6" dataType="datetime" />' +
									'		<Unknown fieldId="ID7" dataType="unknown" />' +
									'	</px:fields>' +
									'	<px:data>' +
									'		<px:dataRow>' +
									'			<Int fieldId="ID0" value="1" text="1" />' +
									'			<Float fieldId="ID1" value="0.5" text="0.5" />' +
									'			<Money fieldId="ID2" value="" text="" />' +
									'			<Bit fieldId="ID3" value="1" text="1" />' +
									'			<Date fieldId="ID4" value="" text="" />' +
									'			<Time fieldId="ID5" value="" text="" />' +
									'			<DateTime fieldId="ID6" value="" text="" />' +
									'			<Unknown fieldId="ID7" value="x" text="x" />' +
									'		</px:dataRow>' +
									'	</px:data>' +
									'</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);
									
				expect(result).not.to.be.empty;
				expect(result[0]).to.to.deep.equal({
					"Int": 1, 
					"Float": 0.5,
					"Money": null,
					"Bit": true,
					"Date": "",
					"Time": "",
					"DateTime": "",
					"Unknown": "x",
				});
			});

		});

	});

	describe('foreign keys', function() {

		it('fields should return data types for foreign keys', function() {
			var xml = '<Entity xmlns:px="urn:panax">' +
								'	<px:fields>' +
								'		<Default fieldId="ID0" dataType="foreignKey" controlType="default" />' +
								'		<RadioGroup fieldId="ID1" dataType="foreignKey" controlType="radiogroup" />' +
								'		<ComboBox fieldId="ID2" dataType="foreignKey" controlType="combobox" />' +
								'	</px:fields>' +
								'	<px:data>' +
								'		<px:dataRow>' +
								'			<Default fieldId="ID0" value="" text="- -" />' +
								'			<RadioGroup fieldId="ID1" value="" text="- -" />' +
								'			<ComboBox fieldId="ID2" value="" text="- -" />' +
								'		</px:dataRow>' +
								'	</px:data>' +
								'</Entity>';

        var Doc = libxmljs.parseXmlString(xml);
        var Entity = Doc.root();
        _initKeyIndexes(Entity);
        var result = _Model.Transform(Entity);
								
			expect(result).not.to.be.empty;
			expect(result[0]).to.to.deep.equal({
				"Default": "",
				"RadioGroup": "",
				"ComboBox": ""
			});

		});

	});

	describe('foreign table', function() {

		it('fields should return data types for nested foreign tables', function() {
			var xml = '<Entity xmlns:px="urn:panax">' +
								'	<px:fields>' +
								'		<DefaultA fieldId="ID0" dataType="unknown" controlType="default" />' +
								'		<NestedForm fieldId="ID1" dataType="foreignTable" relationshipType="hasOne" controlType="formView">' +
								'			<NestedForm xmlns:px="urn:panax">' +
								'				<px:fields>' +
								'					<DefaultB fieldId="ID2" dataType="unknown" controlType="default" />' +
								'					<NestedGrid fieldId="ID3" dataType="foreignTable" relationshipType="hasMany" controlType="gridView">' +
								'						<NestedGrid xmlns:px="urn:panax">' +
								'							<px:fields>' +
								'								<DefaultC fieldId="ID4" dataType="unknown" controlType="default" />' +
								'							</px:fields>' +
								'						</NestedGrid>' +
								'					</NestedGrid>' +
								'				</px:fields>' +
								'			</NestedForm>' +
								'		</NestedForm>' +
								'	</px:fields>' +
								'	<px:data>' +
								'		<px:dataRow>' +
								'			<DefaultA fieldId="ID0" value="A" text="A" />' +
								'			<NestedForm fieldId="ID1">' +
								'				<NestedForm xmlns:px="urn:panax">' +
								'					<px:data>' +
								'						<px:dataRow>' +
								'							<DefaultB fieldId="ID2" value="B" text="B" />' +
								'							<NestedGrid fieldId="ID3">' +
								'								<NestedGrid xmlns:px="urn:panax">' +
								'									<px:data>' +
								'										<px:dataRow>' +
								'											<DefaultC fieldId="ID4" value="C1" text="C1" />' +
								'										</px:dataRow>' +
								'										<px:dataRow>' +
								'											<DefaultC fieldId="ID4" value="C2" text="C2" />' +
								'										</px:dataRow>' +
								'									</px:data>' +
								'								</NestedGrid>' +
								'							</NestedGrid>' +
								'						</px:dataRow>' +
								'					</px:data>' +
								'				</NestedForm>' +
								'			</NestedForm>' +
								'		</px:dataRow>' +
								'	</px:data>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Model.Transform(Entity);
								
			expect(result).not.to.be.empty;
			expect(result[0]).to.to.deep.equal({
				"DefaultA": "A",
				"NestedForm": [{
					"DefaultB": "B",
					"NestedGrid": [{
						"DefaultC": "C1",
					}, {
						"DefaultC": "C2"
					}]
				}]
			});

		});

		it('dataRow\'s should return primaryKey / identityKey', function() {
			var xml = '<Entity xmlns:px="urn:panax" identityKey="Id">' +
								'	<px:fields>' +
								'		<Id fieldId="IDA" dataType="identity" />' +
								'		<DefaultA fieldId="ID0" dataType="unknown" controlType="default" />' +
								'		<NestedForm fieldId="ID1" dataType="foreignTable" relationshipType="hasOne" controlType="formView">' +
								'			<NestedForm xmlns:px="urn:panax" primaryKey="Di">' +
								'				<px:fields>' +
								'					<Di fieldId="IDB" dataType="int" />' +
								'					<DefaultB fieldId="ID2" dataType="unknown" controlType="default" />' +
								'				</px:fields>' +
								'			</NestedForm>' +
								'		</NestedForm>' +
								'	</px:fields>' +
								'	<px:data>' +
								'		<px:dataRow identity="1">' +
								'			<DefaultA fieldId="ID0" value="A" text="A" />' +
								'			<NestedForm fieldId="ID1">' +
								'				<NestedForm xmlns:px="urn:panax" primaryKey="Di">' +
								'					<px:data>' +
								'						<px:dataRow primaryValue="1">' +
								'							<DefaultB fieldId="ID2" value="B" text="B" />' +
								'						</px:dataRow>' +
								'					</px:data>' +
								'				</NestedForm>' +
								'			</NestedForm>' +
								'		</px:dataRow>' +
								'	</px:data>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Model.Transform(Entity);
								
			expect(result).not.to.be.empty;
			expect(result[0]).to.to.deep.equal({
				"Id": "1",
				"DefaultA": "A",
				"NestedForm": [{
					"Di": "1",
					"DefaultB": "B"
				}]
			});
		});

	});

  describe('junction table (nested PxAgGrid)', function() {

    it('to plain table');

    it('to self-referenced table');

  });

});