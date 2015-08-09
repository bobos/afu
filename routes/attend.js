var express = require('express');
    router = express.Router();

/*
  GET /attend/openid/actid
*/
router.get('/:openid/:actid', function(req, res){
    var openid = req.params.openid;
    var actid = req.params.actid;
//TODO 
console.log("yes here " + openid + " " + actid);
});

module.exports = router;
