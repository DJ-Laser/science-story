import { ChoiceRoom } from "./builders/ChoiceRoom";
import { NameSelectRoom, USER_NAME } from "./builders/NameSelectRoom";
import { PressEnterRoom } from "./builders/PressEnterRoom";
import { mkActionRoom, mkRoom } from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

const rooms: () => [string, Room][] = () => [
  [
    "creditsRoom",
    new PressEnterRoom(
      [
        "##### Nuclear Adventure #####",
        "A game by Alex K and Devin M",
        "",
        "### Sources ###",
        "https://www.afhistory.af.mil/FAQs/Fact-Sheets/Article/458993/the-story-of-the-atomic-bomb/",
        "https://www.britannica.com/technology/nuclear-weapon",
        "https://www.afnwc.af.mil/About-Us/History/Trinity-Nuclear-Test/",
        "https://www2.lbl.gov/Publications/Seaborg/bio.htm",
      ],
      "startingRoom",
    ),
  ],

  [
    "startingRoom",
    mkActionRoom(
      [`Booting up nuclear-adventure ${"v0.0.3"}`],
      {
        goto: "nameSelectRoom",
        desc: "Start the program",
        result: "Please enter your name:",
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
        result: ["Please enter your name:"],
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
