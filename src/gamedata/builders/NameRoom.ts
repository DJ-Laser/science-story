import { TerminalOutput } from "../../terminal/terminalState";
import { Choice } from "../framework/Choice";
import { Room } from "../framework/Room";

const defaultUserName = "UserNameNotFound";
export let USER_NAME = defaultUserName;

export class NameSelectRoom implements Room {
  nextRoomId: string;

  constructor(nextRoomId: string) {
    this.nextRoomId = nextRoomId;
  }


  getPrompt(): TerminalOutput[] {
    return [
      "Please enter your username"
    ];
  }

  process(input: string): Choice {
    USER_NAME = input;
    return {
      result: [],
      destinationRoom: this.nextRoomId,
    };
  }
}
