const assert = require("assert");
const mongoose = require("mongoose");
const {fetchSessionAndPopulate} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const Session = require('../../schemas/session');
const {NoResultError} = require("../../database/NoResultError");
const {submitLog} = require("../../util");

const handler = async (context, reason) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Search database for user with matching socket id
    let user = await User.findOne(
      {socketid: context.socket.id}
    ).session(db_session)

    // Throw validation error if user is not found or is not the correct type
    assert.ok(user, new NoResultError("No user found with matching socket id"));

    // Set the user to disconnected in the database
    user = await User.findByIdAndUpdate(
      user._id,
      {disconnected: true},
      {new: true, session: db_session},
    ).populate({path: 'room', model: 'Session'});

    assert.ok(user instanceof User, new ValidationError("Updated user object is not a valid User"));

    // Fetch session using session code
    const session = await fetchSessionAndPopulate(user.room.session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Create log entry for user disconnection
    let logs = await submitLog(session._id, user._id, db_session,
      `Disconnected from session due to ${reason}`,
    )

    // Commit transaction if everything else completed successfully
    await db_session.commitTransaction();

    // Emit response
    console.info(`DISCONNECT: ${user.name} disconnected from ${session.session_code}`);
    context.io.in(session.session_code).emit("UPDATE_LOGS", logs);
    context.io.in(user.room.session_code).emit("SESSION_DATA", session);

  } catch (err) {
    // If no user object was found, don't output anything since user reconnected to socket
    // without already being in a session
    if (!(err instanceof NoResultError)) {
      // If an error occurred, rollback and log the warning details
      await db_session.abortTransaction();
      console.warn(`DISCONNECT: An error occurred during a user disconnection`, err);
    }
  }

}

module.exports.handler = handler;