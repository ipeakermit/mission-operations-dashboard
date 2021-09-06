const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = Schema({
  session_code: { type: String, required: true, index: true},
  host_id: { type: Schema.ObjectId, ref: 'users'},
  tutors: [{ type: Schema.ObjectId, ref: 'users'}],
  operators: [{type: Schema.ObjectId, ref: 'users'}],
  consoles: {
    spartan: [{ type: Schema.ObjectId, ref: 'users'}],
    cronus: [{ type: Schema.ObjectId, ref: 'users'}],
    ethos: [{ type: Schema.ObjectId, ref: 'users'}],
    bme: [{ type: Schema.ObjectId, ref: 'users'}],
    flight: [{ type: Schema.ObjectId, ref: 'users'}],
    capcom: [{ type: Schema.ObjectId, ref: 'users'}]
  },
  in_progress: {type: Boolean, default: false},
  start_time: {type: String},
})

module.exports = mongoose.model('Session', sessionSchema);
