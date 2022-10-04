import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { ReactElement } from "react";

export function ScoreboardPanel(): ReactElement {
  const { addGoal, reset, removeLastGoal, goals } = useMatchActions();

  const local = goals.local.length.toString().padStart(2, "0");
  const visitor = goals.visitor.length.toString().padStart(2, "0");

  return (
    <div>
      <fieldset>
        <h3>Local Team Score</h3>
        <h4>{local}</h4>
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
        <h4>{visitor}</h4>
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
