const assert = require("assert");
const mongoose = require("mongoose");
const {fetchSessionAndPopulate, updateSessionById} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');

const handler = async (context, session_code, username) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSessionAndPopulate(session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Create new user in database
    const user = await User.create([{
        name: username,
        room: session._id,
        console: null,
        socketid: context.socket.id,
      }], {session: db_session});

    // Throw validation error if user was not properly created
    assert.strictEqual(user.length, 1, new ValidationError("Incorrect number of user objects created"));
    assert.ok(user[0] instanceof User, new ValidationError("Created user object is not a valid User"));

    // Update session to include user id in operators array
    let update = { $addToSet: { ["operators"]: user[0]._id }};
    session = await updateSessionById(session._id, update, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session ID found"));

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Join the socket.io room
    context.socket.join(session_code);

    console.debug(session);

    // Return callback response
    console.info(`JOIN_SESSION: ${username} joined ${session_code}`);
    context.io.in(session_code).emit("SESSION_DATA", session);
    return {success: true, msg: "", data: { userID: user[0]._id } }

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`JOIN_SESSION: ${username} failed to join ${session_code}`, err);
    return {success: false, msg: err.message}
  }
}

module.exports.handler = handler;