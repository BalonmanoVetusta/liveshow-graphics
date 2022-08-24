import { useStopwatchReplicant } from "hooks/use-stop-watch";
import { ReactElement, useState } from "react";
import { scoreboardMainTimer } from "services/scoreboard-main-timer";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";

export function StopwatchPanel(): ReactElement {
  const [showMiliseconds, setShowMiliseconds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isRunning, start, stop, reset, minutes, seconds, setOffset } =
    useStopwatchReplicant(STOPWATCH_REPLICANT_NAME, scoreboardMainTimer);
  const [enableReset, setEnableReset] = useState(false);

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // oldValue
    const newValue = parseInt(value, 10);
    if (isNaN(newValue)) {
      return;
    }

    console.log({ name, value });

    setError(null);
    setEnableReset(true);
    let offset = 0;
    if (name === "minutes") {
      offset = (minutes - newValue) * 60;
    } else if (name === "seconds") {
      offset = (seconds - newValue) * 60;
    }
    setOffset(offset);
  };

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
              value={minutes.toString()}
              readOnly={isRunning}
              onChange={handleTimeChange}
            />
            <span> : </span>
            <input
              type="number"
              name="seconds"
              id="seconds"
              value={seconds.toString()}
              readOnly={isRunning}
              onChange={handleTimeChange}
            />
            <p>
              To set time you must stop the stopwatch first and edit directly
              the time
            </p>
          </fieldset>
        </div>
        <fieldset>
          <button
            onClick={(event) => {
              event.preventDefault();
              isRunning ? stop() : start();
            }}
          >
            {isRunning ? "Stop" : "Start"}
          </button>

          <button onClick={reset} disabled={!enableReset}>
            Reset
          </button>
          <input
            type="checkbox"
            name="enable-reset"
            id="enable-reset"
            value={enableReset.toString()}
            onChange={() => setEnableReset((prev) => !prev)}
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
