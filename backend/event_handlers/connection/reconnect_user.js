const assert = require("assert");
const mongoose = require("mongoose");
const {fetchSession, fetchSessionAndPopulate, updateSessionById} = require("../../database/sessionFunctions");
const {fetchFlightNotesBySessionId} = require("../../database/efnFunctions");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const Event = require('../../schemas/event');
const {submitLog} = require("../../util");

const handler = async (context, user_id, session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Update user's socket id and disconnected status
    await User.updateOne(
      {_id: user_id},
      {socketid: context.socket.id, disconnected: false},
      {session: db_session}
    );

    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSession(session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // If user is a student in the room
    if (session.operators.some(operator => operator._id.toString() === user_id)) {
      // Rejoin the socket.io room to receive data update
      context.socket.join(session_code);

      // Fetch flight notes to update reconnecting user
      let flightnotes = await fetchFlightNotesBySessionId(session._id, db_session);

      // Fetch OSTPV events
      let events = await Event.find({session_id: session._id}).session(db_session);

      // Create a new log and fetch tutor_logs
      let logs = await submitLog(session._id, user_id, db_session,
        `Reconnected to session ${session_code} successfully`,
      )

      // Fetch session data
      session = await fetchSessionAndPopulate(session_code, db_session);

      // Emit all data updates to users in the room
      context.io.in(session_code).emit("SESSION_DATA", session);
      context.io.in(session_code).emit("UPDATE_EFNS", flightnotes);
      context.io.in(session_code).emit("UPDATE_EVENTS", events);
      context.io.in(session_code).emit("UPDATE_LOGS", logs);

      // If everything was successful, commit transaction
      await db_session.commitTransaction();
      console.info(`RECONNECT_USER: User ${user_id} reconnected to session ${session_code}`);
      return {success: true, msg: ""};
    }

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`RECONNECT_USER: A user failed to reconnect to session ${session_code}`, err);
    return {success: false, msg: `Unable to reconnect user ${user_id} to session ${session_code}`};
  }
}

module.exports.handler = handler;