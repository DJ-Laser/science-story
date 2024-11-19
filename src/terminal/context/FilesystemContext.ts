import {
  clearTerminal,
  outputFromStrings,
  TerminalOutput,
  TerminalState,
} from "../terminalState";
import { immerable } from "immer";
import { TerminalContext } from "./TerminalContext";
import { GameContext } from "./GameContext";

type OutputAction =
  | { action: "program"; program: TerminalContext }
  | { action: "clear" };

type BuiltinOutput =
  | OutputAction
  | string[] & { action?: undefined };

interface BuiltinCommand {
  args?: string[];
  helpText: string;
  execute: (args: string[], state: TerminalState) => BuiltinOutput;
}

const programs = new Map<string, () => TerminalContext>([
  ["nuclear-adventure.sh", () => new GameContext()],
  ["credits.txt", () => ({
    init: () => {
      //TODO: Finish credits
      const output = [
        "##### Nuclear Adventure #####",
        "A text based game by Alex K and Devin M",
      ];
      return outputFromStrings(output);
    },
    process: () => [],
    isFinished: () => true,
  })],
]);

const commands = new Map<string, BuiltinCommand>([
  ["clear", {
    helpText: "Clear the terminal",
    execute: () => {
      return { action: "clear" };
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
        return [`No such program: "${programName}"`];
      }

      // We know the map has programName because of the above early return
      const programConstructor = programs.get(programName)!;

      return { action: "program", program: programConstructor() };
    },
  }],
]);

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
      `or type "help" to explore other terminal commands.`,
    ];
    return outputFromStrings(output);
  }

  processCommand(cmd: string, state: TerminalState): TerminalOutput[] {
    const parts = cmd.trim().split(" ");
    const commandName = parts[0];
    const args = parts.slice(1);

    switch (commandName) {
      case "":
        return [];
      case "help": {
        const output = ["Available commands:"];
        output.push("• help - Show this help message");

        for (const [name, builtin] of commands) {
          const args = builtin.args?.map((a) => `[${a}] `).join("") ?? "";
          output.push(`• ${name} ${args}- ${builtin.helpText}`);
        }

        return outputFromStrings(output);
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
          return outputFromStrings(output);
        }
      }
    }

    return outputFromStrings([
      `Command not found: ${commandName}. Type 'help' for available commands.`,
    ]);
  }

  process(input: string, state: TerminalState): TerminalOutput[] {
    let output;

    if (this.programContext) {
      output = this.programContext.process(input, state);
    } else {
      output = this.processCommand(input, state);
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
