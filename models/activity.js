var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var attendeeSchema = new Schema({ name: String, avatar: String });

var activitySchema = new Schema({
  _id: Number,
  creator: String,
  title: String,
  when: String,
  where: String,
  city: String,
  publicity: Boolean,
  type: String,
  attLimits: Number,
  attendeeIds: [String], //openid
  attendees: [attendeeSchema],
  description: String,
  isActive: Boolean,
  spent: Number,
  open: Boolean,
});

// the collection name should be generated based on previous table size
module.exports = mongoose.model('Activities', activitySchema);

