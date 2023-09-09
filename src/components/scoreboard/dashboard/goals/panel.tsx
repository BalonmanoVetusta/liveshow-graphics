import { useMatchActions } from "hooks/use-match-actions";
import { MatchActionType, Team } from "hooks/use-match-actions/types";
import { ReactElement } from "react";
import { GoalsTeamControls } from "./team-controls";

export function GoalsPanel(): ReactElement {
  const { setActions, actions } = useMatchActions();

  const handleResetGoals = (event) => {
    event.preventDefault();
    const filteredActions = actions.filter(({ action }) => action !== MatchActionType.GOAL);
    setActions(filteredActions);
  };

  return (
    <div>
      <h3>Controls: Goals</h3>
      <GoalsTeamControls team={Team.LOCAL} teamLabel="Local" />
      <GoalsTeamControls team={Team.VISITOR} teamLabel="Visitor" />
      <button onClick={handleResetGoals}>Reset All Goals (only actions that are goals)</button>
    </div>
  );
}
