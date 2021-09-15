import React, {useState} from 'react';
import { useHistory } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field} from 'formik';
import { TextField } from 'formik-material-ui';
import socket from 'util/Socket';
import { useLocalStorageMap } from 'util/useLocalStorageMap';
import {useSessionContext} from "../../context/SessionContext";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
  gridRoot: {
    height: "100%",
  },
  paper: {
    width: "550px",
    padding: "30px"
  },
  textSize: {
    fontSize: "30px"
  },
  form: {
    width: "100%",
  },
  error: {

  },
  joinBtn: {
    marginTop: "12px",
    padding: "10px"
  },
  createBtn: {
    marginTop: "8px",
    padding: "10px"
  },
  divider: {
    width: "100%",
    marginTop: "8px"
  }
}))

interface JoinUsernameFormValues {
  username: string,
}

const initialValues = {username: ""};

interface JoinUsernameFormProps {
  sessionCode: string,
  userType: string;
}

const JoinUsernameForm: React.FC<JoinUsernameFormProps> = (props) => {  
  const classes = useStyles();
  const history = useHistory();
  const [ reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
  const { session, setSession, userID, setUserID } = useSessionContext();
  const [error, setError] = useState<string>("");

  const handleJoinSession = ( values: JoinUsernameFormValues ) => {
    // Make Socket.IO call to see if room exists
    if (props.userType === "student") {
      socket.emit('JOIN_SESSION', props.sessionCode, values.username, (res: {success: boolean, msg: string, data: {userID: string}}) => {
        console.log(res);
        if (!res.success) setError(res.msg);
        else {
          setError("")
          addMapKey(props.sessionCode, res.data.userID)
          setUserID(res.data.userID);
        };
      })
    } else if (props.userType === "tutor") {
      socket.emit('TUTOR_JOIN_SESSION', props.sessionCode, values.username, (res: {success: boolean, msg: string, data: {userID: string}}) => {
        if (!res.success) setError(res.msg);
        else {
          setError("")
          addMapKey(props.sessionCode, res.data.userID)
          setUserID(res.data.userID);
        };
      })
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid 
        className={classes.gridRoot}
        container
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Paper className={classes.paper}>
          <Grid 
            className={classes.gridRoot}
            container
          >
            <Grid container item xs={12}>
              <Grid item xs={1}>
                <IconButton onClick={() => history.push("/" + (props.userType === "tutor" ? "tutor" : ""))}>
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography
                  align="center"
                  variant="h4" 
                  component="h1"
                  gutterBottom
                >
                  Join session <strong>{props.sessionCode}</strong>
                </Typography>
              </Grid>
              <Grid item xs={1}></Grid>
            </Grid>
            <Grid item xs={12}>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting}) => {
                  handleJoinSession(values);
                  setSubmitting(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className={classes.form}>
                    {error && (
                      <Alert severity="error" className={classes.error}>
                        {error}
                      </Alert>
                    )}
                    <Field
                      name="username"
                      label="Username"
                      margin="normal"
                      variant="outlined"
                      required
                      fullWidth
                      component={TextField}
                    />
                    <Button
                      className={classes.joinBtn}
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Join Session
                    </Button>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Container>
  )
}

export default JoinUsernameForm;