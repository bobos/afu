var request = require('request');
    temp = require('../controller/secrets');
    tempHandler = require('../controller/wechatTemplateHandler');
    db = require('../models/db');

function submit(openid, actid, actvInfo, res) {
  var id = parseInt(actid);
  db.get_user(openid, res
              function (userInfo, response) {
                var name = userInfo.nickname;
                db.update_user_async(openid, {actvs: info.hostedActvs.push(id)});
                var actv = {_id = id,
                            title: actvInfo.title,
                            when: actvInfo.when,
                            where: actvInfo.where,
                            attLimits: actvInfo.limits,
                            description: actvInfo.descr,
                            isActive: true}
                db.create_actv(actv, response, 
                               function(resp) {
                                  console.log("Dont reply")
                               });
              });
}

//                                 var msg = {touser:openid,
//                                            template_id:temp.invitation,
//                                            url:"http://www.ziyueonline.com/authen/attend?openid="+openid+"&actid="+actid,
//                                            topcolor:"#FF0000",
//                                            data:{
//                                                    first: {
//                                                              value:name+"邀请你参加活动",
//                                                              color:"#173177"
//                                                             },
//                                                    remark:{
//                                                              value:"点击查看",
//                                                              color:"#173177"
//                                                             }
//                                                   }
//                                           };
//                                 tempHandler.send_template_msg(openid, msg, resp, 
//                                                               function (resp1) 
//                                                               {resp1.render('submitDone', { title: 'Ziyue' });}); 
