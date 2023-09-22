import { useReplicant } from "hooks/use-replicant";
import { AutoGoals } from "types/schemas/auto-goals";

export function useAutoGoals(initial: AutoGoals = { activated: false }) {
  const [autoGoals, setAutoGoals] = useReplicant<AutoGoals>("auto-goals", initial);

  const updateWithObject = (o: Partial<AutoGoals>) => setAutoGoals({ ...autoGoals, ...o });

  function setActive(activate?: boolean) {
    if (activate === false || autoGoals.activated) return updateWithObject({ activated: false });

    if (autoGoals.matchId && autoGoals.weekId && autoGoals.tournamentId)
      return updateWithObject({ activated: activate ?? true });
  }

  return { ...autoGoals, setActive, setAutoGoals: updateWithObject };
}
