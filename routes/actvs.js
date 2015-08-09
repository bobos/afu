var express = require('express');
    router = express.Router();

/*
  POST /actvs/
*/
router.post('/', function(req, res){
    var submit = require('../controller/submitActivity');
    var openid = req.param('openid');
    var actid = req.param('actid');
    //var openid = req.query.openid;
    //var actid = req.query.actid;
    submit.submit(openid, actid, req.body, res);
});

module.exports = router;
