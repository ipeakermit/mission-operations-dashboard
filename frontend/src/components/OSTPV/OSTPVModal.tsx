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
import { Event } from '../../types/event';
import Typography from "@material-ui/core/Typography";
import {DateTime} from "luxon";
import {Autocomplete} from "@material-ui/lab";
import socket from "../../util/Socket";
import {useSessionContext} from "../../context/SessionContext";
import {useLocalStorageMap} from "../../util/useLocalStorageMap";

const useStyles = makeStyles(() => ({

}))

const options: string[] = [
    'scheduled',
    'completed',
    'sequenced1',
    'sequenced2',
    'sequenced3',
    'active',
]

interface OSTPVModalProps {
    event: Event | null;
    open: boolean;
    handleClose: () => void;
}

const OSTPVModal: React.FC<OSTPVModalProps> = (props) => {
    const classes = useStyles();
    const {session, userID } = useSessionContext();

    const handleChange = (event: React.ChangeEvent<{value: unknown }>) => {
        if (session && userID && props.event) {
            let newStatus = event.target.value as string;
            socket.emit("UPDATE_EVENT_STATUS", userID, props.event.id, session._id, newStatus, session.session_code);
        }
    }

    if (!props.event) {
        return null
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle style={{ paddingBottom: "0px", textAlign: "center"}}>
                {`${props.event.extendedProps.astronaut} - ${props.event.title.substring(2)}`}
            </DialogTitle>
            <DialogContent style={{ paddingTop: "0px", width: "300px"}}>
                <Typography variant={"subtitle2"} align={"center"} style={{ paddingBottom: "15px"}}>
                    {`
                        ${DateTime.fromJSDate(props.event.start, {zone: 'utc'}).toFormat("ooo/HH:mm")}
                        -
                        ${DateTime.fromJSDate(props.event.end, {zone: 'utc'}).toFormat("ooo/HH:mm")}
                    `}
                </Typography>
                <Typography variant={"body1"} align={"center"}>
                    Procedure: {props.event.extendedProps.procedure ? props.event.extendedProps.procedure : "None"}
                </Typography>
                <Typography variant={"body1"} align={"center"} style={{ paddingBottom: "15px"}}>
                    Location: {props.event.extendedProps.location ? props.event.extendedProps.location : "N/A"}
                </Typography>
                <form>
                    <FormControl variant={"outlined"}>
                        <InputLabel id={"event-status-select-label"}>Event Status</InputLabel>
                        <Select
                            labelId={"event-status-select-label"}
                            id={"event-status-select"}
                            value={props.event.classNames.filter((cn) => cn !== "time-critical")[0]}
                            onChange={handleChange}
                            label={"Event Status"}
                            style={{width: "250px", marginBottom: "15px"}}
                        >
                            <MenuItem value={"scheduled"}>Scheduled</MenuItem>
                            <MenuItem value={"completed"}>Completed</MenuItem>
                            <MenuItem value={"sequenced1"}>Sequenced 1</MenuItem>
                            <MenuItem value={"sequenced2"}>Sequenced 2</MenuItem>
                            <MenuItem value={"sequenced3"}>Sequenced 3</MenuItem>
                            <MenuItem value={"active"}>Active</MenuItem>
                        </Select>
                    </FormControl>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default OSTPVModal;