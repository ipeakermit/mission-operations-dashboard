import { Session } from "./session"

export type User = {
  socket_id: string,
  name: string,
  room: string | Session,
  console: string
}