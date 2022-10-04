import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { ReactElement } from "react";

export function ScoreboardPanel(): ReactElement {
  const { addGoal, reset, removeLastGoal } = useMatchActions();

  return (
    <div>
      <fieldset>
        <h3>Local Team Score</h3>
        <button
          onClick={() => {
            addGoal(Team.LOCAL);
          }}
        >
          +1
        </button>
        <button onClick={() => removeLastGoal(Team.LOCAL)}>-1</button>
      </fieldset>
      <fieldset>
        <h3>Visitor Team Score</h3>
        <button
          onClick={() => {
            addGoal(Team.VISITOR);
          }}
        >
          +1
        </button>
        <button onClick={() => removeLastGoal(Team.VISITOR)}>-1</button>
      </fieldset>
      <fieldset>
        <button
          onClick={() => {
            reset();
          }}
        >
          Reset
        </button>
      </fieldset>
    </div>
  );
}
