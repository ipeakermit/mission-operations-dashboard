import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import {useSessionTime} from "../../util/useSessionTime";

const useStyles = makeStyles(() => ({
    time: {
        textAlign: "end"
    },
}))

interface OSTPVClockProps {

}

const OSTPVClock: React.FC<OSTPVClockProps> = (props) => {
    const classes = useStyles();
    const {sessionTime} = useSessionTime();

    return (
        <Typography className={classes.time} variant={"h6"}>{sessionTime?.toFormat("ooo/HH:mm:ss")} GMT</Typography>
    )
}
export default OSTPVClock;