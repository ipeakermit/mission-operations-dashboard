import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, InputLabel, MenuItem,
    Paper,
    Select,
    TextField
} from "@material-ui/core";
import { Event } from '../../../types/event';
import Typography from "@material-ui/core/Typography";
import {DateTime} from "luxon";
import socket from "../../../util/Socket";
import {useSessionContext} from "../../../context/SessionContext";
import {EFN} from "../../../types/efn";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(() => ({

}))

interface EFNModalProps {
    index: number | null;
    efn: EFN | null;
    open: boolean;
    handleClose: () => void;
}

const EFNModal: React.FC<EFNModalProps> = (props) => {
    const classes = useStyles();
    const {session, userID } = useSessionContext();
    const [commentText, setCommentText] = useState<string>();

    const handleChange = (event: React.ChangeEvent<{value: unknown }>) => {
        if (session && userID && props.efn) {
            let newStatus = event.target.value as string;
            socket.emit("UPDATE_EFN_STATUS", userID, props.efn._id, session._id, newStatus, session.session_code);
        }
    }

    const handleSubmitComment = () => {
        if (session && userID && props.efn) {
            socket.emit("ADD_EFN_COMMENT", userID, props.efn._id, session._id, commentText, session.session_code);
        }
    }

    const closeModal = () => {
        setCommentText("");
        props.handleClose();
    }

    if (props.efn === null) {
        return null
    }

    return (
        <Dialog open={props.open} onClose={closeModal}>
            <DialogTitle style={{ paddingBottom: "0px", textAlign: "center"}}>
                {`${props.efn.sender_id.name.toUpperCase()}`}
                <br/>
                {`${props.efn.subject}`}
            </DialogTitle>
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "0px",
                width: "550px",
                margin: "0 auto"
            }}>
                <Typography variant={"subtitle2"} align={"center"} style={{ paddingBottom: "15px"}}>
                    {`EFN${props.index?.toString().padStart(3, '0')}`}
                </Typography>
                <FormControl variant={"outlined"}>
                    <InputLabel id={"efn-select-label"}>Event Status</InputLabel>
                    <Select
                        labelId={"efn-select-label"}
                        id={"efn-select"}
                        value={props.efn.status}
                        onChange={handleChange}
                        label={"Event Status"}
                        style={{width: "250px", marginBottom: "15px"}}
                        disabled={props.efn._id === ""}
                    >
                        <MenuItem value={"open"}>Open</MenuItem>
                        <MenuItem value={"closed"}>Closed</MenuItem>
                        <MenuItem value={"safety-issue"}>Safety Issue</MenuItem>
                        <MenuItem value={"info-only"}>Info Only</MenuItem>
                        <MenuItem value={"approved"}>Approved</MenuItem>
                    </Select>
                </FormControl>
                <Typography variant={"body1"} align={"justify"} style={{ paddingBottom: "15px"}}>
                    {props.efn.message}
                </Typography>
                <Divider light style={{width: "100%", marginBottom: "20px"}}/>
                {
                    props.efn.comments.map((comment, index) => (
                        <React.Fragment key={index}>
                            <Typography variant={"body2"} align={"justify"} gutterBottom >
                                {comment}
                            </Typography>
                            <Divider light style={{width: "100%", marginBottom: "20px"}}/>
                        </React.Fragment>
                    ))
                }
                <TextField
                    name={"efn-comment-box"}
                    fullWidth
                    label={"Add a comment..."}
                    variant={"outlined"}
                    rows={3}
                    multiline
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={props.efn._id === ""}
                />
                <Button
                    color={"primary"}
                    onClick={handleSubmitComment}
                    disabled={props.efn._id === ""}
                >Add Comment</Button>
            </DialogContent>
        </Dialog>
    )
}
export default EFNModal;