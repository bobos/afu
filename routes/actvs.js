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
  POST /actvs
*/
router.post('/', function(req, res){
  db.create_actv(req.body, res, 
                 function (resp){
                   if ( resp == undefined ) 
                     res.status(404).send('update db failed');
                   else {
                     res.write('ok');
                     res.end()
                   }
                 }) 
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
                if ( ret.ret ) 
                  db.update_user_async(openid, {hostedActvs: ret.array});
              });
});


module.exports = router;
