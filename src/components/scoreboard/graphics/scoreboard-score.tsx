import { useMatchActions } from "hooks/use-match-actions";
import { MatchActionType, Team } from "hooks/use-match-actions/types";
import { useEffect, useState } from "react";

export function ScoreboardScore({
  team,
  fill = "0",
  fillLength = 2,
}: {
  team: Team;
  fill?: string;
  fillLength?: number;
}) {
  const [score, setScore] = useState<number>(0);
  const { getTeamActions, actions } = useMatchActions();

  useEffect(() => {
    setScore(getTeamActions(team, MatchActionType.GOAL).length);
  }, [actions]);

  return (
    <>
      <div className="score">
        <p>{score.toString().padStart(fillLength, fill)}</p>
      </div>
    </>
  );
}
