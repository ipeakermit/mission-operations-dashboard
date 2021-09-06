import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {Paper} from "@material-ui/core";
import {useInitSessionTime} from "../../util/useInitSessionTime";
import {CalEvent, DBEvent, Event} from '../../types/event'
import OSTPVModal from "./OSTPVModal";
import socket from "../../util/Socket";
import {DateTime} from "luxon";

const useStyles = makeStyles(() => ({
    container: {
        height: "90vh",
    },
    event: {
        height: "65px",
        backgroundColor: "#DDDDDD",
        borderColor: "#848C8C",
        "&.ku, &.s, &.daynight, &.orbits": {
            height: "25px"
        },
        "&.completed": {
            backgroundColor: "#848C8C",
            borderColor: "#000",
        },
        "&.sequenced1": {
            backgroundColor: "#00B0F0",
            borderColor: "#000",
        },
        "&.sequenced2": {
            backgroundColor: "#00B050",
            borderColor: "#000",
        },
        "&.sequenced3": {
            backgroundColor: "#FFFF00",
            borderColor: "#000",
        },
        "&.active": {
            backgroundColor: "#A9D08E",
            borderColor: "#000",
        },
        "&:hover": {
            cursor: "pointer",
        },
        "&.daynight:hover": {
            cursor: "default"
        },
        "&.orbits:hover": {
            cursor: "default"
        },
        "&.ku:hover": {
            cursor: "default"
        },
        "&.s:hover": {
            cursor: "default"
        }
    },
    paper: {
        height: "90%",
        padding: "20px"
    },
    resourceLane: {
        "&[data-resource-id='ku'], &[data-resource-id='s'], &[data-resource-id='do'], &[data-resource-id='dn']": {
            height: "15px"
        }
    },
    slotLabel: {
        "& a": {
            color: "#FFF",
            textDecoration: "none"
        }
    }
}))

interface EventClick {
    el: HTMLElement;
    event: any;
    jsEvent: MouseEvent;
    view: any;
}

interface OSTPVProps {

}

const OSTPV: React.FC<OSTPVProps> = (props) => {
    const classes = useStyles();
    const {getCurrentSessionTime} = useInitSessionTime();
    const [nowTime, setNowTime] = useState<string>(getCurrentSessionTime().toISO());
    const [events, setEvents] = useState<CalEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

    useEffect(() => {
        socket.off("UPDATE_EVENTS").on("UPDATE_EVENTS",(events: DBEvent[]) => {
            setEvents(events.map((ev) => ({
                    id: ev.event_id.toString(),
                    resourceId: ev.resource_id,
                    astronaut: ev.astronaut,
                    title: ev.title,
                    start: ev.start,
                    end: ev.end,
                    procedure: ev.procedure,
                    location: ev.location,
                    classNames: ev.classNames,
                    color: ev.color,
                    borderColor: ev.borderColor
                }))
            );
        })
    }, [])

    useEffect(() => {
        if (selectedEvent) {
            let newSelectedEvent = events.find(event => event.id === selectedEvent.id);
            if (newSelectedEvent) {
                setSelectedEvent({
                    id: newSelectedEvent.id,
                    title: newSelectedEvent.title,
                    start: DateTime.fromISO(newSelectedEvent.start, {zone: 'utc'}).toJSDate(),
                    end: DateTime.fromISO(newSelectedEvent.end, {zone: 'utc'}).toJSDate(),
                    extendedProps: {
                        astronaut: newSelectedEvent.astronaut,
                        procedure: newSelectedEvent.procedure,
                        location: newSelectedEvent.location,
                    },
                    classNames: newSelectedEvent.classNames,
                });
            }
        }
    }, [events])

    const handleEventClick = (info: EventClick) => {
        if (info.event.id >= 200) {
            setSelectedEvent(info.event);
        }
    }

    return (
        <Container className={classes.container}>
            <Paper variant={"outlined"} className={classes.paper}>
                <FullCalendar
                    eventClassNames={classes.event}
                    eventMinWidth={0}
                    eventTextColor={"#000"}
                    events={events}
                    expandRows={true}
                    eventClick={handleEventClick}
                    headerToolbar={{start: '', center: '', end: '',}}
                    height={700}
                    initialView='resourceTimeline'
                    navLinks={false}
                    now={nowTime}
                    nowIndicator={true}
                    plugins={[resourceTimelinePlugin]}
                    resourceAreaWidth={180}
                    resourceOrder={"order"}
                    resourceLabelClassNames={classes.resourceLane}
                    resourceLaneClassNames={classes.resourceLane}
                    resources={[{order: 1, id: 'ku', title: 'ALL KU AVAILABILITY'},
                        {order: 2, id: 's', title: 'ALL S AVAILABILITY'},
                        {order: 3, id: 'dn', title: 'DAY/NIGHT'},
                        {order: 4, id: 'do', title: 'DailyOrbit'},
                        {order: 5, id: 'astro1', title: 'ISS CDR'},
                        {order: 6, id: 'astro2', title: 'FE-1'},
                        {order: 7, id: 'astro3', title: 'FE-2'},
                        {order: 8, id: 'astro4', title: 'FE-3'},
                        {order: 9, id: 'astro5', title: 'FE-4'},
                        {order: 10, id: 'astro6', title: 'FE-5'}]}
                    schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
                    scrollTime={'13:30:00'}
                    slotDuration={"00:15:00"}
                    slotLabelClassNames={classes.slotLabel}
                    slotLabelInterval={"00:30:00"}
                    slotMinWidth={50}
                    timeZone={"UTC"}
                />
            </Paper>
            <OSTPVModal event={selectedEvent} open={selectedEvent !== null} handleClose={() => setSelectedEvent(null)} />
        </Container>
    )
}
export default OSTPV;