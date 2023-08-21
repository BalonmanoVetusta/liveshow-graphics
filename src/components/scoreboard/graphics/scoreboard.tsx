import { StopwatchTime } from "components/stopwatch";
import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { useReplicant } from "hooks/use-replicant";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement, useLayoutEffect, useMemo } from "react";
import { Graphics } from "types/schemas/graphics";
import { ScoreboardScore } from "./scoreboard-score";
import { ScoreboardShield } from "./scoreboard-shield";
import { ScoreboardTeamName } from "./scoreboard-team-name";
import Suspensions from "./suspensions/suspensions";

const START_SEVEN_PLAYERS = "START_SEVEN_PLAYERS";
const END_SEVEN_PLAYERS = "END_SEVEN_PLAYERS";
// const WARNING = "WARNING";
// const SUSPENSION = "SUSPENSION";
// const DISQUALIFICATION = "DISQUALIFICATION";
// const GOAL = "GOAL";
// const TIMEOUT = "TIMEOUT";

// const SUSPENSION_TIME = 120_000;

// TODO: Suspensions must recognise the case where a player has a double suspension

export default function Scoreboard(): ReactElement | null {
  const { goals, actions } = useMatchActions();
  // const { goals, actions, getSuspensions } = useMatchActions();
  const { localTeamSide = "LEFT" } = useTeamSide();
  const [graphics] = useReplicant<Graphics>("graphics", {
    advertising: true,
    advertisingTime: 10,
  });
  const showTeamName = false;
  const localName = "VETUSTA";
  const visitorName = "VISITOR";

  const isLocalTeamSevenPlayers = useMemo<boolean>(() => {
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

  const isVisitorTeamSevenPlayers = useMemo<boolean>(() => {
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

  const isAnyTeamSevenPlayers = useMemo<boolean>(() => {
    return isLocalTeamSevenPlayers || isVisitorTeamSevenPlayers;
  }, [isLocalTeamSevenPlayers, isVisitorTeamSevenPlayers]);

  // const localTeamYellowCards = useMemo<number>(() => {
  //   return actions.filter(
  //     ({ action, team }) => action === WARNING && team === Team.LOCAL
  //   ).length;
  // }, [actions]);

  // const visitorTeamYellowCards = useMemo<number>(() => {
  //   return actions.filter(
  //     ({ action, team }) => action === WARNING && team === Team.VISITOR
  //   ).length;
  // }, [actions]);

  useLayoutEffect(() => {
    document
      .querySelector(".visitor-team")
      ?.setAttribute("data-active-info", isVisitorTeamSevenPlayers.toString());

    document
      .querySelector(".local-team")
      ?.setAttribute("data-active-info", isLocalTeamSevenPlayers.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnyTeamSevenPlayers]);

  return (
    <>
      <div data-position="top center">
        <div
          className="scoreboard"
          data-local-team-side={
            localTeamSide?.toLowerCase() === "left" ? "left" : "right"
          }
        >
          <ScoreboardShield team={Team.LOCAL} src={graphics.localShield} />
          <ScoreboardTeamName name={localName} show={showTeamName} />
          <ScoreboardScore score={goals.local.length} />
          <Suspensions team={Team.LOCAL} />
        </div>
        <div className="stopwatch column">
          <div className="competition-banner">
            <img
              src="https://www.rfebm.com/competiciones/images/logo.png"
              alt=""
              width={16}
            />
          </div>
          <StopwatchTime padZeroes={2} />
          <div className="info column">
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 485 485"
              >
                <path d="M0 70v345h30V121.213l40 40V371h30v-43.5h48.75V371h30v-43.5h48.75V371h30v-43.5h48.75V371h30v-43.5H385V371h30V161.213l40-40V415h30V70H0zm100 100h48.75v48.75H100V170zm285 0v48.75h-48.75V170H385zm-78.75 48.75H257.5V170h48.75v48.75zm-78.75 0h-48.75V170h48.75v48.75zM100 297.5v-48.75h48.75v48.75H100zm78.75 0v-48.75h48.75v48.75h-48.75zm78.75 0v-48.75h48.75v48.75H257.5zm78.75 0v-48.75H385v48.75h-48.75zM393.787 140H91.213l-40-40h382.574l-40 40z" />
              </svg> */}
          </div>
        </div>
        <div className="visitor-team team">
          <ScoreboardShield team={Team.VISITOR} src={graphics.visitorShield} />
          <ScoreboardTeamName name={visitorName} show={showTeamName} />
          <ScoreboardScore score={goals.visitor.length} />

          <Suspensions team={Team.VISITOR} />
        </div>
      </div>
    </>
  );
}
