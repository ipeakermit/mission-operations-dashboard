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
    {eventNum: "9413", annun: "SUPP", cl: "C", ack: false, sys: "TCS", message: "Thermal Safing Load Shed Inhibited - LAB", time: '2019-11-15T15:04:00'},
    {eventNum: "12288", annun: "SUPP", cl: "C", ack: false, sys: "TCS", message: "Thermal Thermal Safing Node 2 LTL Load Shed Timer Started - Node2", time: '2019-11-15T15:07:02'},
    {eventNum: "13463", annun: "SUPP", cl: "C", ack: false, sys: "CDH", message: "DMS Mission Management Computer (MMC) Failure - COL", time: '2019-11-15T15:11:04'},
    {eventNum: "13598", annun: "ENA", cl: "C", ack: false, sys: "EPS", message: "Power Distribution Unit (PDU2) Output Overcurrent Trip - COL", time: '2019-11-15T15:14:06'},
    {eventNum: "13568", annun: "SUPP", cl: "C", ack: false, sys: "CDH", message: "DMS System Bus Failure - COL", time: '2019-11-15T15:20:08'},
    {eventNum: "13578", annun: "ENA", cl: "C", ack: false, sys: "EPS", message: "Power Distribution Unit (PDU1) Nominal Controller Failure - COL", time: '2019-11-15T15:23:10'},
    {eventNum: "12592", annun: "SUPP", cl: "C", ack: false, sys: "ECL", message: "Cabin Smoke Detector 2 Fail - COL", time: '2019-11-15T15:31:12'},
    {eventNum: "5049", annun: "SUPP", cl: "C", ack: false, sys: "TCS", message: "Thermal Saffing Partial LTL Load Shed Timer Started", time: '2019-11-15T15:37:14'},
    {eventNum: "5050", annun: "SUPP", cl: "C", ack: false, sys: "TCS", message: "Thermal Saffing Partial MTL Load Shed Timer Started", time: '2019-11-15T15:40:16'},
    {eventNum: "13529", annun: "SUPP", cl: "C", ack: false, sys: "ECL", message: "ppO2 Sensor 2 Low - COL", time: '2019-11-15T15:47:18'},
    {eventNum: "13558", annun: "SUPP", cl: "C", ack: false, sys: "ECL", message: "Loss of IMV Supply Function - COL", time: '2019-11-15T15:51:20'},
    {eventNum: "4173", annun: "ENA", cl: "C", ack: false, sys: "TCS", message: "ETCS Loop B PCVP Loss of Comm - P1", time: '2019-11-15T15:58:22'},
    {eventNum: "13535", annun: "SUPP", cl: "W", ack: false, sys: "TCS", message: "Cooling Loop Delta Pressure Sensor 2 Low - COL", time: '2019-11-15T16:02:24'},
    {eventNum: "10472", annun: "ENA", cl: "C", ack: true, sys: "TCS", message: "ETCS Loop B Radiator Environment Temp Too Cold - P1", time: '2019-11-15T16:10:26'},
    {eventNum: "4248", annun: "ENA", cl: "C", ack: true, sys: "TCS", message: "ETCS Loop B TRRJ Switchover Sequence Failure - P1", time: '2019-11-15T16:17:28'},
    {eventNum: "5100", annun: "SUPP", cl: "C", ack: true, sys: "CNT", message: "Loss of Active IAC Handover to Backup IAC", time: '2019-11-15T16:23:30'},
    {eventNum: "11099", annun: "ENA", cl: "C", ack: true, sys: "EPS", message: "RPCM S32B_A Observed vs Last Commanded State Discrepancy - S3", time: '2019-11-15T16:27:32'}
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