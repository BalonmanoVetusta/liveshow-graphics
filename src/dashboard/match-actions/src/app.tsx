import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { ReactElement, useMemo } from "react";

const START_SEVEN_PLAYERS = "START_SEVEN_PLAYERS";
const END_SEVEN_PLAYERS = "END_SEVEN_PLAYERS";

function App(): ReactElement {
  const {
    actions,
    startSevenPlayers,
    stopSevenPlayers,
    reset: resetActions,
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
      </fieldset>
      <fieldset>
        <legend>Visitor</legend>
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
      </fieldset>

      <fieldset>
        <legend>Actions</legend>
        <button
          onClick={(event) => {
            event.preventDefault();
            resetActions();
          }}
        >
          Delete All actions & goals
        </button>
      </fieldset>
    </>
  );
}

export default App;
