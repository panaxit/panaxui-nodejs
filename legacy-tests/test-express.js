/**
 * Panax test with Express
 *
 * Test with:
 * curl -i -X POST -d 'username=webmaster&password=tests' http://localhost:8080/login
 */

// Get required packages
var express = require('express'),
	bodyParser = require('body-parser'),
    sql = require('mssql'),
    crypto = require('crypto');

// Global MS-SQL connection string
var sql_config = {
    user: 'sa',
    password: 'zama',
    server: 'localhost',
    database: 'Showcase',
};

// Create application
var app = express();

// Configure application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);

// Start  application
app.listen(app.get('port'));
console.info("PanaxUI server running on 127.0.0.1:" + app.get('port'));

/**
 * /login [POST]
 */
app.post('/login', function login(req, res) {

	sql.connect(sql_config, function(err) {

        if (err) {
        	//ToDo: Session("AccessGranted") = FALSE
            res.json({
            	success: false,
            	message: "Error opening the database connection!",
            	error: err
            });
            console.log("Error opening the database connection!"); 
            console.log("ERROR:");
	        console.dir(err);
            return;
        }

	    var sqlRequest = new sql.Request();

	    //ToDo: oCn.Execute("SET LANGUAGE SPANISH")
	    sqlRequest.input('username', sql.VarChar, req.body.username);
	    sqlRequest.input('password', sql.VarChar, 
	        crypto.createHash('md5').update(req.body.password).digest('hex'));

	    sqlRequest.execute('Showcase.[$Security].Authenticate', function(err, recordsets, returnValue) {

	        if(err) {
        		//ToDo: Session("AccessGranted") = FALSE
	            res.json({
	            	success: false,
	            	message: "Error running query!",
            		error: err
	            });
            	console.log("Error running query!");
	            console.log("ERROR:");
		        console.dir(err);
	            			
            	return;
	        }

        	//ToDo: Session("AccessGranted") = TRUE
        	//
	        //ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
	        //sqlRequest.query("...", function(err, recordset) {....
	        //
	        //ToDo: SET SESSION("UserSiteMap")=oSiteMap //GET USER SITEMAP

	        res.json({
	        	success: true,
	        });
	    });

	}); 
});
