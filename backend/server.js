const {DateTime} = require("luxon");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {transports: ["websocket"]});
const mongoose = require("mongoose");
const User = require('./schemas/user');
const Session = require('./schemas/session');
const Log = require('./schemas/log');
const FlightNote = require('./schemas/flightnote');
const Event = require('./schemas/event');
const {initEvents} = require("./database/eventsInit");
const {fetchSession, submitLog} = require("./util");

// Read environment variables from .env file if not in production
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const PORT = process.env.PORT || 4001;

// Attempt connection to database
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set('useCreateIndex', true);
mongoose.connection.once('open', () => console.info('MongoDB successfully connected'))
mongoose.connection.on('error', (err) => console.error.bind(console, ['MongoDB connection error!', err]))
mongoose.connect(process.env.DB_URL, {dbName: 'missioncontrol'});
const db = mongoose.connection;

// Establish socket connection
io.on('connection', socket => {
  const context = {socket: socket, io: io};
  console.info(`Client connected with socketID ${socket.id}`);

  // Handle host creating new session
  socket.on("CREATE_SESSION", async (cb) => {
    let response = await require('./event_handlers/menu/createSession.js')
      .handler(context);
    cb(response);
  })

  // Handle user checking if session exists
  socket.on("CHECK_SESSION_CODE", async (session_code, cb) => {
    let response = await require('./event_handlers/menu/checkSessionCode.js')
      .handler(session_code);
    cb(response);
  })

  // Handle user joining active session
  socket.on("JOIN_SESSION", async (session_code, username, cb) => {
    let response = await require('./event_handlers/menu/joinSession.js')
      .handler(context, session_code, username)
    cb(response);
  })

  // Handle tutor joining active session
  socket.on("TUTOR_JOIN_SESSION", async (session_code, username, cb) => {
    let response = await require('./event_handlers/menu/tutorJoinSession.js')
      .handler(context, session_code, username)
    cb(response);
  })

  // Handle student assigning themselves to a console
  socket.on("JOIN_CONSOLE", async (console_name, session_code, user_id, cb) => {
    let response = await require('./event_handlers/lobby/joinConsole.js')
      .handler(context, console_name, session_code, user_id)
    cb(response);
  })

  socket.on("disconnect", async (reason) => {
    await require('./event_handlers/connection/disconnect.js')
      .handler(context, reason)
  })

  socket.on("RECONNECT_USER", async (user_object_id, session_code, cb) => {
    let response = await require('./event_handlers/connection/reconnect_user.js')
      .handler(context, user_object_id, session_code)
    cb(response);
  })

  socket.on("RECONNECT_TUTOR", async (user_object_id, session_code, cb) => {
    let response = await require('./event_handlers/connection/reconnect_tutor.js')
      .handler(context, user_object_id, session_code)
    cb(response);
  })

  socket.on("LEAVE_SESSION", async (user_id, session_code, cb) => {
    let response = await require('./event_handlers/lobby/leaveSession.js')
      .handler(context, user_id, session_code)
    cb(response);
  })

  socket.on("START_SESSION", async (session_code, cb) => {
    let response = await require('./event_handlers/lobby/startSession.js')
      .handler(context, session_code)
    cb(response);
  })

  socket.on("UPDATE_EVENT_STATUS", async (user_object_id, event_id, session_id, status, session_code) => {
    await require('./event_handlers/events/updateEventStatus.js')
      .handler(context, user_object_id, event_id, session_id, status, session_code);
  })

  socket.on("UPDATE_EFN_STATUS", async (user_object_id, efn_id, session_id, status, session_code) => {
    await require('./event_handlers/efn/updateEFNStatus.js')
      .handler(context, user_object_id, efn_id, session_id, status, session_code);
  })

  socket.on("ADD_EFN_COMMENT", async (user_object_id, efn_id, session_id, comment, session_code) => {
    await require('./event_handlers/efn/addEFNComment.js')
      .handler(context, user_object_id, efn_id, session_id, comment, session_code);
  })

  socket.on("NEW_EFN", async (efn_data, cb) => {
    let response = await require('./event_handlers/efn/newEFN.js')
      .handler(context, efn_data)
    cb(response);
  })

  socket.on("FIRST_TAB_OPEN", async (session_id, session_code, user_id, tab_name) => {
    await require('./event_handlers/logs/firstTabOpen.js')
      .handler(context, session_id, session_code, user_id, tab_name)
  })

  socket.on("FETCH_LOGS", async (session_id, session_code) => {
    let logs = await Log.find({session_id: session_id})
                        .populate({path: 'target_id', model: 'User'})
                        .exec()
                        .catch((e) => console.log(e));
    io.in(session_code).emit("UPDATE_LOGS", logs);
  })
})


server.listen(PORT, () => console.info(`Listening on port ${PORT}`));