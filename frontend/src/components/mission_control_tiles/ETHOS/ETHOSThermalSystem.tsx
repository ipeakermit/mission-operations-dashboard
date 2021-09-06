import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ThermalSystem from '../../../media/ETHOSThermalSystem.svg';
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";
import {generateRandom, decreaseValue} from "../../../util/dataGenerator";

const useStyles = makeStyles({
    container: {
        height: "90vh",
    },
    paper: {
        padding: "20px"
    },
})

interface ETHOSThermalSystemProps {

}

const ETHOSThermalSystem: React.FC<ETHOSThermalSystemProps> = (props) => {
    const classes = useStyles();
    const [modLoopQualDest, setModLoopQualDest] = useState<number>(0);
    const [modLoopQualHarm, setModLoopQualHarm] = useState<number>(0);
    const [modLoopQualTranq, setModLoopQualTranq] = useState<number>(0);
    const [modLoopTempDest, setModLoopTempDest] = useState<number>(0);
    const [modLoopTempHarm, setModLoopTempHarm] = useState<number>(0);
    const [modLoopTempTranq, setModLoopTempTranq] = useState<number>(0);
    const [lowLoopQualDest, setLowLoopQualDest] = useState<number>(0);
    const [lowLoopQualHarm, setLowLoopQualHarm] = useState<number>(0);
    const [lowLoopQualTranq, setLowLoopQualTranq] = useState<number>(0);
    const [lowLoopTempDest, setLowLoopTempDest] = useState<number>(0);
    const [lowLoopTempHarm, setLowLoopTempHarm] = useState<number>(0);
    const [lowLoopTempTranq, setLowLoopTempTranq] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setModLoopQualDest(generateRandom(83.54, 83.74,2))
            setModLoopQualHarm(generateRandom(39, 39.4,2))
            setModLoopQualTranq(generateRandom(74.54, 75.38,2))
            setModLoopTempDest(generateRandom(17.04, 17.23,2))
            setModLoopTempHarm(generateRandom(16.4, 16.98,2))
            setModLoopTempTranq(generateRandom(5.87, 9.45,2))
            setLowLoopQualDest(generateRandom(60.34, 61.34,2))
            setLowLoopQualHarm(generateRandom(25.9, 27.1,2))
            setLowLoopQualTranq(generateRandom(70.5, 70.9,2))
            setLowLoopTempDest(generateRandom(6.31, 9.25,2))
            setLowLoopTempHarm(generateRandom(8.4, 8.99,2))
            setLowLoopTempTranq(generateRandom(6.31, 9.25,2))
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={ThermalSystem}/>
                    <text x={"32.5%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{lowLoopQualDest}</text>
                    <text x={"32.5%"} y={"79.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{lowLoopQualHarm}</text>
                    <text x={"32.5%"} y={"86.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{lowLoopQualTranq}</text>

                    <text x={"47.5%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{modLoopQualDest}</text>
                    <text x={"47.5%"} y={"79.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{modLoopQualHarm}</text>
                    <text x={"47.5%"} y={"86.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{modLoopQualTranq}</text>

                    <text x={"61.9%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{lowLoopTempDest}</text>
                    <text x={"61.9%"} y={"79.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{lowLoopTempHarm}</text>
                    <text x={"61.9%"} y={"86.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{lowLoopTempTranq}</text>

                    <text x={"77%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{modLoopTempDest}</text>
                    <text x={"77%"} y={"79.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{modLoopTempHarm}</text>
                    <text x={"77%"} y={"86.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{modLoopTempTranq}</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default ETHOSThermalSystem;