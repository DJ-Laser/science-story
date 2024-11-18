import {
  outputFromStrings,
  TerminalOutput,
  TerminalState,
} from "../terminalState";
import { immerable } from "immer";
import { TerminalContext } from "./TerminalContext";

interface BuiltinCommand {
  args?: string[];
  helpText: string;
  execute: (args: string[], state: TerminalState) => string[];
}

const programs = new Map<string, TerminalContext | null>([
  ["nuclear-adventure.sh", null],
  ["credits.txt", null],
]);

const commands = new Map<string, BuiltinCommand>([
  ["clear", {
    helpText: "Clear the terminal",
    execute: (_, state) => {
      state.clearIndex = state.history.length;
      return [];
    },
  }],
  ["date", {
    helpText: "Show current date and time",
    execute: () => [new Date().toLocaleString()],
  }],
  ["echo", {
    args: ["text"],
    helpText: "Display text",
    execute: (args) => [args.join(" ")],
  }],
  ["ls", {
    helpText: "List available programs",
    execute: () => {
      const output = [];
      for (const name of programs.keys()) {
        output.push(name);
      }

      return output;
    },
  }],
  ["run", {
    args: ["program"],
    helpText: "Run a specified program",
    execute: (args) => {
      if (args.length === 0) {
        return ["Specify a program to run"];
      } else if (args.length > 1) {
        return ["Too many agruments: specify one program to run"];
      }

      const programName = args[0];
      if (!programs.has(programName)) {
        return [`No such program: "${programName}"`]
      }

      //const program = programs.get(programName);

      return ["TODO: Run program"];
    },
  }],
]);

function processCommand(cmd: string, state: TerminalState): string[] {
  const parts = cmd.trim().split(" ");
  const command = parts[0];
  const args = parts.slice(1);

  const builtin = commands.get(command);
  if (builtin) {
    return builtin.execute(args, state);
  }

  switch (command) {
    case "":
      return [];
    case "help": {
      const output = ["Available commands:"];
      output.push("• help - Show this help message");

      for (const [name, builtin] of commands) {
        const args = builtin.args?.map((a) => `[${a}] `).join("") ?? "";
        output.push(`• ${name} ${args}- ${builtin.helpText}`);
      }

      return output;
    }
    default:
      return [
        `Command not found: ${command}. Type 'help' for available commands.`,
      ];
  }
}

export default class FilesystemContext implements TerminalContext {
  [immerable] = true;
  programContext: TerminalContext | null;

  constructor() {
    this.programContext = null;
  }

  init() {
    const output = [
      "Welcome to the terminal!",
      `Type "run nuclear-adventure.sh" to start the game`,
      `or type "help" to explore other terminal commands.`
    ];
    return outputFromStrings(output);
  }

  process(input: string, state: TerminalState): TerminalOutput[] {
    if (this.programContext) {
      const output = this.programContext.process(input, state);
      if (this.programContext.isFinished()) {
        this.programContext = null;
      }

      return output;
    } else {
      return outputFromStrings(processCommand(input, state));
    }
  }

  isFinished() {
    return false;
  }
}
