const assert = require("assert");
const mongoose = require("mongoose");
const {submitLog} = require("../../util");
const {DateTime} = require("luxon");
const {updateSessionById} = require("../../database/sessionFunctions");
const {ValidationError} = require("../../database/ValidationError");
const User = require('../../schemas/user');
const Event = require('../../schemas/event');

const handler = async (context, user_id, event_id, session_id, status, session_code) => {
  // Create mongoose session to handle transaction
  const db_session = await mongoose.connection.startSession();

  try {
    // Use transaction to roll back changes on error
    await db_session.startTransaction();

    // Fetch user using user ID
    let user = await User.findById(user_id).session(db_session);

    // Throw validation error if no result returned
    assert.ok(user, new ValidationError("No user with matching user ID found"));

    // Fetch event using event ID and session ID
    let event = await Event.findOne(
      {session_id: session_id, event_id: event_id},
    ).session(db_session);

    // Create new list of classnames based on new status
    let new_classNames = [...event.classNames.filter(cn => cn === "time-critical"), status];

    // Update event with new list of classNames
    await Event.findByIdAndUpdate(
      event._id,
      {classNames: new_classNames},
      {session: db_session}
    );

    // Fetch list of events for the current session
    let events = await Event.find({session_id: session_id}).session(db_session);

    // Create a new log and fetch tutor_logs
    let logs = await submitLog(session_id, user_id, db_session,
      `Updated event ${event_id} to status ${status}`,
    )

    // If everything was successful, commit transaction
    await db_session.commitTransaction();

    // Emit event and log data to all users
    console.info(`UPDATE_EVENT_STATUS: Event ${event_id} was updated to ${status} in ${session_code}`);
    context.io.in(session_code).emit("UPDATE_EVENTS", events);
    context.io.in(session_code).emit("UPDATE_LOGS", logs);

  } catch (err) {
    // If an error occurred, rollback and log the warning details
    await db_session.abortTransaction();
    console.warn(`UPDATE_EVENT_STATUS: User ${user_id} failed to update event ${event_id} to ${status} in ${session_code}`, err);
  }
}

module.exports.handler = handler;