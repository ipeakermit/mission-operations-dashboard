import React, {useState, useEffect} from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import NestedList from "./NestedList";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({

})

interface NavDrawerProps {
    userType: string;
    active: string;
    setActive: (newTab: string) => void;
    openEfnModal: () => void;
}

const NavDrawer: React.FC<NavDrawerProps> = (props) => {
    const classes = useStyles();

    return (
        <Drawer
            anchor={"left"}
            variant={"permanent"}
        >
            <NestedList userType={props.userType} active={props.active} setActive={props.setActive} openEfnModal={props.openEfnModal}/>
        </Drawer>
    )
}

export default NavDrawer;