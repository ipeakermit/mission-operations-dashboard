import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {ReactComponent as ISS} from '../../media/ISS.svg';
import RMIT from '../../media/rmit.png';
import Typography from "@material-ui/core/Typography";

interface ContentPaneProps {
    hidden: boolean;
    className: string;
}

const ContentPane: React.FC<ContentPaneProps> = (props) => {
    return (
        <div className={props.className}
            style={{
                display: props.hidden ? "none" : "block"
            }}
        >
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px"}}>
                <img src={RMIT} height={50} style={{marginRight: "30px"}}/>
                <Typography variant={"h4"} align={"center"} >
                    RMIT MCC Simulator
                </Typography>
                <ISS height={50} style={{marginLeft: "20px"}}/>
            </div>
            {props.children}
        </div>
    )
}

export default ContentPane;