import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as ISS} from '../../media/ISS.svg';
import HomeBackground from '../../media/homebackground.jpg';
import ISSEmblem from '../../media/ISS_emblem.png';
import RMITLogoFull from '../../media/RMITLogoFull.png';
import Typography from "@material-ui/core/Typography";
import Container from '@material-ui/core/Container';
import {Paper} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    container: {
        height: "90vh",
        display: "flex",
    },
    paper: {
        width: "1232px",
        height: "90%",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
    },
    image: {
        maxWidth: "100%",
        maxHeight: "100%"
    }
}))

interface HomeProps {

}

const Home: React.FC<HomeProps> = (props) => {
    const classes = useStyles();
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div className={classes.container}>
                <Paper variant={"outlined"} className={classes.paper}>
                    <img src={HomeBackground} className={classes.image}/>
                </Paper>
                <div style={{height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <img src={ISSEmblem} width={200} style={{marginLeft: "20px"}}/>
                    <img src={RMITLogoFull} width={200} style={{marginLeft: "20px"}}/>
                </div>
            </div>
        </div>
    )
}

export default Home;