import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";

export function ShowAdvertisingInput({
  labelShow = "Show advertising",
  labelHide = "Hide advertising",
}: { labelShow?: string; labelHide?: string } = {}) {
  const { show, setAdvertising } = useAdvertisingReplicant();

  return (
    <>
      <button
        onClick={() => {
          setAdvertising({ show: !show });
        }}
      >
        {show ? labelHide : labelShow}
      </button>
    </>
  );
}
