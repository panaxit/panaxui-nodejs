/**
 * DB Jasmine tests
 */

describe("PanaxDB MSSQL", function () {

	var sql = require('mssql'),
		panaxdb = require('../panaxdb'),
		panaxui = require('../panaxui'),
		md5 = panaxui.md5;

	var userId;

	it("should connect", function (done) {
		sql.connect(panaxdb.config, function (err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it("should execute SQL queries", function (done) {
		sql.connect(panaxdb.config, function (err) {
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
		sql.connect(panaxdb.config, function (err) {
			var sql_req = new sql.Request();

			sql_req.input('username', sql.VarChar, panaxui.config.username);
			sql_req.input('password', sql.VarChar, md5(panaxui.config.password));

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
		sql.connect(panaxdb.config, function (err) {
			var sql_req = new sql.Request();

			sql_req.query("[$Security].UserSitemap @@IdUser="+userId, function (err, recordsets, returnValue) {
				expect(err).toBeFalsy();
				done();
			});
		});
	});

});