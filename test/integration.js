describe('Integration tests: Without mocks', function() {

	require('./integration/ng/session');

});

describe('Integration tests: Using mocks', function() {

	var fs = require('fs');
	var PanaxJS = require('panaxjs');
	var config = require('../config/panax');
	var panaxdb = new PanaxJS.Connection(config);

  before('mock setup & authenticate', function(done) {
		// DDL Isolation
		panaxdb.query(fs.readFileSync('test/mocks.clean.sql', 'utf8'), function(err) {
			if(err) return done(err);
			panaxdb.query(fs.readFileSync('test/mocks.prep.sql', 'utf8'), function(err) {
				if(err) return done(err);
				panaxdb.rebuildMetadata(function (err) {
					if(err) return done(err);
					done();
				});
			});
		});
  });

	require('./integration/ng/read');
	require('./integration/ng/persist');

});