import { Consoles } from "./consoles";
import { User } from "./user";
import {Session} from "./session";

export type EFN = {
    _id: string;
    session_id: Session;
    sender_id: User;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    comments: string[];
    _v: number;
}