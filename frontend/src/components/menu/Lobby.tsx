import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import socket from 'util/Socket';
import { Session } from 'types/session';
// import { ListGroup } from 'react-bootstrap';
import { Consoles } from 'types/consoles';
import { User } from 'types/user';
import { makeStyles } from '@material-ui/core/styles';
import ConsoleList from 'components/menu/ConsoleList';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "32px"
  }
}))

interface LobbyProps {
  className?: string;
  userType: string;
  sessionData: Session;
  username: string;
}

const Lobby: React.FC<LobbyProps> = (props) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>("");
  
  const fetchConsoleNames = (console: keyof Consoles) => {
    let users = props.sessionData.consoles[console] as User[];
    return [
      users[0]?.name,
      users[1]?.name
    ]
  }
  
  const joinConsole = (console: keyof Consoles) => {
    if (props.userType === "student") {
      socket.emit("JOIN_CONSOLE", console, props.sessionData.session_code, (res: {success: boolean, msg: string}) => {
        if (!res.success) {
          setError(res.msg);
        }
      });
    }
  }

  return (
    <Grid 
      className={classes.root}
      container 
      spacing={4}
      direction="column"
      alignItems="center"
    >
      <Grid 
        container 
        item
        xs 
        direction="column" 
        alignItems="center"
      >
        <Typography 
          variant="h4" 
          component="h1"
        >
          {props.sessionData.session_code}
        </Typography>
        <Typography 
          variant="subtitle1" 
          component="h2"
          color="textSecondary"
        >
          Please wait for the session to begin
        </Typography>
      </Grid>
      <Grid 
        container 
        spacing={4}
        item 
        xs={12}
      >
        <Grid item xs={4}>
          <ConsoleList
            userType={props.userType}
            console="spartan"
            users={fetchConsoleNames('spartan')}
            onJoinConsole={joinConsole}
          />
        </Grid>
        <Grid item xs={4}>
          <ConsoleList
            userType={props.userType}
            console="cronus"
            users={fetchConsoleNames('cronus')}
            onJoinConsole={joinConsole}
          />
        </Grid>
        <Grid item xs={4}>
          <ConsoleList
            userType={props.userType}
            console="ethos"
            users={fetchConsoleNames('ethos')}
            onJoinConsole={joinConsole}
          />
        </Grid>
      </Grid>
      <Grid 
        container 
        spacing={4}
        item 
        xs={12}
      >
        <Grid item xs={4}>
          <ConsoleList
            userType={props.userType}
            console="flight"
            users={fetchConsoleNames('flight')}
            onJoinConsole={joinConsole}
          />
        </Grid>
        <Grid item xs={4}>
          <ConsoleList
            userType={props.userType}
            console="bme"
            users={fetchConsoleNames('bme')}
            onJoinConsole={joinConsole}
          />
        </Grid>
        <Grid item xs={4}>
          <ConsoleList
            userType={props.userType}
            console="capcom"
            users={fetchConsoleNames('capcom')}
            onJoinConsole={joinConsole}
          />
        </Grid>
      </Grid>
    </Grid>

    // <div className={props.className}>
    //   <Row className="mt-5 mb-4">
    //     <Col xs="auto" className="mx-auto">
    //       <h1 className="text-center mb-0">{props.sessionData.session_code}</h1>
    //       <p className="text-muted">Please wait for session to begin</p>
    //     </Col>
    //   </Row>
    //   <Row className="justify-content-center">
    //     <Col xs="auto">
    //       <ListGroup className="console-list mb-4">
    //         <ListGroup.Item 
    //           className="text-center console-list-header" 
    //           variant="dark"
    //           data-console="spartan"
    //           onClick={joinConsole}
    //         >
    //             {(props.userType === "student" ? "JOIN " : "") + "SPARTAN"}
    //         </ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("spartan", 0)}</ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("spartan", 1)}</ListGroup.Item>
    //       </ListGroup>
    //     </Col>
    //     <Col xs="auto">
    //       <ListGroup className="console-list mb-4">
    //         <ListGroup.Item 
    //           className="text-center console-list-header" 
    //           variant="dark"
    //           data-console="cronus"
    //           onClick={joinConsole}
    //         >
    //             {(props.userType === "student" ? "JOIN " : "") + "CRONUS"}
    //         </ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("cronus", 0)}</ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("cronus", 1)}</ListGroup.Item>
    //       </ListGroup>
    //     </Col>
    //     <Col xs="auto">
    //       <ListGroup className="console-list mb-4">
    //         <ListGroup.Item 
    //           className="text-center console-list-header" 
    //           variant="dark"
    //           data-console="ethos"
    //           onClick={joinConsole}
    //         >
    //             {(props.userType === "student" ? "JOIN " : "") + "ETHOS"}
    //         </ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("ethos", 0)}</ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("ethos", 1)}</ListGroup.Item>
    //       </ListGroup>
    //     </Col>
    //   </Row>
    //   <Row className="justify-content-center">
    //     <Col xs="auto">
    //       <ListGroup className="console-list mb-4">
    //         <ListGroup.Item 
    //           className="text-center console-list-header" 
    //           variant="dark"
    //           data-console="flight"
    //           onClick={joinConsole}
    //         >
    //             {(props.userType === "student" ? "JOIN " : "") + "FLIGHT"}
    //         </ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("flight", 0)}</ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("flight", 1)}</ListGroup.Item>
    //       </ListGroup>
    //     </Col>
    //     <Col xs="auto">
    //       <ListGroup className="console-list mb-4">
    //         <ListGroup.Item 
    //           className="text-center console-list-header" 
    //           variant="dark"
    //           data-console="capcom"
    //           onClick={joinConsole}
    //         >
    //             {(props.userType === "student" ? "JOIN " : "") + "CAPCOM"}
    //         </ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("capcom", 0)}</ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("capcom", 1)}</ListGroup.Item>
    //       </ListGroup>
    //     </Col>
    //     <Col xs="auto">
    //       <ListGroup className="console-list mb-4">
    //         <ListGroup.Item 
    //           className="text-center console-list-header" 
    //           variant="dark"
    //           data-console="bme"
    //           onClick={joinConsole}
    //         >
    //             {(props.userType === "student" ? "JOIN " : "") + "BME"}
    //         </ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("bme", 0)}</ListGroup.Item>
    //         <ListGroup.Item>{fetchConsoleName("bme", 1)}</ListGroup.Item>
    //       </ListGroup>
    //     </Col>
    //   </Row>
    // </div>
  )
}

export default Lobby;