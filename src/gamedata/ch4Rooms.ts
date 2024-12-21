import { OneOrArray, TerminalOutput } from "../terminal/terminalState";
import { PressEnterRoom } from "./builders/PressEnterRoom";
import {
  ChoiceBuilder,
  mkActionRoom,
  mkDialougeRoom,
  mkQuestionRooms,
} from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

function mkRampRoom(
  id: number,
  desc: OneOrArray<TerminalOutput>,
  continueChoice?: ChoiceBuilder,
  returnChoice?: ChoiceBuilder,
  ...extraChoices: ChoiceBuilder[]
): [string, Room] {
  const choices = [];
  choices.push(
    continueChoice ?? {
      goto: `ramp${id + 1}`,
      desc: "Walk up the spiral ramp",
      result: [],
    },
  );

  if (id > 0) {
    choices.push(
      returnChoice ?? {
        goto: `ramp${id - 1}`,
        desc: "Walk back down the spiral ramp",
        result: [],
      },
    );
  }

  choices.push(...extraChoices);

  return [`ramp${id}`, mkActionRoom(desc, ...choices)];
}

const rooms: () => [string, Room][] = () => [
  ["startingRoom", new PressEnterRoom(["TODO: transition"], "ramp0")],
  mkRampRoom(0, [
    "You appear to be in a decommissioned missile silo. It has been renovated into a museum on nuclear energy and nuclear weapons.",
    "In the center stands a giant replica missile, with a quarter cut away to see the inner workings.",
    "The museum consists of many rooms, which have one or more objects to observe.",
    "You can walk around and inspect the exhibits to learn more about nuclear weapons.",
  ]),

  mkRampRoom(1, [
    "You start walking up the ramp. A plaque located on the rail reads:",
    "",
    "Intercontinental Ballistic Missiles, or ICBMs for short, are the primary forms nuclear weapons take in the modern age. They are fully autonomous and faster than a bomber plane, making them ideal for quickly responding to threats.",
  ]),

  mkRampRoom(
    2,
    [
      "As you continue up the ramp, you notice that the path branches. To the side of the ramp is a small exhibit titled “Mutually Assured Destruction”",
    ],
    undefined,
    undefined,
    {
      desc: "Walk into the exhibit",
      goto: "todo",
      result: [],
    },
  ),

  mkRampRoom(3, [
    "Intercontinental ballistic missiles work by firing rocket engines to fly into space and back down onto the target. Just like human manned rockets, the engines are split into stages, which are discarded after use.",
  ]),
];
export const ch4Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch4-",
};
