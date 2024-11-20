import { immerable } from "immer";
import { introChapter } from "../../gamedata/introduction";
import {
  clearTerminal,
  TerminalOutput,
  TerminalState,
  toOutputEntry,
} from "../terminalState";
import { TerminalContext } from "./TerminalContext";
import { Room, RoomCollection } from "../../gamedata/framework/Room";

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
    this.addRooms(introChapter);
    const prefix = introChapter.prefix;
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

  outputRoomDetails(): TerminalOutput[] {
    const output = [];
    output.push(...this.room.getDescription());

    output.push(...[
      toOutputEntry("\n"),
      this.room.getPrompt(),
      toOutputEntry("\n"),
    ]);

    const choices = this.room.choices.map((choice, i) =>
      `${i}) ${choice.name}`
    );

    output.push(...choices);

    return output;
  }

  init(_input: string, state: TerminalState): TerminalOutput[] {
    clearTerminal(state);
    return this.outputRoomDetails();
  }
  process(input: string): TerminalOutput[] {
    const output: TerminalOutput[] = [];
    let choiceIndex: number | null = null;

    for (const i in this.room.choices) {
      console.log(`Saw choice ${i}`);
      if (i === input) {
        console.log(`Confirmed choice ${i}`);
        choiceIndex = parseInt(input);
        break;
      }
    }

    if (choiceIndex === null) {
      output.push(
        "Invalid choice, please input a number corresponding to the desired choice.",
      );
      output.push("\n");
    } else {
      const choice = this.room.choices[choiceIndex];
      output.push(...choice.description);
      output.push("\n");
      this.setRoom(choice.destinationRoom);
    }

    output.push(...this.outputRoomDetails());

    return output;
  }
  isFinished() {
    return false;
  }
}
