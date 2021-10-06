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
            setCommentText("");
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
            <DialogContent style={{
                paddingBottom: "0px",
                textAlign: "center",
            }}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <Typography>{props.efn.sender_id.console.toUpperCase()}</Typography>
                    <Typography>{`EFN${props.index?.toString().padStart(3, '0')}`}</Typography>
                </div>
                <Divider style={{margin: "10px 0"}} />
                <Typography variant={"h5"} align={"center"} style={{ paddingBottom: "15px"}}>
                    {props.efn.subject}
                </Typography>
            </DialogContent>
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "0px",
                width: "550px",
                margin: "0 auto",
            }}>
                <Typography variant={"body1"} align={"justify"} style={{ paddingBottom: "30px"}}>
                    {props.efn.message}
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
            </DialogContent>
            <DialogContent style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "0px",
                width: "550px",
                margin: "0 auto"
            }}>
                <Typography variant={"body1"} align={"center"} style={{width: "100%"}}>
                    Comments
                </Typography>
                <Divider style={{margin: "0 0 10px 0", width: "100%"}}/>
                {
                    props.efn.comments.map((comment, index) => (
                        <React.Fragment key={index}>
                            <div style={{
                                width: "100%",
                                padding: "10px 15px",
                                margin: "5px 0",
                                borderRadius: "5px",
                                backgroundColor: "#505050",
                            }}>
                                <Typography variant={"body2"} align={"justify"}>
                                    {comment}
                                </Typography>
                            </div>
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
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={props.efn._id === ""}
                    style={{marginTop: "15px"}}
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