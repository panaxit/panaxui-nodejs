var expect = require('chai').expect;
var Fields = require('../../../../transformers/ng/json.fields');

describe('px-form', function() {

	describe('basic', function() {

		it('empty layout should return array with empty fieldset', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:layout>' +
								'	</px:layout>' +
								'</Entity>';
			var result = Fields.Transform(xml);
			expect(result).to.deep.equal(
				[
					{
						"type": "fieldset",
						"fields": []
					}
				]
			);
		});
		
	});

	describe('fieldset / fieldContainer', function() {
		
		it('PENDING');

	});

	describe('tabPanel / tabs', function() {

		it('layout with empty tabpanel should return empty tabs', function() {
			var xml = '<Entity xmlns:px="urn:panax" controlType="formView">' +
								'	<px:layout>' +
								'		<px:tabPanel>' +
								'		</px:tabPanel>' +
								'	</px:layout>' +
								'</Entity>';
			var result = Fields.Transform(xml);
			expect(result).to.deep.equal(
				[
					{
						"type": "fieldset",
						"fields": [
							{
								"type": "tabPanel",
								"tabs": []
							}
						]
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
			var result = Fields.Transform(xml);
			expect(result).to.deep.equal(
				[
					{
						"type": "fieldset",
						"fields": [
							{
								"type": "tabPanel",
								"tabs": [
									{"type": "tab", "name": "Tab 1", "fields": []},
									{"type": "tab", "name": "Tab 2", "fields": []}
								]
							}
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
			var result = Fields.Transform(xml);
			expect(result).to.deep.equal(
				[
					{
						"type": "fieldset",
						"fields": [
							{
								"type": "tabPanel",
								"tabs": [
									{
										"type": "tab", 
										"name": "Tab", 
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
								'		<RadioGroup fieldId="ID03" fieldName="RadioGroup" headerText="Radio Group" dataType="foreignKey" relationshipType="belongsTo" length="10" controlType="radiogroup" />' +
								'		<Combobox fieldId="ID04" fieldName="Combobox" headerText="Combobox" dataType="foreignKey" relationshipType="belongsTo" length="2" controlType="combobox" />' +
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
								'		<px:field fieldId="ID03" />' +
								'		<px:field fieldId="ID04" />' +
								'		<px:field fieldId="ID05" />' +
								'		<px:field fieldId="ID06" />' +
								'		<px:field fieldId="ID07" />' +
								'		<px:field fieldId="ID08" />' +
								'		<px:field fieldId="ID09" />' +
								'		<px:field fieldId="ID10" />' +
								'	</px:layout>' +
								'</Entity>';
			var result = Fields.Transform(xml);
			expect(result).to.deep.equal(
				[
					{
						"type": "fieldset",
						"fields": [
							{ "key": "ShortTextField", "type": "input", "templateOptions": { "label": "Short Text Field", "placeholder": "" }, "data": {} },
							{ "key": "IntegerReq", "type": "number", "templateOptions": { "label": "Integer Req", "placeholder": "" }, "data": {} },
							{ "key": "Float", "type": "number", "templateOptions": { "label": "Float", "placeholder": "" }, "data": {} },
							{ "key": "RadioGroup", "type": "radio", "templateOptions": { "label": "Radio Group", "placeholder": "" }, "data": {} },
							{ "key": "Combobox", "type": "async_select", "templateOptions": { "label": "Combobox", "placeholder": "" }, "data": {} },
							{ "key": "Boolean", "type": "checkbox", "templateOptions": { "label": "Boolean", "placeholder": "" }, "data": {} },
							{ "key": "Money", "type": "money", "templateOptions": { "label": "Money", "placeholder": "" }, "data": {} },
							{ "key": "Date", "type": "date", "templateOptions": { "label": "Date", "placeholder": "" }, "data": {} },
							{ "key": "Datetime", "type": "datetime", "templateOptions": { "label": "Datetime", "placeholder": "" }, "data": {} },
							{ "key": "Time", "type": "time", "templateOptions": { "label": "Time", "placeholder": "" }, "data": {} },
							{ "key": "LongText", "type": "textarea", "templateOptions": { "label": "Long Text", "placeholder": "" }, "data": {} }
						]
					}
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
			var result = Fields.Transform(xml);
			expect(result).to.deep.equal(
				[
					{
						"type": "fieldset",
						"fields": [
							{ "key": "EMail", "type": "email", "templateOptions": { "label": "E Mail", "placeholder": "" }, "data": {} },
							{ "key": "Color", "type": "color", "templateOptions": { "label": "Color", "placeholder": "" }, "data": {} },
							{ "key": "PxFile", "type": "file", "templateOptions": { "label": "Px File", "placeholder": "" }, "data": {} },
							{ "key": "PxPicture", "type": "file", "templateOptions": { "label": "Px Picture", "placeholder": "" }, "data": {} },
							{ "key": "PxPassword", "type": "password", "templateOptions": { "label": "Px Password", "placeholder": "" }, "data": {} }
						]
					}
				]
			);
		});
		
	});

	describe('foreign tables', function() {

		describe('hasOne', function() {

			it('PENDING');
			
		});

		describe('hasMany', function() {

			it('PENDING');
			
		});
		
	});

	describe('junction tables', function() {

		it('PENDING');
		
	});
	
});