import React, {useState, useContext, useEffect} from 'react';
import {Session} from "../types/session";
import {DateTime} from "luxon";

type SessionContextType = {
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
    userID: string | null,
    setUserID: React.Dispatch<React.SetStateAction<string | null>>,
}

const sessionContextDefaultValues = {
    session: null,
    setSession: () => {},
    userID: null,
    setUserID: () => {},
}

export const SessionContext = React.createContext<SessionContextType>(
    sessionContextDefaultValues,
)

export const SessionProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(sessionContextDefaultValues.session);
    const [userID, setUserID] = useState<string | null>(null);

    return (
        <SessionContext.Provider value={{ session, setSession, userID, setUserID }}>
            {children}
        </SessionContext.Provider>
    )
}

export function useSessionContext() {
    return useContext(SessionContext);
}