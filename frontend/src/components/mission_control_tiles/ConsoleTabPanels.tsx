import React, {useState, useEffect} from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import NestedList from "./NestedList";
import {makeStyles} from "@material-ui/core/styles";
import TabPanel from "@material-ui/lab/TabPanel";
import OSTPV from "../OSTPV/OSTPV";
import {TabContext} from "@material-ui/lab";
import SPARTANPowerConsole from "./SPARTAN/SPARTANPowerConsole";
import ContentPane from "./ContentPane";
import SPARTANExtThermalControl from "./SPARTAN/SPARTANExtThermalControl";
import BMEEVASuits from "./BME/BMEEVASuits";
import BMEVitalSigns from "./BME/BMEVitalSigns";
import CRONUSUHFComms from "./CRONUS/CRONUSUHFComms";
import CRONUSSBandComms from "./CRONUS/CRONUSSBandComms";
import CRONUSKuBandComms from "./CRONUS/CRONUSKuBandComms";
import FlightInbox from "./FLIGHT/FlightInbox";
import ETHOSLifeSupport from "./ETHOS/ETHOSLifeSupport";
import ETHOSThermalSystem from "./ETHOS/ETHOSThermalSystem";
import ETHOSRegenLifeSupport from "./ETHOS/ETHOSRegenLifeSupport";
import CAPCOM from "./CAPCOM/CAPCOM";
import Tutor from "./TUTOR/Tutor";
import Home from "./Home";

const useStyles = makeStyles({
    tabs: {
        marginTop: "20px",
        marginLeft: "250px",
        minWidth: "800px"
    }
})

interface ConsoleTabPanelsProps {
    active: string;
}

const ConsoleTabPanels: React.FC<ConsoleTabPanelsProps> = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <ContentPane hidden={props.active !== "TUTOR"} className={classes.tabs}>
                <Tutor />
            </ContentPane>
            <ContentPane hidden={props.active !== "HOME"} className={classes.tabs}>
                <Home />
            </ContentPane>
            <ContentPane hidden={props.active !== "SPARTAN-1"} className={classes.tabs}>
                <SPARTANPowerConsole />
            </ContentPane>
            <ContentPane hidden={props.active !== "SPARTAN-2"} className={classes.tabs}>
                <SPARTANExtThermalControl />
            </ContentPane>
            <ContentPane hidden={props.active !== "CRONUS-1"} className={classes.tabs}>
                <CRONUSUHFComms />
            </ContentPane>
            <ContentPane hidden={props.active !== "CRONUS-2"} className={classes.tabs}>
                <CRONUSSBandComms />
            </ContentPane>
            <ContentPane hidden={props.active !== "CRONUS-3"} className={classes.tabs}>
                <CRONUSKuBandComms />
            </ContentPane>
            <ContentPane hidden={props.active !== "ETHOS-1"} className={classes.tabs}>
                <ETHOSLifeSupport />
            </ContentPane>
            <ContentPane hidden={props.active !== "ETHOS-2"} className={classes.tabs}>
                <ETHOSThermalSystem />
            </ContentPane>
            <ContentPane hidden={props.active !== "ETHOS-3"} className={classes.tabs}>
                <ETHOSRegenLifeSupport />
            </ContentPane>
            <ContentPane hidden={props.active !== "FLIGHT"} className={classes.tabs}>
                <FlightInbox />
            </ContentPane>
            <ContentPane hidden={props.active !== "CAPCOM"} className={classes.tabs}>
                <CAPCOM />
            </ContentPane>
            <ContentPane hidden={props.active !== "BME-1"} className={classes.tabs}>
                <BMEEVASuits />
            </ContentPane>
            <ContentPane hidden={props.active !== "BME-2"} className={classes.tabs}>
                <BMEVitalSigns />
            </ContentPane>
            <ContentPane hidden={props.active !== "OSTPV"} className={classes.tabs}>
                <OSTPV />
            </ContentPane>
        </React.Fragment>
    )
}

export default ConsoleTabPanels;