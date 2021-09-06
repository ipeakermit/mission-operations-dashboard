import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useSessionContext} from '../../../context/SessionContext'
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {Field, Form, Formik} from "formik";
import Alert from "@material-ui/lab/Alert";
import {TextField} from "formik-material-ui";
import Button from "@material-ui/core/Button";
import socket from "../../../util/Socket";
import {useLocalStorageMap} from "../../../util/useLocalStorageMap";
import {useSessionTime} from "../../../util/useSessionTime";

const useStyles = makeStyles({
    paper: {

    },
    form: {

    },
    button: {

    },
    error: {

    }
})

interface FlightInboxProps {
    open: boolean;
    handleClose: () => void;
}

const initialValues = {subject: "", message: ""};

const FlightInbox: React.FC<FlightInboxProps> = (props) => {
    const classes = useStyles();
    const {session} = useSessionContext();
    const {sessionTime} = useSessionTime();
    const [ reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
    const [error, setError] = useState<string>("");

    const handleSubmission = (values: typeof initialValues) => {
        if (session && sessionTime) {
            const newEFN = {
                session_code: session.session_code,
                sender: reconnectMap.get(session.session_code),
                subject: values.subject,
                message: values.message,
                status: "open",
                createdAt: sessionTime.toMillis(),
                comments: []
            }
            socket.emit("NEW_EFN", newEFN, (res: any) => {
                console.log(res);
            })
            props.handleClose();
        }
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true}>
            <DialogTitle id={"efn-dialog-title"}>Submit EFN</DialogTitle>
            <Formik
                initialValues={initialValues}
                onSubmit={(values, { setSubmitting}) => {
                    handleSubmission(values);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className={classes.form}>
                        <DialogContent>
                            {error && (
                                <Alert severity="error" className={classes.error}>
                                    {error}
                                </Alert>
                            )}
                            <Field
                                name="subject"
                                label="Subject"
                                margin="normal"
                                variant="outlined"
                                required
                                fullWidth
                                component={TextField}
                            />
                            <Field
                                name="message"
                                label="Message"
                                margin="normal"
                                variant="outlined"
                                required
                                fullWidth
                                multiline
                                rows={5}
                                component={TextField}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={props.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" variant="contained">
                                Submit EFN
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default FlightInbox;