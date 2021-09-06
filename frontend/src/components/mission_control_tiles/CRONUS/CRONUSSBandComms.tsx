import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import SBandComms from '../../../media/CRONUSSBandComms.svg';
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

interface CRONUSSBandCommsProps {

}

const CRONUSSBandComms: React.FC<CRONUSSBandCommsProps> = (props) => {
    const classes = useStyles();
    const [elevation, setElevation] = useState<number>(60.00);
    const [azimuth, setAzimuth] = useState<number>(2.00);

    useEffect(() => {
        const interval = setInterval(() => {
            setElevation(decreaseValue(elevation, 0.001, 0.05, 2));
            setAzimuth(decreaseValue(azimuth, 0.001, 0.05, 2));
        }, 5000)
        return () => clearInterval(interval);
    }, [elevation, azimuth])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={SBandComms}/>
                    <text x={"40.8%"} y={"50.5%"} fill={"#94F190"} fontSize={18} textAnchor={"start"}>ACTIVE</text>
                    <text x={"41%"} y={"57.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{elevation} deg</text>
                    <text x={"41%"} y={"64.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{azimuth} deg</text>
                    <text x={"56.5%"} y={"50.5%"} fill={"#94F190"} fontSize={18} textAnchor={"end"}>INACTIVE</text>
                    <text x={"56.5%"} y={"57.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>N/A</text>
                    <text x={"56.5%"} y={"64.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>N/A</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default CRONUSSBandComms;