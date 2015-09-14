function callback(data, _userData, res) {
  res.render('home', 
             { title: 'home page', 
               OpenId: data.openId, 
             })
}

exports.callback = callback;
