import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import VitalSigns from '../../../media/BMEVitalSigns.svg';
import ECG1 from '../../../media/ecg.gif';
import ECG2 from '../../../media/ecg_90.gif';
import ECG3 from '../../../media/ecg_110.gif';
import ECG4 from '../../../media/ecg_99.gif';
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";
import {generateRandom, decreaseValue, increaseValue} from "../../../util/dataGenerator";
import Chart from "./Chart";
import {useSessionContext} from "../../../context/SessionContext";
import {DateTime} from "luxon";
import {useSessionTime} from "../../../util/useSessionTime";

const useStyles = makeStyles({
    container: {
        height: "90vh",
    },
    paper: {
        padding: "20px"
    },
})

interface BMEVitalSignsProps {

}

const BMEVitalSigns: React.FC<BMEVitalSignsProps> = (props) => {
    const classes = useStyles();
    const {sessionTime} = useSessionTime();
    const [maleHeartrates, setMaleHeartrates] = useState<number[]>(Array.from({length: 2}, () => generateRandom(60, 90, 0)));
    const [femaleHeartrates, setFemaleHeartrates] = useState<number[]>(Array.from({length: 2}, () => generateRandom(60, 80, 0)));
    const [sysBloodPressures, setSysBloodPressures] = useState<number[]>([125, 125, 115, 115]);
    const [diaBloodPressures, setDiaBloodPressures] = useState<number[]>([60, 60, 70, 70]);
    const [lucaTemps,] = useState<number[]>(Array.from({length: 25}, () => generateRandom(36, 37.5, 1)));
    const [andrewTemps,] = useState<number[]>(Array.from({length: 25}, () => generateRandom(36, 37.5, 1)));
    const [christinaTemps,] = useState<number[]>(Array.from({length: 25}, () => generateRandom(36, 37.5, 1)));
    const [jessicaTemps,] = useState<number[]>(Array.from({length: 25}, () => generateRandom(36, 37.5, 1)));
    const [tempIndex, setTempIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMaleHeartrates(Array.from({length: 2}, () => generateRandom(60, 90, 0)))
            setFemaleHeartrates(Array.from({length: 2}, () => generateRandom(60, 80, 0)))
            setSysBloodPressures(sysBloodPressures.map(bp => decreaseValue(bp, 0.01, 0.02, 2)));
            setDiaBloodPressures(diaBloodPressures.map(bp => increaseValue(bp, 0.01, 0.02, 2)));
        }, 5000)
        return () => clearInterval(interval);
    }, [sysBloodPressures, diaBloodPressures])

    useEffect(() => {
        if (sessionTime) {
            let startTime = DateTime.fromISO("2019-11-15T15:00:00", { zone: 'utc' });
            let diff = sessionTime.diff(startTime, 'minutes');
            let numDataPoints = (diff.as('minutes') / 5).toFixed(0);
            setTempIndex(parseInt(numDataPoints));
        }
    }, [sessionTime])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={VitalSigns}/>

                    {/*LUCA*/}
                    <image x={"33%"} y={"5.2%"} width={200} height={100} href={ECG1}/>
                    <text x={"25.2%"} y={"11.2%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"start"}>{maleHeartrates[0]} bpm
                    </text>
                    <text x={"25.2%"} y={"23.5%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"start"}>{sysBloodPressures[0].toFixed(0)} / {diaBloodPressures[0].toFixed(0)}</text>
                    <foreignObject x={"25.0%"} y={"31.4%"} height={"125px"} width={"270px"}>
                        <Chart newData={lucaTemps.filter((temp, i) => i <=tempIndex)}/>
                    </foreignObject>

                    {/*DREW*/}
                    <image x={"50%"} y={"5.2%"} width={200} height={100} href={ECG2}/>
                    <text x={"74.6%"} y={"11.2%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"end"}>{maleHeartrates[1]} bpm
                    </text>
                    <text x={"74.6%"} y={"23.5%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"end"}>{sysBloodPressures[1].toFixed(0)} / {diaBloodPressures[1].toFixed(0)}</text>
                    <foreignObject x={"52%"} y={"31.4%"} height={"110px"} width={"270px"}>
                        <Chart newData={andrewTemps.filter((temp, i) => i <=tempIndex)}/>
                    </foreignObject>

                    {/*CHRISTINA*/}
                    <image x={"50%"} y={"55.2%"} width={200} height={100} href={ECG3}/>
                    <text x={"25.2%"} y={"61.2%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"start"}>{femaleHeartrates[0]} bpm
                    </text>
                    <text x={"25.2%"} y={"73.4%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"start"}>{sysBloodPressures[2].toFixed(0)} / {diaBloodPressures[2].toFixed(0)}</text>
                    <foreignObject x={"25.0%"} y={"81%"} height={"110px"} width={"270px"}>
                        <Chart newData={christinaTemps.filter((temp, i) => i <=tempIndex)}/>
                    </foreignObject>

                    {/*JESSICA*/}
                    <image x={"33%"} y={"55.2%"} width={200} height={100} href={ECG4}/>
                    <text x={"74.6%"} y={"61.2%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"end"}>{femaleHeartrates[1]} bpm
                    </text>
                    <text x={"74.6%"} y={"73.4%"} fill={"#E7BA73"} fontSize={18}
                          textAnchor={"end"}>{sysBloodPressures[3].toFixed(0)} / {diaBloodPressures[3].toFixed(0)}</text>
                    <foreignObject x={"52%"} y={"81%"} height={"110px"} width={"270px"}>
                        <Chart newData={jessicaTemps.filter((temp, i) => i <=tempIndex)}/>
                    </foreignObject>
                </svg>
            </Paper>
        </Container>
    )
}

export default BMEVitalSigns;