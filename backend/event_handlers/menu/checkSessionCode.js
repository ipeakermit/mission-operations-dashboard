const assert = require("assert");
const mongoose = require("mongoose");
const {fetchSessionAndPopulate} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");

const handler = async (session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch session using session code
    let session = await fetchSessionAndPopulate(session_code, db_session);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Return callback response
    return {success: true, msg: "", data: {session: session}};

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`CHECK_SESSION_CODE: Error finding session ${session_code}`, err);
    return {success: false, msg: `Session ${session_code} does not exist`};
  }
}

module.exports.handler = handler;