import { mkActionRoom, mkDialougeRoom, mkQuestionRooms } from "./builders/roomBuilders";
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
      result: "It glitched or smth idk",
    }, {
      goto: "dialogRoom",
      desc: "Have a conversation or smth",
      result: `You see a person over there, you walk toward him`,
    }),
  ],
  [
    "dialogRoom",
    mkDialougeRoom(`The mysterious person says "Hi!"`, {
      goto: "",
      desc: "Hi",
      result: `The mysterious person takes a second to process this`,
    }, {
      goto: "questionRoom",
      desc:
        "I am going to repeatedly question you now to test the game systems",
      result: "The mysterious figure looks annoyed",
    }),
  ],
  ...mkQuestionRooms("questionRoom", {
    desc: "The mysetrious figure stands silent",
    doneGoto: "startingRoom",
    questions: [{
      question: "Hi, whats ur name",
      result: "Mysterious figure: ...",
    }, {
      question: "So like why wont you talk",
      result: "Mysterious figure: ...",
    }, {
      question: "EEEEEEEEEEEEEEEEE",
      result: "Mysterious figure: ...",
    }, {
      goto: "nullRoom",
      question: "Aight ima glitch out now",
      result: "Nullpointer exception again ._.",
    }]
  })
];

export const testRooms: RoomCollection = {
  getRooms: introductionRooms,
  prefix: "intro-",
};
