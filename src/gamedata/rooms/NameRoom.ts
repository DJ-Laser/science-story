import { TerminalOutput } from "../../terminal/terminalState";
import { Choice } from "../framework/Choice";
import { Room } from "../framework/Room";

const defaultUserName = "UserNameNotFound";
export let USER_NAME = defaultUsername;

export class NameRoom implements Room {
  getPrompt(): TerminalOutput[] {
    throw new Error("Method not implemented.");
  }

  process(input: string): Choice {
    USER_NAME = input;
  }
}
