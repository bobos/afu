var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Users = require('../models/user.js');
var Actvs = require('../models/activity.js');

function get_model(req) {
  if ( req.params.type == 'users' ) 
    return Users;
  if ( req.params.type == 'actvs' ) 
    return Actvs;
}

/* GET /resource/users or
   GET /resource/actvs */
router.get('/:type', function(req, res, next) {
  get_model(req).find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* POST /users or
   POST /actvs */
router.post('/:type', function(req, res, next) {
  get_model(req).create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /users/id or
   GET /actvs/id */
router.get('/:type/:id', function(req, res, next) {
  get_model(req).findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /users/id or
   PUT /actvs/id */
router.put('/:type/:id', function(req, res, next) {
  get_model(req).findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return console.log(err);
    res.json(post);
  });
});

/* DELETE /users/id or
   DELETE /actvs/id */
router.delete('/:type/:id', function(req, res, next) {
  get_model(req).findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
