import React, {useState, useEffect} from 'react';
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
    drawer: {
        width: "250px"
    },
    nested: {
        paddingLeft: "30px"
    }
})

interface NestedListProps {
    userType: string;
    active: string;
    setActive: (newTab: string) => void;
    openEfnModal: () => void;
}

const NestedList: React.FC<NestedListProps> = (props) => {
    const classes = useStyles();
    const [openSPARTAN, setOpenSPARTAN] = useState(false);
    const [openCRONUS, setOpenCRONUS] = useState(false);
    const [openETHOS, setOpenETHOS] = useState(false);
    const [openBME, setOpenBME] = useState(false);

    const handleOpen = (console: string) => {
        switch(console) {
            case "SPARTAN":
                setOpenSPARTAN(!openSPARTAN);
                break;
            case "CRONUS":
                setOpenCRONUS(!openCRONUS);
                break;
            case "ETHOS":
                setOpenETHOS(!openETHOS);
                break;
            case "BME":
                setOpenBME(!openBME);
                break;
        }
    }
    return (
        <List component={"nav"} className={classes.drawer}>
            { props.userType === "tutor" &&
                <ListItem
                    button
                    onClick={() => props.setActive("TUTOR")}
                    selected={props.active === "TUTOR"}
                >
                    <ListItemText primary={"TUTOR"}/>
                </ListItem>
            }
            <ListItem
                button
                onClick={() => props.setActive("HOME")}
                selected={props.active === "HOME"}
            >
                <ListItemText primary={"HOME"}/>
            </ListItem>
            <ListItem
                button
                selected={props.active.includes("SPARTAN")}
                onClick={() => handleOpen("SPARTAN")}
            >
                <ListItemText primary={"SPARTAN"} />
                {openSPARTAN ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openSPARTAN} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                    <ListItem
                        button
                        onClick={() => props.setActive("SPARTAN-1")}
                        className={classes.nested}
                        selected={props.active === "SPARTAN-1"}
                    >
                        <ListItemText primary={"Power Console"}/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => props.setActive("SPARTAN-2")}
                        className={classes.nested}
                        selected={props.active === "SPARTAN-2"}
                    >
                        <ListItemText primary={"Ext. Thermal Console"}/>
                    </ListItem>
                </List>
            </Collapse>
            <ListItem
                button
                selected={props.active.includes("CRONUS")}
                onClick={() => handleOpen("CRONUS")}
            >
                <ListItemText primary={"CRONUS"} />
                {openCRONUS ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openCRONUS} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                    <ListItem
                        button
                        onClick={() => props.setActive("CRONUS-1")}
                        className={classes.nested}
                        selected={props.active === "CRONUS-1"}
                    >
                        <ListItemText primary={"UHF Comms"}/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => props.setActive("CRONUS-2")}
                        className={classes.nested}
                        selected={props.active === "CRONUS-2"}
                    >
                        <ListItemText primary={"S-Band Comms"}/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => props.setActive("CRONUS-3")}
                        className={classes.nested}
                        selected={props.active === "CRONUS-3"}
                    >
                        <ListItemText primary={"Video Comms"}/>
                    </ListItem>
                </List>
            </Collapse>
            <ListItem
                button
                selected={props.active.includes("ETHOS")}
                onClick={() => handleOpen("ETHOS")}
            >
                <ListItemText primary={"ETHOS"} />
                {openETHOS ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openETHOS} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                    <ListItem
                        button
                        onClick={() => props.setActive("ETHOS-1")}
                        className={classes.nested}
                        selected={props.active === "ETHOS-1"}
                    >
                        <ListItemText primary={"Life Support"}/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => props.setActive("ETHOS-2")}
                        className={classes.nested}
                        selected={props.active === "ETHOS-2"}
                    >
                        <ListItemText primary={"Thermal System"}/>
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => props.setActive("ETHOS-3")}
                        className={classes.nested}
                        selected={props.active === "ETHOS-3"}
                    >
                        <ListItemText primary={"Regenerative Life Support"}/>
                    </ListItem>
                </List>
            </Collapse>
            <ListItem
                button
                onClick={() => props.setActive("FLIGHT")}
                selected={props.active === "FLIGHT"}
            >
                <ListItemText primary={"FLIGHT"} />
            </ListItem>
            <ListItem
                button
                onClick={() => props.setActive("CAPCOM")}
                selected={props.active === "CAPCOM"}
            >
                <ListItemText primary={"CAPCOM"} />
            </ListItem>
            <ListItem
                button
                selected={props.active.includes("BME")}
                onClick={() => handleOpen("BME")}
            >
                <ListItemText primary={"BME"} />
                {openBME ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={openBME} timeout={"auto"} unmountOnExit>
                <List component={"div"} disablePadding>
                    <ListItem
                        button
                        onClick={() => props.setActive("BME-1")}
                        className={classes.nested}
                        selected={props.active === "BME-1"}
                    >
                        <ListItemText primary={"EVA Suit"} />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => props.setActive("BME-2")}
                        className={classes.nested}
                        selected={props.active === "BME-2"}
                    >
                        <ListItemText primary={"Vital Signs"}/>
                    </ListItem>
                </List>
            </Collapse>
            <ListItem
                button
                onClick={() => props.setActive("OSTPV")}
                selected={props.active === "OSTPV"}
            >
                <ListItemText primary={"OSTPV"} />
            </ListItem>
            <Divider />
            <ListItem button onClick={props.openEfnModal}>
                <ListItemText primary={"Send EFN"} />
            </ListItem>
        </List>
    )
}

export default NestedList;