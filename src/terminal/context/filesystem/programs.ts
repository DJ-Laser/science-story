import { GameContext } from "../GameContext";
import { TerminalContext } from "../TerminalContext";

export const programs = new Map<string, () => TerminalContext>([
  ["nuclear-adventure.sh", () => new GameContext()],
  ["credits.txt", () => ({
    init: () => {
      //TODO: Finish credits
      return [
        "##### Nuclear Adventure #####",
        "A text based game by Alex K and Devin M",
      ];
    },
    process: () => [],
    isFinished: () => true,
  })],
]);