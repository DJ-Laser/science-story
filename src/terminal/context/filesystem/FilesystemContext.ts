import {
  clearTerminal,
  normalizeToArray,
  OneOrArray,
  TerminalOutput,
  TerminalState,
} from "../../terminalState";
import { immerable } from "immer";
import { TerminalContext } from "../TerminalContext";
import { commands } from "./commands";

export default class FilesystemContext implements TerminalContext {
  [immerable] = true;
  programContext: TerminalContext | null;

  constructor() {
    this.programContext = null;
  }

  init() {
    return [
      "Welcome to the terminal!",
      `Type "run nuclear-adventure.sh" to start the game`,
      `or type "help" to explore other terminal commands.`,
    ];
  }

  processCommand(
    cmd: string,
    state: TerminalState,
  ): OneOrArray<TerminalOutput> {
    const parts = cmd.trim().split(" ");
    const commandName = parts[0];
    const args = parts.slice(1);

    switch (commandName) {
      case "":
        return [];
      case "help": {
        const output = ["Available commands:"];
        output.push("• help - Show this help message");

        for (const [name, command] of commands) {
          const args = command.args?.map((a) => `[${a}] `).join("") ?? "";
          output.push(`• ${name} ${args}- ${command.helpText}`);
        }

        return output;
      }
    }

    const command = commands.get(commandName);
    if (command) {
      const output = command.execute(args, state);
      switch (output.action) {
        case "clear": {
          clearTerminal(state);
          return [];
        }
        case "program": {
          this.programContext = output.program;
          return this.programContext.init(args.join(" "), state);
        }
        case undefined: {
          return output;
        }
      }
    }

    return `Command not found: ${commandName}. Type 'help' for available commands.`;
  }

  process(input: string, state: TerminalState): TerminalOutput[] {
    let output: TerminalOutput[];

    if (this.programContext) {
      output = this.programContext.process(input, state);
    } else {
      output = normalizeToArray(this.processCommand(input, state));
    }

    if (this.programContext?.isFinished()) {
      this.programContext = null;
    }

    return output;
  }

  isFinished() {
    return false;
  }
}
