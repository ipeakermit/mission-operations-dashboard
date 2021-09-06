import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useSessionTime} from "../../../util/useSessionTime";
import {DateTime} from "luxon";
import {Log} from "../../../types/log"
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import socket from "../../../util/Socket";
import {EFN} from "../../../types/efn";
import {useSessionContext} from "../../../context/SessionContext";

const useStyles = makeStyles({
    container: {
        height: "90vh",
    },
    paper: {
        padding: "20px"
    },
})

interface TutorProps {

}

const Tutor: React.FC<TutorProps> = (props) => {
    const classes = useStyles();
    const {sessionTime} = useSessionTime();
    const {session} = useSessionContext();
    const [logs, setLogs] = useState<Log[]>([])

    useEffect(() => {
        socket.off("UPDATE_LOGS").on("UPDATE_LOGS",(logs: Log[]) => {
            console.log("Logs:", logs);
            setLogs(logs);
        })
    }, [])

    useEffect(() => {
        if (session) {
            socket.emit("FETCH_LOGS", session._id, session.session_code);
        }
    }, [session])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <TableContainer style={{height: "700px", border: "1px solid #000", borderRadius: "5px"}}>
                    <Table size={"small"}>
                        <TableBody>
                            { logs && logs.length > 0 &&
                                logs.map((log, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                {DateTime.fromISO(log.createdAt, {zone: 'utc'}).setZone("Australia/Melbourne").toFormat("dd/MM HH:mm:ss")}
                                            </TableCell>
                                            <TableCell>
                                                {log.target_id ? log.target_id.name : ""}
                                            </TableCell>
                                            <TableCell>
                                                {log.message}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    )
}
export default Tutor;