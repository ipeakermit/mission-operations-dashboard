import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { Consoles } from 'types/consoles';

const useStyles = makeStyles(() => ({
  listitem: {
    minHeight: "24px",
  },
  header: {
    backgroundColor: "#C5C7C9",
    textAlign: "center"
  }
}))

interface ConsoleListProps {
  userType: string;
  console: keyof Consoles;
  users: string[];
  onJoinConsole: (console: keyof Consoles) => void;
}

const ConsoleList: React.FC<ConsoleListProps> = (props) => {
  const classes = useStyles();

  return (
    <Paper variant="outlined">
      <List aria-label={`${props.console} list`} disablePadding>
        <ListItem 
          className={classes.header} 
          button 
          divider
          disabled={props.userType === "student" ? false : true}
          onClick={() => props.onJoinConsole(props.console)}
        >
          <ListItemText>
            {(props.userType === "student" ? "JOIN " : "") + props.console.toUpperCase()}
          </ListItemText>
        </ListItem>
        <ListItem divider>
          <ListItemText className={classes.listitem}>{props.users[0]}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText className={classes.listitem}>{props.users[1]}</ListItemText>
        </ListItem>
      </List>
    </Paper>

    // <ListGroup className="console-list mb-4">
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
  )
}

export default ConsoleList;