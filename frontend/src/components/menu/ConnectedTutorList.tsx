import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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
  tutors: User[];
}

const ConnectedUserList: React.FC<ConnectedUserListProps> = (props) => {
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="body2" className={classes.heading} align="center">CONNECTED TUTORS</Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <List dense>
            { props.tutors.map((tutor, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  {tutor.disconnected ?
                    <SignalWifiOffIcon /> :
                    <CheckCircleIcon />
                  }
                </ListItemIcon>
                <ListItemText className={classes.ellipsis}>{tutor.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ConnectedUserList;