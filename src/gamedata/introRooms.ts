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
        goto: "creditsRoom",
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
        new ChoiceRoom(d, c, [() => `Is the name "${USER_NAME}" correct?`]),
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
    new PressEnterRoom(
      [
        () =>
          `Hello ${USER_NAME}, and welcome to the interactive history lesson.`,
        "Today you are going to go on an adventure through time and space to be able to speak to people who witnessed the atomic bomb firsthand.",
        'You will start by meeting a very famous scientist, the man known as the "father of the atomic bomb"',
      ],
      "beginCh1Room",
    ),
  ],
  [
    "beginCh1Room",
    new PressEnterRoom(
      [
        "You see the world around you disolving and becomng void.",
        "You also somehow sense yourself travlling back in time.",
        "The feeling is fuzzy, but you think it must be the early 1940s",
        "Then, the world begins reshaping itself and suddenly...",
      ],
      "ch1-startingRoom",
    ),
  ],
  [
    "finaleRoom",
    new PressEnterRoom(
      [
        "Congratulations! You have completed Nuclear Adventure.",
        "We hope you enjoyed, and maybe even learned something along the way.",
        "",
        "Thanks for playing :)",
      ],
      "creditsRoom",
    ),
  ],
];

export const introRooms: RoomCollection = {
  getRooms: rooms,
  prefix: "intro-",
};
