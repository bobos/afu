var request = require('request');

function create_user(jsonData, res, callback) {
  var options = {
    uri: 'http://localhost/resource/users',
    method: 'POST',
    json: jsonData
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200)
      callback(res);
  });
}

function get_user(openid, res, callback) {
  var options = {url: 'http://localhost/resource/users/'+openid};
  request.get(options,
              function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  callback(body, res);
                }
              });
}  

function update_user_async(openid, jsonData) {
  var options = {uri: 'http://localhost/resource/users/'+openid,
                 method: 'PUT',
                 json: jsonData};
  
  request(options, 
          function (error, response, body) {
            if (!error && response.statusCode == 200)
              console.log("user updated");
          });
}

function create_actv(jsonData, res, callback) {
  var options = {url: 'http://localhost/resource/actvs/',
                 method: 'POST',
                 json: jsonData};
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200)
        callback(res);
  });
}

exports.get_user = get_user;
exports.create_user = create_user;
exports.update_user_async = update_user_async;
exports.create_actv = create_actv;
