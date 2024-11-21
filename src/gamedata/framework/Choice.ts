import { TerminalOutput } from "../../terminal/terminalState";

export interface Choice {
  result: TerminalOutput[];
  destinationRoom: string;
}

export interface NamedChoice extends Choice {
  description: string;
}

export class ErrorChoice implements Choice {
  result: TerminalOutput[];
  destinationRoom = "";

  constructor(output: TerminalOutput[]) {
    this.result = output;
  }
}
