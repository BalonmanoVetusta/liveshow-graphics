import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { useReplicant } from "hooks/use-replicant";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement, useLayoutEffect, useMemo } from "react";
import { Graphics } from "types/schemas/graphics";
import { StopwatchTime } from "./src/components/stopwatch-time";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

const START_SEVEN_PLAYERS = "START_SEVEN_PLAYERS";
const END_SEVEN_PLAYERS = "END_SEVEN_PLAYERS";

function App(): ReactElement | null {
  const { goals, actions } = useMatchActions();
  const { localTeamSide = "LEFT" } = useTeamSide();
  const [graphics] = useReplicant<Graphics, Graphics>("graphics", {});
  const showTeamName = false;
  const localName = "VET";
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
          <div className="local-team team">
            <div className="shield shield-local column">
              <div className="yellow-card">
                {document
                  .querySelector(".local-team")
                  ?.getAttribute("data-yellow-cards") || ""}
              </div>
              <img
                src={
                  graphics.localShield ||
                  "https://balonmano.isquad.es/images/afiliacion_clubs/2898/square_35723432687275366a39.jpg"
                }
                alt="Local Team Image"
              />
            </div>

            {showTeamName ? (
              <div className="team-name">
                <p>{localName}</p>
              </div>
            ) : null}

            <div className="score">
              <p>{goals.local.length.toString().padStart(2, "0")}</p>
            </div>

            <div className="suspensions"></div>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 485 485"
              >
                <path d="M0 70v345h30V121.213l40 40V371h30v-43.5h48.75V371h30v-43.5h48.75V371h30v-43.5h48.75V371h30v-43.5H385V371h30V161.213l40-40V415h30V70H0zm100 100h48.75v48.75H100V170zm285 0v48.75h-48.75V170H385zm-78.75 48.75H257.5V170h48.75v48.75zm-78.75 0h-48.75V170h48.75v48.75zM100 297.5v-48.75h48.75v48.75H100zm78.75 0v-48.75h48.75v48.75h-48.75zm78.75 0v-48.75h48.75v48.75H257.5zm78.75 0v-48.75H385v48.75h-48.75zM393.787 140H91.213l-40-40h382.574l-40 40z" />
              </svg>
            </div>
          </div>
          <div className="visitor-team team">
            <div className="shield shield-visitor column">
              <div className="yellow-card">
                {document
                  .querySelector(".visitor-team")
                  ?.getAttribute("data-yellow-cards") || ""}
              </div>
              <img
                src={
                  graphics.visitorShield ||
                  "https://balonmano.isquad.es/images/afiliacion_clubs/2898/square_35723432687275366a39.jpg"
                }
                alt="Visitor Team"
              />
            </div>

            {showTeamName ? (
              <div className="team-name">
                <p>{visitorName}</p>
              </div>
            ) : null}

            <div className="score">
              <p>{goals.visitor.length.toString().padStart(2, "0")}</p>
            </div>
            <div className="suspensions"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
