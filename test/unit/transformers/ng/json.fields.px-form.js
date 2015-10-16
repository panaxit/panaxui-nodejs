var expect = require('chai').expect;
var Fields = require('../../../../transformers/ng/json.fields');

describe.skip('px-form', function() {

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
		
		it('PENDING');
		
	});
	
});