var express = require('express')
var router = express.Router() // eslint-disable-line new-cap
var fs = require('fs')
var path = require('path')
var mkpath = require('mkpath')
var multer = require('multer')

var auth = require('../lib/auth.js')
var upload = multer({
  dest: 'public/uploads/',
})
var panaxConfig = require('../config/panax.js')

module.exports = router

/**
 * POST /api/upload
 *
 * Upload Single File
 */
router.post('/', auth.requiredAuth, upload.single('file'), function(req, res, next) {
  var panaxInstance, tmpPath, targetPath

  if (!req.file) {
    return next({
      message: 'No file supplied',
    })
  }
  if (!req.query.catalogName) {
    return next({
      message: 'No catalogName supplied',
    })
  }
  if (!req.query.fieldName) {
    return next({
      message: 'No fieldName supplied',
    })
  }

  panaxInstance = panaxConfig.instances[panaxConfig.default_instance]

  // Rename to new path
  tmpPath = path.join(__dirname, '..', req.file.path)
  //ToDo: When to use 'req.session.userId' in path?
  targetPath = path.join(__dirname, '..', 'public', 'uploads',
                    panaxInstance.db.database,
                    req.query.catalogName,
                    req.query.fieldName)
  mkpath(targetPath, function(err) {
    if (err) {
      return next(err)
    }

    fs.rename(tmpPath, path.join(targetPath, req.file.originalname), function(err) {
      if (err) {
        return next(err)
      }

      res.json({
        success: true,
        action: 'upload',
        data: {
          file: req.file,
        },
      })
    })
  })
})
