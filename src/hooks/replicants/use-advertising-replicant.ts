import { useReplicant } from "hooks/use-replicant";
import { Advertising } from "types/schemas/advertising";

export function useAdvertisingReplicant() {
  const [advertisingProps, setAdvertisingInternal] = useReplicant<Advertising>("advertising", {}, { persistent: true });

  function setAdvertising(value: Partial<Advertising>) {
    setAdvertisingInternal({ ...advertisingProps, ...value });
  }
  return { ...advertisingProps, setAdvertising };
}
