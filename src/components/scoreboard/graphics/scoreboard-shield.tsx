import { NO_SHIELD_URL } from "constants/default-urls";
import { Team } from "hooks/use-match-actions/types";

export function ScoreboardShield({
  team,
  src,
  yellowCards,
  show = true,
}: {
  team: Team;
  src?: string;
  yellowCards?: number;
  show?: boolean;
}) {
  if (!show) return null;

  let whichTeam = "local";
  if (team === Team.VISITOR) {
    whichTeam = "visitor";
  }

  return (
    <>
      <div className={`shield shield-${whichTeam} column`}>
        {yellowCards ? <div className="yellow-card">{yellowCards}</div> : null}
        <img src={src ? src : NO_SHIELD_URL} alt="Team Shield" />
      </div>
    </>
  );
}
