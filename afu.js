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

app.get('/getuserinfo', function(req, res){
    code = req.param('code')
    console.log(code + ' first code');
    var request = require('request');

    request.post('https://api.weixin.qq.com/sns/oauth2/access_token', 
        {form: { 'appid': 'wx920fe476bb090ff9',
                 'secret': '360a89b6fdbe9571841963e7920e5a09',
                 'code': code,
                 'grant_type': 'authorization_code'}},
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                var req1 = require('request');
    console.log(info.access_token + " access token");
    console.log(info.openid + " openid");
    console.log(info.scope + " scope");
var options = {
    url: 'https://api.weixin.qq.com/sns/userinfo?access_token='+info.access_token+'&openid='+info.openid+'&lang=zh_CN'
    }
                req1.get(options,
                         function (error1, response1, body1) {
                             if (!error1 && response1.statusCode == 200) {
                                 var info1 = JSON.parse(body1);
    console.log(info1.nickname + " nickname");
    console.log(info1.headimgurl + " img");
                                 var ret = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><div><h1>'+info1.nickname+'</h1></div><div><img src="'+info1.headimgurl+'"></div></body></html>'
                                 res.write(ret);
                                 res.end();
                             }
                          });
                }
         });
    });

http.listen(80, function(){
  console.log('listening on *:80');
})
