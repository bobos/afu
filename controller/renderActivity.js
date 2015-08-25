var db = require('../models/db');

function render_page(openid, actid, res) {
  db.get_actv(actid, res,
              function (actvInfo, resp) {
                if ( actvInfo.attendeeIds.indexOf(openid) == -1 ) 
                  resp.render('attendActivity', 
                              { title: actvInfo.title, 
                                OpenId: openid, 
                                ActId: actid,
                                attendees: attendee_list(actvInfo.attendees) });
                else
                  resp.render('viewActivity', 
                              { title: actvInfo.title, 
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
