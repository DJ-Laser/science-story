import {
  outputFromString,
  outputFromStrings,
  TerminalOutput,
} from "../../terminal/terminalState";
import { Choice } from "./Choice";

export interface Room {
  choices: Choice[];
  getDescription(): TerminalOutput[];
  getPrompt(): TerminalOutput;
}

export class SimpleRoom implements Room {
  description: TerminalOutput[];
  choices: Choice[];

  constructor(description: TerminalOutput[], choices: Choice[]) {
    this.description = description;
    this.choices = choices;
  }

  getDescription(): TerminalOutput[] {
    return this.description;
  }

  getPrompt(): TerminalOutput {
    return outputFromString("What will you chose to do next?");
  }
}

export interface ChoiceBuilder {
  // destinationRoom
  goto: string;
  name: string;
  result: string | TerminalOutput[];
}

function stringOrOutput(output: string | TerminalOutput[]): TerminalOutput[] {
  if (Array.isArray(output)) return output;

  return outputFromStrings([output]);
}

export function mkRoom(
  desc: string | TerminalOutput[],
  ...choices: ChoiceBuilder[]
): Room {
  const description = stringOrOutput(desc);
  const outputChoices = choices.map(({ goto, name, result }) => ({
    name,
    description: stringOrOutput(result),
    destinationRoom: goto,
  }));

  return new SimpleRoom(description, outputChoices);
}

export interface RoomCollection {
  getRooms: () => ([string, Room])[];
  prefix: string;
}
