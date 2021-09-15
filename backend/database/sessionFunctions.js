const Session = require('../schemas/session');

const fetchSession = async (session_code, db_session) => {
  return Session.findOne(
    {session_code: session_code}
  ).session(db_session);
}

const fetchSessionAndPopulate = async (session_code, db_session) => {
  return Session.findOne(
    {session_code: session_code}
  ).session(db_session)
                .populate({path: 'consoles', populate: {path: 'spartan', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'ethos', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'cronus', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'flight', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'capcom', model: 'User'}})
                .populate({path: 'consoles', populate: {path: 'bme', model: 'User'}})
                .populate({path: 'tutors', model: 'User'})
                .populate({path: 'operators', model: 'User'});
}

const updateSessionById = async (session_id, update, db_session) => {
  return Session.findByIdAndUpdate(
    session_id,
    update,
    {
      new: true,
      omitUndefined: true,
      session: db_session,
    }).populate({path: 'consoles', populate: {path: 'spartan', model: 'User'}})
                             .populate({path: 'consoles', populate: {path: 'ethos', model: 'User'}})
                             .populate({path: 'consoles', populate: {path: 'cronus', model: 'User'}})
                             .populate({path: 'consoles', populate: {path: 'flight', model: 'User'}})
                             .populate({path: 'consoles', populate: {path: 'capcom', model: 'User'}})
                             .populate({path: 'consoles', populate: {path: 'bme', model: 'User'}})
                             .populate({path: 'tutors', model: 'User'})
                             .populate({path: 'operators', model: 'User'});
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
module.exports.fetchSessionAndPopulate = fetchSessionAndPopulate;
module.exports.updateSessionById = updateSessionById;
module.exports.populateSession = populateSession;