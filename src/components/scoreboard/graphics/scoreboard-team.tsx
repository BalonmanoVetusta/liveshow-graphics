import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useMatchActions } from "hooks/use-match-actions";
import { MatchActionType, Team } from "hooks/use-match-actions/types";
import { useMemo } from "react";
import { ScoreboardScore } from "./scoreboard-score";
import { ScoreboardShield } from "./scoreboard-shield";
import { ScoreboardTeamName } from "./scoreboard-team-name";
import Suspensions from "./suspensions/suspensions";

export function ScoreboardTeam({ team }: { team: Team }) {
  const { showShields, showName, localShield, visitorShield, localTeamName, visitorTeamName } = useGraphicsReplicant();
  const { getTeamActions, actions } = useMatchActions();

  const isSevenPlayers = useMemo(() => {
    const startActions = getTeamActions(team, MatchActionType.START_SEVEN_PLAYERS);
    const endActions = getTeamActions(team, MatchActionType.END_SEVEN_PLAYERS);

    return (startActions.length > 0 || endActions.length > 0) && startActions.length !== endActions.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  const name = team === Team.LOCAL ? localTeamName : visitorTeamName;
  const src = team === Team.LOCAL ? localShield : visitorShield;

  return (
    <>
      <div className={`${team.toString().toLowerCase()}-team team`} data-active-info={isSevenPlayers}>
        <ScoreboardShield team={team} src={src} show={showShields} />
        <ScoreboardTeamName name={name} show={showName} />
        <ScoreboardScore team={team} />
        <Suspensions team={team} />
      </div>
    </>
  );
}
