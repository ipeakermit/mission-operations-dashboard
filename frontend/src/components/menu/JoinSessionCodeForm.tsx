import React, {useState} from 'react';
import { useHistory } from 'react-router';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field} from 'formik';
import { TextField } from 'formik-material-ui';
import socket from 'util/Socket';
import {useLocalStorageMap} from "../../util/useLocalStorageMap";
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

interface JoinSessionCodeFormValues {
  sessionCode: string,
}

const initialValues = {sessionCode: ""};

interface JoinSessionCodeFormProps {
  userType: string;
}

const JoinSessionCodeForm: React.FC<JoinSessionCodeFormProps> = (props) => {  
  const classes = useStyles();
  const history = useHistory();
  const [ reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
  const { session, setSession, userID, setUserID } = useSessionContext();

  const [error, setError] = useState<string>("");

  const handleJoinSession = ( values: JoinSessionCodeFormValues ) => {
    // Make Socket.IO call to see if room exists
    socket.emit("CHECK_SESSION_CODE", values.sessionCode, (res: {success: boolean, msg: string}) => {
      if (!res.success) setError(res.msg);
      else {
        setError("");
        if (props.userType === "student") {
          history.push(`/${values.sessionCode}`);
        } else if (props.userType === "tutor") {
          history.push(`/tutor/${values.sessionCode}`);
        }
      }
    })
  }

  const handleCreateSession = () => {
    socket.emit("CREATE_SESSION", (res: {success: boolean, msg: string, data: {sessionCode: string, userID: string} }) => {
      console.log(res);
      if (!res.success) setError(res.msg);
      else {
        // Redirect user to the lobby of newly created session
        console.log(res.data.sessionCode);
        setError("");
        addMapKey(res.data.sessionCode, res.data.userID)
        setUserID(res.data.userID);
        history.push(`/tutor/${res.data.sessionCode}`)
      }
    })
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
            <Grid item xs={12}>
              <Typography
                align="center"
                variant="h4" 
                component="h1"
                gutterBottom
              >
                Join a Mission Control Center
              </Typography>
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
                      name="sessionCode"
                      label="Session Code"
                      margin="normal"
                      variant="outlined"
                      maxLength="6"
                      required
                      fullWidth
                      component={TextField}
                      InputProps={{
                        classes: {
                          input: classes.textSize,
                        }
                      }}
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
            {props.userType === "tutor" &&
              <React.Fragment>
                <Grid container item xs={12}>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid container item xs={12}>
                  <Button
                    className={classes.createBtn}
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleCreateSession}
                    fullWidth
                  >
                    Host Session
                  </Button>
                </Grid>
              </React.Fragment>
            }
          </Grid>
        </Paper>
      </Grid>
    </Container>
  )
}

export default JoinSessionCodeForm;