import { Consoles } from "./consoles";
import { User } from "./user";

export type Session = {
  _id: string;
  host_id: string | User;
  session_code: string;
  tutors: string[] | User[];
  consoles: Consoles;
  in_progress: boolean;
  start_time: string;
  _v: number;
}