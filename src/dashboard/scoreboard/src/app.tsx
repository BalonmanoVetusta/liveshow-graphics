import { useReplicant } from "hooks/use-replicant";
import { useStopwatchReplicant } from "hooks/use-stop-watch";
import { ReactElement, useState } from "react";
import { scoreboardMainTimer } from "services/scoreboard-main-timer";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import styled from 'styled-components'

enum STOPWATCH_ACTIONS {
  START = "start",
  STOP = "stop",
  RESET = "reset",
  SET = "set",
}

interface ActionPayload {
  offset?: number;
  set?: number; // miliseconds
}

// Interval variable
const timer: number | null = null;

function App(): ReactElement {
  const [showMiliseconds, setShowMiliseconds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    totalTime,
    isRunning,
    start,
    stop,
    reset,
    minutes,
    seconds,
    miliseconds,
  } = useStopwatchReplicant(STOPWATCH_REPLICANT_NAME, scoreboardMainTimer);
  const [stopwatch] = useReplicant(STOPWATCH_REPLICANT_NAME, {});
  const [enableReset, setEnableReset] = useState(false);

  return (
    <div>
      <div>
        <h3>Match time</h3>

        <div className="error">{error ? error : null}</div>
        <>{console.log({ stopwatch })}</>

        <div>
          <form action="#">
            <input
              type="number"
              name="minutes"
              id="minutes"
              key={minutes.toString()}
              value={minutes.toString()}
            />
            <span> : </span>
            <input
              type="number"
              name="seconds"
              id="seconds"
              key={seconds.toString()}
              value={seconds.toString()}
            />
            <span> . </span>
            <input
              type="number"
              name="miliseconds"
              id="miliseconds"
              key={miliseconds.toString()}
              value={miliseconds.toString()}
            />
            <button type="submit" disabled={isRunning}>
              Set time
            </button>
          </form>
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
        <fieldset>
          <h3>Local Team Score</h3>
          <button>+1</button>
          <button>-1</button>
        </fieldset>
        <fieldset>
          <h3>Visitor Team Score</h3>
          <button>+1</button>
          <button>-1</button>
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

export default App;
