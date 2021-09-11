const Session = require('../schemas/session');

const fetchSession = async (session_code, db_session) => {
  let session = await Session.findOne({session_code: session_code});
  return populateSession(session);
}

const updateSessionById = async (session_id, update, db_session) => {
  let session = await Session.findByIdAndUpdate(session_id, update, {new: true, omitUndefined: true})
  return populateSession(session);
}

const populateSession = async (session) => {
  return session.populate({path: 'consoles', populate: {path: 'spartan', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'ethos', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'cronus', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'flight', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'capcom', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'bme', model: 'User'}})
                .populate({path: 'tutors', model: 'User'})
                .populate({path: 'operators', model: 'User'});
}

module.exports.fetchSession = fetchSession;
module.exports.updateSessionById = updateSessionById;
module.exports.populateSession = populateSession;