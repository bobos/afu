var express = require('express');
    router = express.Router();
    render = require('../controller/renderActivity');
    db = require('../models/db');
    utils = require('../controller/utils');

/*
  GET /actvs/openid/actid
*/
router.get('/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  render.render_page(openid, actid, res);
});

/*
  GET /actvs/update/openid/actid
*/
router.get('/update/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  db.get_user(openid, res,
              function (userInfo, resp) {
                var ret = utils.pushArray(userInfo.hostedActvs, actid);
                db.update_user_async(openid, {hostedActvs: ret.array});
              });
});


module.exports = router;
