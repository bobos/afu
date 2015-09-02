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
    else
      callback();
  });
}

function get_user(openid, res, callback) {
  var options = {url: 'http://localhost/resource/users/'+openid};
  request.get(options,
              function (error, response, body) {
                if (!error && response.statusCode == 200) 
                  callback(JSON.parse(body), res);
                else
                  callback();
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

function update_actv_async(actId, jsonData) {
  var options = {uri: 'http://localhost/resource/actvs/'+actId,
                 method: 'PUT',
                 json: jsonData};
  
  request(options, 
          function (error, response, body) {
            if (!error && response.statusCode == 200)
              console.log("actv updated");
          });
}

function create_actv(jsonData, res, callback) {
  var options = {url: 'http://localhost/resource/actvs/',
                 method: 'POST',
                 json: jsonData};
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200)
        callback(res);
      else
        callback();
  });
}

function get_actv(actid, res, callback) {
  var options = {url: 'http://localhost/resource/actvs/'+actid};
  request.get(options,
              function (error, response, body) {
                if (!error && response.statusCode == 200)
                  callback(JSON.parse(body), res);
                else
                  callback();
              });
}

exports.get_user = get_user;
exports.create_user = create_user;
exports.update_user_async = update_user_async;
exports.update_actv_async = update_actv_async;
exports.create_actv = create_actv;
exports.get_actv = get_actv;
