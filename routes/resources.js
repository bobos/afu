var express = require('express');
    router = express.Router();

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
router.get('/:type', function(req, res) {
  get_model(req).find(function (err, users) {
    if (err) res.status(404).send(err);
    res.json(users);
  });
});

/* POST /resource/users or
   POST /resource/actvs */
router.post('/:type', function(req, res) {
console.log(req.body);
  get_model(req).create(req.body, function (err, post) {
    if (err) {console.log(err); res.status(404).send(err);}
    res.json(post);
  });
});

/* GET /resource/users/id or
   GET /resource/actvs/id */
router.get('/:type/:id', function(req, res) {
  get_model(req).findById(req.params.id, function (err, post) {
    if (err) res.status(404).send(err);
    res.json(post);
  });
});

/* PUT /resource/users/id or
   PUT /resource/actvs/id */
router.put('/:type/:id', function(req, res) {
  get_model(req).findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) res.status(404).send(err);
    res.json(post);
  });
});

/* DELETE /resource/users/id or
   DELETE /resource/actvs/id */
router.delete('/:type/:id', function(req, res) {
  get_model(req).findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) res.status(404).send(err);
    res.json(post);
  });
});

module.exports = router;
