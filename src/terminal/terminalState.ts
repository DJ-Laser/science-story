import { TerminalContext } from "./context/TerminalContext";

export interface TerminalState {
  history: HistoryEntry[];
  context: TerminalContext;
  clearIndex: number;
  input: string[];
  inputIndex: number;
}

export interface TerminalInput {
  type: "input";
  input: string;
}

export interface StringOutput {
  type: "output";
  output: string;
}

export function outputFromStrings(strings: string[]): StringOutput[] {
  return strings.map((output) => ({ type: "output", output }));
}

export type TerminalOutput = StringOutput;

export type HistoryEntry =
  | TerminalInput
  | TerminalOutput;
