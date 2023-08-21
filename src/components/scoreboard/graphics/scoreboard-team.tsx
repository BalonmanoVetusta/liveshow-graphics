import { Team } from "hooks/use-match-actions/types";
import { ScoreboardScore } from "./scoreboard-score";
import { ScoreboardShield } from "./scoreboard-shield";
import { ScoreboardTeamName } from "./scoreboard-team-name";
import Suspensions from "./suspensions/suspensions";

export function ScoreboardTeam({
  src,
  name,
  team,
  side = "left",
  showTeamName = true,
}: {
  src?: string;
  name?: string;
  team: Team;
  side?: string;
  showTeamName?: boolean;
}) {
  return (
    <>
      <div className="scoreboard" data-local-team-side={side}>
        <ScoreboardShield team={Team.LOCAL} src={src} />(
        {name ? <ScoreboardTeamName name={name} show={!!name} /> : null})
        <ScoreboardScore team={team} />
        <Suspensions team={Team.LOCAL} />
      </div>
    </>
  );
}
