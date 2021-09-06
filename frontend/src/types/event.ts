export type Event = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    extendedProps: {
        astronaut: string;
        procedure: string;
        location: string;
    }
    classNames: string[]
}

export type CalEvent = {
    id: string,
    resourceId: string,
    astronaut: string,
    title: string,
    start: string,
    end: string,
    procedure: string,
    location: string,
    classNames: string[],
    color: string,
    borderColor: string,
}

export type DBEvent = {
    _id: string,
    event_id: number,
    session_id: string,
    resource_id: string,
    astronaut: string,
    title: string,
    start: string,
    end: string,
    procedure: string,
    location: string,
    classNames: string[],
    color: string,
    borderColor: string
    _v: number
}