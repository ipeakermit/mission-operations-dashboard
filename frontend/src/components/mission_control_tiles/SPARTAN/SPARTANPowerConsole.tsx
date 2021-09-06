import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import PowerConsoleBackground from '../../../media/SPARTANPowerConsole.svg';
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";
import {generateRandom} from "../../../util/dataGenerator";

const useStyles = makeStyles({
    container: {
        height: "90vh",
    },
    paper: {
        padding: "20px"
    },
})

interface SPARTANPowerConsoleProps {

}

const SPARTANPowerConsole: React.FC<SPARTANPowerConsoleProps> = (props) => {
    const classes = useStyles();
    const [currents, setCurrents] = useState<number[]>(Array.from({length: 8}, () => generateRandom(-51, -24, 2)));
    const [voltages, setVoltages] = useState<number[]>(Array.from({length: 8}, () => generateRandom(151, 165, 2)));
    const [positions, setPositions] = useState<number[]>(Array.from({length: 8}, () => generateRandom(17, 24, 2)));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrents(Array.from({length: 8}, () => generateRandom(-51, -24, 2)));
            setVoltages(Array.from({length: 8}, () => generateRandom(151, 165, 2)));
            setPositions(Array.from({length: 8}, () => generateRandom(17, 24, 2)));
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={PowerConsoleBackground}/>
                    {/*Panel 2B*/}
                    <text x={"13.5%"} y={"12.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{currents[0]} A</text>
                    <text x={"13.5%"} y={"21.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{voltages[0]} V</text>
                    <text x={"13.5%"} y={"30.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{positions[0]} deg</text>

                    {/*Panel 4A*/}
                    <text x={"37%"} y={"12.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{currents[1]} A</text>
                    <text x={"37%"} y={"21.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{voltages[1]} V</text>
                    <text x={"37%"} y={"30.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{positions[1]} deg</text>

                    {/*Panel 1A*/}
                    <text x={"62.8%"} y={"12.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{currents[2]} A</text>
                    <text x={"62.8%"} y={"21.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{voltages[2]} V</text>
                    <text x={"62.8%"} y={"30.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{positions[2]} deg</text>

                    {/*Panel 3B*/}
                    <text x={"86.3%"} y={"12.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{currents[3]} A</text>
                    <text x={"86.3%"} y={"21.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{voltages[3]} V</text>
                    <text x={"86.3%"} y={"30.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{positions[3]} deg</text>

                    {/*Panel 4B*/}
                    <text x={"13.5%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{currents[4]} A</text>
                    <text x={"13.5%"} y={"81.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{voltages[4]} V</text>
                    <text x={"13.5%"} y={"90%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{positions[4]} deg</text>

                    {/*Panel 2A*/}
                    <text x={"37%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{currents[5]} A</text>
                    <text x={"37%"} y={"81.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{voltages[5]} V</text>
                    <text x={"37%"} y={"90%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{positions[5]} deg</text>

                    {/*Panel 3A*/}
                    <text x={"62.8%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{currents[6]} A</text>
                    <text x={"62.8%"} y={"81.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{voltages[6]} V</text>
                    <text x={"62.8%"} y={"90%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{positions[6]} deg</text>

                    {/*Panel 1B*/}
                    <text x={"86.3%"} y={"72.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{currents[7]} A</text>
                    <text x={"86.3%"} y={"81.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{voltages[7]} V</text>
                    <text x={"86.3%"} y={"90%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{positions[7]} deg</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default SPARTANPowerConsole;