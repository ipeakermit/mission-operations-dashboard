const FlightNote = require('../schemas/flightnote');

const fetchFlightNotesBySessionId = async (session_id, db_session) => {
  return FlightNote.find(
    {session_id: session_id},
    {},
    {session: db_session},
  ).populate({path: 'session_id', model: 'Session'})
                   .populate({path: 'sender_id', model: 'User'})
                   .exec()
}

module.exports.fetchFlightNotesBySessionId = fetchFlightNotesBySessionId;
