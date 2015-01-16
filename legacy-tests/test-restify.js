/**
 * Panax test with Restify
 *
 * Test with:
 * curl -i -X POST -d 'username=webmaster&password=tests' http://localhost:8080/login
 */
var restify = require('restify'),
	sql = require('mssql'),
    crypto = require('crypto');

/*
Global MSSQL connection
 */
var sql_config = {
    user: 'sa',
    password: 'zama',
    server: 'localhost',
    database: 'Showcase',
};

/*
Create, Configure & Start Restify Server
 */
var server = restify.createServer({
	name: 'panaxui'
});
// server.use(restify.acceptParser(server.acceptable));
server.use(restify.fullResponse());
server.use(restify.bodyParser());
// server.use(restify.jsonp());
// server.use(restify.queryParser());
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

/**
 * /login [POST]
 */
server.post('/login', function login(req, res, next) {

	res.header("Content-Type: application/json");

	sql.connect(sql_config, function(err) {

        if (err) {
        	//ToDo: Session("AccessGranted") = FALSE
            res.end(JSON.stringify({
            	success: false,
            	message: "Error opening the database connection!",
            	error: err
            }));
            console.log("Error opening the database connection!");
            console.log("ERROR:");
	        console.error(err);
            return;
        }

	    var sqlRequest = new sql.Request();

	    //ToDo: oCn.Execute("SET LANGUAGE SPANISH")

	    sqlRequest.input('username', sql.VarChar, req.params.username);
	    sqlRequest.input('password', sql.VarChar, 
	        crypto.createHash('md5').update(req.params.password).digest('hex'));

	    sqlRequest.execute('Showcase.[$Security].Authenticate', function(err, recordsets, returnValue) {

	        if(err) {
        		//ToDo: Session("AccessGranted") = FALSE
	            res.end(JSON.stringify({
	            	success: false,
	            	message: "Error running query!",
            		error: err
	            }));
            	console.log("Error running query!");
	            console.log("ERROR:");
		        console.error(err);
	            			
            	return;
	        }

        	//ToDo: Session("AccessGranted") = TRUE
        	//
	        //ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
	        //sqlRequest.query("...", function(err, recordset) {....
	        //
	        //ToDo: SET SESSION("UserSiteMap")=oSiteMap //GET USER SITEMAP

	        res.end(JSON.stringify({
	        	success: true,
	        }));
	    });

	});

	return next();
});

/**
 * /logout [GET]
 */
server.get('/logout', function login(req, res, next) {

	res.header("Content-Type: application/json");

	//ToDo: Session("AccessGranted") = FALSE
    //
    //ToDo: SET SESSION("UserSiteMap")=nothing //CLEAR USER SITEMAP

    res.end(JSON.stringify({
    	success: true,
    }));

	return next();
});

/**
 * /login [POST]
 */
server.post('/menu', function login(req, res, next) {

	res.header("Content-Type: application/json");

	sql.connect(sql_config, function(err) {

        if (err) {
        	//ToDo: Session("AccessGranted") = FALSE
            res.end(JSON.stringify({
            	success: false,
            	message: "Error opening the database connection!",
            	error: err
            }));
            console.log("Error opening the database connection!");
            console.log("ERROR:");
	        console.error(err);
            return;
        }

	    var sqlRequest = new sql.Request();

	    //ToDo: oCn.Execute("SET LANGUAGE SPANISH")

	    sqlRequest.input('username', sql.VarChar, req.params.username);
	    sqlRequest.input('password', sql.VarChar, 
	        crypto.createHash('md5').update(req.params.password).digest('hex'));

	    sqlRequest.execute('Showcase.[$Security].Authenticate', function(err, recordsets, returnValue) {

	        if(err) {
        		//ToDo: Session("AccessGranted") = FALSE
	            res.end(JSON.stringify({
	            	success: false,
	            	message: "Error running query!",
            		error: err
	            }));
            	console.log("Error running query!");
	            console.log("ERROR:");
		        console.error(err);
	            			
            	return;
	        }

        	//ToDo: Session("AccessGranted") = TRUE
        	//
	        //ToDo: oCn.execute "IF EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES IST WHERE routine_schema IN ('$Application') AND ROUTINE_NAME IN ('OnStartUp')) BEGIN EXEC [$Application].OnStartUp END"
	        //sqlRequest.query("...", function(err, recordset) {....
	        //
	        //ToDo: SET SESSION("UserSiteMap")=oSiteMap //GET USER SITEMAP

	        res.end(JSON.stringify({
	        	success: true,
	        }));
	    });

	});

	return next();
});