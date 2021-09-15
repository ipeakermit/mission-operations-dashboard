const assert = require("assert");
const mongoose = require("mongoose");
const {fetchSessionAndPopulate, updateSessionById} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const Session = require('../../schemas/session');

const handler = async (context, console_name, session_code, user_id) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSessionAndPopulate(session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Throw validation error if console is full
    let console_count = session.consoles[console_name].length;
    assert.ok(console_count < 3, new ValidationError("Specified console is already full"))

    // Set user's console to selected console (fetch user before update to check if they
    // already were assigned to a console or not
    let user = await User.findByIdAndUpdate(
      user_id,
      {console: console_name},
      {new: false, session: db_session}
    );

    // Throw validation error if user is not the correct type
    assert.ok(user instanceof User, new ValidationError("Fetched user object is not a valid User"));

    // Check if user must be removed from one of the console arrays
    if (user.console !== null) {
      let updateKey = "consoles." + user.console;
      await Session.updateOne(
        {_id: session._id},
        { $pull: {[updateKey]: user._id }},
        { session: db_session}
      )
    }

    // Add user id to new console array for selected console
    let updateKey = "consoles." + console_name;
    let update = { $addToSet: { [updateKey]: user._id }};
    session = await updateSessionById(session._id, update, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session ID found"));

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Return callback response
    console.info(`JOIN_CONSOLE: ${user.name} joined ${console_name} in ${session_code}`);
    context.io.in(session_code).emit("SESSION_DATA", session);
    return {success: true, msg: ""}

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`JOIN_CONSOLE: User ${user_id} failed to join ${console_name} in ${session_code}`, err);
    return {success: false, msg: err.message}
  }
}

module.exports.handler = handler;