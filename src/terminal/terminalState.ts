import { TerminalContext } from "./context/TerminalContext";

export interface TerminalState {
  history: HistoryEntry[];
  context: TerminalContext;
  clearIndex: number;
  input: string[];
  inputIndex: number;
}

export function clearTerminal(state: TerminalState) {
  state.clearIndex = state.history.length;
}

export interface TerminalInput {
  type: "input";
  input: string;
}

export interface StringOutput {
  type: "output";
  output: string;
}

export function outputFromString(output: string): StringOutput {
  return { type: "output", output };
}

export function outputFromStrings(strings: string[]): StringOutput[] {
  return strings.map(outputFromString);
}

export type TerminalOutput = StringOutput;

export type HistoryEntry =
  | TerminalInput
  | TerminalOutput;
