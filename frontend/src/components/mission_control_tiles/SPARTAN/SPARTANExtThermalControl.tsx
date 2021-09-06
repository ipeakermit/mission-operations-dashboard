import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ExtThermalControl from '../../../media/SPARTANExtThermalControl.svg';
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

interface SPARTANExtThermalControlProps {

}

const SPARTANExtThermalControl: React.FC<SPARTANExtThermalControlProps> = (props) => {
    const classes = useStyles();
    const [flowrates, setFlowrates] = useState<number[]>(Array.from({length: 2}, () => generateRandom(3500, 4500, 2)));
    const [pressures, setPressures] = useState<number[]>(Array.from({length: 2}, () => generateRandom(2100, 2300, 2)));
    const [temperatures, setTemperatures] = useState<number[]>(Array.from({length: 2}, () => generateRandom(4, 5, 2)));
    const [positions, setPositions] = useState<number[]>(Array.from({length: 2}, () => generateRandom(-40, -35, 2)));

    useEffect(() => {
        const interval = setInterval(() => {
            setFlowrates(Array.from({length: 2}, () => generateRandom(3500, 4500, 2)));
            setPressures(Array.from({length: 2}, () => generateRandom(2100, 2300, 2)));
            setTemperatures(Array.from({length: 2}, () => generateRandom(4, 5, 2)));
            setPositions(Array.from({length: 2}, () => generateRandom(-40, -35, 2)));
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={ExtThermalControl}/>
                    {/*Radiator Loop A*/}
                    <text x={"30.6%"} y={"61.1%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{flowrates[0]} kg/hr</text>
                    <text x={"30.6%"} y={"70.1%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{pressures[0]} kPa</text>
                    <text x={"30.6%"} y={"78.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{temperatures[0]} °C</text>
                    <text x={"30.6%"} y={"87.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{positions[0]} deg</text>

                    {/*Radiator Loop B*/}
                    <text x={"69%"} y={"61.1%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{flowrates[1]} kg/hr</text>
                    <text x={"69%"} y={"70.1%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{pressures[1]} kPa</text>
                    <text x={"69%"} y={"78.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{temperatures[1]} °C</text>
                    <text x={"69%"} y={"87.7%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{positions[1]} deg</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default SPARTANExtThermalControl;