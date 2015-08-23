var db = require('../models/db');

function callback(openid, nickname, avatar, city, ownerId, actId, res) {
  db.get_user(openid, res,
              function (userInfo, resp) {
                // update user info hour-basis
                var updateTime = Math.floor(Date.now()/1000/60/60);
                // TODO: update friends list
                var respFun = 
                  function (response) {
                    // TODO: update actv db
                    response.render('accepted', 
                                    { title: 'you have accepted' });
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
