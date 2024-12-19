import {
  mkActionRoom,
  mkDialougeRoom,
  mkQuestionRooms,
} from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

const rooms: () => [string, Room][] = () => [
  [
    "startingRoom",
    mkActionRoom(
      [
        "You are in a lab. There are beakers and large amounts of math on a chalkboard.",
        "There is a person coming up to you. He appears to be a scientist who works here.",
      ],
      {
        goto: "meetingRoom",
        desc: "Approach the scientist",
        result: [],
      },
    ),
  ],
  [
    "meetingRoom",
    mkDialougeRoom(
      'Scientist: "Ah hello. You must be the new researcher who will be joining us today."',
      {
        goto: "questionRoom1",
        desc: "What is this place?",
        result: [
          "Scientist: This is the Los Alamos Laboratory, a state of the art facility for research into nuclear weapons.",
          "Ah, but where are my manners? My name is Robbert Oppenheimer. It is good to have you here.",
        ],
      },
      {
        goto: "questionRoom1",
        desc: "And who are you?",
        result: [
          "J Robert Oppenheimer: I am Robert Oppenheimer. The lead scientist at this facility.",
        ],
      },
    ),
  ],
  ...mkQuestionRooms("questionRoom1", {
    doneGoto: "ch2-startingRoom",
    desc: [
      'J Robert Oppenheimer: "Our work is on a top secret operation known as the Manhattan project."',
      '"We are working on developing the kind of nuclear weapons that could lead to a decisive end to the war."',
    ],
    questions: [
      {
        question: "Tell me more about the Manhattan project?",
        result: [
          "J Robert Oppenheimer: The Manhattan project is a secret project working on developing weapons capable of ending the war in favor of the allies.",
          "Scientists from both Canada and The United Kindoms have joined us to work on this project. The Manhattan project is not the first project researching atomic weapons, but as far as we can tell the Germans have gotten nowhere since they started.",
        ],
      },
      {
        question: "Tell me more about the weapons being developed?",
        result:
          "J Robert Oppenheimer: We are developing nuclear bombs. Nuclear bombs use nuclear energy to create huge reactions of power and turn that power into an explosion of huge magnitude.",
      },
      {
        question: "Tell me more about nuclear energy and how it is generated?",
        result: [
          "J Robert Oppenheimer: Nuclear energy is the energy generated when atoms split apart, the two ways this is generated is fusion or fission. Fusion refers to the merging of two lighter atoms into heavier atoms, and Fission is the opposite, splitting one heavier atom into two smaller atoms.",
          "This causes a chain reaction that will generate huge amounts of energy because the process releases neutrons that will collide with other atoms, causing the same process to occur.",
        ],
      },
      {
        question: "Tell me about yourself?",
        result:
          "J Robert Oppenheimer: I direct the project here at the Los Alamos laboratory, where we are designing the bombs. The other laboratories are at hanford, washington and Oak ridge, Tennessee.",
      },
      {
        goto: "ch2-startingRoom",
        question: "I have no questions",
        result: "",
      },
    ],
  }),
];

export const ch1Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch1-",
};
