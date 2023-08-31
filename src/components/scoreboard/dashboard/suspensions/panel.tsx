import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { ReactElement } from "react";
import { MatchAction } from "types/schemas/match-action";
import { AddSuspensionForm } from "./add-suspension-form";
import { SevenPlayersControlButton } from "./seven-players-control-button";

// const START_SEVEN_PLAYERS = "START_SEVEN_PLAYERS";
// const END_SEVEN_PLAYERS = "END_SEVEN_PLAYERS";
const GOAL = "GOAL";
// const SUSPENSION = "SUSPENSION";

export function SunspensionsPanel(): ReactElement {
  const { actions, setActions, resetAllActions } = useMatchActions();

  return (
    <>
      <h3>Controls: Suspensions & Seven Players</h3>
      <fieldset>
        <legend>Local</legend>
        <div>
          <fieldset>
            <legend>Suspensions</legend>
            <AddSuspensionForm team={Team.LOCAL} />
          </fieldset>

          <fieldset>
            <SevenPlayersControlButton team={Team.LOCAL} />
          </fieldset>
        </div>
      </fieldset>
      <fieldset>
        <legend>Visitor</legend>

        <fieldset>
          <legend>Suspensions</legend>
          <AddSuspensionForm team={Team.VISITOR} />
        </fieldset>

        <fieldset>
          <SevenPlayersControlButton team={Team.VISITOR} />
        </fieldset>
      </fieldset>

      <fieldset>
        <legend>Actions</legend>
        <button
          onClick={(event) => {
            event.preventDefault();
            resetAllActions();
          }}
        >
          Reset (delete all actions & goals)
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setActions(actions.filter(({ action }: MatchAction) => action === GOAL));
          }}
        >
          Delete All actions (keep goals)
        </button>
      </fieldset>
    </>
  );
}
