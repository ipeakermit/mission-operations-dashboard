const mongoose = require("mongoose");
const {submitLog} = require("../../util");
const FlightNote = require('../../schemas/flightnote');

const handler = async (context, user_id, efn_id, session_id, comment, session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch event using event ID and session ID
    await FlightNote.updateOne(
      {_id: efn_id},
      {$push: {comments: comment}}
    ).session(db_session);

    // Fetch list of events for the current session
    let flightnotes = await FlightNote.find({session_id: session_id})
                                      .populate({path: 'sender_id', model: 'User'})
                                      .session(db_session);

    // Create a new log and fetch logs
    let logs = await submitLog(session_id, user_id, db_session,
      `Added a comment to EFN ${efn_id}`,
    )

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Emit event and log data to all users
    console.info(`ADD_EFN_COMMENT: Added a comment to EFN ${efn_id} in ${session_code}`);
    context.io.in(session_code).emit("UPDATE_EFNS", flightnotes);
    context.io.in(session_code).emit("UPDATE_LOGS", logs);

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`ADD_EFN_COMMENT: User ${user_id} failed to add comment to EFN ${efn_id} in ${session_code}`, err);
  }
}

module.exports.handler = handler;