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
        "You are in a bunker. The bunker has a way to see outside.",
        "The outside is a desert that has nothing you can see outside of sand and rock.",
        "The bunker has large amounts of scientific equipment that you can not tell what the use is for.",
        "Oppenheimer is walking over to a scientist who seems to be in charge.",
      ],
      {
        goto: "meetingRoom",
        desc: "Meet the scientist",
        result: "",
      },
    ),
  ],
  [
    "meetingRoom",
    mkDialougeRoom(
      [
        'J Robert Oppenhiemer: "Hello Glenn. We have a new researcher with us today so you should explain what is happening here."',
        'Scientist: "Of Course. I am Dr Glenn Seaborg. I am the scientist in charge here. Right now we are preparing for the test of the current version of the bomb. This version of the bomb has Plutonium used instead of uranium to spark the initial reaction."',
      ],
      {
        goto: "questionRoom1",
        desc: "ask questions",
        result: "",
      },
    ),
  ],
  ...mkQuestionRooms("questionRoom1", {
    doneGoto: "ch3-startingRoom",
    desc: "",
    questions: [
      {
        question: "Tell me more about Plutonium compared to uranium?",
        result:
          'Glenn Seaborg: "Plutonium is an element I discovered how to extract, It is much easier to get than uranium. This is because of the fact that uranium is a naturally occurring element so we can only find it in ores and metals in the earths crust. Plutonium however is an element that we can create by ourselves. Plutonium is much cheaper than uranium because of this fact."',
      },
      {
        question: "Tell me about yourself?",
        result:
          'Glenn Seaborg: "I am the lead researcher on the use of plutonium in the atomic bomb. I graduated from the University of california. I discovered how to extract plutonium. I also discovered multiple other elements."',
      },
      {
        question: "Tell me about this test?",
        result:
          'Glenn Seaborg: "This is our first test of the atomic bomb, the test is code named Trinity. The bomb we are using is an implosion type. An implosion type bomb compresses the core until it reaches critical mass and explodes, which is why it is called an implosion type. The other type of bomb is called a gun type bomb. It is called a gun type bomb because it has two separate parts that when it is time to explode are launched at each other at extremely high speed, and the collision causes the explosion."',
      },
      {
        goto: "ch3-startingRoom",
        question: "I have no questions.",
        result: "",
      },
    ],
  }),
];
export const ch1Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch2-",
};