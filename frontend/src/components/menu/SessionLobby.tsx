import React, {useState, useEffect} from 'react';
import socket from 'util/Socket';
import { Session } from 'types/session';
import { useSessionContext } from "../../context/SessionContext";
import { useHistory, useParams } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import { useLocalStorageMap } from 'util/useLocalStorageMap';
import JoinUsernameForm from './JoinUsernameForm';
import JoinConsoleScreen from './JoinConsoleScreen';
import SessionInterface from "../mission_control_tiles/SessionInterface";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "32px"
  }
}))

interface SessionLobbyParams {
  sessioncode: string;
}

interface SessionLobbyProps {
  userType: string;
}

const SessionLobby: React.FC<SessionLobbyProps> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { sessioncode } = useParams<SessionLobbyParams>();
  const { session, setSession, userID, setUserID } = useSessionContext();
  const [ reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());

  const clearSessionData = () => {
    setSession(null);
    setUserID(null);
  }

  // Handle receiving session data update events
  useEffect(() => {
    socket.off("SESSION_DATA").on("SESSION_DATA", (sessionData: Session) => {
      setSession(sessionData);
    })
    socket.io.off("reconnect").on("reconnect", (attempt: number) => {
      if (reconnectMap.has(sessioncode)) {
        if (props.userType === "tutor") {
          socket.emit("RECONNECT_TUTOR", reconnectMap.get(sessioncode), sessioncode, (res: { success: boolean, msg: string }) => {
            console.log(res.success, res.msg)
            setUserID(reconnectMap.get(sessioncode));
          });
        } else {
          socket.emit("RECONNECT_USER", reconnectMap.get(sessioncode), sessioncode, (res: { success: boolean, msg: string }) => {
            console.log(res.success, res.msg)
            setUserID(reconnectMap.get(sessioncode));
          });
        }
      }
    })
  }, [reconnectMap, sessioncode])

  // Handle redirecting for invalid session codes
  useEffect(() => {
    // Make Socket.IO call to see if room exists
    socket.emit("CHECK_SESSION_CODE", sessioncode, (res: {success: boolean, msg: string, data: {session: Session}}) => {
      // If the session is not found in the database, redirect the user to session code entry
      if (!res.success) {
        if (props.userType === "student") {
          history.push(`/`);
        } else if (props.userType === "tutor") {
          history.push(`/tutor/`);
        }
      } else {
        // If the session is found, check if the user already has a socket id for it in localstorage
        if (reconnectMap.has(sessioncode)) {
          let userID = reconnectMap.get(sessioncode);
          if (props.userType === "tutor") {
            socket.emit("RECONNECT_TUTOR", userID, sessioncode, (res: { success: boolean, msg: string }) => {
              console.log(res.success, res.msg)
            });
          } else {
            socket.emit("RECONNECT_USER", userID, sessioncode, (res: { success: boolean, msg: string }) => {
              console.log(res.success, res.msg)
            });
          }
        } else {
          console.log("No reconnect")
        }
      }
    })
  }, [sessioncode, history, props.userType, reconnectMap])
  
  return (  
    <React.Fragment>
      { !session &&
        <JoinUsernameForm sessionCode={sessioncode} userType={props.userType} />
      }
      {
        session && !session.in_progress &&
        <JoinConsoleScreen userType={props.userType} clearSession={clearSessionData}/>
      }
      {
        session && session.in_progress &&
        <SessionInterface userType={props.userType}/>
      }
    </React.Fragment>
  )
}
export default SessionLobby;