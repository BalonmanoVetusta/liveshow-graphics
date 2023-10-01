import { useAdvertisingReplicant } from "hooks/replicants/use-advertising-replicant";

export function AdvertisingGraphics() {
  const { show } = useAdvertisingReplicant();

  if (!show) return null;

  return (
    <div>
      <h1>Advertising Graphics</h1>
    </div>
  );
}
