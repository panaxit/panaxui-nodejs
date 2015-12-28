var express = require('express')
var path = require('path')
var favicon = require('serve-favicon') // eslint-disable-line no-unused-vars
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var panaxConfig = require('./config/panax')

var index = require('./routes/index')
var api = require('./routes/api')
var apiSession = require('./routes/api_session')
var apiBuild = require('./routes/api_build')
var apiRead = require('./routes/api_read')
var apiOptions = require('./routes/api_options')
var apiCreate = require('./routes/api_create')
var apiUpdate = require('./routes/api_update')
var apiDelete = require('./routes/api_delete')
var apiFilters = require('./routes/api_filters')
var apiUpload = require('./routes/api_upload')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')) // 'combined'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false,
}))
app.use(cookieParser())
app.use(session({
  secret: 'zekret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1800000, // Session timeout 30m * 60s * 1000ms
      //secure: true // Requires https
  },
}))

// Public Path
app.use(express.static(path.join(__dirname, 'public')))

//GUIs static webserver
panaxConfig.enabled_guis.forEach(function(gui) {
  var guiConf = panaxConfig.guis[gui]
  //application's root location
  app.use('/gui/' + gui, express.static(guiConf.root))
  //other static asset's locations
  if (guiConf.other) {
    guiConf.other.forEach(function(other) {
      app.use('/gui/' + gui + other.url, express.static(other.path))
    })
  }
})

// routes
app.use('/', index)
app.use('/api', api)
app.use('/api/session', apiSession)
app.use('/api/build', apiBuild)
app.use('/api/read', apiRead)
app.use('/api/options', apiOptions)
app.use('/api/create', apiCreate)
app.use('/api/update', apiUpdate)
app.use('/api/delete', apiDelete)
app.use('/api/filters', apiFilters)
app.use('/api/upload', apiUpload)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'testing') {
  app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
    res.status(err.status || 500)
    res.json({
      success: false,
      message: err.message,
      error: err,
    })
    if (app.get('env') === 'development') {
      console.error(err) // eslint-disable-line no-console
    }
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) { // eslint-disable-line no-unused-vars
  res.status(err.status || 500)
  res.json({
    success: false,
    message: err.message,
    error: {
      data: {
        instances: err.data || err.data.instances,
      },
    },
  })
})

/**
 * Show banner & config
 */
require('./lib/banner').show()

module.exports = app
