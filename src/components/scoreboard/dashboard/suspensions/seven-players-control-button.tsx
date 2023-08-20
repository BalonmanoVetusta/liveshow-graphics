import { Goal, GoalWithGoalkeeper } from "components/Icons";
import { useMatchActions } from "hooks/use-match-actions";
import { MatchActionType, Team } from "hooks/use-match-actions/types";
import { useMemo } from "react";

export function SevenPlayersControlButton({ team }: { team: Team }) {
  const { actions, getTeamActions, startSevenPlayers, stopSevenPlayers } =
    useMatchActions();
  const isSevenPlayers = useMemo(() => {
    const startActions = getTeamActions(
      team,
      MatchActionType.START_SEVEN_PLAYERS
    );
    const endActions = getTeamActions(team, MatchActionType.END_SEVEN_PLAYERS);

    return (
      startActions.length !== endActions.length &&
      (startActions.length > 0 || endActions.length > 0)
    );
  }, [actions]);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        if (!isSevenPlayers) {
          startSevenPlayers(team);
          return;
        }

        if (isSevenPlayers) {
          stopSevenPlayers(team);
          return;
        }
      }}
    >
      {isSevenPlayers ? (
        <GoalWithGoalkeeper width={64} height={64} />
      ) : (
        <Goal width={64} height={64} />
      )}
    </button>
  );
}
