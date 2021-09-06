import React, {useState, useEffect} from 'react';
import {makeStyles} from "@material-ui/core/styles";

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
            {props.children}
        </div>
    )
}

export default ContentPane;