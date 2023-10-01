import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";
import { useId } from "react";

export function ShowAdvertisingInput({ label }: { label?: string } = {}) {
  const id = useId();
  const { show = false, setAdvertising } = useAdvertisingReplicant();
  return (
    <>
      {label ? <label htmlFor={`advertising-show-${id}`}>{label}</label> : null}
      <input
        placeholder="Show Advertising"
        type="checkbox"
        name="advertising-show"
        id={`advertising-show-${id}`}
        value={show?.toString()}
        onChange={() => {
          setAdvertising({ show: !show });
        }}
      />
    </>
  );
}
