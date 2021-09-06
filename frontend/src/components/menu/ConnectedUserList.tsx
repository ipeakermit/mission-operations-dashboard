import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff';
import { makeStyles } from '@material-ui/core/styles';
import { User } from 'types/user';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  paper: {
    height: "100%"
  },
  heading: {
    padding: "10px"
  },
  ellipsis: {
    "& span": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }
  }
}))

interface ConnectedUserListProps {
  users: User[];
}

const ConnectedUserList: React.FC<ConnectedUserListProps> = (props) => {
  const classes = useStyles();

  const interleaveArray = (users: User[], offset: number) => {
    return users.filter((_u, idx) => (idx - offset) % 3 === 0).map((user, idx) => (
      <ListItem key={idx}>
        <ListItemIcon>
          {user.disconnected ?
            <SignalWifiOffIcon /> :
            (
              user.console ?
              <CheckCircleIcon /> :
              <RadioButtonUncheckedIcon />
            )
          }
        </ListItemIcon>
        <ListItemText className={classes.ellipsis}>{user.name}</ListItemText>
      </ListItem>
    ))
  }

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="body2" className={classes.heading} align="center">CONNECTED STUDENTS</Typography>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <List dense>
            { interleaveArray(props.users, 0) }
          </List>
        </Grid>
        <Grid item xs={4}>
          <List dense>
            { interleaveArray(props.users, 1) }
          </List>
        </Grid>
        <Grid item xs={4}>
          <List dense>
            { interleaveArray(props.users, 2) }
          </List>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ConnectedUserList;