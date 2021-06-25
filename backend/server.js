const { DateTime } = require("luxon");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {transports: ["websocket"]});
const mongoose = require("mongoose");
const User = require('./user');
const Session = require('./session');
const FlightNote = require('./flightnote');
const Event = require('./event');
const { fetchSession } = require("./util");

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
    const session = fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Create a new user object in the database
    const newUser = await User.create({
      socket_id: socket.id,
      name: username,
      room: session._id,
      console: null
    }).catch((e) => {console.log(e)});
    if (!newUser) {
      // If the new user is not created, return an error
      console.error("Error creating user for client")
      cb({success: false, msg: "Error creating user for client"});
      console.groupEnd();
      return;
    }

    // Add the host socket to the newly created room
    socket.join(session_code);

    // Transmit session data back to host
    console.groupEnd();
    cb({success: true, msg: ""});
    io.in(session_code).emit("SESSION_DATA", session);
  })

  socket.on("CREATE_SESSION", async (cb) => {
    console.group("CREATE_SESSION event");

    // Create a new user object for the host in the database
    const newUser = await User.create({
      socket_id: socket.id,
      name: "Host",
      room: null,
      console: null
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
    const newSession = await Session.create({
      session_code: newSessionCode,
      host_id: newUser._id,
      start_time: DateTime.utc(),
    }).catch((e) => {console.log(e)});

    // If the new session is not created, return an error
    if (!newSession) {
      console.error("Error creating new session.")
      cb({success: false, msg: "Error creating new session"});
      console.groupEnd();
      return;
    }

    // Update the host's room to point to the newly created session
    User.updateOne({_id: newUser._id}, {room: newSession._id}, (err, _res) => {
      if (err) console.error(err);
    })

    // Add the host socket to the newly created room
    socket.join(newSessionCode);

    // Transmit session data back to host
    console.groupEnd();
    cb({success: true, msg: "", sessionCode: newSessionCode});
    io.in(newSessionCode).emit("SESSION_DATA", newSession);
  })

  socket.on("JOIN_CONSOLE", async (console_name, session_code, cb) => {
    console.group("JOIN_CONSOLE event")
    // Check to make sure the console is not full
    var session = await Session.where({ session_code: session_code }).findOne().catch((e) => {console.log(e)});
    if (!session) {
      // If no session is returned, return error to the client
      console.error(`Session ${session_code} could not be found in database`);
      cb({success: false, msg: "Session could not be found in database"})
      return;
    }
    if (session.consoles[console_name].length >= 2) {
      // If the console is already full, return error to the client
      console.error(`Console ${console_name} is already full`);
      cb({success: false, msg: "Specified console is already full"})
      return;
    } 

    // If session exists and space is availabe in console, set user's console
    const user = await User.findOneAndUpdate({ socket_id: socket.id }, { console: console_name}, {new: false}).catch((e) => {console.log(e)});
    if (!user) {
      // If no user is returned, return error to the client
      console.error(`User ${socket.id} could not be found in database`);
      cb({success: false, msg: "No user could be found with matching socket_id"});
      return;
    }
    if (user && user.console !== null) {
      // If a user is returned and they already have a console, update it and remove them from the console array in the session object
      console.info(`User ${socket.id} was previously assigned to ${user.console} in session ${session_code}`)
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
    .catch((e) => {console.log(e)});

    // Return and emit updated session data
    console.info(`User ${socket.id} added to ${console_name} in session ${session_code}`);
    console.groupEnd();
    cb({success: true, msg: ""});
    io.in(session_code).emit("SESSION_DATA", session);
  })

  socket.on("TUTOR_JOIN_SESSION", async (session_code, username, cb) => {
    console.group("TUTOR_JOIN_SESSION event")

    // Try to fetch session and see if it exists
    const session = fetchSession(session_code);
    if (!session) {
      // If session is null, the specified session does not exist
      console.error(`Session ${session_code} does not exist`)
      cb({success: false, msg: `Session ${session_code} does not exist`});
      console.groupEnd();
      return;
    }

    // Create a new user object in the database
    const newUser = await User.create({
      socket_id: socket.id,
      name: username,
      room: session._id,
      console: 'tutor'
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
      $addToSet: { [updateKey]: user._id },
    }, {new: true, omitUndefined: true})
    .populate({ path: 'consoles', populate: { path: 'spartan', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'ethos', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'cronus', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'flight', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'capcom', model: 'User' }})
    .populate({ path: 'consoles', populate: { path: 'bme', model: 'User' }})
    .populate({ path: 'tutors', model: 'User'})
    .catch((e) => {console.log(e)});

    // Add the host socket to the newly created room
    socket.join(session_code);

    // Return and emit updated session data
    console.info(`Tutor ${socket.id} added to ${console_name} in session ${session_code}`);
    console.groupEnd();
    cb({success: true, msg: ""});
    io.in(session_code).emit("SESSION_DATA", session);
  })
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));