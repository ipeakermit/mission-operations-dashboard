import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import KuBandComms from '../../../media/CRONUSKuBandComms.svg';
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

interface CRONUSKuBandCommsProps {

}

const CRONUSKuBandComms: React.FC<CRONUSKuBandCommsProps> = (props) => {
    const classes = useStyles();
    const [elevation, setElevation] = useState<number>(48.00);
    const [crossElevation, setCrossElevation] = useState<number>(45.00);

    useEffect(() => {
        const interval = setInterval(() => {
            setElevation(decreaseValue(elevation, 0.001, 0.05, 2));
            setCrossElevation(decreaseValue(crossElevation, 0.001, 0.05, 2));
        }, 5000)
        return () => clearInterval(interval);
    }, [elevation, crossElevation])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={KuBandComms}/>
                    <text x={"40.8%"} y={"50.5%"} fill={"#94F190"} fontSize={18} textAnchor={"start"}>ACTIVE</text>
                    <text x={"41%"} y={"57.3%"} fill={"#94F190"} fontSize={18} textAnchor={"start"}>ACTIVE</text>
                    <text x={"41%"} y={"64.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{elevation} deg</text>
                    <text x={"56.5%"} y={"50.5%"} fill={"#94F190"} fontSize={18} textAnchor={"end"}>ACTIVE</text>
                    <text x={"56.5%"} y={"57.3%"} fill={"#94F190"} fontSize={18} textAnchor={"end"}>ACTIVE</text>
                    <text x={"56.5%"} y={"64.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{crossElevation} deg</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default CRONUSKuBandComms;