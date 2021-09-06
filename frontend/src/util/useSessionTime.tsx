import {useEffect, useState} from 'react';
import {DateTime} from "luxon";
import {useSessionContext} from "../context/SessionContext";

export const useSessionTime = () => {
    const {session} = useSessionContext();
    const [sessionTime, setSessionTime] = useState<DateTime>(DateTime.fromISO("2019-11-15T15:00:00", {zone: 'utc'}));

    useEffect(() => {
        const updateSessionTime = () => {
            // Calculate difference between session start time and current time and add to scenario start time.
            if (session?.start_time && session?.in_progress) {
                let startTime = DateTime.fromMillis(parseInt(session.start_time));
                let currentTime = DateTime.utc();
                let timeDiff = currentTime.diff(startTime);
                let newSessionTime = DateTime.fromISO("2019-11-15T15:00:00", {zone: 'utc'}).plus(timeDiff);
                setSessionTime(newSessionTime);
            }
        }

        const interval = setInterval(() => {
            updateSessionTime();
        }, 1000);
        return () => clearInterval(interval);
    }, [session?.start_time, session?.in_progress])

    return {sessionTime};
}