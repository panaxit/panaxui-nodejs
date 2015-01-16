/*********************
 * PanaxUI API Server
 *********************/

/**
 * Application Configuration
 */

// Required modules
var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	sql = require('mssql'),
	crypto = require('crypto'),
	Saxon = require('saxon-stream'),
	fs = require('fs'),
	Readable = require('stream').Readable;

// MSSQL global connection config
var sql_conn = {
	user: 'sa',
	password: 'zama',
	server: 'localhost',
	database: 'Showcase',
};

// ToDo: sql_conn = new sql.Connection(sql_config);

// Saxon (XSLT) config
var saxonJarPath = __dirname + '/vendor/SaxonHE9-6-0-3J/saxon9he.jar';
var saxon = new Saxon(saxonJarPath);

// Create, configure & start Express app
var app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(session({
	secret: 'panaxit zekret',
	resave: false,
	saveUninitialized: true
}));
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));
console.info("PanaxUI server running on 127.0.0.1:" + app.get('port'));

/**
 * Helper functions
 */

/**
 * Error handler helper function
 *
 * Return a descriptive error to client and log the error server-side
 *
 * @param  {Object} res Response
 * @param  {String} msg Message/Title
 * @param  {Object} err Error
 *
 * @return {[type]}     [description]
 */
var errorHandler = function(res, msg, err) {
	var result = {
		success: false,
		message: msg
			// ToDo: Add req & res for logging purposes
	};

	console.error("-- ERROR:\n" + msg); // ToDo: Add datetime and format as standard Unix log

	if (!!err) {
		result.err = err;
		console.dir(err);
	}

	return res.json(result);
};

/**
 * Application Routes
 */

// Login
app.post('/login', function login(req, res) {

	// Connect to MSSQL
	sql.connect(sql_conn, function(err) {

		// Error handling
		if (err) {
			return errorHandler(res, "Error: Database connection", err);
		}

		if (!req.body.username || !req.body.password) {
			return errorHandler(res, "Error: Missing username or password");
		}

		// SQL Request
		try {

			var sqlRequest = new sql.Request(),
				username = req.body.username,
				password = crypto.createHash('md5').update(req.body.password).digest('hex');

			//ToDo: oCn.Execute("SET LANGUAGE SPANISH")
			sqlRequest.input('username', sql.VarChar, username);
			sqlRequest.input('password', sql.VarChar, password);

			sqlRequest.execute('[$Security].Authenticate', function(err, recordsets, returnValue) {

				// Error handling for SQL Request
				if (err) {
					return errorHandler(res, "Error: SQL Request - Authenticate", err);
				}

				// Set session data
				req.session.userId = recordsets[0][0].userId;
				//ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
				//sqlRequest.query("...", function(err, recordset) {...

				// Response JSON
				res.json({
					success: true,
					data: {
						userId: req.session.userId
					}
				});

			});

		} catch (err) {
			// Error handling for Exceptions
			errorHandler(res, "Error: Exception", err);
		}

	});
});

// Logout current user
app.get('/logout', function logout(req, res) {

	// Clear session
	req.session.userId = null;
	req.session.usersitemap = null;

	// Response JSON
	res.json({
		success: true
	});
});




app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

