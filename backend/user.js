const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String },
  room: { type: Schema.ObjectId, ref: 'sessions' },
  console: { type: String },
  socketid: { type: String },
  disconnected: {type: Boolean, default: false}
})

module.exports = mongoose.model('User', userSchema);
