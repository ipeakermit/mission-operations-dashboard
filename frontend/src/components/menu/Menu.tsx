import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import socket from 'util/Socket';
import { Session } from 'types/session';
import JoinForm from './JoinForm';
import Lobby from './Lobby';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({

}))

interface MenuProps {
  className?: string;
  userType: string;
}

const Menu: React.FC<MenuProps> = (props) => {
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    socket.off("SESSION_DATA").on("SESSION_DATA", (data: Session) => {
      console.log("Session data updated", data);
      sessionStorage.setItem('socket_id', socket.id);
      sessionStorage.setItem('session_code', data.session_code);
      setSessionData(data);
    })
  }, [])
  

  return (
    <Container maxWidth="lg">
      {/* If there is no session code in session storage, display the join form */}
      { !sessionStorage.getItem('session_code') && !sessionData && 
        <JoinForm userType={props.userType} />
      }

      {/* If there is a session code in storage, display the lobby */}
      { sessionStorage.getItem('session_code') && sessionData &&
        <Lobby
          userType={props.userType}
          sessionData={sessionData}
          username={username}
        />
      }
    </Container>
  )
}

const StyledMenu = styled(Menu)``;

export default StyledMenu;