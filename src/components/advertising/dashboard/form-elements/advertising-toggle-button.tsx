import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";
import { useEffect } from "react";

export function ShowAdvertisingInput({
  labelShow = "Show advertising",
  labelHide = "Hide advertising",
}: { labelShow?: string; labelHide?: string } = {}) {
  const { show, setAdvertising } = useAdvertisingReplicant();
  useEffect(() => {
    console.log({ show });
  }, [show]);
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
