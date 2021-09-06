import {useEffect, useState} from 'react';
import {DateTime} from "luxon";
import {useSessionContext} from "../context/SessionContext";

export const useInitSessionTime = () => {
    const {session} = useSessionContext();

    const getCurrentSessionTime = () => {
        while (!session);
        let startTime = DateTime.fromMillis(parseInt(session.start_time));
        let currentTime = DateTime.utc();
        let timeDiff = currentTime.diff(startTime);
        let newSessionTime = DateTime.fromISO("2019-11-15T15:00:00", {zone: 'utc'}).plus(timeDiff);
        return newSessionTime;

    }

    return {getCurrentSessionTime};
}