// Get user's sitemap
app.get('/sitemap', function (req, res, next) {

	// Connect to MSSQL
	sql.connect(sql_conn, function(err) {

		// Error handling
		if(err) {
			console.dir(err);
			return next(err);
		}

		if (!req.session.userId) {
			return next({message: "Error: Not logged in"});
		}

		// SQL Request
		try {

			var sqlRequest = new sql.Request(),
				sqlQuery = "[$Security].UserSitemap @@IdUser=" + req.session.userId;

			if (!!req.session.lang) {
				sqlQuery += ", @lang=" + req.session.lang;
			}

			// Stream request
			sqlRequest.stream = true;

			sqlRequest.query(sqlQuery);

			// Error handling for SQL Request
			sqlRequest.on('error', function (err) {
				return next(err);
			});

			sqlRequest.on('row', function (row) {

				var tmp = require('temporary');
				var path = require('path');
				var xml = new tmp.File();
				var xsl = path.resolve('xsl/sitemap.xsl');
				console.log(row['']);
				xml.writeFileSync(row['']);

				var _opts = ['-jar', saxonJarPath, '-s:' + xml.path, '-xsl:' + xsl];

				var cmd = require('child_process').exec('java ' + _opts.join(' '), {
					timeout: 5000
				}, function(err, stdout, stderr) {
					if (err)
						return next(err);
					if (stderr) 
						return next(stderr);

					res.json(stdout);
				});

				cmd.on('exit', function(code, sig) {
					//xml.unlink();
				});



				// // XSLT Configuration
				// var xslt = saxon.xslt('xsl/sitemap.xsl');
				// var allDataString;

				// // Set session data
				// req.session.usersitemap = new Readable; // Readable stream (https://github.com/substack/stream-handbook#creating-a-readable-stream)
				// req.session.usersitemap.push(row['']);
				// req.session.usersitemap.push(null);

				// // Response XSLT transformation from XML to JSON
				// var transform = req.session.usersitemap.pipe(xslt);

				// transform.on('error', function(err) {
				// 	return next(err);
				// });

				// transform.on('data', function(data) {
				// 	allDataString = data.toString();
				// });

				// transform.on('end', function() {
				// 	console.log("DATA COUNTER ##################");
				// 	console.log(allDataString.substring(0,50));
				// 	res.json(allDataString);
				// });

			});

		} catch (err) {
			// Error handling for Exceptions
			return next(err);
		}

	});
});

// Get user's sitemap
app.get('/sitemap_old', function sitemap(req, res) {

	// XSLT Configuration
	var xslPath = __dirname + '/xsl/sitemap.xsl',
		xslt = saxon(saxonJarPath, xslPath, {timeout: 5000});

	xslt.on('error', function(err) {
		return errorHandler(res, "Error: XSLT", err);
	});

	// Connect to MSSQL
	sql.connect(sql_conn, function(err) {

		// Error handling
		if (err) {
			return errorHandler(res, "Error: Database connection", err);
		}

		if (!req.session.userId) {
			return errorHandler(res, "Error: Not logged in");
		}

		// SQL Request
		try {

			var sqlRequest = new sql.Request(),
				sqlQuery = "[$Security].UserSitemap @@IdUser=" + req.session.userId;

			if (!!req.session.lang) {
				sqlQuery += ", @lang=" + req.session.lang;
			}

			// Stream request
			sqlRequest.stream = true;

			sqlRequest.query(sqlQuery);

			// Error handling for SQL Request
			sqlRequest.on('error', function (err) {
				return errorHandler(res, "Error: SQL Request - UserSitemap", err);
			});

			// sqlRequest.on('recordset', function (column) {
			// });

			sqlRequest.on('row', function (row) {

				// Set session data
				req.session.usersitemap = new Readable; // Readable stream (https://github.com/substack/stream-handbook#creating-a-readable-stream)
				req.session.usersitemap.push(row['']);
				req.session.usersitemap.push(null);

				// Response XSLT transformation from XML to JSON
				//var transform = req.session.usersitemap.pipe(xslt);
				var transform = fs.createReadStream('tests/menu.xml',{encoding:'utf-8'}).pipe(xslt);

				transform.on('error', function(err) {
					return errorHandler(res, "Error: Processing XSLT", err);
				});

				transform.on('data', function(data) {
					console.log("DATA COUNTER ##################");
					console.log(data.toString().substring(0,50));
					res.json(data.toString());
				});

			});

		} catch (err) {
			// Error handling for Exceptions
			errorHandler(res, "Exception", err);
		}

	});
});