var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var panax = require('./config/panax');

var index = require('./routes/index');
var api = require('./routes/api');
var api_session = require('./routes/api_session');
var api_build = require('./routes/api_build');
var api_read = require('./routes/api_read');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); // 'combined'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'zekret',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//GUIs static webserver
panax.ui.enabled_guis.forEach(function (gui, index, arr) {
    app.use('/gui/' + gui, express.static(panax.ui.guis[gui].root));
});

// routes
app.use('/', index);
app.use('/api', api);
app.use('/api/session', api_session);
app.use('/api/build', api_build);
app.use('/api/read', api_read);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            success: false,
            message: err.message,
            error: err
        });
        console.error(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message,
        error: {}
    });
});


module.exports = app;
