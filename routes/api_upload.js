var express = require('express');
var router = express.Router();
var fs  = require('fs');
var path = require('path');
var mkpath = require('mkpath');
var multer  = require('multer');

var auth = require('../lib/auth.js');
var upload = multer({ dest: 'public/uploads/' });
var panax_config = require('../config/panax.js');

module.exports = router;

/**
 * POST /api/upload
 *
 * Upload Single File
 */
router.post('/', auth.requiredAuth, upload.single('file'), function(req, res, next) {
  if (!req.file)
    return next({message: "No file supplied"});
  if (!req.query.catalogName)
    return next({message: "No catalogName supplied"});
  if (!req.query.fieldName)
    return next({message: "No fieldName supplied"});

  var panax_instance = panax_config.instances[panax_config.default_instance];

  // Rename to new path
  var tmp_path = path.join(__dirname, '..', req.file.path);
  //ToDo: When to use 'req.session.userId' in path?
  var target_path = path.join(__dirname, '..', 'public', 'uploads',
                              panax_instance.db.database, 
                              req.query.catalogName,
                              req.query.fieldName);
  mkpath(target_path, function(err) {
    if (err)
      return next(err);

    fs.rename(tmp_path, path.join(target_path, req.file.originalname), function(err) {
      if (err)
        return next(err);

      res.json({
        success: true,
        action: 'upload',
        data: {
          file: req.file
        }
      });
    });
  });
});