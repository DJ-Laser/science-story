import {
  normalizeToArray,
  OneOrArray,
  TerminalOutput,
} from "../terminal/terminalState";
import { ChoiceRoom } from "./builders/ChoiceRoom";
import { PressEnterRoom } from "./builders/PressEnterRoom";
import { ChoiceBuilder, mkActionRoom, mkRoom } from "./builders/roomBuilders";
import { Room, RoomCollection } from "./framework/Room";

export interface PlaqueBuilder {
  name: string;
  result: OneOrArray<TerminalOutput>;
}

export function mkExhbitRooms(
  key: string,
  {
    doneGoto,
    desc,
    plaques,
  }: {
    doneGoto: string;
    desc: OneOrArray<TerminalOutput>;
    plaques: PlaqueBuilder[];
  },
): [string, Room][] {
  const answerRoomKey = `${key}-answerRoom`;
  const exhibitRoom = mkRoom(
    (desc, plaques) =>
      new ChoiceRoom(desc, plaques, ["Which plaque will you examine?"]),
    desc,
    ...plaques.map(({ name, result }) => ({
      goto: answerRoomKey,
      desc: name,
      result: [`${name}:`, ...normalizeToArray(result)],
    })),
  );

  const plaqueRoom = mkActionRoom(
    "",
    {
      desc: "Examine another plaque",
      goto: key,
      result: [],
    },
    {
      desc: "Leave the exhibit",
      goto: doneGoto,
      result: [],
    },
  );

  return [
    [key, exhibitRoom],
    [answerRoomKey, plaqueRoom],
  ];
}

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
  mkRampRoom(
    0,
    [
      "You appear to be in a decommissioned missile silo. It has been renovated into a museum on nuclear energy and nuclear weapons.",
      "In the center stands a giant replica missile, with a quarter cut away to see the inner workings.",
      "The museum consists of many rooms, which have one or more objects to observe.",
      "You can walk around and inspect the exhibits to learn more about nuclear weapons.",
    ],
    {
      goto: `ramp1`,
      desc: "Walk up the spiral ramp",
      result: ["You start walking up the ramp."],
    },
  ),

  mkRampRoom(1, [
    "A plaque located on the rail reads:",
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
      goto: "madRoom",
      result: [],
    },
  ),

  mkRampRoom(3, [
    "You notice another plaque on the rail. This one reads:",
    "Intercontinental ballistic missiles work by firing rocket engines to fly into space and back down onto the target. Just like human manned rockets, the engines are split into stages, which are discarded after use.",
  ]),

  mkRampRoom(
    4,
    [
      "Here, the lower part of the missile is cut away to reveal it's engine systems. A plaque reads:",
      "The first stage is known as the boost stage. It propels the missile straight up and out of the silo. This stage usually lasts right until the missile enters space.",
    ],
    {
      goto: `ramp4`,
      desc: "Walk up the spiral ramp",
      result: [
        "You complete a full circle around the missile, ending up much higher.",
      ],
    },
  ),

  mkRampRoom(4, [
    "From your vantage point, you can see the second stage engines. Another plaque reads:",
    "After the boost stage, the missile uses it's second stage rockets to propel itself in orbit. The rockets use a variety of guidance systems to approach the target, including taking images of the stars to estimate it's position.",
  ]),

  mkRampRoom(5, [
    "You are almost at the end of the ramp, staring up at the cutaway that reveals the payload and reentry systems.",
    "",
    "Next to you, the final plaque reads:",
    "The final stage is the reentry stage. These final engines fire after the payload enters the atmosphere again, and propel the payload toward it's destination, where it then explodes.",
  ]),
  [
    "ramp6",
    mkActionRoom(
      [
        "At the top of the ramp, you see two more exhibits, and the exit door.",
        "",
        "One exhibit shows a pulse expanding from an explosion, knocking down many cell towers.",
        "The other shows a plane, submarine, and artillery cannon.",
      ],
      {
        goto: "empRoom1",
        desc: "Examine the EMP exhibit",
        result: [],
      },
      {
        goto: "weaponsRoom",
        desc: "Examine the weapons exhibit",
        result: ["You walk up to the weapons exhibit."],
      },
      {
        goto: "todo",
        desc: "Leave the museum",
        result: [],
      },
    ),
  ],

  ...mkExhbitRooms("madRoom", {
    desc: [
      "The exhibit features many plaqus, each in front of a corresponding model.",
    ],
    doneGoto: "ramp2",
    plaques: [
      {
        name: "A pile of missiled stacked over a map of the United States",
        result: [
          "By 2010 the United States had amassed approximately 9,400 nuclear warheads, but had never fired a single one of them.",
        ],
      },
      {
        name: "A model of the earth, with metal wires showing missile trajectories between the US and USSR",
        result: [
          "While the US had a massive amount of missiles, during the cold war, the soviet union started to produce more missiles as well. Smaller countries also started producing nuclear weapons on a smaller scale.",
        ],
      },
      {
        name: "A radar tower, alongside anti air cannons",
        result: [
          "Modern technology now allows any country to detect if their opponents have fired a nuclear missile, and respond with their own. False positives in these systems almost led to unprovoked attacks, but fortunately the officers in charge decided not to trust the sensors.",
        ],
      },
      {
        name: "A model of the earth, with nuclear missiles frozen mid-explosion on every country and state",
        result: [
          "The sheer amount of missiles there means that if any country sent just one unprovoked attack, every other country could respond by sending their own missiles. This principle is known as mutually assured destruction, and is what kept the peace between the US and USSR during the cold war.",
        ],
      },
    ],
  }),

  ...mkExhbitRooms("weaponsRoom", {
    desc: [
      "Inside the exhibit are many models of planes, submarines, and bombs.",
    ],
    doneGoto: "ramp6",
    plaques: [
      {
        name: "Submarine Ballistic Missiles",
        result:
          "Submarine ballistic missiles can be launched from submarines and because of acoustic quieting are hard to detect, thus making them a survivable deterrent in the event of a first strike.",
      },
      {
        name: "Cruise Missiles",
        result:
          "Cruise missiles are missiles that use aerodynamic lift to sustain flight for most of its flight path, and are designed to deliver warheads over long distances with high precision.",
      },
      {
        name: "Artillery ammo",
        result:
          "Nuclear artillery was designed for use on the battlefield instead of strategic bombings against cities, military bases, and heavy industry. Nuclear artillery has almost entirely been replaced by mobile tactical ballistic missile launchers.",
      },
      {
        name: "Depth Charges",
        result:
          "Nuclear depth Charges were developed to increase the yield of depth charges, increasing explosion size, thus increasing the likelihood of hitting targeted submarines to a near certainty.",
      },
      {
        name: "Land Mines",
        result:
          "Nuclear land mines were designed for military and non-military uses. As military devices they were designed to block or channel enemy forces. As Non-military devices they were designed for demolition, mining, or earthmoving.",
      },
    ],
  }),

  [
    "empRoom1",
    new PressEnterRoom(
      [
        "You walk up to the exhibit. A voiceover starts playing from a nearby speaker.",
        'Narrator: "Nuclear explosions also generate Electromagnetic Pulses or EMP for short. This is because when a nuclear reaction happens in addition to particle radiation they also release electromagnetic radiation."',
      ],
      "empRoom2",
    ),
  ],
  [
    "empRoom2",
    new PressEnterRoom(
      [
        "The voiceover continues playing.",
        'Narrator: "Electromagnetic Pulses cause electronic devices in the area to short out and stop working this is because the Electromagnetic Pulses interact with the devices and induces high voltage spikes in electronic devices causing them to short circuit causing damage to the semiconductors that make the electronic device work."',
        "",
        "Once the voiceover stops, you decide to walk back from the exhibit.",
      ],
      "ramp6",
    ),
  ],
];

export const ch4Rooms: RoomCollection = {
  getRooms: rooms,
  prefix: "ch4-",
};
