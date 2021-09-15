const assert = require("assert");
const mongoose = require("mongoose");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const Session = require('../../schemas/session');
const {updateSessionById} = require("../../database/sessionFunctions");
const {fetchSession} = require("../../database/sessionFunctions");

const handler = async (context, user_id, session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSession(session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Fetch user from database
    let user = await User.findById(user_id).session(db_session);

    // Throw validation error if no result returned
    assert.ok(user, new ValidationError("No user with matching user ID found"));

    // Remove user ID from session console if they have been assigned to one
    if (user.console) {
      let updateKey = "consoles." + user.console;
      await Session.updateOne(
        {_id: session._id},
        {$pull: {[updateKey]: user._id}},
        {session: db_session}
      )
    }

    // Remove user ID from operators list and return updated session
    session = await updateSessionById(
      session._id,
      {$pull: {operators: user._id}},
      db_session
    );

    // Delete user object from database
    await User.deleteOne({_id: user_id }, {session: db_session});

    // Leave socket room
    context.socket.leave(session_code);

    // Commit transaction if everything was successful
    await db_session.commitTransaction();

    // Return session data and callback response
    console.info(`LEAVE_SESSION: ${user.name} left session ${session_code}`);
    context.io.in(session_code).emit("SESSION_DATA", session);
    return {success: true, msg: ""};

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`LEAVE_SESSION: An error occurred while a user was leaving session ${session_code}`, err);
    return {success: false, msg: err.message}
  }
}

module.exports.handler = handler;