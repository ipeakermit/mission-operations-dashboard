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

const useStyles = makeStyles(() => ({
  container: {
    
  },
  root: {
    marginTop: "32px",
  },
}));

interface JoinConsoleScreenProps {
  userType: string;
  sessionData: Session;
  clearSession: () => void;
}

const JoinConsoleScreen: React.FC<JoinConsoleScreenProps> = (props) => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
  
  const fetchConsoleNames = (consoleName: keyof Consoles) => {
    let users = props.sessionData.consoles[consoleName] as User[];
    return [
      users[0]?.name,
      users[1]?.name,
      users[2]?.name,
    ]
  }

  const joinConsole = (console: keyof Consoles) => {
    if (props.userType === "student") {
      socket.emit("JOIN_CONSOLE", console, props.sessionData.session_code, reconnectMap.get(props.sessionData.session_code), (res: {success: boolean, msg: string}) => {
        if (!res.success) {
          setError(res.msg);
        }
      });
    }
  }

  const leaveSession = () => {
    socket.emit("LEAVE_SESSION", reconnectMap.get(props.sessionData.session_code), props.sessionData.session_code, (res: {success: boolean, msg: string}) => {
      if (!res.success) {
        setError(res.msg);
      } else {
        deleteMapKey(props.sessionData.session_code);
        props.clearSession();
      }
    })
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
              {props.sessionData.session_code}
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
                <ConnectedUserList users={props.sessionData.operators} />
              </Grid>
              <Grid item xs={3}>
                <ConnectedTutorList tutors={props.sessionData.tutors as User[]} />
              </Grid>
            </Grid>
          }
        </Grid>
        <Grid item xs>
          <Button variant="outlined" color="primary" onClick={leaveSession}>
            Leave Session
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JoinConsoleScreen;
