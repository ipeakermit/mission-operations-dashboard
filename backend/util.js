const mongoose = require("mongoose");
const Session = require('./session');

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

module.exports.fetchSession = fetchSession;