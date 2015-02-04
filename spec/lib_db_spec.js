/**
 * DB Jasmine tests
 */

var sql = require('mssql');
var panax = require('../config/panax');
var util = require('../lib/util');

var userId;

describe("panax.db MSSQL", function () {

	it("should connect", function (done) {
		sql.connect(panax.db.config, function (err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it("should execute SQL queries", function (done) {
		sql.connect(panax.db.config, function (err) {
			var sql_req = new sql.Request();

			sql_req.query('select 1 as number', function (err, recordset) {
				expect(err).toBeFalsy();
				if(!err) {
					expect(recordset[0].number).toBe(1);
				}
				done();
			});
		});
	});

	it("should [$Security].Authenticate", function (done) {
		sql.connect(panax.db.config, function (err) {
			var sql_req = new sql.Request();

			sql_req.input('username', sql.VarChar, panax.ui.config.username);
			sql_req.input('password', sql.VarChar, util.md5(panax.ui.config.password));

			sql_req.execute("[$Security].Authenticate", function (err, recordsets, returnValue) {
				expect(err).toBeFalsy();
				if(!err) {
					expect(returnValue).toBeGreaterThan(-1);
					userId = recordsets[0][0].userId;
				}
				done();
			});
		});
	});

	it("should get sitemap with '[$Security].UserSitemap'", function (done) {
		sql.connect(panax.db.config, function (err) {
			var sql_req = new sql.Request();

			sql_req.query("[$Security].UserSitemap @@UserId="+userId, function (err, recordsets, returnValue) {
				expect(err).toBeFalsy();
				done();
			});
		});
	});

});