import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import UHFComms from '../../../media/CRONUSUHFComms.svg';
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

interface CRONUSUHFCommsProps {

}

const CRONUSUHFComms: React.FC<CRONUSUHFCommsProps> = (props) => {
    const classes = useStyles();
    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <svg viewBox={"0 0 1190 700"}>
                    <image width={1190} height={700} href={UHFComms}/>
                    <text x={"50.5%"} y={"53%"} fill={"#94F190"} fontSize={18} textAnchor={"start"}>ON</text>
                    <text x={"40%"} y={"53%"} fill={"#94F190"} fontSize={18} textAnchor={"start"}>ON</text>
                    <text x={"42%"} y={"59%"} fill={"#E7BA73"} fontSize={18} textAnchor={"center"}>FRAME SYNC</text>
                    <text x={"75.5%"} y={"31.7%"} fill={"#94F190"} fontSize={18} textAnchor={"end"}>ON</text>
                    <text x={"85.8%"} y={"31.7%"} fill={"#94F190"} fontSize={18} textAnchor={"end"}>ON</text>
                </svg>
            </Paper>
        </Container>
    )
}

export default CRONUSUHFComms;