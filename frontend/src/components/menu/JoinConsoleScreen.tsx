import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import socket from "util/Socket";
import { Session } from "types/session";
import { Consoles } from "types/consoles";
import { User } from "types/user";
import { makeStyles } from "@material-ui/core/styles";
import ConsoleList from "components/menu/ConsoleList";
import { useLocalStorageMap } from "util/useLocalStorageMap";
import JoinUsernameForm from "./JoinUsernameForm";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ConnectedUserList from "./ConnectedUserList";
import ConnectedTutorList from "./ConnectedTutorList";
import {useSessionContext} from "../../context/SessionContext";

const useStyles = makeStyles(() => ({
  container: {
    
  },
  root: {
    marginTop: "32px",
  },
  tutorButton: {
    marginLeft: '20px'
  }
}));

interface JoinConsoleScreenProps {
  userType: string;
  clearSession: () => void;
}

const JoinConsoleScreen: React.FC<JoinConsoleScreenProps> = (props) => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const { session, userID } = useSessionContext();
  const [reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
  
  const fetchConsoleNames = (consoleName: keyof Consoles) => {
    if (session?.consoles) {
      let users = session.consoles[consoleName] as User[];
      return [
        users[0]?.name,
        users[1]?.name,
        users[2]?.name,
      ]
    } else {
      return []
    }
  }

  const joinConsole = (console: keyof Consoles) => {
    if (session && props.userType === "student") {
      socket.emit("JOIN_CONSOLE", console, session.session_code, userID, (res: {success: boolean, msg: string}) => {
        if (!res.success) {
          setError(res.msg);
        }
      });
    }
  }

  const leaveSession = () => {
    if (session) {
      socket.emit("LEAVE_SESSION", userID, session.session_code, (res: { success: boolean, msg: string }) => {
        if (!res.success) {
          setError(res.msg);
        } else {
          deleteMapKey(session.session_code);
          props.clearSession();
        }
      })
    }
  }

  const startSession = () => {
    if (session) {
      socket.emit("START_SESSION", session.session_code, (res: any) => {
        console.log(res);
      })
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid
        className={classes.root}
        container
        spacing={6}
        direction="column"
        alignItems="center"
      >
        <Grid container spacing={4} direction="column" alignItems="center">
          <Grid container item xs direction="column" alignItems="center">
            <Typography variant="h4" component="h1">
              {session?.session_code}
            </Typography>
            <Typography variant="subtitle1" component="h2" color="textSecondary">
              Please wait for the session to begin
            </Typography>
          </Grid>
          <Grid container spacing={4} item xs={12}>
            <Grid item xs={4}>
              <ConsoleList
                userType={props.userType}
                console="spartan"
                users={fetchConsoleNames("spartan")}
                onJoinConsole={joinConsole}
              />
            </Grid>
            <Grid item xs={4}>
              <ConsoleList
                userType={props.userType}
                console="cronus"
                users={fetchConsoleNames("cronus")}
                onJoinConsole={joinConsole}
              />
            </Grid>
            <Grid item xs={4}>
              <ConsoleList
                userType={props.userType}
                console="ethos"
                users={fetchConsoleNames("ethos")}
                onJoinConsole={joinConsole}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} item xs={12}>
            <Grid item xs={4}>
              <ConsoleList
                userType={props.userType}
                console="flight"
                users={fetchConsoleNames("flight")}
                onJoinConsole={joinConsole}
              />
            </Grid>
            <Grid item xs={4}>
              <ConsoleList
                userType={props.userType}
                console="bme"
                users={fetchConsoleNames("bme")}
                onJoinConsole={joinConsole}
              />
            </Grid>
            <Grid item xs={4}>
              <ConsoleList
                userType={props.userType}
                console="capcom"
                users={fetchConsoleNames("capcom")}
                onJoinConsole={joinConsole}
              />
            </Grid>
          </Grid>
          { props.userType === "tutor" &&
            <Grid container spacing={4} item xs={12}>
              <Grid item xs={9}>
                <ConnectedUserList users={session!.operators} />
              </Grid>
              <Grid item xs={3}>
                <ConnectedTutorList tutors={session?.tutors as User[]} />
              </Grid>
            </Grid>
          }
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="primary" onClick={leaveSession}>
            Leave Session
          </Button>
          { props.userType === "tutor" &&
            <Button variant="contained" color="primary" onClick={startSession} className={classes.tutorButton}>
              Start Session
            </Button>
          }
        </Grid>
      </Grid>
    </Container>
  );
};

export default JoinConsoleScreen;
