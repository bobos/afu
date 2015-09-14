function callback(data, _userData, res) {
  res.render('myActivities', 
             { title: 'my page', 
               OpenId: data.openId, 
             })
}

exports.callback = callback;
