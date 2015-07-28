var fs = require("fs"),
    app = require('express')();
    http = require('http').Server(app);

app.get('/', function(req, res){
      fs.readFile('/home/ubuntu/nodejs/afu.html', function(err, html) {
        if (err) {
            throw err;
        }
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
    });
});

function init_party(openid, nickname, avatar, res) {
    var ret = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><div><h1><font color=red>'+nickname+'</font></h1></div><div><img src="'+avatar+'"></div></body></html>'
    res.write(ret);
    res.end();
}

function fetch_usr_info(code, res, callback){
    var request = require('request');
    var openid;
    request.post('https://api.weixin.qq.com/sns/oauth2/access_token', 
                 {form: {'appid': 'wx920fe476bb090ff9',
                         'secret': '360a89b6fdbe9571841963e7920e5a09',
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
                                 callback(openid, info.nickname, info.headimgurl, res)}
                              });
                    }
                 }
    );
}

app.get('/initparty', function(req, res){
    code = req.param('code')
    console.log(code + ' first code');
    fetch_usr_info(code, res, init_party);
});

http.listen(80, function(){
  console.log('listening on *:80');
})
