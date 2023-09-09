import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useEffect, useState } from "react";

export function AdvertisingConfig() {
  const [initial, setInitial] = useState(true);
  const { setGraphics, advertising, advertisingTime = 0 } = useGraphicsReplicant();
  const [time, setTime] = useState(advertisingTime);

  useEffect(() => {
    if (!initial) setGraphics({ advertisingTime: time });
    setInitial(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <fieldset>
      <legend>Advertising</legend>
      <input
        type="number"
        step={1}
        min={0}
        max={60}
        onChange={(event) => {
          event.preventDefault();
          setTime(Number(event.target.value));
        }}
        value={time}
      />
      <button
        onClick={(event) => {
          event.preventDefault();
          setGraphics({ advertising: !advertising });
        }}
      >
        Toggle
      </button>
    </fieldset>
  );
}
