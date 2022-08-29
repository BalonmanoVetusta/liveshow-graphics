import { useStopwatchReplicant } from "hooks/react-use-stop-watch";
import { ReactElement, useEffect, useState } from "react";
import { scoreboardMainTimer } from "services/scoreboard-main-timer";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";
import { StopwatchLap } from "types/schemas/stopwatch-lap";

enum Keyboardkey {
  Enter = "Enter",
  Escape = "Escape",
  Tab = "Tab",
  ArrowRight = "ArrowRight",
  ArrowLeft = "ArrowLeft",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
}

export function StopwatchPanel(): ReactElement {
  const [showMiliseconds, setShowMiliseconds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    isRunning,
    start,
    stop,
    reset,
    minutes,
    seconds,
    setOffset,
    isEnded,
  } = useStopwatchReplicant(STOPWATCH_REPLICANT_NAME, scoreboardMainTimer, {
    limitMiliseconds: 5000,
  } as StopwatchLap);
  const [enableReset, setEnableReset] = useState(false);

  const [minutesInput, setMinutesInput] = useState("");
  const [secondsInput, setSecondsInput] = useState("");
  const [isModifying, setIsModifying] = useState(false);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isRunning) {
      return;
    }

    const { name, value } = event.target;
    // oldValue
    const newValue = parseInt(value, 10);
    if (name === "minutes" && isNaN(newValue)) {
      setMinutesInput(minutes.toString().padStart(2, "0"));
    } else if (name === "seconds" && isNaN(newValue)) {
      setSecondsInput(seconds.toString().padStart(2, "0"));
    }

    if (!isNaN(newValue)) {
      setError(null);
      setEnableReset(true);
      let offset = 0;
      if (name === "minutes") {
        offset = (minutes - newValue) * 60;
      } else if (name === "seconds") {
        offset = (seconds - newValue) * 60;
      }
      setOffset(offset);
    }
  };

  // const handleSet: React.KeyboardEventHandler<HTMLInputElement> = (
  //   event: React.KeyboardEvent<HTMLInputElement>
  // ) => {
  //   switch (event.key) {
  //     case Keyboardkey.Enter:
  //       break;
  //     default:
  //       return;
  //   }
  // };

  useEffect(() => {
    if (isModifying) return;

    setMinutesInput(minutes.toString().padStart(2, "0"));
    setSecondsInput(seconds.toString().padStart(2, "0"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes, seconds]);

  return (
    <div>
      <div>
        <h3>Match time</h3>

        <div className="error">{error ? error : null}</div>

        <div>
          <fieldset>
            <input
              type="number"
              name="minutes"
              id="minutes"
              value={minutesInput}
              readOnly={isRunning}
              onFocus={() => setIsModifying(true)}
              onBlur={() => setIsModifying(false)}
              onChange={handleTimeChange}
              // onKeyDown={handleSet}
            />
            <span> : </span>
            <input
              type="number"
              name="seconds"
              id="seconds"
              value={secondsInput}
              readOnly={isRunning}
              onFocus={() => setIsModifying(true)}
              onBlur={() => setIsModifying(false)}
              onChange={handleTimeChange}
              // onKeyDown={handleSet}
            />
            <p>
              To set time you must stop the stopwatch first and edit directly
              the time
            </p>
            {isEnded ? <p>The stopwatch has ended</p> : null}
          </fieldset>
        </div>
        <fieldset>
          <button
            onClick={(event) => {
              event.preventDefault();
              isRunning ? stop() : start();
            }}
            disabled={isModifying}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </fieldset>
        <fieldset>
          <button
            onClick={() => {
              if (isRunning) {
                alert("You can not reset the stopwatch while running");
                return;
              }

              if (confirm("Sure you want to do this?")) {
                reset();
              }
            }}
            disabled={!enableReset}
          >
            Reset
          </button>
          <input
            type="checkbox"
            name="enable-reset"
            id="enable-reset"
            value={enableReset.toString()}
            onChange={(event) => {
              if (isRunning) {
                alert(
                  "You can not reset the stopwatch while running, stop it first"
                );
                event.preventDefault();
                event.target.checked = false;
                return;
              }
              setEnableReset((prev) => !prev);
            }}
          />
        </fieldset>
        <fieldset>
          <input
            type="number"
            name="offset"
            id="offset"
            placeholder="secs"
            min="0"
          />
          <button>+ Add</button>
          <button>- Substract</button>
        </fieldset>
      </div>

      <div>
        <label htmlFor="showMiliseconds">
          {showMiliseconds ? "Hide" : "Show"} miliseconds
          <input
            type="checkbox"
            name="showMiliseconds"
            id="showMiliseconds"
            value={showMiliseconds.toString()}
            onChange={(event) => {
              event.preventDefault();
              setShowMiliseconds((prev) => !prev);
            }}
          />
        </label>
      </div>
    </div>
  );
}
