import { TerminalOutput } from "../../terminal/terminalState";
import { Choice } from "../framework/Choice";
import { Room } from "../framework/Room";

export class PressEnterRoom implements Room {
  static defaultPrompt = ["Press enter to continue"];

  description: TerminalOutput[];
  prompt: TerminalOutput[];
  nextRoomId: string;
  result: TerminalOutput[];

  constructor(
    description: TerminalOutput[],
    nextRoomId: string,
    result: TerminalOutput[] = [],
    prompt: TerminalOutput[] = PressEnterRoom.defaultPrompt,
  ) {
    this.description = description;
    this.nextRoomId = nextRoomId;
    this.result = result;
    this.prompt = prompt;
  }

  getPrompt(): TerminalOutput[] {
    const description =
      this.description.length === 0 ? [] : [...this.description, "\n"];
    const prompt = this.prompt.length === 0 ? [] : [...this.prompt, "\n"];

    return [...description, ...prompt];
  }

  process(): Choice {
    return {
      result: this.result,
      destinationRoom: this.nextRoomId,
    };
  }
}
