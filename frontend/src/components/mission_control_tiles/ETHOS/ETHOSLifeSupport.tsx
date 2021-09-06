import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import LifeSupport from '../../../media/ETHOSLifeSupport.svg';
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

interface ETHOSLifeSupportProps {

}

const ETHOSLifeSupport: React.FC<ETHOSLifeSupportProps> = (props) => {
    const classes = useStyles();
    const [tranqPressure, setTranqPressure] = useState<number>(0);
    const [tranqTemp, setTranqTemp] = useState<number>(0);
    const [questPressure, setQuestPressure] = useState<number>(0);
    const [crewlockPressure, setCrewlockPressure] = useState<number>(0);
    const [questEVATank, setQuestEVATank] = useState<number>(0);
    const [questN2Tank, setQuestN2Tank] = useState<number>(0);
    const [questO2Tank, setQuestO2Tank] = useState<number>(0);
    const [destinyPressure, setDestinyPressure] = useState<number>(0);
    const [destinyTemp, setDestinyTemp] = useState<number>(0);
    const [harmPressure, setHarmPressure] = useState<number>(0);
    const [harmCoolTemp, setHarmCoolTemp] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTranqPressure(generateRandom(737,743,2))
            setTranqTemp(generateRandom(21.8,22.2,2))
            setQuestPressure(generateRandom(737,743,2))
            setCrewlockPressure(generateRandom(732,738,2))
            setQuestEVATank(generateRandom(10070,10090,2))
            setQuestN2Tank(generateRandom(9010,9030,2))
            setQuestO2Tank(generateRandom(7640,7660,2))
            setDestinyPressure(generateRandom(737,743,2))
            setDestinyTemp(generateRandom(21.8,22.2,2))
            setHarmPressure(generateRandom(737,743,2))
            setHarmCoolTemp(generateRandom(8.8,9.2,2))
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={LifeSupport}/>
                    <text x={"25.5%"} y={"11.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{tranqPressure}</text>
                    <text x={"25.5%"} y={"16.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{tranqTemp}</text>
                    <text x={"25.5%"} y={"21.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>162.50</text>
                    <text x={"25.5%"} y={"26.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>565.35</text>
                    <text x={"25.5%"} y={"31.8%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>3.48</text>
                    <text x={"25.5%"} y={"36.9%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>ON</text>

                    <text x={"46.2%"} y={"53.0%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{tranqPressure}</text>
                    <text x={"46.2%"} y={"57.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{tranqTemp}</text>
                    <text x={"46.2%"} y={"61.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>162.50</text>
                    <text x={"46.2%"} y={"65.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>565.35</text>
                    <text x={"46.2%"} y={"69.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>3.48</text>
                    <text x={"58.5%"} y={"55.9%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>OFF</text>
                    <text x={"58.5%"} y={"68.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"middle"}>ON</text>

                    <text x={"25.2%"} y={"83.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{questPressure}</text>
                    <text x={"25.2%"} y={"87.6%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>ON</text>
                    <text x={"25.2%"} y={"92.9%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{crewlockPressure}</text>
                    <text x={"8.2%"} y={"85.6%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>OPEN</text>
                    <text x={"8.2%"} y={"94.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>OPEN</text>
                    <text x={"46.7%"} y={"85.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{questEVATank}</text>
                    <text x={"46.7%"} y={"89.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{questN2Tank}</text>
                    <text x={"46.7%"} y={"93.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{questO2Tank}</text>
                    <text x={"57.8%"} y={"85.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>CLOSED</text>
                    <text x={"57.0%"} y={"89.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>OPEN</text>
                    <text x={"57.0%"} y={"93.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>OPEN</text>

                    <text x={"80.5%"} y={"53.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{harmPressure}</text>
                    <text x={"80.5%"} y={"58.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{harmCoolTemp}</text>
                    <text x={"80.5%"} y={"63.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>162.50</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default ETHOSLifeSupport;