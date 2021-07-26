import { Session } from "./session"

export type User = {
  _id: string,
  name: string,
  room: string | Session,
  console: string,
  disconnected: boolean,
}