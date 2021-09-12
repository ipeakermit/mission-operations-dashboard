const assert = require("assert");
const mongoose = require("mongoose");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const Session = require('../../schemas/session');
const {initEvents} = require("../../database/eventsInit");
const {populateSession} = require("../../database/sessionFunctions");

const handler = async (context) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();


  try {
    // Use transaction to roll back changes on error
    db_session.startTransaction();

    // Create new host user in database
    const user = await User.create([{
      name: "Host",
      room: null,
      console: null,
      socketid: context.socket.id,
    }], {session: db_session});

    // Throw validation error if user was not properly created
    assert.strictEqual(user.length, 1, new ValidationError("Incorrect number of user objects created"));
    assert.ok(user[0] instanceof User, new ValidationError("Created user object is not a valid User"));

    // Generate a new 6-digit session code
    let newSessionCode = Math.floor(100000 + Math.random() * 899999).toString();

    // Get array of all existing session codes currently
    const existingSessions = await Session.find({}, {session_code: 1});

    // If session code is duplicate, regenerate until unique
    while (existingSessions.map(session => session.session_code).includes(newSessionCode)) {
      newSessionCode = Math.floor(100000 + Math.random() * 899999).toString();
    }

    // Create a new session object in database
    let session = await Session.create([{
      session_code: newSessionCode,
      host_id: user[0]._id,
      start_time: "",
      tutors: [user[0]._id],
    }], {session: db_session});

    // Throw validation error if user was not properly created
    assert.strictEqual(session.length, 1, new ValidationError("Incorrect number of session objects created"));
    assert.ok(session[0] instanceof Session, new ValidationError("Created session object is not a valid Session"));

    // Populate session user references
    session = await populateSession(session[0], db_session);

    // Add session code to host user object room attribute
    User.updateOne({_id: user[0]._id}, {room: session._id});

    // Populate OSTPV events for session
    await initEvents(session._id, db_session);

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Join the socket.io room
    context.socket.join(newSessionCode);

    // Return session data and callback response
    console.info(`CREATE_SESSION: Session ${newSessionCode} created`);
    context.io.in(newSessionCode).emit("SESSION_DATA", session);
    return [session, {
      success: true, msg: "", data: {
        sessionCode: newSessionCode,
        userID: user[0]._id,
      },
    }]
  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`CREATE_SESSION: Failed to create new session`, err);
    return {success: false, msg: err.message}
  }
}

module.exports.handler = handler;