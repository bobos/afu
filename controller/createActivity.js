var db = require('../models/db');
var id = 0;

function get_next_id() {
  return id++;
}

function callback(data, _userData, res) {
  res.render('create', 
             { title: data.nickName+' invites u', 
               OpenId: data.openId, 
               Name: data.nickName,
               Avatar: data.avatar,
               ActId: get_next_id(),
               City: data.city })
}

exports.callback = callback;
