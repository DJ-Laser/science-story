import { mkRoom, Room, RoomCollection } from "./framework/Room";

const introductionRooms: () => ([string, Room])[] = () => [
  [
    "nullRoom",
    mkRoom("This is a test room, if you see this, something went wrong :P", {
      goto: "startingRoom",
      name: "Go to start",
      result: [],
    }),
  ],
  [
    "startingRoom",
    mkRoom("Starting Intro Room", {
      goto: "startingRoom",
      name: "Loop",
      result: "Loop loop yeet",
    }, {
      goto: "nullRoom",
      name: "NullPointerException",
      result: "Null room time :)",
    }),
  ],
];

export const introChapter: RoomCollection = {
  getRooms: introductionRooms,
  prefix: "intro-",
};
