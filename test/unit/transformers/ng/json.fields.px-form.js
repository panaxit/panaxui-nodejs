var expect = require('chai').expect;
var libxmljs = require('libxslt').libxmljs;
var _initKeyIndexes = require('../../../../transformers/ng/json').initKeyIndexes;
var _Fields = require('../../../../transformers/ng/json.fields');

describe('px-form', function() {

	describe('basic', function() {

		it('empty layout should return array with empty fields', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:layout>' +
								'	</px:layout>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

			expect(result).to.deep.equal([]);
		});
		
	});

	describe('fieldset (fieldContainer)', function() {

    it('empty fieldcontainer should return empty fieldgroup', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
                ' <px:layout>' +
                '   <px:fieldContainer>' +
                '   </px:fieldContainer>' +
                ' </px:layout>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          {
            "fieldgroup": []
          }
        ]
      );
    });
    
    it('PENDING Orientation');

	});

	describe('tabPanel / tabs', function() {

		it('layout with empty tabpanel should return empty tabs', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:layout>' +
								'		<px:tabPanel>' +
								'		</px:tabPanel>' +
								'	</px:layout>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

			expect(result).to.deep.equal(
				[
					{
						"type": "tabPanel",
						"tabs": []
					}
				]
			);
		});

		it('layout with empty tabs should return named tabs with empty fields', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:layout>' +
								'		<px:tabPanel>' +
								'			<px:tab name="Tab 1">' +
								'			</px:tab>' +
								'			<px:tab name="Tab 2">' +
								'			</px:tab>' +
								'		</px:tabPanel>' +
								'	</px:layout>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

			expect(result).to.deep.equal(
				[
					{
						"type": "tabPanel",
						"tabs": [
							{"type": "tab", "title": "Tab 1", "fields": []},
							{"type": "tab", "title": "Tab 2", "fields": []}
						]
					}
				]
			);
		});
		
	});

	describe('fields', function() {

		it('layout with fields should return array of field objects', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:fields>' +
								'		<FieldA fieldId="IDA" fieldName="FieldA" />' +
								'		<FieldB fieldId="IDB" fieldName="FieldB" />' +
								'	</px:fields>' +
								'	<px:layout>' +
								'		<px:tabPanel>' +
								'			<px:tab name="Tab">' +
								'				<px:field fieldId="IDA" />' +
								'				<px:field fieldId="IDB" />' +
								'			</px:tab>' +
								'		</px:tabPanel>' +
								'	</px:layout>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

			expect(result).to.deep.equal(
				[
					{
						"type": "tabPanel",
						"tabs": [
							{
								"type": "tab", 
								"title": "Tab", 
								"fields": [
									{
										"key": "FieldA",
										"type": "default",
										"templateOptions": {
											"label": "",
											"placeholder": ""
										},
										"data": {}
									},
									{
										"key": "FieldB",
										"type": "default",
										"templateOptions": {
											"label": "",
											"placeholder": ""
										},
										"data": {}
									}
								]
							}
						]
					}
				]
			);
		});
		
	});

	describe('data types', function() {

		it('basic data types', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:fields>' +
								'		<ShortTextField fieldId="ID00" fieldName="ShortTextField" headerText="Short Text Field" dataType="nvarchar" length="255" controlType="default" />' +
								'		<IntegerReq fieldId="ID01" fieldName="IntegerReq" headerText="Integer Req" dataType="int" length="10" controlType="default" />' +
								'		<Float fieldId="ID02" fieldName="Float" headerText="Float" dataType="float" controlType="default" />' +
								'		<Boolean fieldId="ID05" fieldName="Boolean" headerText="Boolean" dataType="bit" controlType="default" />' +
								'		<Money fieldId="ID06" fieldName="Money" headerText="Money" dataType="money" length="15" controlType="default" />' +
								'		<Date fieldId="ID07" fieldName="Date" headerText="Date" dataType="date" controlType="default" />' +
								'		<Datetime fieldId="ID08" fieldName="Datetime" headerText="Datetime" dataType="datetime" controlType="default" />' +
								'		<Time fieldId="ID09" fieldName="Time" headerText="Time" dataType="time" controlType="default" />' +
								'		<LongText fieldId="ID10" fieldName="LongText" headerText="Long Text" dataType="text" length="2147483647" controlType="default" />' +
								'	</px:fields>' +
								'	<px:layout>' +
								'		<px:field fieldId="ID00" />' +
								'		<px:field fieldId="ID01" />' +
								'		<px:field fieldId="ID02" />' +
								'		<px:field fieldId="ID05" />' +
								'		<px:field fieldId="ID06" />' +
								'		<px:field fieldId="ID07" />' +
								'		<px:field fieldId="ID08" />' +
								'		<px:field fieldId="ID09" />' +
								'		<px:field fieldId="ID10" />' +
								'	</px:layout>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

			expect(result).to.deep.equal(
				[
					{ "key": "ShortTextField", "type": "input", "templateOptions": { "label": "Short Text Field", "placeholder": "", "maxLength": 255 }, "data": {} },
					{ "key": "IntegerReq", "type": "number", "templateOptions": { "label": "Integer Req", "placeholder": "", "maxLength": 10 }, "data": {} },
					{ "key": "Float", "type": "number", "templateOptions": { "label": "Float", "placeholder": "" }, "data": {} },
					{ "key": "Boolean", "type": "checkbox", "templateOptions": { "label": "Boolean", "placeholder": "" }, "data": {} },
					{ "key": "Money", "type": "money", "templateOptions": { "label": "Money", "placeholder": "", "maxLength": 15 }, "data": {} },
					{ "key": "Date", "type": "date", "templateOptions": { "label": "Date", "placeholder": "" }, "data": {} },
					{ "key": "Datetime", "type": "datetime", "templateOptions": { "label": "Datetime", "placeholder": "" }, "data": {} },
					{ "key": "Time", "type": "time", "templateOptions": { "label": "Time", "placeholder": "" }, "data": {} },
					{ "key": "LongText", "type": "textarea", "templateOptions": { "label": "Long Text", "placeholder": "", "maxLength": 2147483647 }, "data": {} }
        ]
			);
		});

		it('advanced data types', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:fields>' +
								'		<EMail fieldId="ID00" fieldName="EMail" headerText="E Mail" dataType="nvarchar" length="255" controlType="email" />' +
								'		<Color fieldId="ID01" fieldName="Color" headerText="Color" dataType="nchar" length="7" controlType="color" />' +
								'		<PxFile fieldId="ID02" fieldName="PxFile" headerText="Px File" dataType="nvarchar" length="255" controlType="file" />' +
								'		<PxPicture fieldId="ID03" fieldName="PxPicture" headerText="Px Picture" dataType="nvarchar" length="255" controlType="picture" />' +
								'		<PxPassword fieldId="ID04" fieldName="PxPassword" headerText="Px Password" dataType="nchar" length="32" controlType="password" />' +
								'	</px:fields>' +
								'	<px:layout>' +
								'		<px:field fieldId="ID00" />' +
								'		<px:field fieldId="ID01" />' +
								'		<px:field fieldId="ID02" />' +
								'		<px:field fieldId="ID03" />' +
								'		<px:field fieldId="ID04" />' +
								'	</px:layout>' +
								'</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

			expect(result).to.deep.equal(
				[
					{ "key": "EMail", "type": "email", "templateOptions": { "label": "E Mail", "placeholder": "", "maxLength": 255 }, "data": {} },
					{ "key": "Color", "type": "color", "templateOptions": { "label": "Color", "placeholder": "", "maxLength": 7 }, "data": {} },
					{ "key": "PxFile", "type": "file", "templateOptions": { "label": "Px File", "placeholder": "", "maxLength": 255 }, "data": {} },
					{ "key": "PxPicture", "type": "file", "templateOptions": { "label": "Px Picture", "placeholder": "", "maxLength": 255 }, "data": {} },
					{ "key": "PxPassword", "type": "password", "templateOptions": { "label": "Px Password", "placeholder": "", "maxLength": 32 }, "data": {} }
				]
			);
		});
		
	});

	describe('options / params', function() {

    it('radio', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
                ' <px:fields>' +
                '   <RadioGroup fieldId="ID00" fieldName="RadioGroup" headerText="Radio Group" dataType="foreignKey" relationshipType="belongsTo" length="10" controlType="radiogroup">' +
                '     <Options />' +
                '     <px:data>' +
                '       <Options text="A" value="1" />' +
                '       <Options text="B" value="2" />' +
                '     </px:data>' +
                '   </RadioGroup>' +
                ' </px:fields>' +
                ' <px:layout>' +
                '   <px:field fieldId="ID00" />' +
                ' </px:layout>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          { "key": "RadioGroup", "type": "radio", "templateOptions": { 
            "label": "Radio Group", 
            "placeholder": "",
            "maxLength": 10,
            "options": [
              {"name": "A", "value": "1"},
              {"name": "B", "value": "2"}
            ]
          }, "data": {} }
        ]
      );
    });

    it('async_select', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
                ' <px:fields>' +
                '   <Combobox fieldId="ID00" fieldName="Combobox" headerText="Combo box" dataType="foreignKey" relationshipType="belongsTo" length="2" controlType="combobox">' +
                '     <Options dataText="RTRIM(Name)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="Options" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="Options" Name="Options" controlType="default" />' +
                '   </Combobox>' +
                ' </px:fields>' +
                ' <px:layout>' +
                '   <px:field fieldId="ID00" />' +
                ' </px:layout>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          // {
          //   "template": "Combo box"
          // },
          {
            "className": "display-flex",
            "fieldGroup": [
              { "className": "flex-1",
                "key": "Combobox", "type": "async_select", "templateOptions": { 
                "label": "Combo box", 
                "placeholder": "",
                "maxLength": 2,
                "options": [],
                "params": {
                  "catalogName": "TestSchema.Options",
                  "valueColumn": "RTRIM([Id])",
                  "textColumn": "RTRIM(Name)",
                  "dependantEntity": "Combobox"
                }
              }, "data": {} }
            ]
          }
        ]
      );
    });

    it('cascaded', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
                ' <px:fields>' +
                '   <BirthPlace fieldId="ID00" fieldName="BirthPlace" Name="BirthPlace" Column_Name="BirthPlace" isPrimaryKey="0" isIdentity="0" dataType="foreignKey" relationshipType="belongsTo" length="5" isNullable="1" headerText="Birth Place" controlType="default">' +
                '     <City fieldId="ID0EUB" fieldName="BirthPlace" sortOrder="0" text="- -" foreignKey="fk" dataText="RTRIM(City)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="City" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="City" Name="City" controlType="default">' +
                '       <State sortOrder="0" text="- -" foreignKey="fk" dataText="RTRIM(State)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="State" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="State" Name="State" controlType="default">' +
                '         <Country sortOrder="0" text="- -" dataText="RTRIM(Country)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="Country" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="Country" Name="Country" controlType="default" />' +
                '       </State>' +
                '     </City>' +
                '   </BirthPlace>' +
                ' </px:fields>' +
                ' <px:layout>' +
                '   <px:field fieldId="ID00" />' +
                ' </px:layout>' +
                ' <px:data>' +
                '   <px:dataRow rowNumber="1" identity="1" primaryValue="1" mode="inherit">' +
                '     <BirthPlace fieldId="ID00" value="01001" text="MEXICO //Aguascalientes //Aguascalientes">' +
                '       <City fieldId="ID0EUB" fieldName="BirthPlace" sortOrder="1" text="Aguascalientes" value="01001" foreignValue="01" foreignKey="fk" dataText="RTRIM(City)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="City" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="City" Name="City" controlType="default">' +
                '         <State sortOrder="1" text="Aguascalientes" value="01" foreignValue="MX" foreignKey="fk" dataText="RTRIM(State)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="State" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="State" Name="State" controlType="default">' +
                '           <Country sortOrder="151" text="MEXICO" value="MX" dataText="RTRIM(Country)" dataValue="RTRIM([Id])" primaryKey="Id" headerText="Country" Table_Schema="TestSchema" Schema="TestSchema" Table_Name="Country" Name="Country" controlType="default"/>' +
                '         </State>' +
                '       </City>' +
                '     </BirthPlace>' +
                '   </px:dataRow>' +
                ' </px:data>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          // {
          //   "template": "Birth Place"
          // },
          {
            "className": "display-flex",
            "fieldGroup": [
              { "className": "flex-1",
                "key": "Country", "type": "async_select",
                "model": "formState", "templateOptions": {
                  "label": "Country", 
                  "placeholder": "",
                  "options": [],
                  "params": {
                    "catalogName": "TestSchema.Country",
                    "valueColumn": "RTRIM([Id])",
                    "textColumn": "RTRIM(Country)",
                    "dependantEntity": "State"
                  }
                }
              },
              { "className": "flex-1",
                "key": "State", "type": "async_select",
                "model": "formState", "templateOptions": {
                  "label": "State", 
                  "placeholder": "",
                  "options": [],
                  "params": {
                    "catalogName": "TestSchema.State",
                    "valueColumn": "RTRIM([Id])",
                    "textColumn": "RTRIM(State)",
                    "foreignEntity": "Country",
                    "foreignKey": "fk",
                    "foreignValue": "MX",
                    "dependantEntity": "City"
                  }
                }
              },
              { "className": "flex-1",
                "key": "BirthPlace", "type": "async_select", "templateOptions": { 
                "label": "Birth Place", 
                "placeholder": "",
                "maxLength": 5,
                "options": [],
                "params": {
                  "catalogName": "TestSchema.City",
                  "valueColumn": "RTRIM([Id])",
                  "textColumn": "RTRIM(City)",
                  "foreignEntity": "State",
                  "foreignKey": "fk",
                  "foreignValue": "01",
                  "dependantEntity": "BirthPlace"
                }
              }, "data": {} }
            ]
          }
        ]
      );
    });
		
	});

	describe('foreign table', function() {

    it('hasOne (nested FormView)', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
                ' <px:fields>' +
                '   <NestedForm fieldId="ID00" fieldName="NestedForm" dataType="foreignTable" relationshipType="hasOne" foreignSchema="TestSchema" foreignTable="NestedForm" foreignReference="Id" headerText="Nested Form" mode="inherit" controlType="formView">' +
                '     <NestedForm xmlns:px="urn:panax" xml:lang="es" dbId="Demo" fullPath="" version="Beta_12" pageSize="0" pageIndex="1" foreignReference="Id" Schema="TestSchema" Name="NestedForm" Table_Name="NestedForm" Table_Schema="TestSchema" Base_Type="TABLE" primaryKey="Id" dataType="table" controlType="formView" filtersBehavior="append" headerText="Nested Form" filters="id=1" mode="edit" supportsInsert="1" disableInsert="0" supportsUpdate="1" disableUpdate="0" supportsDelete="1" disableDelete="0">' +
                '       <px:fields>' +
                '         <FieldA fieldId="IDA" fieldName="FieldA" />' +
                '       </px:fields>' +
                '       <px:layout>' +
                '         <px:field fieldId="IDA" />' +
                '       </px:layout>' +
                '     </NestedForm>' +
                '   </NestedForm>' +
                ' </px:fields>' +
                ' <px:layout>' +
                '   <px:field fieldId="ID00" />' +
                ' </px:layout>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          { 
            "key": "NestedForm", 
            "type": "form", 
            "templateOptions": { 
              "label": "Nested Form", 
              "placeholder": "" 
            },
            "data": {
              "fields": [
                {
                  "key": "FieldA",
                  "type": "default",
                  "templateOptions": {
                    "label": "",
                    "placeholder": ""
                  },
                  "data": {}
                }
              ],
              "catalog": {
                "dbId": 'Demo',
                "catalogName": 'TestSchema.NestedForm',
                "schemaName": 'TestSchema',
                "tableName": 'NestedForm',
                "mode": 'edit',
                "controlType": 'formView',
                "lang": 'es',
                "primaryKey": 'Id',
                "foreignReference": 'Id',
                "pageSize": 0,
                "pageIndex": 1,
                "metadata": {
                  "supportsInsert": '1',
                  "supportsUpdate": '1',
                  "supportsDelete": '1',
                  "disableInsert": '0',
                  "disableUpdate": '0',
                  "disableDelete": '0'
                }
              }
            } 
          }
        ]
      );
    });

    it('hasMany (deeply nested GridView)', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView" >' +
                ' <px:fields>' +
                '   <NestedForm fieldId="ID00" fieldName="NestedForm" dataType="foreignTable" relationshipType="hasOne" foreignSchema="TestSchema" foreignTable="NestedForm" foreignReference="Id" headerText="Nested Form" mode="inherit" controlType="formView">' +
                '     <NestedForm xmlns:px="urn:panax" xml:lang="es" dbId="Demo" fullPath="" version="Beta_12" pageSize="0" pageIndex="1" foreignReference="Id" Schema="TestSchema" Name="NestedForm" Table_Name="NestedForm" Table_Schema="TestSchema" Base_Type="TABLE" primaryKey="Id" dataType="table" controlType="formView" filtersBehavior="append" headerText="Nested Form" filters="id=1" mode="edit" supportsInsert="1" disableInsert="0" supportsUpdate="1" disableUpdate="0" supportsDelete="1" disableDelete="0">' +
                '       <px:fields>' +
                '         <NestedGrid fieldId="ID01" fieldName="NestedGrid" controlType="gridView" Name="NestedGrid" Column_Name="NestedGrid" dataType="foreignTable" relationshipType="hasMany" foreignSchema="TestSchema" foreignTable="NestedGrid" foreignReference="FkId" headerText="Nested Grid" mode="inherit">' +
                '           <NestedGrid xmlns:px="urn:panax" xml:lang="es" dbId="Demo" version="Beta_12" pageSize="0" pageIndex="1" foreignReference="FkId" Schema="TestSchema" Name="NestedGrid" Table_Name="NestedGrid" Table_Schema="TestSchema" Base_Type="TABLE" primaryKey="Id" supportsInsert="1" disableInsert="0" supportsUpdate="1" disableUpdate="0" supportsDelete="1" disableDelete="0" dataType="table" controlType="gridView" filtersBehavior="append" headerText="Nested Grid" filters="id=1" mode="edit">' +
                '             <px:fields>' +
                '               <FieldA fieldId="IDA" fieldName="FieldA" />' +
                '             </px:fields>' +
                '             <px:layout>' +
                '               <px:field fieldId="IDA" />' +
                '             </px:layout>' +
                '           </NestedGrid>' +
                '         </NestedGrid>' +
                '       </px:fields>' +
                '       <px:layout>' +
                '         <px:field fieldId="ID01" />' +
                '       </px:layout>' +
                '     </NestedForm>' +
                '   </NestedForm>' +
                ' </px:fields>' +
                ' <px:layout>' +
                '   <px:field fieldId="ID00" />' +
                ' </px:layout>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          { 
            "key": "NestedForm", 
            "type": "form", 
            "templateOptions": { 
              "label": "Nested Form", 
              "placeholder": "" 
            },
            "data": {
              "fields": [
                {
                  "key": "NestedGrid",
                  "type": "grid",
                  "templateOptions": {
                    "label": "Nested Grid",
                    "placeholder": ""
                  },
                  "data": {
                    "fields": {
                      "columnDefs": [
                        {"field": "FieldA", "displayName": "", "type": "object"}
                      ]
                    },
                    "catalog": {
                      "dbId": 'Demo',
                      "catalogName": 'TestSchema.NestedGrid',
                      "schemaName": 'TestSchema',
                      "tableName": 'NestedGrid',
                      "mode": 'edit',
                      "controlType": 'gridView',
                      "lang": 'es',
                      "primaryKey": 'Id',
                      "foreignReference": 'FkId',
                      "pageSize": 0,
                      "pageIndex": 1,
                      "metadata": {
                        "supportsInsert": '1',
                        "supportsUpdate": '1',
                        "supportsDelete": '1',
                        "disableInsert": '0',
                        "disableUpdate": '0',
                        "disableDelete": '0'
                      }
                    }
                  }
                }
              ],
              "catalog": {
                "dbId": 'Demo',
                "catalogName": 'TestSchema.NestedForm',
                "schemaName": 'TestSchema',
                "tableName": 'NestedForm',
                "mode": 'edit',
                "controlType": 'formView',
                "lang": 'es',
                "primaryKey": 'Id',
                "foreignReference": 'Id',
                "pageSize": 0,
                "pageIndex": 1,
                "metadata": {
                  "supportsInsert": '1',
                  "supportsUpdate": '1',
                  "supportsDelete": '1',
                  "disableInsert": '0',
                  "disableUpdate": '0',
                  "disableDelete": '0'
                }
              }
            } 
          }
        ]
      );
    });

    it('hasMany (deeply nested CardsView)', function() {
      var xml = '<Entity xmlns:px="urn:panax" controlType="formView" >' +
                ' <px:fields>' +
                '   <NestedForm fieldId="ID00" fieldName="NestedForm" dataType="foreignTable" relationshipType="hasOne" foreignSchema="TestSchema" foreignTable="NestedForm" foreignReference="Id" headerText="Nested Form" mode="inherit" controlType="formView">' +
                '     <NestedForm xmlns:px="urn:panax" xml:lang="es" dbId="Demo" fullPath="" version="Beta_12" pageSize="0" pageIndex="1" foreignReference="Id" Schema="TestSchema" Name="NestedForm" Table_Name="NestedForm" Table_Schema="TestSchema" Base_Type="TABLE" primaryKey="Id" dataType="table" controlType="formView" filtersBehavior="append" headerText="Nested Form" filters="id=1" mode="edit" supportsInsert="1" disableInsert="0" supportsUpdate="1" disableUpdate="0" supportsDelete="1" disableDelete="0">' +
                '       <px:fields>' +
                '         <NestedCards fieldId="ID01" fieldName="NestedCards" controlType="cardsView" Name="NestedCards" Column_Name="NestedCards" dataType="foreignTable" relationshipType="hasMany" foreignSchema="TestSchema" foreignTable="NestedCards" foreignReference="FkId" headerText="Nested Cards" mode="inherit">' +
                '           <NestedCards xmlns:px="urn:panax" xml:lang="es" dbId="Demo" version="Beta_12" pageSize="0" pageIndex="1" foreignReference="FkId" Schema="TestSchema" Name="NestedCards" Table_Name="NestedCards" Table_Schema="TestSchema" Base_Type="TABLE" primaryKey="Id" supportsInsert="1" disableInsert="0" supportsUpdate="1" disableUpdate="0" supportsDelete="1" disableDelete="0" dataType="table" controlType="cardsView" filtersBehavior="append" headerText="Nested Cards" filters="id=1" mode="edit">' +
                '             <px:fields>' +
                '               <FieldA fieldId="IDA" fieldName="FieldA" />' +
                '             </px:fields>' +
                '             <px:layout>' +
                '               <px:field fieldId="IDA" />' +
                '             </px:layout>' +
                '           </NestedCards>' +
                '         </NestedCards>' +
                '       </px:fields>' +
                '       <px:layout>' +
                '         <px:field fieldId="ID01" />' +
                '       </px:layout>' +
                '     </NestedForm>' +
                '   </NestedForm>' +
                ' </px:fields>' +
                ' <px:layout>' +
                '   <px:field fieldId="ID00" />' +
                ' </px:layout>' +
                '</Entity>';

      var Doc = libxmljs.parseXmlString(xml);
      var Entity = Doc.root();
      _initKeyIndexes(Entity);
      var result = _Fields.Transform(Entity);

      expect(result).to.deep.equal(
        [
          { 
            "key": "NestedForm", 
            "type": "form", 
            "templateOptions": { 
              "label": "Nested Form", 
              "placeholder": "" 
            },
            "data": {
              "fields": [
                {
                  "key": "NestedCards",
                  "type": "cards",
                  "templateOptions": {
                    "label": "Nested Cards",
                    "placeholder": ""
                  },
                  "data": {
                    "fields": {},
                    "catalog": {
                      "dbId": 'Demo',
                      "catalogName": 'TestSchema.NestedCards',
                      "schemaName": 'TestSchema',
                      "tableName": 'NestedCards',
                      "mode": 'edit',
                      "controlType": 'cardsView',
                      "lang": 'es',
                      "primaryKey": 'Id',
                      "foreignReference": 'FkId',
                      "pageSize": 0,
                      "pageIndex": 1,
                      "metadata": {
                        "supportsInsert": '1',
                        "supportsUpdate": '1',
                        "supportsDelete": '1',
                        "disableInsert": '0',
                        "disableUpdate": '0',
                        "disableDelete": '0'
                      }
                    }
                  }
                }
              ],
              "catalog": {
                "dbId": 'Demo',
                "catalogName": 'TestSchema.NestedForm',
                "schemaName": 'TestSchema',
                "tableName": 'NestedForm',
                "mode": 'edit',
                "controlType": 'formView',
                "lang": 'es',
                "primaryKey": 'Id',
                "foreignReference": 'Id',
                "pageSize": 0,
                "pageIndex": 1,
                "metadata": {
                  "supportsInsert": '1',
                  "supportsUpdate": '1',
                  "supportsDelete": '1',
                  "disableInsert": '0',
                  "disableUpdate": '0',
                  "disableDelete": '0'
                }
              }
            } 
          }
        ]
      );
    });
		
	});

	describe('junction table', function() {

		it('PENDING');
		
	});
	
});