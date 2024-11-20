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

export function toOutputEntry(output: TerminalOutput): TerminalOutputEntry {
  return (typeof output === "object") ? output : { type: "output", output };
}

export function toOutputEntries(
  strings: TerminalOutput[],
): TerminalOutputEntry[] {
  return strings.map(toOutputEntry);
}

export type TerminalOutputEntry = StringOutput;

export type HistoryEntry =
| TerminalInput
| TerminalOutputEntry;

export type TerminalOutput = string | TerminalOutputEntry;
export type OneOrArray<T> = T | T[];

export function normalizeToArray<T>(x: OneOrArray<T>) {
  return Array.isArray(x) ? x : [x];
}
