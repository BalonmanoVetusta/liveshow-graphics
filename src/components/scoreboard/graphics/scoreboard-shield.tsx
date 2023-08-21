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
  if (!show || !src) return null;

  let whichTeam = "local";
  if (team === Team.VISITOR) {
    whichTeam = "visitor";
  }

  return (
    <>
      <div className={`shield shield-${whichTeam} column`}>
        {yellowCards ? <div className="yellow-card">{yellowCards}</div> : null}
        <img src={src} alt="Team Shield" />
      </div>
    </>
  );
}
