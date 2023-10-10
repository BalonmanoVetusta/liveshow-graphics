import { useReplicant } from "hooks/use-replicant";
import { AutoGoals } from "types/schemas/auto-goals";

export function useAutoGoalsReplicant() {
  const [autoGoals, setAutoGoals] = useReplicant<AutoGoals>("auto-goals", {});

  const updateValue = (key: keyof AutoGoals | Record<string, unknown>, value: unknown) => {
    if (typeof key === "object") return setAutoGoals((prev: AutoGoals) => ({ ...prev, ...key }));

    setAutoGoals({
      ...autoGoals,
      [key]: value,
    });
  };

  return {
    ...autoGoals,
    setAutoGoals,
    updateValue,
  };
}
