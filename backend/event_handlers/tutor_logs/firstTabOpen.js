const mongoose = require("mongoose");
const {submitLog} = require("../../util");

const handler = async (context, session_id, session_code, user_id, tab_name) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Create a new log and fetch tutor_logs
    let logs = await submitLog(session_id, user_id, db_session,
      `Opened console tab (${tab_name}) for the first time`,
    )

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Emit event and log data to all users
    context.io.in(session_code).emit("UPDATE_LOGS", logs);

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`FIRST_TAB_OPEN: Failed to create log for first open of ${tab_name} for user ${user_id} in ${session_code}`, err);
  }
}

module.exports.handler = handler;