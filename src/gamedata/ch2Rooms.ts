import { Ch2QuizRoom } from "./builders/Ch2QuizRoom";
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
        result: [],
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
        desc: "May I ask you some questions",
        result: ['Glenn Seaborg: "Of course, what would you like to know"'],
      },
    ),
  ],
  ...mkQuestionRooms("questionRoom1", {
    doneGoto: "quizRoom",
    desc: [],
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
        goto: "quizRoom",
        question: "I have no questions.",
        result: [],
      },
    ],
  }),
  ["quizRoom", new Ch2QuizRoom("questionRoom1", "preBombTestRoom1")],
  [
    "preBombTestRoom1",
    mkDialougeRoom(
      [
        "You return to the room with Glenn Seaborg, Oppenheimer is also present.",
        'J Robert Oppenhiemer: "I take it everything is ready for the test?"',
      ],
      {
        desc: "Yes, me and Dr. Seaborg have prepared everything.",
        goto: "preBombTestRoom2",
        result: [],
      },
    ),
  ],
  [
    "preBombTestRoom2",
    mkActionRoom(
      'J Robert Oppenhiemer: "Excellent! Once you both put on eye protection, we may monitor the explosion from this bunker."',
      {
        desc: "Take a pair eye protection glasses",
        goto: "bombTestRoom",
        result: [],
      },
    ),
  ],
  [
    "bombTestRoom",
    mkActionRoom(
      [
        "You make your way into the bumker and peer out the small window slit",
        "Oppenheimer inserts a key into the console and presses a button.",
        "",
        "The bomb explodes.",
        "",
        "It looks like a sun appeared on the earth, and is vaporizing everything around it.",
        "The sky appears to be burning as the dust from the explosion flies up and spreads into a strange mushroom shaped cloud.",
      ],
      {
        desc: "ch2 done",
        goto: "ch3-startingRoom",
        result: [],
      },
    ),
  ],
];
export const ch2Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch2-",
};
