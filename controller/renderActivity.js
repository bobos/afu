var db = require('../models/db');

function render_page(openid, actid, res) {
  db.get_actv(actid, res,
              function (actvInfo, resp) {
                var info = JSON.parse(actvInfo);
                // TODO
                resp.render('attend', 
                            { title: info.title, 
                              OpenId: openid, 
                              ActId: actid });
              })
}

exports.render_page = render_page;
