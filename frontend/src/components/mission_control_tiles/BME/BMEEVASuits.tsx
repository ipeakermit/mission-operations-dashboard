import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import EVASuits from '../../../media/BMEEVASuits.svg';
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";
import {generateRandom, decreaseValue} from "../../../util/dataGenerator";
import LucaParmitano from '../../../media/Bme_Luca_Parmitano.jpg';
import DrewMorgan from '../../../media/Bme_Andrew_R_Morgan.jpg';
import ChristinaKoch from '../../../media/Bme_Christina_Koch.jpg';
import JessicaMeir from '../../../media/Bme_Jessica_Meir.jpg';

const useStyles = makeStyles({
    container: {
        height: "90vh",
    },
    paper: {
        padding: "20px"
    },
})

interface BMEEVASuitsProps {

}

const BMEEVASuits: React.FC<BMEEVASuitsProps> = (props) => {
    const classes = useStyles();
    const [pressures, setPressures] = useState<number[]>(Array.from({length: 2}, () => generateRandom(8, 10, 2)));
    const [oxygens, setOxygens] = useState<number[]>([65, 61]);
    const [waters, setWaters] = useState<number[]>([80, 82]);
    const [batteries, setBatteries] = useState<number[]>([67, 68]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPressures(Array.from({length: 2}, () => generateRandom(8, 10, 2)));
            setOxygens(oxygens.map(value => decreaseValue(value, 0.001, 0.05, 2)));
            setWaters(waters.map(value => decreaseValue(value, 0.001, 0.05, 2)));
            setBatteries(batteries.map(value => decreaseValue(value, 0.001, 0.05, 2)));
        }, 5000)
        return () => clearInterval(interval);
    }, [pressures, oxygens, waters, batteries])

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={EVASuits}/>

                    {/*EVA 1 - LUCA*/}
                    <text x={"32%"} y={"18.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{pressures[0]} psi</text>
                    <text x={"33.8%"} y={"45.8%"} fill={"#94F190"} fontSize={18} textAnchor={"start"}>ACTIVE</text>
                    <text x={"12.8%"} y={"27.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{oxygens[0]}%</text>
                    <text x={"12.8%"} y={"42.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{waters[0]}%</text>
                    <text x={"17%"} y={"62.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{batteries[0]}%</text>

                    {/*EVA 2 - DREW*/}
                    <text x={"67.2%"} y={"18.5%"} fill={"#E7BA73"} fontSize={18} textAnchor={"end"}>{pressures[1]} psi</text>
                    <text x={"65.5%"} y={"45.8%"} fill={"#94F190"} fontSize={18} textAnchor={"end"}>ACTIVE</text>
                    <text x={"87.3%"} y={"27.2%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{oxygens[1]}%</text>
                    <text x={"87.3%"} y={"42.4%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{waters[1]}%</text>
                    <text x={"82.6%"} y={"62.3%"} fill={"#E7BA73"} fontSize={18} textAnchor={"start"}>{batteries[1]}%</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default BMEEVASuits;