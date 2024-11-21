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
    const description = this.description.length === 0
      ? []
      : [...this.description, "\n"];
    const prompt = this.prompt.length === 0 ? [] : [...this.prompt, "\n"];

    const choices = this.choices.map((choice, i) =>
      `${i + 1}) ${choice.description}`
    );

    return [...description, ...prompt, ...choices];
  }

  process(input: string): Choice {
    const choice = this.choices.reduce<Choice | null>((prev, choice, i) => {
      // Choices are 1-indexed in the ui, so make sure to account for that
      if (input === (i + 1).toString()) {
        return choice;
      }

      return prev;
    }, null);
  
    return choice ?? new ErrorChoice([
      "Invalid choice, please input a number corresponding to the desired choice.",
    ]);
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
