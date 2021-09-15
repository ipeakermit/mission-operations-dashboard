const assert = require("assert");
const mongoose = require("mongoose");
const {submitLog} = require("../../util");
const {DateTime} = require("luxon");
const {updateSessionById} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const FlightNote = require('../../schemas/flightnote');

const handler = async (context, user_id, efn_id, session_id, status, session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch user using user ID
    let user = await User.findById(user_id).session(db_session);

    // Throw validation error if no result returned
    assert.ok(user, new ValidationError("No user with matching user ID found"));

    // Fetch event using event ID and session ID
    await FlightNote.updateOne(
      {_id: efn_id},
      {status: status}
    ).session(db_session);

    // Fetch list of events for the current session
    let flightnotes = await FlightNote.find({session_id: session_id})
                                      .populate({path: 'sender_id', model: 'User'})
                                      .session(db_session);

    // Create a new log and fetch logs
    let logs = await submitLog(session_id, user_id, db_session,
      `Updated EFN ${efn_id} to status ${status}`,
    )

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Emit event and log data to all users
    console.info(`UPDATE_EFN_STATUS: EFN ${efn_id} was updated to ${status} in ${session_code}`);
    context.io.in(session_code).emit("UPDATE_EFNS", flightnotes);
    context.io.in(session_code).emit("UPDATE_LOGS", logs);

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`UPDATE_EFN_STATUS: User ${user_id} failed to update EFN ${efn_id} to ${status} in ${session_code}`, err);
  }
}

module.exports.handler = handler;