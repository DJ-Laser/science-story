import {
  mkActionRoom,
  mkDialougeRoom,
  mkQuestionRooms,
} from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";
import { PressEnterRoom } from "./builders/PressEnterRoom.ts";
import { USER_NAME } from "./builders/NameSelectRoom.ts";

const rooms: () => [string, Room][] = () => [
  [
    "startingRoom",
    new PressEnterRoom(
      [
        "You find yourself at the Air Force base on Tinian Island.",
        "A pilot is getting out of a plane and is approaching the you.",
      ],
      "pilotRoom",
    ),
  ],
  [
    "pilotMeetingRoom",
    mkActionRoom(
      "Pilot: Hello there. Are you the researcher who came to ask about the bomb dropping?",
      {
        desc: "Introduce yourself",
        result: [],
        goto: "pilotIntroductionRoom",
      },
    ),
  ],
  [
    "pilotIntroductionRoom",
    new PressEnterRoom(
      [
        () => `"My name is ${USER_NAME}" you say.`,
        `Pilot: The name's Major Charles Sweeney, air force pilot.`,
        "That plane behind me is a B-29 bomber. It was chosen to be the bomber carrying the atomic bombs because of its long range, superior high altitude performance, and its ability to carry the bomb without requiring many modifications.",
      ],
      "pilotQuestionRoom",
      [
        "Sweeny: With introductions out of the way, let's talk about the bomb. That's what you're here for right?",
      ],
    ),
  ],
  ...mkQuestionRooms("pilotQuestionRoom", {
    desc: "Sweeny: What do you want to know about the bomb?",
    doneGoto: "test-nullRoom",
    questions: [
      {
        question:
          "Could you tell me about the bomb you dropped compared to the bomb dropped on Hiroshima?",
        result: [
          "Sweeney: The bomb I dropped was nicknamed the “Fat Man”. The bomb dropped on Hiroshima was nicknamed the “Little Boy”.",
          "The “Little Boy” was a gun type bomb that used uranium, and had the force of around 1500 tons of TNT. The “Fat Man” was an implosion type bomb that used Plutonium, and had the force of around 21,000 Tons of TNT.",
          "The “Fat Man” caused less casualties than the “Little Boy” because Nagasaki was smaller than Hiroshima and the terrain around Nagasaki contained some of the explosion.",
        ],
      },
      {
        question: "Could you tell me about the Casualties of the two bombs?",
        result: [
          "Sweeney: The bomb dropped on Hiroshima killed over 100,000 people and destroyed three quarters of the buildings in the city. The bomb dropped on Nagasaki killed an estimated 39,000 people.",
          "The casualties combined were 110,000 to 210,000. We discovered that the bombs cause radioactivity and so the casualties can't account for the people killed by radioactive fallout.",
        ],
      },
      {
        question:
          "Could you tell me about the process behind the bomb dropping?",
        result: [
          "Sweeney:  The final decision to  drop the bomb fell on to president Truman as Rossevelt died before the bombs were completed. The bombing of pearl harbor increased the speed of our efforts to develop the atomic bomb.",
        ],
      },
    ],
  }),
  [
    "pilotLeaveRoom",
    mkDialougeRoom(
      [
        "Sweeney: Alright then, I am due for a debrief at the base soon so this is great timing.",
        "Major Sweeney exchanges a few words with a technician, and they both head for the Air Force Base.",
      ],
      {
        desc: "Thanks for your help",
        goto: "ch4-startingRoom",
        result:
          "The major looks back and flashes you a quick thumbs up before entering the base",
      },
      {
        desc: "...",
        goto: "ch4-startingRoom",
        result: [],
      },
    ),
  ],
];
export const ch1Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch3-",
};
