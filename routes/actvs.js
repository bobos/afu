var express = require('express');
    router = express.Router();
    render = require('../controller/renderActivity');

/*
  GET /actvs/openid/actid
*/
router.get('/attend/:openid/:actid', function(req, res){
    var openid = req.params.openid;
    var actid = req.params.actid;
    render.render_page(openid, actid, res);
});

module.exports = router;
