import {
  mkActionRoom,
  mkDialougeRoom,
  mkQuestionRooms,
} from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

const rooms: () => [string, Room][] = () => [["startingRoom", mkActionRoom()]];
export const ch1Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch2-",
};
