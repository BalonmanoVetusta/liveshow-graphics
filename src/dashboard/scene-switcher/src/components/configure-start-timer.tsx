import { StartCountdownText } from "components/start-countdown-text";
import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";

export function ConfigureStartTimer() {
  const { startTime, startTimeFinishText, setGraphics } = useGraphicsReplicant();

  return (
    <>
      <h3>
        <StartCountdownText />
      </h3>
      <h4>{startTime}</h4>
      <fieldset>
        <legend>Configure the time when the match starts</legend>
        <div>
          <label htmlFor="start-time-finish-text">Finish text</label>
          <input
            type="text"
            name="start-time-finish-text"
            id="start-time-finish-text"
            value={startTimeFinishText}
            onChange={(event) => setGraphics({ startTimeFinishText: event.target.value })}
          />
        </div>

        <div>
          <label htmlFor="start-time">Start time</label>
          <input
            type="time"
            name="start-time"
            id="start-time"
            step={60}
            value={startTime === "0" ? "" : startTime}
            onChange={({ target: { value } }) => {
              const [h, m] = value.split(":");
              setGraphics({ startTime: `${h}:${m}` });
            }}
            placeholder="00:00"
            required
            pattern="[0-9]{2}:[0-9]{2}"
          />
          <label htmlFor="disable-start-time"></label>
          <button onClick={() => setGraphics({ startTime: "0" })}>Remove Countdown</button>
        </div>
      </fieldset>
    </>
  );
}
