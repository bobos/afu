var secrets = require("./secrets");
var appid = secrets.appid;
var secret = secrets.secret;
var request = require('request');

function send_template_msg(jsonData) {
  var options = {url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret};
  request.get(options,
              function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  var info = JSON.parse(body);
                  var access_token = info.access_token;
                  var options = {
                    uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+access_token,
                    method: 'POST',
                    json: jsonData};
                  request(options, function (error, response, body) {
                  });
                }});
}

exports.send_template_msg = send_template_msg;
