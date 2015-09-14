var express = require('express');
    router = express.Router();
    render = require('../controller/renderActivity');
    db = require('../models/db');
    utils = require('../controller/utils');
    tempHandler = require('../controller/wechatTemplateHandler');
    temp = require('../controller/secrets');

var id = 0;

function get_next_id() {
  return id++;
}

/*
  GET /actvs/openid/actid
*/
router.get('/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  render.render_page(openid, actid, res);
});

/*
  GET /actvs/attend/openid/actid
*/
router.get('/attend/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  render.render_attend_page(openid, actid, res);
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
  GET /actvs/create/openid
*/
router.get('/create/:openid/', function(req, res){
  var openid = req.params.openid;
  db.get_user(openid, res,
              function (data, resp) {
                res.render('create', 
                           { title: data.nickname+' invites u', 
                             OpenId: openId, 
                             Name: data.nickname,
                             Avatar: data.avatar,
                             ActId: get_next_id(),
                             City: data.city })
              });
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

/*
  GET /actvs/view/openid
*/
router.get('/view/:openid/', function(req, res){
  var openid = req.params.openid;
  resp.render('myActivities', 
              { title: "我的活动", 
                OpenId: openid 
              });
});

/*
  GET /actvs/accepted/openid
*/
router.get('/accepted/:openid/', function(req, res){
  var openid = req.params.openid;
  db.get_user(openid, res,
              function (userInfo, resp) {
                resp.render('activity', 
                { title: "我收藏的活动", 
                  OpenId: openid,
		  Actvs: userInfo.acceptedActvs.join()
                })
              });
});

/*
  GET /actvs/hosted/openid
*/
router.get('/hosted/:openid/', function(req, res){
  var openid = req.params.openid;
  db.get_user(openid, res,
              function (userInfo, resp) {
                resp.render('activity', 
                { title: "我发起的活动", 
                  OpenId: openid,
		  Actvs: userInfo.hostedActvs.join()
                })
              });
});

/*
  GET /actvs/favored/openid
*/
router.get('/favored/:openid/', function(req, res){
  var openid = req.params.openid;
  db.get_user(openid, res,
              function (userInfo, resp) {
                resp.render('activity', 
                { title: "我接受的活动", 
                  OpenId: openid,
		  Actvs: userInfo.favoredActvs.join()
                })
              });
});

/*
  GET /actvs/start/openid/actid
*/
router.get('/start/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  db.update_actv(actid, {open: false}, res,
                 function (_actvInfo, resp) {
                   resp.write('ok');
                   resp.end()
	         })
});

/*
  GET /actvs/cancel/openid/actid
*/
router.get('/cancel/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  db.update_actv(actid, {open: false, isActive: false}, res,
                 function (actvInfo, resp) {
	           db.get_user(openid, res, 
			       function (usrInfo, res) {
                                 for (var i = 0; 
				      i < actvInfo.attendeeIds.length; 
				      i++) 
				   send_notify(actvInfo.attendeeIds[i],
					       usrInfo.nickname+'取消了活动',
			                       "http://www.ziyueonline.com/actvs/"+actvInfo.attendeeIds[i]+"/"+actId);
			       });
                   resp.write('ok');
                   resp.end()
	         })
});

/*
  GET /actvs/conclude/openid/actid
*/
router.get('/conclude/:openid/:actid', function(req, res){
  var openid = req.params.openid;
  var actid = req.params.actid;
  db.update_actv(actid, {open: false, isActive: false}, res,
                 function (actvInfo, resp) {
	           db.get_user(openid, res, 
			       function (usrInfo, res) {
                                 for (var i = 0; 
				      i < actvInfo.attendeeIds.length; 
				      i++) 
				   send_notify(actvInfo.attendeeIds[i],
					       usrInfo.nickname+'找你收钱了',
			                       "http://www.ziyueonline.com/qrCode/"+actId);
			       });
                   resp.write('ok');
                   resp.end()
	         })
});

function send_notify(toId, title, link) {
  var msg = {touser:toId,
             template_id:temp.invitation,
             url:link,
             topcolor:"#FF0000",
             data:{
                     first: {
                               value:title,
                               color:"#173177"
                              },
                     remark:{
                               value:"点击查看",
                               color:"#173177"
                              }
                  }
            };
  tempHandler.send_template_msg(msg);
}

module.exports = router;
