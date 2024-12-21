import { TerminalOutput } from "../../terminal/terminalState";
import { Choice } from "./Choice";

export interface Room {
  getPrompt(): TerminalOutput[];
  process(input: string): Choice;
}

export interface RoomCollection {
  getRooms: () => [string, Room][];
  prefix: string;
}
