const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  resource_id: { type: String },
  astronaut: { type: String },
  title: { type: String },
  start: { type: String },
  end: { type: String },
  procedure: { type: String },
  location: { type: String },
  class_names: [{ type: String }]
})

module.exports = mongoose.model('Event', eventSchema);
