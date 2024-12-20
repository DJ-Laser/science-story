import { immerable } from "immer";
import { testRooms } from "../../gamedata/testRooms";
import { clearTerminal, TerminalOutput, TerminalState } from "../terminalState";
import { TerminalContext } from "./TerminalContext";
import { Room, RoomCollection } from "../../gamedata/framework/Room";
import { introRooms } from "../../gamedata/introRooms";
import { ch1Rooms } from "../../gamedata/ch1Rooms";
import { ch2Rooms } from "../../gamedata/ch2Rooms";
import { ch3Rooms } from "../../gamedata/ch3Rooms";

type PrefixedRoom = { room: Room; prefix: string };

export class GameContext implements TerminalContext {
  [immerable] = true;

  rooms: Map<string, PrefixedRoom>;
  prefixedRoom: PrefixedRoom;

  get room() {
    return this.prefixedRoom.room;
  }

  constructor() {
    this.rooms = new Map();
    this.addRooms(testRooms);
    this.addRooms(introRooms);

    this.addRooms(ch1Rooms);
    this.addRooms(ch2Rooms);
    this.addRooms(ch3Rooms);

    const prefix = introRooms.prefix;
    const returnedRoom = this.rooms.get(prefix + "startingRoom");
    if (returnedRoom === undefined) throw "Starting room not found";

    this.prefixedRoom = { room: returnedRoom.room, prefix };
  }

  addRooms({ prefix, getRooms }: RoomCollection) {
    for (const [name, room] of getRooms()) {
      this.rooms.set(prefix + name, { room, prefix });
    }
  }

  setRoom(roomId: string) {
    // Keep current room on empty string
    if (roomId === "") return;

    let maybeRoom = this.rooms.get(roomId);
    if (maybeRoom !== undefined) {
      this.prefixedRoom = maybeRoom;
      return;
    }

    maybeRoom = this.rooms.get(this.prefixedRoom.prefix + roomId);
    if (maybeRoom !== undefined) {
      this.prefixedRoom = maybeRoom;
      return;
    }

    throw `Could not find room ${roomId}`;
  }

  init(_input: string, state: TerminalState): TerminalOutput[] {
    clearTerminal(state);
    return this.room.getPrompt();
  }

  process(input: string): TerminalOutput[] {
    const choice = this.room.process(input);
    this.setRoom(choice.destinationRoom);

    const result = choice.result.length === 0 ? [] : [...choice.result, "\n"];

    return [...result, ...this.room.getPrompt()];
  }
  isFinished() {
    return false;
  }
}
