var db = require('../models/db');
var id = 0;

function get_next_id() {
  return id++;
}

function callback(openid, nickname, avatar, res) {
  db.get_user(openid, res,
              function (userInfo, resp) {
                // update user info hour-basis
                var updateTime = Math.floor(Date.now()/1000/60/60);
                var actid = get_next_id();
                var respFun = 
                  function (response) {
                    response.render('create', 
                                    { title: nickname+' wants to have some fun', 
                                      OpenId: openid, 
                                      ActId: actid });
                   }
                if ( userInfo == 'null' ) {
                  data = {
                    _id: openid,
                    nickname: nickname,
                    avatar: avatar,
                    update_at: updateTime};
                  db.create_user(data, resp, respFun);}
                 else {
                   var userData = {nickname: nickname, avatar: avatar, update_at: updateTime};
                   db.update_user_async(openid, userData);
                   respFun(res);
                 }
             });
}

exports.callback = callback;
