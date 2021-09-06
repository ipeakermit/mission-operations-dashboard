const mongoose = require("mongoose");
const Session = require('./session');
const Log = require("./log");
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

const submitLog = async (session_id, session_code, target_id, message) => {
  await Log.create({
                     session_id: session_id,
                     target_id: target_id,
                     message: message,
                     createdAt: DateTime.utc()
                   }).catch((e) => {console.log(e)});
  return await Log.find({session_id: session_id})
                  .populate({path: 'target_id', model: 'User'})
                  .exec()
                  .catch((e) => console.log(e));
}


module.exports.fetchSession = fetchSession;
module.exports.submitLog = submitLog;