var db = require('../models/db');
var utils = require('./utils');
var cons = require('./cons');
var tempHandler = require('./wechatTemplateHandler');
var temp = require('./secrets');

function callback(data, userData, res) {
  db.get_actv(data.actId, res,
              function (actvInfo, resp) {
                if ( actvInfo.attendeeIds.indexOf(data.openId) == -1 ) 
                  db.get_user(data.ownerId, resp,
                              function (userInfo, resp) {
                                var ret = utils.pushArray(userInfo.friends, 
                                                          data.openId);
                                var updateUsr = {};
                                if ( ret.ret ) 
                                  db.update_user_async(data.ownerId, 
                                                       {friends: ret.array});

                                if ( userData == null ) {
                                  var accepts = [];
                                  var favors = [];
                                  var friends = [];
                                } else {
                                  var accepts = userData.acceptedActvs;
                                  var favors = userData.favoredActvs;
                                  var friends = userData.friends;
                                }

                                var ret = utils.pushArray(friends, 
                                                          data.ownerId);
                                if ( ret.ret ) updateUsr.friends = ret.array; 
                                if ( data.route == cons.ACCEPT ) {
                                  var ret1 = utils.pushArray(accepts, 
                                                             data.actId);
                                  if ( ret1.ret ) 
                                    updateUsr.acceptedActvs = ret1.array;
                                }
                                if ( data.route == cons.FAVOR ) {
                                  var ret = utils.pushArray(favors, data.actId);
                                  if ( ret.ret ) 
                                    updateUsr.favoredActvs = ret.array;
                                }

                                if ( Object.keys(updateUsr).length > 0 ) 
                                  db.update_user_async(data.openId, updateUsr);

                                if ( data.route == cons.ACCEPT && ret1.ret ) {
                                  db.get_actv(data.actId, resp, 
                                    function(actv, response) {
                                      var ret=utils.pushArray(actv.attendeeIds,
                                                              data.openId);
                                      if ( ret.ret ) {
                                        send_accept_notify(data.ownerId, 
                                                           data.actId, 
                                                           data.nickName);
                                        var attendee = {name: data.nickName, 
                                                        avatar: data.avatar};
                                        var ret1=utils.pushArray(actv.attendees,
                                                                 attendee);
                                        db.update_actv_async(data.actId, 
                                                             {attendeeIds: 
                                                              ret.array,
                                                              attendees: 
                                                              ret1.array});
                                      }
                                      response.render('accepted', 
                                                      { title: 
                                                        'you have accepted' });
                                    });
                                }
                                else
                                  resp.render('accepted', 
                                              { title: 'you have favored' });
                             });
                else
                  resp.render('accepted', 
                              { title: 'you have already accepted' });
            });
}

function send_accept_notify(ownerId, actId, name) {
  var msg = {touser:ownerId,
             template_id:temp.invitation,
             url:"http://www.ziyueonline.com/actvs/"+ownerId+"/"+actId,
             topcolor:"#FF0000",
             data:{
                     first: {
                               value:name+"接受了你的活动邀请",
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

exports.callback = callback;
