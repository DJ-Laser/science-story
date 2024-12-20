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
        "You appears in a decommissioned missile silo. It has been renovated into a museum on nuclear energy and nuclear weapons.",
        "In the center stands a giant replica missile, with a quarter cut away to see the inner workings.",
        "The museum consists of many rooms, which have one or more objects to observe.",
        "You can walk around and inspect the exhibits to learn more about nuclear weapons.",
      ],
      {
        goto: "spiralRampRoom",
        desc: "Walk down the spiral ramp",
        result: [],
      },
    ),
  ],
  ...mkQuestionRooms(),
];
export const ch4Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch2-",
};
