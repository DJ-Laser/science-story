import { TerminalOutput } from "../../terminal/terminalState";

export interface Choice {
  name: string;
  description: TerminalOutput[];
  destinationRoom: string;
}
