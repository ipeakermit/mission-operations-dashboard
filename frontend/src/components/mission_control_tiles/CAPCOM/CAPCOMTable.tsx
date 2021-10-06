import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {useSessionTime} from "../../../util/useSessionTime";
import {DateTime} from "luxon";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles({
    tableCell: {
        paddingTop: 1,
        paddingBottom: 1,
        color: "black"
    }
})

interface CAPCOMTableProps {

}

const tableEntries = [
    {eventNum: "12", annun: "ENA", cl: "C", ack: false, sys: "EPS", message: "RPCM LF_A Trip - LAB", time: '2019-11-15T15:04:00'},
    {eventNum: "257", annun: "ENA", cl: "C", ack: false, sys: "CDH", message: "TLM System Off - FGB", time: '2019-11-15T15:10:16'},
    {eventNum: "412", annun: "ENA", cl: "C", ack: false, sys: "CHCS", message: "EMU Bio TLM BP Anomaly", time: '2019-11-15T15:15:35'},
    {eventNum: "37", annun: "ENA", cl: "C", ack: false, sys: "ECL", message: "Smoke Detector 1 Fail - NOD1", time: '2019-11-15T15:21:06'},
    {eventNum: "7", annun: "ENA", cl: "C", ack: false, sys: "CDH", message: "MDM N1-1 Detected RT Fail MDM N1-2 - PMA1", time: '2019-11-15T15:26:48'},
    {eventNum: "170", annun: "ENA", cl: "C", ack: false, sys: "EPS", message: "FGB Power Utilization Violation - Load Shed Initiated - NOD1", time: '2019-11-15T15:31:10'},
    {eventNum: "139", annun: "ENA", cl: "C", ack: false, sys: "CHCS", message: "EMU Batt Diagnostic Cycle Overdue - EVA1", time: '2019-11-15T15:37:24'},
    {eventNum: "13535", annun: "ENA", cl: "W", ack: false, sys: "TCS", message: "Cooling Loop Delta Pressure Sensor 2 Low - COL", time: '2019-11-15T15:44:14'},
    {eventNum: "9", annun: "ENA", cl: "C", ack: false, sys: "CDH", message: "MDM N1-1 User Bus Orb N1-1 Fail - NOD1", time: '2019-11-15T15:50:43'},
    {eventNum: "20", annun: "ENA", cl: "C", ack: false, sys: "EPS", message: "RPCM N14B_A Loss of Comm - NOD1", time: '2019-11-15T15:56:18'},
    {eventNum: "83", annun: "ENA", cl: "C", ack: false, sys: "CHCS", message: "Delta Press Increase Hi - EVA1/2", time: '2019-11-15T16:01:05'},
    {eventNum: "27", annun: "ENA", cl: "C", ack: false, sys: "ECL", message: "IMV Aft Port Fan Fail Low - NOD1", time: '2019-11-15T16:10:22'}
]

const CAPCOMTable: React.FC<CAPCOMTableProps> = (props) => {
    const classes = useStyles();
    const {sessionTime} = useSessionTime();

    return (
        <TableContainer>
            <Table size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell>EVENT #</TableCell>
                        <TableCell>ANNUN</TableCell>
                        <TableCell>CL</TableCell>
                        <TableCell>ACK</TableCell>
                        <TableCell>SYS</TableCell>
                        <TableCell>C&W MESSAGE TEXT</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        tableEntries.filter((entry) => sessionTime >= DateTime.fromISO(entry.time, {zone: 'utc'}))
                            .map((entry, index) => (
                                <TableRow key={index} style={{backgroundColor: entry.cl === "W" ? "#F86868" : "#fcea5d"}}>
                                    <TableCell className={classes.tableCell}>
                                        {entry.eventNum}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {entry.annun}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {entry.cl}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {entry.ack ? "X" : ""}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {entry.sys}
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        {entry.message}
                                    </TableCell>
                                </TableRow>
                            ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}
export default CAPCOMTable;