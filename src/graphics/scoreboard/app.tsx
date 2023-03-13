import { useMatchActions } from "hooks/use-match-actions";
import { useReplicant } from "hooks/use-replicant";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement } from "react";
import { Graphics } from "types/schemas/graphics";
import { StopwatchTime } from "./src/components/stopwatch-time";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  const { goals } = useMatchActions();
  const { localTeamSide = "LEFT" } = useTeamSide();
  const [graphics] = useReplicant<Graphics, Graphics>("graphics", {});
  const showTeamName = false;
  const localName = "VET";
  const visitorName = "VISITOR";
  return (
    <>
      <div data-position="top center">
        <div
          className="scoreboard"
          data-local-team-side={localTeamSide === "LEFT" ? "left" : "right"}
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
            <StopwatchTime padZeroes={2} />
            <div className="info column"></div>
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
              <p>{goals.local.length.toString().padStart(2, "0")}</p>
            </div>
            <div className="suspensions"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
