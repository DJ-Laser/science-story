import React, { useEffect, useRef } from "react";
import { useImmerReducer } from "use-immer";
import { ChevronRight, Terminal as TerminalIcon } from "lucide-react";
import { HistoryEntry, TerminalState } from "./terminalState";
import FilesystemContext from "./context/FilesystemContext";

export type Action =
  | { type: "runCurrentCommand" }
  | { type: "setInput"; input: string }
  | { type: "scrollInput"; distance: number };

function reducer(draft: TerminalState, action: Action) {
  switch (action.type) {
    case "runCurrentCommand": {
      const input = draft.input[draft.inputIndex];
      const output = draft.context.process(input, draft);

      draft.history.push({ type: "input", input });
      draft.history.push(...output);

      // Don't add a new input entry if the newest one is empty
      if (draft.input[0].trim()) {
        draft.input.splice(0, 0, "");
      }

      draft.inputIndex = 0;
      draft.input[0] = "";

      break;
    }
    case "setInput":
      draft.input[draft.inputIndex] = action.input;
      break;
    case "scrollInput": {
      const newIndex = draft.inputIndex + action.distance;
      draft.inputIndex = Math.max(
        0,
        Math.min(newIndex, draft.input.length - 1),
      );
      break;
    }
  }
}

function TerminalCommand(
  { children }: { children: JSX.Element | readonly JSX.Element[] },
) {
  return (
    <div className="my-2 h-4 flex items-center gap-2 text-green-400">
      <ChevronRight className="w-4 h-4" />
      {children}
    </div>
  );
}

function TerminalHistory({ entry }: { entry: HistoryEntry }) {
  switch (entry.type) {
    case "input":
      return (
        <div className="first:mt-0">
          <TerminalCommand>
            <span>{entry.input}</span>
          </TerminalCommand>
        </div>
      );
    case "output":
      return (
        <div className="ml-6 text-gray-300 whitespace-pre-line">
          <span>{entry.output}</span>
        </div>
      );
  }
}

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useImmerReducer<
    TerminalState,
    Action,
    TerminalState
  >(
    reducer,
    {
      context: new FilesystemContext(),
      history: [],
      clearIndex: -1,
      input: [""],
      inputIndex: 0,
    },
    (state) => {
      state.history = state.context.init("", state);
      return state;
    },
  );

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const focusInput = (snapCusror: boolean) => {
    inputRef.current?.focus();
    scrollToBottom();

    if (inputRef.current && snapCusror) {
      const end = inputRef.current.value.length;
      inputRef.current.setSelectionRange(end, end);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const distance = e.key === "ArrowUp" ? 1 : -1;
      dispatch({ type: "scrollInput", distance });

      // Snap cusror to end of new input from history
      focusInput(true);
    } else {
      focusInput(false);
    }
  };

  // Scroll to bottom the output is added
  useEffect(() => {
    scrollToBottom();
  }, [state.history]);

  // Preserve original keys for react element keying
  const displayedHistory = state.history.map((entry, i) => ({ entry, i }))
    .filter((_, i) => i > state.clearIndex);
  const input = state.input[state.inputIndex];

  return (
    <div className="w-full h-full bg-gray-900 text-gray-100 p-4 sm:p-8 flex items-center justify-center">
      <div className="flex flex-col w-full h-5/6 max-w-4xl max-h-full bg-transparent">
        <div className="bg-gray-700 p-3 flex items-center gap-2 rounded-t-lg">
          <TerminalIcon className="w-5 h-5 text-gray-400" />
          <span className="font-mono font-semibold">Terminal</span>
        </div>

        <div
          ref={terminalRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="grow p-4 overflow-y-auto font-mono text-sm bg-gray-800 rounded-b-lg"
        >
          {displayedHistory.map(({ entry, i }) => (
            <TerminalHistory key={i} entry={entry} />
          ))}

          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: "runCurrentCommand" });
            }}
          >
            <TerminalCommand>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) =>
                  dispatch({
                    type: "setInput",
                    input: e.target.value,
                  })}
                className="w-full bg-transparent outline-none"
                autoFocus
                spellCheck={false}
              />
            </TerminalCommand>
          </form>
        </div>
      </div>
    </div>
  );
}
