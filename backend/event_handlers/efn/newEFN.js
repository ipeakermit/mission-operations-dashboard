const assert = require("assert");
const mongoose = require("mongoose");
const {submitLog} = require("../../util");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const FlightNote = require('../../schemas/flightnote');
const {fetchSession} = require("../../database/sessionFunctions");

const handler = async (context, efn_data) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSession(efn_data.session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Fetch user using user ID
    let user = await User.findById(efn_data.sender).session(db_session);

    // Throw validation error if no result returned
    assert.ok(user, new ValidationError("No user with matching user ID found"));

    let efn = await FlightNote.create([{
      session_id: session._id,
      sender_id: efn_data.sender,
      subject: efn_data.subject,
      message: efn_data.message,
      status: efn_data.status,
      createdAt: efn_data.createdAt,
      comments: efn_data.comments
    }], {session: db_session});

    // Throw validation error if no new EFN object returned
    assert.strictEqual(efn.length, 1, new ValidationError("Incorrect number of EFNs created"));
    assert.ok(efn[0] instanceof FlightNote, new ValidationError("Creation of new EFN failed"));

    // Fetch list of events for the current session
    let flightnotes = await FlightNote.find({session_id: session._id})
                                      .populate({path: 'sender_id', model: 'User'})
                                      .session(db_session);

    // Create a new log and fetch tutor_logs
    let logs = await submitLog(session._id, user._id, db_session,
      `Created EFN ${efn[0]._id}`,
    )

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Emit event and log data to all users
    console.info(`NEW_EFN: ${user.name} created EFN ${efn[0]._id} in ${session.session_code}`);
    context.io.in(session.session_code).emit("UPDATE_EFNS", flightnotes);
    context.io.in(session.session_code).emit("UPDATE_LOGS", logs);
    return {success: true, msg: ""};

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`NEW_EFN: User failed to created a new EFN in ${efn_data.session_code}`, err);
    return {success: false, msg: err.message};
  }
}

module.exports.handler = handler;