var express = require('express');
    urlencode = require('urlencode');
    request = require('request');
    router = express.Router();
    secrets = require('../controller/secrets');
    authen_cb = require('../controller/authen_callback');
    cons = require('../controller/cons');

function redirect_to_wechat(res, redirectUrl) {
  var encodedUrl = urlencode(redirectUrl);
  res.render('redirect', { title: 'Ziyue', AppId: secrets.appid, EncodedUrl: encodedUrl });
}

function fetch_usr_info(code, res, route, actvOwnerId, actid){
    var openid;
    request.post('https://api.weixin.qq.com/sns/oauth2/access_token', 
                 {form: {'appid': secrets.appid,
                         'secret': secrets.secret,
                         'code': code,
                         'grant_type': 'authorization_code'}},
                 function (error, response, body) {
                   if (!error && response.statusCode == 200) {
                       var info = JSON.parse(body);
                       openid = info.openid;
                       console.log(info.access_token + " access token");
                       console.log(info.openid + " openid");
                       console.log(info.scope + " scope");
                       var options = 
                         {url: 'https://api.weixin.qq.com/sns/userinfo?access_token='
                               +info.access_token+'&openid='+openid+'&lang=zh_CN'};
                       request.get(options,
                               function (error, response, body) {
                                 var info = JSON.parse(body);
                                 console.log(info.province + " province");
                                 console.log(info.city + " city");
                                 var lokation = info.province + info.city;
                                 if (!error && response.statusCode == 200) {
                                   var data = {openId: openid,
                                               nickName: info.nickname,
                                               avatar: info.headimgurl,
                                               city: lokation,
                                               ownerId: actvOwnerId,
                                               actId: actid,
                                               route: route};
                                   authen_cb.callback(data, res);
                                 }
                              });
                   }
                 });
}

/*
 * GET /authen/guide2create
 */
router.get('/guide2create', function(req, res) {
  var redirectUrl = "http://www.ziyueonline.com/authen/fetchInfo2create";
  redirect_to_wechat(res, redirectUrl);
});

/*
 * GET /authen/accept/ownerid/actid
 */
router.get('/accept/:ownerid/:actid', function(req, res){
  var ownerid = req.params.ownerid;
  var actid = req.params.actid;
  var redirectUrl = "http://www.ziyueonline.com/authen/fetchInfo2accept/"+ownerid+"/"+actid;
  redirect_to_wechat(res, redirectUrl);
});

/*
 * GET /authen/fetchInfo2create
 */
router.get('/fetchInfo2create', function(req, res) {
  var code = req.param('code')
  console.log(code + ' first code');
  fetch_usr_info(code, res, cons.CREATE);
});

/*
 * GET /authen/fetchInfo2accept/ownerid/actid
 */
router.get('/fetchInfo2accept/:ownerid/:actid', function(req, res) {
  var code = req.param('code')
  var ownerid = req.params.ownerid;
  var actid = req.params.actid;
  console.log(code + ' second code');
  fetch_usr_info(code, res, cons.ACCEPT, ownerid, actid);
});

module.exports = router;
