const assert = require("assert");
const mongoose = require("mongoose");
const {submitLog} = require("../../util");
const {DateTime} = require("luxon");
const {updateSessionById} = require("../../database/sessionFunctions");
const {fetchSessionAndPopulate} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");
const Event = require('../../schemas/event');

const handler = async (context, session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSessionAndPopulate(session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Determine if number of connected users is equal to taken console positions
    let operators = session.operators.length;
    let consoles = Object.values(session.consoles.toJSON()).flat().length;
    assert.strictEqual(operators, consoles, new ValidationError("Not all students are assigned to consoles"));

    // Start session and update database object
    session = await updateSessionById(
      session._id,
      {in_progress: true, start_time: DateTime.utc()},
      db_session
    );

    // Fetch OSTPV events
    let events = await Event.find({session_id: session._id}, {}, {session: db_session});

    // Create a new log and fetch tutor_logs
    let logs = await submitLog(session._id, null, db_session,
      `Lab session started`,
    )

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Emit session data to all users
    context.io.in(session_code).emit("SESSION_STARTED");
    context.io.in(session_code).emit("SESSION_DATA", session);
    context.io.in(session_code).emit("UPDATE_EVENTS", events);
    context.io.in(session_code).emit("UPDATE_LOGS", logs);

    console.info(`START_SESSION: Session ${session_code} was started`);
    return {success: true, msg: ""};

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`START_SESSION: Session ${session_code} failed to start`, err);
    return {success: false, msg: err.message};
  }
}

module.exports.handler = handler;