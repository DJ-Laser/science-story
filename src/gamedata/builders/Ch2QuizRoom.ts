import { TerminalOutput } from "../../terminal/terminalState";
import { Choice } from "../framework/Choice";
import { Room } from "../framework/Room";

type quizQuestion = "select" | "detectorElement" | "bombType" | "testCodeName";

export class Ch2QuizRoom implements Room {
  static detectorCalibrations = ["Uranium", "Plutonium", "Polonium"];
  static correctDetectorCalibration = Ch2QuizRoom.detectorCalibrations[1];

  static bombTypes = ["Gun type", "Implosion type"];
  static correctBombType = Ch2QuizRoom.bombTypes[1];

  static correctCodeName = "trinity";

  selectedDetectorCalibration?: string;
  selectedBombType?: string;
  selectedCodeName?: string;

  currentQuestion: quizQuestion = "select";
  returnRoomId: string;
  completeRoomId: string;

  constructor(returnRoom: string, completeRoom: string) {
    this.returnRoomId = returnRoom;
    this.completeRoomId = completeRoom;
  }

  promptChoices(text: string[], choices: string[]): string[] {
    const output = text;
    output.push("");
    output.push(...choices.map((type, i) => `${i + 1}) ${type}`));
    return output;
  }

  verifyChoices() {
    const detectorCorrect =
      this.selectedDetectorCalibration ==
      Ch2QuizRoom.correctDetectorCalibration;
    const authenticationCorrect =
      this.selectedCodeName == Ch2QuizRoom.correctCodeName;
    const bombCorrect = this.selectedBombType == Ch2QuizRoom.correctBombType;

    return detectorCorrect && authenticationCorrect && bombCorrect;
  }

  getPrompt(): TerminalOutput[] {
    switch (this.currentQuestion) {
      case "select": {
        if (this.verifyChoices()) {
          return [
            "The calibration appears to be all complete",
            "",
            "Press enter to continue",
          ];
        }

        return this.promptChoices(
          [
            "There are three steps that need to be completed before you can proceed with the test",
          ],
          [],
        );
      }

      case "bombType":
        return this.promptChoices(
          [
            "Before you are the detonator controls. It looks like it can be set to detonate a gun type or implosion type bomb.",
            "",
            "Select the detonator type",
          ],
          Ch2QuizRoom.bombTypes,
        );

      case "detectorElement":
        return this.promptChoices(
          [
            "Before is the radiation detector. It needs to be set to detect the radioactive element inside the bomb for accurate results",
            "",
            "Select the detector calibration",
          ],
          Ch2QuizRoom.detectorCalibrations,
        );

      case "testCodeName":
        return [
          "The test requires authentication to begin. It seems you will need to input the codename for the bomb test",
          "",
          "Enter the codename",
        ];
    }
  }

  invalidInput(input: string) {
    return {
      destinationRoom: "",
      result: [`Invalid choice: "${input}"`],
    };
  }

  process(input: string): Choice {
    let output: TerminalOutput[];

    switch (this.currentQuestion) {
      case "select": {
        if (this.verifyChoices()) {
          return {
            destinationRoom: this.completeRoomId,
            result: [],
          };
        }

        const index = parseInt(input);
        switch (index) {
          case 1:
            this.currentQuestion = "detectorElement";
            break;

          case 2:
            this.currentQuestion = "bombType";
            break;

          case 3:
            this.currentQuestion = "testCodeName";
            break;

          case 4:
            return {
              destinationRoom: this.returnRoomId,
              result: [],
            };

          default:
            return this.invalidInput(input);
        }

        output = [];
        break;
      }
      case "bombType": {
        const index = parseInt(input);
        const types = Ch2QuizRoom.bombTypes;
        if (isNaN(index) || index < 1 || index > types.length) {
          return this.invalidInput(input);
        }

        this.selectedBombType = types[index - 1];
        output = [`Set detector to "${this.selectedDetectorCalibration}"`];
        break;
      }
      case "detectorElement": {
        const index = parseInt(input);
        const elements = Ch2QuizRoom.detectorCalibrations;
        if (isNaN(index) || index < 1 || index > elements.length) {
          return this.invalidInput(input);
        }

        this.selectedDetectorCalibration = elements[index - 1];
        output = [`Set detector to "${this.selectedDetectorCalibration}"`];
        break;
      }
      case "testCodeName": {
        const enteredCodeName = input.trim().toLowerCase();
        this.selectedCodeName = enteredCodeName;
        this.currentQuestion = "select";
        output = [`Set authentication codename to "${this.selectedCodeName}"`];
        break;
      }
    }

    return {
      destinationRoom: "",
      result: output,
    };
  }
}
