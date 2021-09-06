import React, {useState, useEffect} from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import NestedList from "./NestedList";
import {makeStyles} from "@material-ui/core/styles";
import NavDrawer from "./NavDrawer";
import ConsoleTabPanels from "./ConsoleTabPanels";
import EFNSubmissionModal from "./FLIGHT/EFNSubmissionModal";
import socket from "../../util/Socket";
import {useSessionContext} from "../../context/SessionContext";
import {useLocalStorageMap} from "../../util/useLocalStorageMap";

const useStyles = makeStyles({

})

interface SessionInterfaceProps {
    userType: string;
}

const SessionInterface: React.FC<SessionInterfaceProps> = (props) => {
    const classes = useStyles();
    const [ reconnectMap, addMapKey, deleteMapKey] = useLocalStorageMap("reconnectMap", new Map());
    const {session} = useSessionContext();
    const [activeTab, setActiveTab] = useState("SPARTAN-1");
    const [efnModalOpen, setEfnModalOpen] = useState<boolean>(false)
    const [visitedTabs, setVisitedTabs] = useState<string[]>([]);

    const changeTab = (newTab: string) => {
        if (props.userType !== "tutor" && !visitedTabs.includes(newTab) && session) {
                setVisitedTabs([...visitedTabs, newTab]);
                socket.emit("FIRST_TAB_OPEN", session._id, session.session_code, reconnectMap.get(session.session_code),  newTab);
        }
        setActiveTab(newTab);
    }

    return (
        <React.Fragment>
            <NavDrawer userType={props.userType} active={activeTab} setActive={changeTab} openEfnModal={() => setEfnModalOpen(true)}/>
            <ConsoleTabPanels active={activeTab}/>
            <EFNSubmissionModal open={efnModalOpen} handleClose={() => setEfnModalOpen(false)} />
        </React.Fragment>
    )
}

export default SessionInterface;