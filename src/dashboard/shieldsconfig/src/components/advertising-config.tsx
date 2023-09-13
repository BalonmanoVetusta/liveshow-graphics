import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useEffect } from "react";

export function AdvertisingConfig() {
  const { setGraphics, advertising, advertisingTime = 0 } = useGraphicsReplicant();

  useEffect(() => {}, [advertisingTime]);

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
          setGraphics({ advertisingTime: parseInt(event.target.value) });
        }}
        value={advertisingTime}
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
