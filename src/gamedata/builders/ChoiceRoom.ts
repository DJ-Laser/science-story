import { TerminalOutput } from "../../terminal/terminalState";
import { Choice, ErrorChoice, NamedChoice } from "../framework/Choice";
import { Room } from "../framework/Room";

export class ChoiceRoom implements Room {
  static defaultPrompt = ["What will you chose to do next?"];

  description: TerminalOutput[];
  prompt: TerminalOutput[];
  choices: NamedChoice[];

  constructor(
    description: TerminalOutput[],
    choices: NamedChoice[],
    prompt: TerminalOutput[] = ChoiceRoom.defaultPrompt,
  ) {
    this.description = description;
    this.choices = choices;
    this.prompt = prompt;
  }

  getPrompt(): TerminalOutput[] {
    const prompt = this.prompt.length === 0 ? [] : ["\n", ...this.prompt];
    return [...this.description, ...prompt, "\n"];
  }

  process(input: string): Choice {
    let choiceIndex: number | null = null;

    for (const i in this.choices) {
      if (i === input) {
        choiceIndex = parseInt(input);
        break;
      }
    }

    if (choiceIndex === null) {
      return new ErrorChoice([
        "Invalid choice, please input a number corresponding to the desired choice.",
        "\n",
      ]);
    }
    return this.choices[choiceIndex];
  }
}

export class DialogueRoom extends ChoiceRoom {
  static prompt = ["What will you say?"];

  constructor(description: TerminalOutput[], choices: NamedChoice[]) {
    const quotedChoices = choices.map((choice) => {
      return {
        ...choice,
        description: `"${choice.description}"`,
      };
    });
    super(description, quotedChoices, DialogueRoom.prompt);
  }
}
