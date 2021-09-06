import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CAPCOMButtons from '../../../media/CAPCOMButtons.svg';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import {DateTime} from "luxon";
import {useSessionTime} from "../../../util/useSessionTime";
import CAPCOMTable from "./CAPCOMTable";

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

interface CAPCOMProps {

}

const CAPCOM: React.FC<CAPCOMProps> = (props) => {
    const classes = useStyles();
    const {sessionTime} = useSessionTime();
    const [signal, setSignal] = useState<boolean>(true);
    const [losTimes, setLosTimes] = useState<string[]>(['2019-11-15T15:17:37', '2019-11-15T15:57:51', '2019-11-15T16:03:53', '2019-11-15T16:07:03', '2019-11-15T16:10:10', '2019-11-15T16:13:24', '2019-11-15T16:52:26', '2019-11-15T17:37:00']);
    const [aosTimes, setAosTimes] = useState<string[]>(['2019-11-15T15:17:52', '2019-11-15T15:59:28', '2019-11-15T16:05:46', '2019-11-15T16:09:19', '2019-11-15T16:12:07', '2019-11-15T16:14:25', '2019-11-15T17:00:00', '2019-11-15T17:44:00']);
    const [nextLOS, setNextLOS] = useState<string>("");
    const [nextAOS, setNextAOS] = useState<string>("");

    useEffect(() => {
        if (aosTimes.length > 0) {
            let nextAOSDateTime = DateTime.fromISO(aosTimes[0], {zone: 'utc'});
            if (sessionTime < nextAOSDateTime) {
                let aosDiff = nextAOSDateTime.diff(sessionTime, ["hours", "minutes", "seconds"]).toObject();
                setNextAOS(`${aosDiff.hours?.toFixed(0).padStart(2, "0")}:${aosDiff.minutes?.toFixed(0).padStart(2, "0")}:${aosDiff.seconds?.toFixed(0).padStart(2, "0")}`);
            } else {
                setSignal(true);
                setAosTimes(aosTimes.filter(time => sessionTime < DateTime.fromISO(time, {zone: 'utc'})));
            }
        }
        if (losTimes.length > 0) {
            let nextLOSDateTime = DateTime.fromISO(losTimes[0], {zone: 'utc'});
            if (sessionTime < nextLOSDateTime) {
                let losDiff = nextLOSDateTime.diff(sessionTime, ["hours", "minutes", "seconds"]).toObject();
                setNextLOS(`${losDiff.hours?.toFixed(0).padStart(2,"0")}:${losDiff.minutes?.toFixed(0).padStart(2,"0")}:${losDiff.seconds?.toFixed(0).padStart(2,"0")}`);
            } else {
                setSignal(false);
                setLosTimes(losTimes.filter(time => sessionTime < DateTime.fromISO(time, {zone: 'utc'})));
            }
        }
    }, [sessionTime, signal, losTimes, aosTimes])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <div style={{height: "430px"}}>
                    <CAPCOMTable />
                </div>
                <div style={{height: "270px"}}>
                    <svg viewBox={"0 0 1190 260"}>
                        <image width={1190} height={260} href={CAPCOMButtons}/>
                        <rect x="103" y="74" rx="8" ry="8" width="71" height="42"
                              style={{
                                  fill: "lightgray"
                              }}/>
                        <text x={"11.6%"} y={"38%"} fill={"black"} fontSize={14} fontWeight={700}
                              textAnchor={"middle"}>FIRE
                        </text>
                        <rect x="195" y="74" rx="8" ry="8" width="71" height="42"
                              style={{
                                  fill: "lightgray"
                              }}/>
                        <text x={"19.3%"} y={"38%"} fill={"black"} fontSize={14} fontWeight={700}
                              textAnchor={"middle"}>&Delta;P
                        </text>
                        <rect x="289" y="74" rx="8" ry="8" width="71" height="42"
                              style={{
                                  fill: "lightgray"
                              }}/>
                        <text x={"27.3%"} y={"38%"} fill={"black"} fontSize={14} fontWeight={700}
                              textAnchor={"middle"}>ATM
                        </text>
                        <rect x="383" y="74" rx="8" ry="8" width="71" height="42"
                              style={{
                                  fill: sessionTime > DateTime.fromISO("2019-11-15T16:02:24", {zone: 'utc'}) ? "#F54242" : "lightgray"
                              }}/>
                        <text x={"35.2%"} y={"38%"}
                              fill={sessionTime > DateTime.fromISO("2019-11-15T16:02:24", {zone: 'utc'}) ? "white" : "black"}
                              fontSize={14}
                              fontWeight={700}
                              textAnchor={"middle"}>
                            WARNING
                        </text>
                        <rect x="477" y="74" rx="8" ry="8" width="71" height="42"
                              style={{
                                  fill: "lightgray"
                              }}/>
                        <text x={"43.1%"} y={"38%"} fill={"black"} fontSize={14} fontWeight={700}
                              textAnchor={"middle"}>CAUTION
                        </text>
                        <rect x="477" y="158" rx="8" ry="8" width="71" height="42"
                              style={{
                                  fill: "lightgray"
                              }}/>
                        <text x={"43.1%"} y={"71%"} fill={"black"} fontSize={14} fontWeight={700}
                              textAnchor={"middle"}>TEST
                        </text>

                        <rect x="683" y="39" rx="5" ry="5" width="185" height="50"
                              style={{
                                  fill: signal ? "#00CC00" : "#004000"
                              }}/>
                        <text x={"65.4%"} y={"30%"} fill={signal ? "white" : "grey"} fontSize={36} fontWeight={700}
                              textAnchor={"middle"}>AOS
                        </text>
                        <rect x="926" y="39" rx="5" ry="5" width="185" height="50"
                              style={{
                                  fill: signal ? "#640000" : "#FF0000"
                              }}/>
                        <text x={"85.6%"} y={"30%"} fill={signal ? "grey" : "white"} fontSize={36} fontWeight={700}
                              textAnchor={"middle"}>LOS
                        </text>
                        <text x={"75.4%"} y={"65.4%"} fill={"#E7BA73"} fontSize={36}
                              textAnchor={"middle"}
                        >
                            {nextAOS}
                        </text>
                        <text x={"75.4%"} y={"90%"} fill={"#E7BA73"} fontSize={36}
                              textAnchor={"middle"}
                        >
                            {nextLOS}
                        </text>
                    </svg>
                </div>
            </Paper>
        </Container>
    )
}
export default CAPCOM;