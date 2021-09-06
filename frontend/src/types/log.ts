import { User } from "./user"
import {Session} from "./session";

export type Log = {
    _id: string,
    session_id: string | Session,
    target_id: User,
    message: string,
    createdAt: string,
}