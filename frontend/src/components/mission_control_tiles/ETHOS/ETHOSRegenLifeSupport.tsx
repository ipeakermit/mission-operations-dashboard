import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import RegenLifeSupport from '../../../media/ETHOSRegenLifeSupport.svg';
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

interface ETHOSRegenLifeSupportProps {

}

const ETHOSRegenLifeSupport: React.FC<ETHOSRegenLifeSupportProps> = (props) => {
    const classes = useStyles();
    const [urineTank, setUrineTank] = useState<number>(0);
    const [wasteWater, setWasteWater] = useState<number>(0);
    const [cleanWater, setCleanWater] = useState<number>(0);
    const [oxygen, setOxygen] = useState<number>(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setUrineTank(generateRandom(60,62,2))
            setWasteWater(generateRandom(60.34,61.34,2))
            setCleanWater(generateRandom(60.34,61.36,2))
            setOxygen(generateRandom(54,56,2))
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={RegenLifeSupport}/>
                    <text x={"31.0%"} y={"37.8%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{urineTank}%</text>
                    <text x={"27.5%"} y={"27.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>STANDBY</text>

                    <text x={"68.1%"} y={"22.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{wasteWater}%</text>
                    <text x={"73.1%"} y={"48%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>PROCESSING</text>
                    <text x={"73.1%"} y={"60%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>FLOW</text>
                    <text x={"68.1%"} y={"77.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{cleanWater}%</text>

                    <text x={"27.5%"} y={"79.0%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>PROCESSING</text>
                    <text x={"27.5%"} y={"86.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>{oxygen} kg/day</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default ETHOSRegenLifeSupport;