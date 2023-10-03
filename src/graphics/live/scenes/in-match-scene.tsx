import {
  BACKGROUND_COLOR_CSS_VAR,
  BANNER_MAX_HEIGHT_CSS_VAR,
  OFFSET_BOTTOM_CSS_VAR,
  OFFSET_LEFT_CSS_VAR,
  OFFSET_RIGT_CSS_VAR,
  OFFSET_TOP_CSS_VAR,
  useCSSVariables,
} from "hooks/use-css-variables";
import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { ReactElement, useLayoutEffect, useMemo } from "react";
import Scoreboard from "components/scoreboard/graphics/scoreboard";

// Scene style
const BACKGROUND_COLOR = "#00ff00";

const START_SEVEN_PLAYERS = "START_SEVEN_PLAYERS";
const END_SEVEN_PLAYERS = "END_SEVEN_PLAYERS";
// const WARNING = "WARNING";
// const SUSPENSION = "SUSPENSION";
// const DISQUALIFICATION = "DISQUALIFICATION";
// const GOAL = "GOAL";
// const TIMEOUT = "TIMEOUT";

// const SUSPENSION_TIME = 120_000;

export default function InMatchScene(): ReactElement | null {
  const { setCssVariables } = useCSSVariables();
  const { actions } = useMatchActions();

  const isLocalTeamSevenPlayers = useMemo<boolean>(() => {
    const startActions = actions.filter(({ action, team }) => action === START_SEVEN_PLAYERS && team === Team.LOCAL);

    const endActions = actions.filter(({ action, team }) => action === END_SEVEN_PLAYERS && team === Team.LOCAL);

    return startActions.length !== endActions.length && (startActions.length > 0 || endActions.length > 0);
  }, [actions]);

  const isVisitorTeamSevenPlayers = useMemo<boolean>(() => {
    const startActions = actions.filter(({ action, team }) => action === START_SEVEN_PLAYERS && team === Team.VISITOR);

    const endActions = actions.filter(({ action, team }) => action === END_SEVEN_PLAYERS && team === Team.VISITOR);

    return startActions.length !== endActions.length && (startActions.length > 0 || endActions.length > 0);
  }, [actions]);

  const isAnyTeamSevenPlayers = useMemo<boolean>(() => {
    return isLocalTeamSevenPlayers || isVisitorTeamSevenPlayers;
  }, [isLocalTeamSevenPlayers, isVisitorTeamSevenPlayers]);

  useLayoutEffect(() => {
    document.querySelector(".visitor-team")?.setAttribute("data-active-info", isVisitorTeamSevenPlayers.toString());

    document.querySelector(".local-team")?.setAttribute("data-active-info", isLocalTeamSevenPlayers.toString());

    setCssVariables((prev) => ({
      ...prev,
      [BACKGROUND_COLOR_CSS_VAR]: BACKGROUND_COLOR,
      [BANNER_MAX_HEIGHT_CSS_VAR]: "130px",
      [OFFSET_TOP_CSS_VAR]: "20px",
      [OFFSET_BOTTOM_CSS_VAR]: "0",
      [OFFSET_LEFT_CSS_VAR]: "0",
      [OFFSET_RIGT_CSS_VAR]: "0",
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnyTeamSevenPlayers]);

  return (
    <>
      <div data-position="top center">
        <Scoreboard />
      </div>
    </>
  );
}
