import { TerminalOutput, TerminalState } from "../terminalState";

export interface TerminalContext {
  process: (input: string, state: TerminalState) => TerminalOutput[];
  // Query if the context is finished taking up the terminal yet
  isFinished: () => boolean;
}
