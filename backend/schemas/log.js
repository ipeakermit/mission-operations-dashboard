const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = Schema({
                             session_id: { type: Schema.ObjectId, ref: 'session', index: true},
                             target_id: { type: Schema.ObjectId, ref: 'users'},
                             message: { type: String },
                             createdAt: { type: String },
                         })

module.exports = mongoose.model('Log', logSchema);
