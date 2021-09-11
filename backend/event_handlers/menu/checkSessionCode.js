const assert = require("assert");
const mongoose = require("mongoose");
const {fetchSession} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");

const handler = async (session_code) => {

  try {
    // Fetch session using session code
    let session = await fetchSession(session_code);

    // Throw validation error if no result returned
    assert.ok(session, new ValidationError("No session with matching session code found"));

    // Return callback response
    return {success: true, msg: "", data: {session: session}};

  } catch (err) {
    console.warn(`CHECK_SESSION_CODE: Error finding session ${session_code}`, err);
    return {success: false, msg: `Session ${session_code} does not exist`};
  }
}

module.exports.handler = handler;