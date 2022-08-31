import {
  MaxTimeUnit,
  useStopwatchReplicantControl,
  useStopwatchReplicantReader,
} from "hooks/use-stopwatch-replicant";
import { ReactElement, useEffect, useState } from "react";

// enum Keyboardkey {
//   Enter = "Enter",
//   Escape = "Escape",
//   Tab = "Tab",
//   ArrowRight = "ArrowRight",
//   ArrowLeft = "ArrowLeft",
//   ArrowUp = "ArrowUp",
//   ArrowDown = "ArrowDown",
// }

export function StopwatchPanel(): ReactElement {
  const [showMiliseconds, setShowMiliseconds] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const { start, stop, reset } = useStopwatchReplicantControl();
  const { minutes, seconds, isEnded, isRunning } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });
  const [enableReset, setEnableReset] = useState(false);

  const [minutesInput, setMinutesInput] = useState("");
  const [secondsInput, setSecondsInput] = useState("");
  const [isModifying, setIsModifying] = useState(false);

  useEffect(() => {
    if (isModifying) return;

    setMinutesInput((minutes ?? 0).toString().padStart(2, "0"));
    setSecondsInput((seconds ?? 0).toString().padStart(2, "0"));
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
              onChange={() => {
                return;
              }}
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
              onChange={() => {
                return;
              }}
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
              isRunning ? stop() : start({});
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
