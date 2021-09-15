const mongoose = require("mongoose");
const Session = require('./schemas/session');
const Log = require("./schemas/log");
const {DateTime} = require("luxon");

const fetchSession = async (session_code) => {
  return await Session.findOne({session_code: session_code})
  .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
  .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
  .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
  .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
  .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
  .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
  .populate({ path: 'tutors', model: 'User' })
  .populate({ path: 'operators', model: 'User' })
  .catch((e) => {console.log(e)});
}

const submitLog = async (session_id, target_id, db_session, message) => {
  // Create new log based on parameters
  await Log.create([{
                     session_id: session_id,
                     target_id: target_id,
                     message: message,
                     createdAt: DateTime.utc()
                   }], {session: db_session});
  // Return all logs
  // TODO: reduce data transmission by sending only changed logs
  return await Log.find({session_id: session_id})
                  .populate({path: 'target_id', model: 'User'})
                  .session(db_session)
                  .exec()
}


module.exports.fetchSession = fetchSession;
module.exports.submitLog = submitLog;