describe('Unit tests', function() {

	describe('Utilities', function() {

		require('./unit/xml');
	
	});

	describe.only('Transformers', function() {

		require('./unit/transformers/helpers');

		describe('JSON', function() {

			require('./unit/transformers/ng/json.catalog');
			require('./unit/transformers/ng/json.model');

		});
	
	});

});