const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
  socket_id: { type: String, required: true, index: true },
  name: { type: String },
  room: { type: Schema.ObjectId, ref: 'sessions' },
  console: { type: String }
})

module.exports = mongoose.model('User', userSchema);
