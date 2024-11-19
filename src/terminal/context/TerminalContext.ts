import { TerminalOutput, TerminalState } from "../terminalState";

export interface TerminalContext {
  // Get initial output for the context
  init: (input: string, state: TerminalState) => TerminalOutput[];
  // Process a command or action
  process: (input: string, state: TerminalState) => TerminalOutput[];
  // Query if the context is finished taking up the terminal yet
  isFinished: () => boolean;
}
