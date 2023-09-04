import { useEffect, useState } from "react";
import { useTimeCounter } from "../hooks/use-time-counter";
import { TimeCounterStatus } from "../lib/time-worker";

export function TimeTestComponent() {
  const { start, add, resume, pause, reset, status, errors, time, limit, isBackwards } = useTimeCounter();

  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [optBackWards, setOptBackwards] = useState<boolean>(false);
  const [optLimit, setOptLimit] = useState<number | Date>(0);
  const [optOffset, setOptOffset] = useState<number>(0);

  useEffect(() => {
    setMinutes(Math.floor(time / 60000));
    setSeconds(Math.floor((time % 60000) / 1000));
  }, [time]);

  useEffect(() => {
    setIsRunning(status === TimeCounterStatus.RUNNING);
  }, [status]);

  useEffect(() => {
    console.log(status, time, errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, errors]);

  return (
    <>
      <h2>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </h2>

      <pre>
        limit: {(limit as unknown as Date)?.toString() ?? limit}
        <br /> isBackwards: {isBackwards}
      </pre>

      <fieldset>
        <legend>Stopwatch</legend>
        <fieldset>
          <legend>Limit</legend>
          <input
            type="datetime-local"
            name="limitDate"
            id="limitDate"
            value={optLimit instanceof Date ? (optLimit as Date).getTime() : Date.now()}
            onChange={(event) => {
              const newDate = Date.parse(event.target.value);
              setOptLimit(newDate);
            }}
          />
          <input
            type="number"
            name="limit"
            id="limit"
            placeholder="Limit in seconds"
            value={!(optLimit instanceof Date) && isFinite(optLimit as number) ? 0 : (optLimit as number)}
          />
        </fieldset>
        <fieldset>
          <legend>Backwards</legend>
          <input
            type="checkbox"
            name="backwards"
            id="backwards"
            value={optBackWards.toString()}
            onChange={() => setOptBackwards(!optBackWards)}
          />
        </fieldset>

        <fieldset>
          <legend>Offset</legend>
          <input
            type="number"
            name="offset"
            id="offset"
            placeholder="Set Offset in seconds"
            value={optOffset}
            onChange={(event) => {
              const newOffset = Number(event.target.value);
              if (isFinite(newOffset) && !isNaN(newOffset)) setOptOffset(newOffset * 1000);
            }}
          />
          <button onClick={() => add(optOffset)}>Add Offset to Current timer</button>
        </fieldset>
        <button
          onClick={() =>
            start({
              offset: optOffset,
              limit: optLimit ?? 0,
              isBackwards: optBackWards,
            })
          }
        >
          Start
        </button>
        <button disabled={!isRunning && status !== TimeCounterStatus.PAUSED} onClick={() => resume()}>
          Resume
        </button>
        <button onClick={pause}>Stop</button>
        <button onClick={reset}>Reset</button>
      </fieldset>
    </>
  );
}
