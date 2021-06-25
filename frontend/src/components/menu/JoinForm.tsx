import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, Field} from 'formik';
import { TextField } from 'formik-material-ui';
import socket from 'util/Socket';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: "32px"
  },
  form: {
    width: "100%",
  },
  error: {

  },
  joinBtn: {
    marginTop: "12px"
  },
  createBtn: {
    marginTop: "8px"
  },
  divider: {
    width: "100%",
    marginTop: "8px"
  }
}))

interface JoinFormValues {
  sessionCode: string,
  username: string
}

const initialValues = {sessionCode: "", username: ""};

interface JoinFormProps {
  userType: string;
}

const JoinForm: React.FC<JoinFormProps> = (props) => {  
  const classes = useStyles();
  const [error, setError] = useState<string>("");

  const handleJoinSession = ( values: JoinFormValues ) => {
    // Make Socket.IO call to attempt to join room
    if (props.userType === "student") {
      socket.emit("JOIN_SESSION", values.sessionCode, values.username, (res: {success: boolean, msg: string}) => {
        if (!res.success) setError(res.msg);
        else setError("");
      })
    } else if (props.userType === "tutor") {
      socket.emit("TUTOR_JOIN_SESSION", values.sessionCode, values.username, (res: {success: boolean, msg: string}) => {
        if (!res.success) setError(res.msg);
        else setError("");
      })
    }
  }

  const handleCreateSession = () => {
    socket.emit("CREATE_SESSION", (res: {success: boolean, msg: string}) => {
      if (!res.success) {
        if (!res.success) setError(res.msg);
        else setError("");
      }
    })
  }

  return (
    <React.Fragment>
      <Grid
        className={classes.root} 
        container
        spacing={1}
        direction="column"
        alignItems="center"
      >
        <Grid item xs>
          <Typography 
            variant="h4" 
            component="h1"
          >
            Join a Mission Control Center
          </Typography>
        </Grid>
        <Grid item xs={4}>
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
                />
                <Field
                  name="username"
                  label="Username"
                  margin="dense"
                  size="small"
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
        {props.userType === "tutor" &&
          <React.Fragment>
            <Grid container item xs={4}>
              <Divider className={classes.divider} />
            </Grid>
            <Grid container item xs={4}>
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
    </React.Fragment>
  )
}

export default JoinForm;