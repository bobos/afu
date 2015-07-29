var fs = require("fs"),
    app = require('express')();
    http = require('http').Server(app);
    urlencode = require('urlencode');

var db = {};
var id = 0;
var appid = 'wx920fe476bb090ff9';
var secret = '360a89b6fdbe9571841963e7920e5a09';
var invitation_template = 'omKLRv7kxNAsoPXuuXUwgmsymLzgcY1ME7w9ORKfSu4';

app.get('/', function(req, res){
    var redirectUrl = "http://www.ziyueonline.com/initiate";
    redirect_to_wechat(res, redirectUrl);
});

function update_db_if_not_there(openid, name, avatar){
    if ( db[openid] == undefined ) 
        db[openid] = {"name": name,
                      "avatar": avatar,
                      "activities": [],
                      "friends": []}
}

function get_next_id() {
    return id++;
}

function init_activity(openid, nickname, avatar, res) {
    update_db_if_not_there(openid, nickname, avatar);
    var actid = get_next_id();
    var form='<form action="submit?openid='+openid+'&actid='+actid+'" method="post"> 活动内容blahblahblah <input type="text" name="activity"><br> <input type="submit" value="check"></form>';
    var ret = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><div><h1>此处应有华丽页面</h1></div><div>'+form+'</div></body></html>'
    res.write(ret);
    res.end();
}

function fetch_usr_info(code, res, opid, actid, callback){
    var request = require('request');
    var openid;
    request.post('https://api.weixin.qq.com/sns/oauth2/access_token', 
                 {form: {'appid': appid,
                         'secret': secret,
                         'code': code,
                         'grant_type': 'authorization_code'}},
                 function (error, response, body) {
                   if (!error && response.statusCode == 200) {
                       var info = JSON.parse(body);
                       var req = require('request');
                       openid = info.openid;
                       console.log(info.access_token + " access token");
                       console.log(info.openid + " openid");
                       console.log(info.scope + " scope");
                       var options = 
                         {url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+info.access_token+'&openid='+openid+'&lang=zh_CN'};
                       req.get(options,
                               function (error, response, body) {
                                 if (!error && response.statusCode == 200) {
                                 var info = JSON.parse(body);
                                 if (opid == undefined) 
                                   callback(openid, info.nickname, info.headimgurl, res);
                                 else
                                   callback(openid, info.nickname, info.headimgurl, opid, actid, res);
                                 }
                              });
                    }
                 }
    );
}

app.get('/initiate', function(req, res){
    var code = req.param('code')
    console.log(code + ' first code');
    fetch_usr_info(code, res, undefined, undefined, init_activity);
});

app.post('/submit', function(req, res){
    var openid = req.query.openid;
    var actid = req.query.actid;
    var name = db[openid]["name"];
    db[openid]["activities"].push(actid);
    // send template msg, wrap this shit
    var req = require('request');
    var options = {url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret};
    req.get(options,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
                    var access_token = info.access_token;
                    var req = require('request');
                    var options = {
                      uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+access_token,
                      method: 'POST',
                      json: {
                             "touser":openid,
                             "template_id":invitation_template,
                             "url":"http://www.ziyueonline.com/attend?openid="+openid+"&actid="+actid,
                             "topcolor":"#FF0000",
                             "data":{
                                       "first": {
                                           "value":name+"邀请你参加活动",
                                           "color":"#173177"
                                       },
                                       "remark":{
                                           "value":"点击查看",
                                           "color":"#173177"
                                       }
                             }}};
                    req(options, function (error, response, body) {
                      if (!error && response.statusCode == 200) {
    var ret = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><h1>活动创建成功，邀请已发送到您的微信帐号，请将其转发给想要邀请的好友吧</h1></body></html>'
                        res.write(ret);
                        res.end();
                      }});
       }});
});

app.get('/attend', function(req, res){
    var openid = req.query.openid;
    var actid = req.query.actid;
    var redirectUrl = "http://www.ziyueonline.com/visit?openid="+openid+"&actid="+actid;
    redirect_to_wechat(res, redirectUrl);
});

function redirect_to_wechat(res, redirectUrl) {
    var encodedUrl = urlencode(redirectUrl);
    var ret = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><script>window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+encodedUrl+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect");</script></body></html>'
    res.write(ret);
    res.end();
}

app.get('/visit', function(req, res){
    var openid = req.query.openid;
    var actid = req.query.actid;
    var code = req.param('code')
    console.log(code + ' visitor code');
    console.log(actid + ' act id');
    fetch_usr_info(code, res, openid, actid, visitor_checkin);
});

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 

function visitor_checkin(visitorid, name, avatar, opid, actid, res) {
    db[opid]["friends"].pushIfNotExist(visitorid, function(e) { 
        return visitorid === e;});
    update_db_if_not_there(visitorid, name, avatar);
    var ret = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><h1>accept or decline page</h1></body></html>'
    res.write(ret);
    res.end();
}

http.listen(80, function(){
  console.log('listening on *:80');
})
