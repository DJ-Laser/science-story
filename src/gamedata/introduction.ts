import { mkActionRoom } from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

const introductionRooms: () => ([string, Room])[] = () => [
  [
    "nullRoom",
    mkActionRoom(
      "This is a test room, if you see this, something went wrong :P",
      {
        goto: "startingRoom",
        desc: "Go to start",
        result: [],
      },
    ),
  ],
  [
    "startingRoom",
    mkActionRoom("Starting Intro Room", {
      goto: "startingRoom",
      desc: "Loop",
      result: "Loop loop yeet",
    }, {
      goto: "nullRoom",
      desc: "NullPointerException",
      result: "Null room time :)",
    }),
  ],
];

export const introChapter: RoomCollection = {
  getRooms: introductionRooms,
  prefix: "intro-",
};
