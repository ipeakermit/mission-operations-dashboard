import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useSessionContext} from '../../../context/SessionContext'
import Typography from "@material-ui/core/Typography";
import {EFN} from '../../../types/efn'
import socket from "../../../util/Socket";
import {DateTime} from "luxon";
import Button from "@material-ui/core/Button";
import {useSessionTime} from "../../../util/useSessionTime";
import {Session} from "../../../types/session";
import {User} from "../../../types/user";
import {Consoles} from "../../../types/consoles";
import EFNModal from "./EFNModal";

const useStyles = makeStyles({
    container: {
        height: "90vh",
    },
    paper: {
        padding: "20px"
    },
    time: {
        textAlign: "end"
    },
    btnCell: {
        width: "160px",
    }
})

interface FlightInboxProps {

}

const initialEFN = [{
    _id: "",
    session_id: {
        _id: "",
        host_id: "",
        session_code: "",
        tutors: [],
        operators: [],
        consoles: {spartan: [], cronus: [], ethos: [], flight: [], capcom: [], bme: []},
        in_progress: true,
        start_time: "",
        _v: 0,
    },
    sender_id: {
        _id: "",
        name: "Mission Manager",
        room: "",
        console: "",
        disconnected: false,
    },
    subject: "Expedition 61 EVA 4 began at 6:50 EST (10:50 GMT)",
    message: "First of a series of four spacewalks to repair the Alpha Magnetic Spectrometer which suffered a power failure last year in one of its four cooling pumps limiting the operation of the experiment.",
    status: "open",
    createdAt: "1573815000000",
    updatedAt: "",
    comments: [],
    _v: 0,
}]

const FlightInbox: React.FC<FlightInboxProps> = (props) => {
    const classes = useStyles();
    const {session} = useSessionContext();
    const {sessionTime} = useSessionTime();
    const [EFNs, setEFNs] = useState<EFN[]>([...initialEFN]);
    const [selectedEFN, setSelectedEFN] = useState<number | null>(null);
    const [viewEFNDialog, setViewEFNDialog] = useState<boolean>(false);

    useEffect(() => {
        socket.off("UPDATE_EFNS").on("UPDATE_EFNS",(efns: EFN[]) => {
            setEFNs([...initialEFN ,...efns]);
        })
    }, [])

    const openDetailsDialog = (efn_index: number) => {
        setSelectedEFN(efn_index);
        setViewEFNDialog(true);
    }
    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <div style={{height: "700px"}}>
                    <Typography className={classes.time} variant={"h6"}>{sessionTime?.toFormat("ooo/HH:mm:ss")} GMT</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>EFN ID</TableCell>
                                    <TableCell>Sender</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell align={"center"}>View Content</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {EFNs.map((efn, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{width: "100px"}}>
                                            {`EFN${index.toString().padStart(3, '0')}`}
                                        </TableCell>
                                        <TableCell style={{width: "300px"}}>
                                            {efn.sender_id.name}
                                        </TableCell>
                                        <TableCell>
                                            {efn.subject}
                                        </TableCell>
                                        <TableCell style={{width: "150px"}}>
                                            {efn.status.toUpperCase()}
                                        </TableCell>
                                        <TableCell style={{width: "150px"}}>
                                            {DateTime.fromMillis(parseInt(efn.createdAt), { zone: 'utc'}).toFormat("ooo/HH:mm:ss")}
                                        </TableCell>
                                        <TableCell className={classes.btnCell}>
                                            <Button
                                                variant="outlined"
                                                color={"primary"}
                                                onClick={() => openDetailsDialog(index)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Paper>
            <EFNModal
                index={selectedEFN}
                efn={selectedEFN !== null ? EFNs[selectedEFN] : null}
                open={selectedEFN !== null}
                handleClose={() => setSelectedEFN(null)}
            />
        </Container>
    )
}
export default FlightInbox;