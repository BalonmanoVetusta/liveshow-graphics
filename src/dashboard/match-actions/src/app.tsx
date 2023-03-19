import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { ReactElement, useMemo, useState } from "react";
import { MatchAction } from "types/schemas/match-action";
import { AddSuspensionForm } from "./components/add-suspension-form";

const START_SEVEN_PLAYERS = "START_SEVEN_PLAYERS";
const END_SEVEN_PLAYERS = "END_SEVEN_PLAYERS";
const GOAL = "GOAL";
const SUSPENSION = "SUSPENSION";

function App(): ReactElement {
  const [suspensionNumber = 0, setSuspensionNumber] = useState<number>(0);
  const {
    actions,
    setActions,
    startSevenPlayers,
    stopSevenPlayers,
    reset: resetActions,
    addAction,
  } = useMatchActions();
  const isSevenPlayersLocal = useMemo(() => {
    const startActions = actions.filter(
      ({ action, team }) =>
        action === START_SEVEN_PLAYERS && team === Team.LOCAL
    );
    const endActions = actions.filter(
      ({ action, team }) => action === END_SEVEN_PLAYERS && team === Team.LOCAL
    );

    return (
      startActions.length !== endActions.length &&
      (startActions.length > 0 || endActions.length > 0)
    );
  }, [actions]);

  const isSevenPlayersVisitor = useMemo<boolean>(() => {
    const startActions = actions.filter(
      ({ action, team }) =>
        action === START_SEVEN_PLAYERS && team === Team.VISITOR
    );
    const endActions = actions.filter(
      ({ action, team }) =>
        action === END_SEVEN_PLAYERS && team === Team.VISITOR
    );

    return (
      startActions.length !== endActions.length &&
      (startActions.length > 0 || endActions.length > 0)
    );
  }, [actions]);

  return (
    <>
      <fieldset>
        <legend>Local</legend>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            if (!isSevenPlayersLocal) {
              startSevenPlayers(Team.LOCAL);
              return;
            }

            if (isSevenPlayersLocal) {
              stopSevenPlayers(Team.LOCAL);
              return;
            }
          }}
        >
          {isSevenPlayersLocal ? "Goalkeeper is back" : "No Goalkeeper"}
        </button>
        <div>
          <fieldset>
            <legend>Suspensions</legend>
            <AddSuspensionForm team={Team.LOCAL} />
          </fieldset>
        </div>
      </fieldset>
      <fieldset>
        <legend>Visitor</legend>
        <div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              if (!isSevenPlayersVisitor) {
                startSevenPlayers(Team.VISITOR);
                return;
              }

              if (isSevenPlayersVisitor) {
                stopSevenPlayers(Team.VISITOR);
                return;
              }
            }}
          >
            {isSevenPlayersVisitor ? "Goalkeeper is back" : "No Goalkeeper"}
          </button>
        </div>
        <div>
          <fieldset>
            <legend>Suspensions</legend>
            <AddSuspensionForm team={Team.VISITOR} />
          </fieldset>
        </div>
      </fieldset>

      <fieldset>
        <legend>Actions</legend>
        <button
          onClick={(event) => {
            event.preventDefault();
            resetActions();
          }}
        >
          Delete All actions & goals (full reset except time)
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            setActions(
              actions.filter(({ action }: MatchAction) => action === GOAL)
            );
          }}
        >
          Delete All actions (keep goals)
        </button>
      </fieldset>
    </>
  );
}

export default App;
