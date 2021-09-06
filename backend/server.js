const { DateTime } = require("luxon");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {transports: ["websocket"]});
const mongoose = require("mongoose");
const User = require('./user');
const Session = require('./session');
const Log = require('./log');
const FlightNote = require('./flightnote');
const Event = require('./event');
const {initEvents} = require("./eventsInit");
const { fetchSession, submitLog } = require("./util");

// Read environment variables from .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const PORT = process.env.PORT || 4001;

// Attempt connection to database
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_URL, { dbName: 'missioncontrol' });
const db = mongoose.connection;
db.once('open', () => console.log('Successfully connected to database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Establish socket connection
io.on('connection', socket => {
  console.log(`Client has connected with socketID ${socket.id}`);


  socket.on("JOIN_SESSION", async (session_code, username, cb) => {
    console.group("JOIN_SESSION event")

    // Try to fetch session and see if it exists
    let session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Create a new user object in the database
    const newUser = await User.create({
      name: username,
      room: session._id,
      console: null,
      socketid: socket.id
    }).catch((e) => {console.log(e)});
    if (!newUser) {
      // If the new user is not created, return an error
      console.error("Error creating user for client")
      cb({success: false, msg: "Error creating user for client"});
      console.groupEnd();
      return;
    }

    // Add user id to array in session consoles
    let updateKey = "operators";
    session = await Session.findOneAndUpdate({_id: session._id}, { 
      $addToSet: { [updateKey]: newUser._id },
    }, {new: true, omitUndefined: true})
    .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
    .populate({ path: 'tutors', model: 'User'})
    .populate({ path: 'operators', model: 'User'})
    .catch((e) => {console.log(e)});

    // Add the host socket to the newly created room
    socket.join(session_code);

    // Transmit session data back to host
    console.groupEnd();
    cb({success: true, msg: "", data: {userID: newUser._id }});
    io.in(session_code).emit("SESSION_DATA", session);
  })

  socket.on("CREATE_SESSION", async (cb) => {
    console.group("CREATE_SESSION event");

    // Create a new user object for the host in the database
    const newUser = await User.create({
      name: "Host",
      room: null,
      console: null,
      socketid: socket.id
    }).catch((e) => {console.log(e)});

    if (!newUser) {
      // If the new user is not created, return an error
      console.error("Error creating user for host.")
      cb({success: false, msg: "Error creating user for host"});
      console.groupEnd();
      return;
    }

    // Generate a new 6-digit session code
    var newSessionCode = Math.floor(100000 + Math.random() * 899999).toString();

    // Get array of all existing session codes currently
    const existingSessions = await Session.find({}, { session_code: 1 }).catch((e) => {console.log(e)});

    // If there are sessions, ensure the session codes do not conflict
    if (existingSessions) {
      const existingCodes = existingSessions.map((session) => session.session_code);
      while (existingCodes.includes(newSessionCode)) {
        newSessionCode = Math.floor(100000 + Math.random() * 899999).toString();
      }
    } // If no sessions are returned, then code cannot conflict so no need to handle
    console.info("Session created with code", newSessionCode);

    // Create a new session object in database
    let newSession = await Session.create({
      session_code: newSessionCode,
      host_id: newUser._id,
      start_time: "",
    }).catch((e) => {console.log(e)});

    // If the new session is not created, delete host user and return an error
    if (!newSession) {
      User.findByIdAndDelete(newUser._id);
      console.error("Error creating new session.")
      cb({success: false, msg: "Error creating new session"});
      console.groupEnd();
      return;
    }

    // Update the host's room to point to the newly created session
    User.updateOne({_id: newUser._id}, {room: newSession._id}, (err, _res) => {
      if (err) console.error(err);
    })

    // Add user id to array in session consoles
    let updateKey = "tutors";
    newSession = await Session.findOneAndUpdate({_id: newSession._id}, {
                             $addToSet: { [updateKey]: newUser._id },
                           }, {new: true, omitUndefined: true})
                           .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
                           .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
                           .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
                           .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
                           .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
                           .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
                           .populate({ path: 'tutors', model: 'User'})
                           .populate({ path: 'operators', model: 'User'})
                           .catch((e) => {console.log(e)});

    // Add the host socket to the newly created room
    socket.join(newSessionCode);

    // Populate the events for the session
    await initEvents(newSession._id);

    // Transmit session data back to host
    console.groupEnd();
    cb({success: true, msg: "", data: {sessionCode: newSessionCode, userID: newUser._id} });
    io.in(newSessionCode).emit("SESSION_DATA", newSession);
  })

  socket.on("CHECK_SESSION_CODE", async (session_code, cb) => {
    // Try to fetch session and see if it exists
    const session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
    } else {
      cb({success: true, msg: "", data: {session: session} });
    }
  })

  socket.on("JOIN_CONSOLE", async (console_name, session_code, user_id, cb) => {
    console.group("JOIN_CONSOLE event")
    // Check to make sure the console is not full
    var session = await Session.where({ session_code: session_code }).findOne().catch((e) => {console.log(e)});
    if (!session) {
      // If no session is returned, return error to the client
      console.error(`Session ${session_code} could not be found in database`);
      cb({success: false, msg: "Session could not be found in database"})
      return;
    }
    if (session.consoles[console_name].length >= 3) {
      // If the console is already full, return error to the client
      console.error(`Console ${console_name} is already full`);
      cb({success: false, msg: "Specified console is already full"})
      return;
    } 

    // If session exists and space is availabe in console, set user's console
    const user = await User.findByIdAndUpdate(user_id, { console: console_name}, {new: false}).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${user_id} could not be found in database`);
      cb({success: false, msg: "No user could be found with matching socket_id"});
      return;
    }
    if (user && user.console !== null) {
      // If a user is returned and they already have a console, update it and remove them from the console array in the session object
      console.info(`User ${user_id} was previously assigned to ${user.console} in session ${session_code}`)
      let updateKey = "consoles." + user.console;
      await Session.updateOne({_id: session._id}, {
        $pull: { [updateKey]: user._id }
      })
    }

    // Add user id to array in session consoles
    let updateKey = "consoles." + console_name;
    session = await Session.findOneAndUpdate({_id: session._id}, { 
      $addToSet: { [updateKey]: user._id },
    }, {new: true, omitUndefined: true})
    .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
    .populate({ path: 'tutors', model: 'User' })
    .populate({ path: 'operators', model: 'User' })
    .catch((e) => {console.log(e)});

    // Return and emit updated session data
    console.info(`User ${user_id} added to ${console_name} in session ${session_code}`);
    console.groupEnd();
    cb({success: true, msg: ""});
    io.in(session_code).emit("SESSION_DATA", session);
  })

  socket.on("TUTOR_JOIN_SESSION", async (session_code, username, cb) => {
    console.group("TUTOR_JOIN_SESSION event")

    // Try to fetch session and see if it exists
    var session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Create a new user object in the database
    const newUser = await User.create({
      name: username,
      room: session._id,
      console: 'tutor',
      socketid: socket.id
    }).catch((e) => {console.log(e)});
    if (!newUser) {
      // If the new user is not created, return an error
      console.error("Error creating user for client")
      cb({success: false, msg: "Error creating user for client"});
      console.groupEnd();
      return;
    }

    // Add user id to array in session consoles
    let updateKey = "tutors";
    session = await Session.findOneAndUpdate({_id: session._id}, { 
      $addToSet: { [updateKey]: newUser._id },
    }, {new: true, omitUndefined: true})
    .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
    .populate({ path: 'tutors', model: 'User' })
    .populate({ path: 'operators', model: 'User' })
    .catch((e) => {console.log(e)});

    // Add the host socket to the newly created room
    socket.join(session_code);

    // Return and emit updated session data
    console.info(`Tutor ${newUser._id} added to tutors in session ${session_code}`);
    console.groupEnd();
    cb({success: true, msg: "", data: {userID: newUser._id }});
    io.in(session_code).emit("SESSION_DATA", session);
  })

  socket.on("disconnect", async (reason) => {
    // If user has disconnected, update their database object to reflect this
    console.group("USER_DISCONNECT event")
    const user = await User.findOneAndUpdate({ socketid: socket.id }, { disconnected: true }, { new: true })
                        .populate({ path: 'room', model: 'Session' });
    if (!user) console.log("No user was found in the database with that socket.id");
    else {
      const session = await fetchSession(user.room.session_code);
      console.log(`User ${user._id} has disconnected from session ${user.room.session_code} due to ${reason}`);
      let logs = await submitLog(session._id, session.session_code, user._id,
                `Disconnected from session due to ${reason}`
      )
      io.in(user.room.session_code).emit("UPDATE_LOGS", logs);
      io.in(user.room.session_code).emit("SESSION_DATA", session);
    }
    console.groupEnd();
  })

  socket.on("RECONNECT_USER", async (user_object_id, session_code, cb) => {
    // TODO: ALLOW TUTORS TO RECONNECT AS WELL (AS WELL AS HOST)
    console.group("RECONNECT_USER event")

    // Update the socket ID being stored in the 
    var session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Update user socket_id being stored in database object
    User.findByIdAndUpdate(user_object_id, {socketid: socket.id, disconnected: false}, (err) => {
      if (err) console.log(err);
    });

    let flightnotes = await FlightNote.find({session_id: session._id})
                                      .populate({ path: 'session_id', model: 'Session' })
                                      .populate({ path: 'sender_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));

    let events = await Event.find({ session_id: session._id }, (err, docs) => {
      if (err) {
        console.log(err)
      }
    })

    // If userID exists in list of operators in room
    if (session.operators.some(operator => operator._id.toString() === user_object_id)) {
      // Add new socket ID to the socket room and send data update
      socket.join(session_code);
      session = await fetchSession(session_code);
      io.in(session_code).emit("SESSION_DATA", session);
      io.in(session_code).emit("UPDATE_EVENTS", events);
      socket.emit("UPDATE_EFNS", flightnotes);
      socket.emit("FETCH_LOGS", session._id, session_code);
      let logs = await submitLog(session._id, session_code, user_object_id,
                           `Reconnected to session ${session_code} successfully`
      )
      io.in(session_code).emit("UPDATE_LOGS", logs);
      console.info(`User ${user_object_id} reconnected to session ${session_code} successfully`);
      cb({success: true, msg: ""});
    } else {
      console.info(`Unable to reconnect user ${user_object_id} to session ${session_code} as they were not previously connected`);
      cb({success: false, msg: `Unable to reconnect user ${user_object_id} to session ${session_code} as they were not previously connected`});
    }
    console.groupEnd();
  })

  socket.on("RECONNECT_TUTOR", async (user_object_id, session_code, cb) => {
    // TODO: ALLOW TUTORS TO RECONNECT AS WELL (AS WELL AS HOST)
    console.group("RECONNECT_TUTOR event")

    // Update the socket ID being stored in the
    var session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Update user socket_id being stored in database object
    User.findByIdAndUpdate(user_object_id, {socketid: socket.id, disconnected: false}, (err) => {
      if (err) console.log(err);
    });

    let flightnotes = await FlightNote.find({session_id: session._id})
                                      .populate({ path: 'session_id', model: 'Session' })
                                      .populate({ path: 'sender_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));

    let events = await Event.find({ session_id: session._id }, (err, docs) => {
      if (err) {
        console.log(err)
      }
    })

    let logs = await Log.find({session_id: session._id})
                        .populate({ path: 'target_id', model: 'User' })
                        .exec()
                        .catch((e) => console.log(e));
    console.log(logs);
    io.in(session.session_code).emit("UPDATE_LOGS", logs);

    // If userID exists in list of operators in room
    if (session.tutors.some(tutor => tutor._id.toString() === user_object_id)) {
      // Add new socket ID to the socket room and send data update
      socket.join(session_code);
      session = await fetchSession(session_code);
      io.in(session_code).emit("SESSION_DATA", session);
      io.in(session_code).emit("UPDATE_EVENTS", events);
      let logs = await submitLog(session._id, session_code, user_object_id,
                           `Reconnected to session ${session_code} successfully`
      )
      io.in(session_code).emit("UPDATE_LOGS", logs);
      socket.emit("UPDATE_EFNS", flightnotes);
      console.info(`Tutor ${user_object_id} reconnected to session ${session_code} successfully`);
      cb({success: true, msg: ""});
    } else {
      console.info(`Unable to reconnect tutor ${user_object_id} to session ${session_code} as they were not previously connected`);
      cb({success: false, msg: `Unable to reconnect tutor ${user_object_id} to session ${session_code} as they were not previously connected`});
    }
    console.groupEnd();
  })

  socket.on("LEAVE_SESSION", async (user_id, session_code, cb) => {
    console.group("LEAVE_SESSION event")

    // Fetch session from database using session code
    var session = await Session.where({ session_code: session_code }).findOne().catch((e) => {console.log(e)});
    if (!session) {
      // If no session is returned, return error to the client
      console.error(`Session ${session_code} could not be found in database`);
      cb({success: false, msg: "Session could not be found in database"})
      return;
    }

    // Fetch user from database using user id
    var user = await User.findById(user_id).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${user_id} could not be found in database`);
      cb({success: false, msg: "No user could be found with matching socket_id"});
      return;
    }

    // Remove user id from session console (if they are assigned to one)
    if (user.console) {
      let updateKey = "consoles." + user.console;
      await Session.updateOne({_id: session._id}, {
        $pull: { [updateKey]: user._id }
      })
    }

    // Remove user id from session operator list and return updated session
    session = await Session.findByIdAndUpdate(session._id, {
      $pull: { operators: user._id },
    }, {new: true})
    .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
    .populate({ path: 'tutors', model: 'User' })
    .populate({ path: 'operators', model: 'User' })
    .catch((e) => {console.log(e)}); 

    // Delete user object from database
    User.findByIdAndDelete(user_id, (err) => {
      if (err) console.log(err);
    });

    // Remove user from socket room
    socket.leave(session_code);

    // Return and emit updated session data
    console.info(`User ${user_id} removed from session ${session_code} and deleted from database`);
    console.groupEnd();
    cb({success: true, msg: ""});
    io.in(session_code).emit("SESSION_DATA", session);
  })

  socket.on("START_SESSION", async (session_code, cb) => {
    console.group("START_SESSION event")

    // Fetch session from database using session code
    let session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Ensure number of connected operators is equal to number of consoles taken
    let connected = session.operators.length;
    let consoles = Object.values(session.consoles.toJSON()).flat().length;
    if (connected !== consoles) {
      // If not same number, someone is connected without being assigned to a console yet
      io.to(socket.id).emit("STUDENT_NO_CONSOLE");
    } else {
      // If same number, session can be started
      session = await Session.findByIdAndUpdate(session._id,
                                  {in_progress: true, start_time: DateTime.utc()},
                                  {new: true})
                             .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
                             .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
                             .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
                             .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
                             .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
                             .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
                             .populate({ path: 'tutors', model: 'User' })
                             .populate({ path: 'operators', model: 'User' })
                             .catch((e) => {console.log(e)});

      // Fetch events from session
      let events = await Event.find({ session_id: session._id }, (err, docs) => {
        if (err) {
          console.log(err)
        }
      })
      io.in(session_code).emit("SESSION_STARTED");

      // Create a new tutor log entry for the event
      let logs = await submitLog(session._id, session_code, null,
                                 "Lab session started"
      )
      io.in(session_code).emit("UPDATE_LOGS", logs);
      io.in(session_code).emit("SESSION_DATA", session);
      io.in(session_code).emit("UPDATE_EVENTS", events);
    }
    console.log(`Session ${session_code} successfully started`)
    console.groupEnd();
  })

  socket.on("UPDATE_EVENT_STATUS", async (user_object_id, event_id, session_id, status, session_code) => {
    let user = await User.findById(user_object_id).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${user_object_id} could not be found in database`);
      return;
    }

    let old_event = await Event.findOne({session_id: session_id, event_id: event_id});
    let new_classNames = [...old_event.classNames.filter(cn => cn === "time-critical"), status];
    await Event.findByIdAndUpdate(old_event._id, {classNames: new_classNames})
    let updated_events = await Event.find({session_id: session_id});
    let logs = await submitLog(session_id, session_code, user_object_id,
                         `Updated event ${event_id} to status ${status}`
    )
    io.in(session_code).emit("UPDATE_LOGS", logs);
    io.in(session_code).emit("UPDATE_EVENTS", updated_events);
  })

  socket.on("UPDATE_EFN_STATUS", async (user_object_id, efn_id, session_id, status, session_code) => {
    console.group("EFN STATUS UPDATE EVENT");

    let user = await User.findById(user_object_id).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${user_object_id} could not be found in database`);
      return;
    }

    await FlightNote.findByIdAndUpdate(efn_id, {status: status})

    let logs = await submitLog(session_id, session_code, user_object_id,
                         `Updated flight note ${efn_id} to status ${status}`
    )
    io.in(session_code).emit("UPDATE_LOGS", logs);

    let flightnotes = await FlightNote.find({session_id: session_id})
                                      .populate({ path: 'session_id', model: 'Session' })
                                      .populate({ path: 'sender_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));

    io.in(session_code).emit("UPDATE_EFNS", flightnotes);
    console.groupEnd();
  })

  socket.on("ADD_EFN_COMMENT", async (user_object_id, efn_id, session_id, comment, session_code) => {
    console.group("EFN ADD COMMENT EVENT");
    console.log(efn_id, comment);
    await FlightNote.findByIdAndUpdate(efn_id, {$push: {comments: comment } })

    let user = await User.findById(user_object_id).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${user_object_id} could not be found in database`);
      return;
    }

    let logs = await submitLog(session_id, session_code, user_object_id,
                         `Added a comment to flight note ${efn_id}`
    )
    io.in(session_code).emit("UPDATE_LOGS", logs);

    let flightnotes = await FlightNote.find({session_id: session_id})
                                      .populate({ path: 'session_id', model: 'Session' })
                                      .populate({ path: 'sender_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));

    io.in(session_code).emit("UPDATE_EFNS", flightnotes);
    console.groupEnd();
  })

  socket.on("FETCH_EFNS", async (session_code, cb) => {
    // Fetch session from database using session code
    let session = await fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    let flightnotes = await FlightNote.find({session_id: session._id})
                                      .populate({ path: 'session_id', model: 'Session' })
                                      .populate({ path: 'sender_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));

    socket.emit("UPDATE_EFNS", flightnotes);
  })

  socket.on("NEW_EFN", async (efn_data, cb) => {
    console.group("NEW_EFN event");

    // Fetch session from database using session code
    let session = await fetchSession(efn_data.session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session does not exist`)
      cb({success: false, msg: `Session does not exist`});
      console.groupEnd();
      return;
    }

    let user = await User.findById(efn_data.sender).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${efn_data.sender} could not be found in database`);
      return;
    }

    // Create a new EFN object in the database
    const newEfn = await FlightNote.create({
                                        session_id: session._id,
                                        sender_id: efn_data.sender,
                                        subject: efn_data.subject,
                                        message: efn_data.message,
                                        status: efn_data.status,
                                        createdAt: efn_data.createdAt,
                                        comments: efn_data.comments
                                      }).catch((e) => {console.log(e)});
    if (!newEfn) {
      // If the new user is not created, return an error
      console.error("Error creating new EFN")
      cb({success: false, msg: "Error creating new EFN"});
      console.groupEnd();
      return;
    }

    let logs = await submitLog(session._id, session.session_code, user._id,
                         `Created flight note ${newEfn._id}`
    )
    io.in(session.session_code).emit("UPDATE_LOGS", logs);

    let flightnotes = await FlightNote.find({session_id: session._id})
                                      .populate({ path: 'session_id', model: 'Session' })
                                      .populate({ path: 'sender_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));

    io.in(efn_data.session_code).emit("UPDATE_EFNS", flightnotes);
    console.log(efn_data);
    console.groupEnd();
  })

  socket.on("FIRST_TAB_OPEN", async (session_id, session_code, user_id, tab_name) => {
    // Create a new tutor log entry for the event
    let logs = await submitLog(session_id, session_code, user_id,
                               `Opened console tab (${tab_name}) for the first time`
    )
    io.in(session_code).emit("UPDATE_LOGS", logs);
  })

  socket.on("FETCH_LOGS", async (session_id, session_code) => {
    let logs = await Log.find({session_id: session_id})
                                      .populate({ path: 'target_id', model: 'User' })
                                      .exec()
                                      .catch((e) => console.log(e));
    io.in(session_code).emit("UPDATE_LOGS", logs);
  })
})


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));