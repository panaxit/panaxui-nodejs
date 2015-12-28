/**
 * Authtentication middleware
 * Passport-like logic
 *
 * http://passportjs.org/
 * http://danialk.github.io/blog/2013/02/20/simple-authentication-in-nodejs/
 */
var PanaxJS = require('panaxjs')
var panaxConfig = require('../config/panax.js')

/**
 * Authanticate in PanaxDB
 * @param  {String}   username Username
 * @param  {String}   password Password (hash)
 * @param  {Object}   instance Panax instance
 * @param  {Function} callback Callback fn
 * @return {Function}          callback
 */
exports.authenticate = function(username, password, instance, callback) {
  var panaxdb

  if (!username || !password) {
    return callback({
      message: 'Error: Missing credentials',
    })
  }

  instance = instance || panaxConfig.default_instance

  /**
   * PanaxJS
   */
  panaxdb = new PanaxJS.Connection(panaxConfig.instances[instance])

  panaxdb.authenticate(username, password, function(err, userId) {
    if (err) {
      return callback(err)
    }

    return callback(null, userId)
  })
}

/**
 * Required Authenticattion Middleware
 * @param  {Object}   req  Request
 * @param  {Object}   res  Results
 * @param  {Function} next Next fn in middleware
 * @return {Function}      next
 */
exports.requiredAuth = function(req, res, next) {
  var instances = [panaxConfig.default_instance]
  var name

  if (!req.session.userId) {
    for (name in panaxConfig.instances) {
      if (name !== panaxConfig.default_instance) {
        instances.push(name)
      }
    }
    return next({
      status: 401,
      message: 'Session Timeout',
      data: {
        instances: instances,
      },
    })
  }

  next()
}
