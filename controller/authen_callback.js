var db = require('../models/db');
var cons = require('./cons');

function callback(data, res) {
  db.get_user(data.openId, res,
              function (userInfo, resp) {
                // update user info hour-basis
                var updateTime = Math.floor(Date.now()/1000/60/60);
                var respFun = function (response) 
                   { get_cb(data.route).callback(data, userInfo, response) };

                if ( userInfo == null ) {
                  var usrData = {
                    _id: data.openId,
                    nickname: data.nickName,
                    avatar: data.avatar,
                    update_at: updateTime};
                  db.create_user(usrData, resp, respFun)
                }
                else {
                  var usrData = {nickname: data.nickName, avatar: data.avatar, update_at: updateTime};
                  db.update_user_async(data.openId, usrData);
                  respFun(res);
                }
             });
}

function get_cb(route) {
  switch (route)
  {
    case cons.ACCEPT:
      var module = require('./acceptActivity');
      break;
    case cons.FAVOR:
      var module = require('./acceptActivity');
      break;
    case cons.CREATE:
      var module = require('./createActivity');
      break;
  }
  return module
}

exports.callback = callback;
