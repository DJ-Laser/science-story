import { credits } from "../../../gamedata/introRooms";
import { GameContext } from "../GameContext";
import { TerminalContext } from "../TerminalContext";

export const programs = new Map<string, () => TerminalContext>([
  ["nuclear-adventure.sh", () => new GameContext()],
  [
    "credits.txt",
    () => ({
      init: () => {
        //TODO: Finish credits
        return credits;
      },
      process: () => [],
      isFinished: () => true,
    }),
  ],
]);
