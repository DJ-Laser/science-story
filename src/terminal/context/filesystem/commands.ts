import { OneOrArray, TerminalOutput, TerminalState } from "../../terminalState";
import { TerminalContext } from "../TerminalContext";
import { programs } from "./programs";

type OutputAction =
  | { action: "program"; program: TerminalContext }
  | { action: "clear" };

type CommandOutput =
  | OutputAction
  | (OneOrArray<TerminalOutput> & { action?: undefined });

interface BuiltinCommand {
  args?: string[];
  helpText: string;
  execute: (args: string[], state: TerminalState) => CommandOutput;
}

export const commands = new Map<string, BuiltinCommand>([
  [
    "clear",
    {
      helpText: "Clear the terminal",
      execute: () => {
        return { action: "clear" };
      },
    },
  ],
  [
    "date",
    {
      helpText: "Show current date and time",
      execute: () => new Date().toLocaleString(),
    },
  ],
  [
    "echo",
    {
      args: ["text"],
      helpText: "Display text",
      execute: (args) => args.join(" "),
    },
  ],
  [
    "ls",
    {
      helpText: "List available programs",
      execute: () => {
        const output = [];
        for (const name of programs.keys()) {
          output.push(name);
        }

        return output;
      },
    },
  ],
  [
    "run",
    {
      args: ["program"],
      helpText: "Run a specified program",
      execute: (args) => {
        if (args.length === 0) {
          return "Specify a program to run";
        } else if (args.length > 1) {
          return "Too many agruments: specify one program to run";
        }

        const programName = args[0];
        if (!programs.has(programName)) {
          return `No such program: "${programName}"`;
        }

        // We know the map has programName because of the above early return
        const programConstructor = programs.get(programName)!;

        return { action: "program", program: programConstructor() };
      },
    },
  ],
]);
