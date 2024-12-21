import { TerminalOutput } from "../../terminal/terminalState";
import { Choice, ErrorChoice } from "../framework/Choice";
import { Room } from "../framework/Room";

const defaultUserName = "UserNameNotFound";
export let USER_NAME = defaultUserName;

export class NameSelectRoom implements Room {
  nextRoomId: string;

  constructor(nextRoomId: string) {
    this.nextRoomId = nextRoomId;
  }

  getPrompt(): TerminalOutput[] {
    return [];
  }

  process(input: string): Choice {
    if (input.trim() === "") {
      return new ErrorChoice(["Please enter a valid name"]);
    }

    USER_NAME = input.trim();
    return {
      result: [],
      destinationRoom: this.nextRoomId,
    };
  }
}
