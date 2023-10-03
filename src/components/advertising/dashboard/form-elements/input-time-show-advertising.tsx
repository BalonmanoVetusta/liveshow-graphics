import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";
import { useId } from "react";

export function InputTimeShowAdvertising({ label }: { label?: string }) {
  const id = useId();
  const { sleep, setAdvertising, show } = useAdvertisingReplicant();
  return (
    <>
      {label ? <label htmlFor={`time-show-advertising-${id}`}>{label}</label> : null}
      <input
        disabled={!!show}
        type="number"
        name="time-show-advertising"
        id={`time-show-advertising-${id}`}
        placeholder="Time to show advertising"
        step={1}
        min={0}
        max={900}
        value={sleep}
        onChange={(event) => {
          event.preventDefault();
          const newValue = parseInt(event.target.value, 10);
          if (isNaN(newValue)) return;
          setAdvertising({ sleep: newValue });
        }}
      />
      {/* <small>You should hide advertising to modify the time</small> */}
    </>
  );
}
