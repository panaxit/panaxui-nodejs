var sql = require('mssql'),
    crypto = require('crypto');

var config = {
    user: 'sa',
    password: 'zama',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'Showcase',

    // options: {
    //     encrypt: true // Use this if you're on Windows Azure
    // }
};

sql.connect(config, function(err) {
    // ... error checks

    // // Query

    // var request = new sql.Request();
    // request.query('SELECT * FROM Showcase.dbo.Empleado', function(err, recordset) {
    //     // ... error checks

    //     console.dir(recordset);
    // });

    // Stored Procedure

    var request = new sql.Request();
    request.input('username', sql.VarChar, 'webmaster');
    request.input('password', sql.VarChar, 
        crypto.createHash('md5').update('tests').digest('hex'));
    //request.output('output_parameter', sql.VarChar(50));
    request.execute('Showcase.[$Security].Authenticate', function(err, recordsets, returnValue) {
        // ... error checks
        if(err) {
            console.dir(err);
        }
        console.dir(recordsets);
    });

});

