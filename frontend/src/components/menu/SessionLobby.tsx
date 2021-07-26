import React, {useState, useEffect} from 'react';
import socket from 'util/Socket';
import { Session } from 'types/session';
import { useHistory, useParams } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import { useLocalStorageMap } from 'util/useLocalStorageMap';
import JoinUsernameForm from './JoinUsernameForm';
import JoinConsoleScreen from './JoinConsoleScreen';

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
  const [ reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
  const [sessionData, setSessionData] = useState<Session | null>(null);

  const clearSessionData = () => {
    setSessionData(null);
  }

  // Handle receiving session data update events
  useEffect(() => {
    console.log(socket.id);
    socket.off("SESSION_DATA").on("SESSION_DATA", setSessionData)
    socket.io.off("reconnect").on("reconnect", (attempt: number) => {
      if (reconnectMap.has(sessioncode)) {
        socket.emit("RECONNECT_USER", reconnectMap.get(sessioncode), sessioncode, (res: { success: boolean, msg: string }) => {
          console.log(res.success, res.msg)
        });
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
          socket.emit("RECONNECT_USER", userID, sessioncode, (res: { success: boolean, msg: string }) => {
            console.log(res.success, res.msg)
          });
        } else {
          console.log("No reconnect")
        }
      }
    })
  }, [sessioncode, history, props.userType, reconnectMap])
  
  return (  
    <React.Fragment>
      { !sessionData &&
        <JoinUsernameForm sessionCode={sessioncode} userType={props.userType} />
      }
      {
        sessionData &&
        <JoinConsoleScreen userType={props.userType} sessionData={sessionData} clearSession={clearSessionData}/>
      }
    </React.Fragment>
  )
}

export default SessionLobby;