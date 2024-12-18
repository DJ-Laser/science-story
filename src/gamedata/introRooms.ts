import { ChoiceRoom } from "./builders/ChoiceRoom";
import { NameSelectRoom, USER_NAME } from "./builders/NameRoom";
import { mkActionRoom, mkRoom } from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

const rooms: () => [string, Room][] = () => [
  [
    "startingRoom",
    mkActionRoom(
      [`Booting up nuclear-adventure ${"v0.0.3"}`],
      {
        goto: "nameSelectRoom",
        desc: "Start the program",
        result: "Please enter your username",
      },
      {
        goto: "todo-credits",
        desc: "View the credits",
        result: [],
      },
    ),
  ],
  ["nameSelectRoom", new NameSelectRoom("confirmNameRoom")],
  [
    "confirmNameRoom",
    mkRoom(
      (d, c) =>
        new ChoiceRoom(d, c, [() => `Is the name \`${USER_NAME}\` correct?`]),
      "",
      {
        goto: "startSimulationRoom",
        desc: "Yes",
        result: [],
      },
      {
        goto: "nameSelectRoom",
        desc: "No",
        result: [],
      },
    ),
  ],
  [
    "startSimulationRoom",
    mkActionRoom(
      [
        () =>
          `Hello ${USER_NAME}, and welcome to the interactive history lesson.`,
        "Today you are going to go on an adventure through time and be able to speak to people and learn about how the atomic bomb was designed and have evolved overtime.",
      ],
      {
        goto: "ch1-startingRoom",
        desc: "Start the simulation",
        result: [],
      },
    ),
  ],
];

export const introRooms: RoomCollection = {
  getRooms: rooms,
  prefix: "intro-",
};
