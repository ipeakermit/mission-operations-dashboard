const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const efnSchema = Schema({
  session_id: { type: Schema.ObjectId, ref: 'session', index: true},
  sender_id: { type: Schema.ObjectId, ref: 'users'},
  subject: { type: String },
  message: { type: String },
  status: { type: String, default: "open"},
  createdAt: { type: String },
  updatedAt: { type: String },
  comments: [{ type: String }]
})

module.exports = mongoose.model('FlightNote', efnSchema);
