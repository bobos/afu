var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var activitySchema = new Schema({
  _id: Number,
  creator: String,
  title: String,
  when: String,
  where: String,
  attLimits: Number,
  attendees: [String], //openid
  description: String,
  isActive: Boolean,
  spent: Number,
});

// the collection name should be generated based on previous table size
module.exports = mongoose.model('Activities', activitySchema);

