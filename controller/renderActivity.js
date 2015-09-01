var db = require('../models/db');

function render_page(openid, actid, res) {
  db.get_actv(actid, res,
              function (actvInfo, resp) {
console.log('actv: '+actvInfo.attendeeIds);
                resp.render('attendActivity', 
                            { title: actvInfo.title, 
                              OpenId: openid, 
                              ActId: actid,
                              attendees: attendee_list(actvInfo.attendees) });
              })
}

function attendee_list(attendees) {
  var html = '';
  for (var i = 0; i < attendees.length; i++) {
    html += '<div class="avatar"><img src="'
            +attendees[i].avatar+'"></div>'+attendees[i].name
  }
  return html;
}

exports.render_page = render_page;
