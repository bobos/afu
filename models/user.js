var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id: String, 
  nickname: String,
  avatar: String,
  friends: [String],
  activePublicActivities: [Number],
  activePrivateActivities: [Number],
  closedActivities: [Number],
  updated_at: Number,
});

// the collection name should be generated based on hashed value of openid
module.exports = mongoose.model('Users', userSchema);

