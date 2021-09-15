const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  event_id: {type: String },
  session_id: { type: Schema.ObjectId, ref: 'sessions'},
  resource_id: { type: String },
  astronaut: { type: String },
  title: { type: String },
  start: { type: String },
  end: { type: String },
  procedure: { type: String },
  location: { type: String },
  classNames: [{ type: String }],
  color: {type: String},
  borderColor: {type: String}
})

module.exports = mongoose.model('Event', eventSchema);
