import { normalizeToArray, OneOrArray, TerminalOutput } from "../../terminal/terminalState";
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
    return "What will you chose to do next?";
  }
}

export interface ChoiceBuilder {
  // destinationRoom
  goto: string;
  name: string;
  result: OneOrArray<TerminalOutput>;
}

export function mkRoom(
  desc: OneOrArray<TerminalOutput>,
  ...choices: ChoiceBuilder[]
): Room {
  const description = normalizeToArray(desc);
  const outputChoices = choices.map(({ goto, name, result }) => ({
    name,
    description: Array.isArray(result) ? result : [result],
    destinationRoom: goto,
  }));

  return new SimpleRoom(description, outputChoices);
}

export interface RoomCollection {
  getRooms: () => ([string, Room])[];
  prefix: string;
}
