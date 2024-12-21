import {
  normalizeToArray,
  OneOrArray,
  TerminalOutput,
} from "../../terminal/terminalState";
import { NamedChoice } from "../framework/Choice";
import { Room } from "../framework/Room";
import { ChoiceRoom, DialogueRoom } from "./ChoiceRoom";

export interface ChoiceBuilder {
  goto: string;
  desc: string;
  result: OneOrArray<TerminalOutput>;
}

export function mkRoom<
  C extends (desc: TerminalOutput[], choices: NamedChoice[]) => ChoiceRoom,
>(
  constructor: C,
  desc: OneOrArray<TerminalOutput>,
  ...choices: ChoiceBuilder[]
): Room {
  const description = normalizeToArray(desc === "" ? [] : desc);
  const outputChoices = choices.map(({ goto, desc, result }) => ({
    description: desc,
    result: Array.isArray(result) ? result : [result],
    destinationRoom: goto,
  }));

  return constructor(description, outputChoices);
}

export function mkActionRoom(
  desc: OneOrArray<TerminalOutput>,
  ...choices: ChoiceBuilder[]
): Room {
  return mkRoom((d, c) => new ChoiceRoom(d, c), desc, ...choices);
}

export function mkDialougeRoom(
  desc: OneOrArray<TerminalOutput>,
  ...choices: ChoiceBuilder[]
): Room {
  return mkRoom((d, c) => new DialogueRoom(d, c), desc, ...choices);
}

export interface QuestionBuilder {
  goto?: string;
  question: string;
  result: OneOrArray<TerminalOutput>;
}

export function mkQuestionRooms(
  key: string,
  {
    doneGoto,
    desc,
    questions,
    reQuestion,
    doneQuestions,
  }: {
    doneGoto: string;
    desc: OneOrArray<TerminalOutput>;
    questions: QuestionBuilder[];
    reQuestion?: ChoiceBuilder;
    doneQuestions?: ChoiceBuilder;
  },
): [string, Room][] {
  const answerRoomKey = `${key}-answerRoom`;
  const questionRoom = mkRoom(
    (desc, questions) =>
      new DialogueRoom(desc, questions, ["What will you ask?"]),
    desc,
    ...questions.map(({ goto, question, result }) => ({
      goto: goto ?? answerRoomKey,
      desc: question,
      result,
    })),
  );

  const answerRoom = mkDialougeRoom(
    "",
    reQuestion ?? {
      desc: "I would like to ask another question",
      goto: key,
      result: [],
    },
    doneQuestions ?? {
      desc: "I have no further questions",
      goto: doneGoto,
      result: [],
    },
  );

  return [
    [key, questionRoom],
    [answerRoomKey, answerRoom],
  ];
}
