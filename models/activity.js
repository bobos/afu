var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var commentSchema = new Schema({ openid: String, date: Number, comment: String }, { noId: true });

var activitySchema = new Schema({
  _id: Number,
  tittle: String,
  isAA: Boolean,
  isPublic: Boolean,
  start: String,
  end: String,
  location: String,
  attLimits: Number,
  attendees: [String], //openid
  preActComments: [commentSchema],
  postActComments: [commentSchema],
  description: String,
  isActive: Boolean,
  spent: Number,
});

// the collection name should be generated based on previous table size
module.exports = mongoose.model('Activities', activitySchema);

