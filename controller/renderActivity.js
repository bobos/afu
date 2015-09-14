var db = require('../models/db');

function render_page(openid, actid, res) {
  db.get_actv(actid, res,
              function (actvInfo, resp) {
                actvInfo.OpenId = openid;
                actvInfo.ActId = actid;
		actvInfo.attendees = attendee_list(actvInfo.attendees);
                if ( actvInfo.creator == openid && actvInfo.open ) 
                  resp.render('myOpenActivity', actvInfo);
                if ( actvInfo.creator == openid && !actvInfo.open
	             && actvInfo.isActive ) 
                  resp.render('myActiveActivity', actvInfo);
                if ( actvInfo.creator == openid && !actvInfo.open
	             && !actvInfo.isActive ) 
                  resp.render('closedActivity', actvInfo);
                if ( actvInfo.creator != openid && actvInfo.open ) 
                  render_attend_page(actvInfo.creator, actid, res);
                if ( actvInfo.creator != openid && !actvInfo.open 
                     && actvInfo.isActive ) 
                  resp.render('notOpenActivity', actvInfo);
                if ( actvInfo.creator != openid && !actvInfo.open 
                     && !actvInfo.isActive ) 
                  resp.render('closedActivity', actvInfo);
              })
}

function render_attend_page(openid, actid, res) {
  db.get_actv(actid, res,
              function (actvInfo, resp) {
                actvInfo.OpenId = openid;
                actvInfo.ActId = actid;
		actvInfo.attendees = attendee_list(actvInfo.attendees);
                resp.render('attendActivity', actvInfo);
               })
}

//TODO: fix the display
function attendee_list(attendees) {
  var html = '';
  for (var i = 0; i < attendees.length; i++) {
    html += '<div class="avatar"><img src="'
            +attendees[i].avatar+'"></div>'+attendees[i].name
  }
  return html;
}

exports.render_page = render_page;
exports.render_attend_page = render_attend_page;
