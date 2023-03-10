import { useMatchActions } from "hooks/use-match-actions";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement } from "react";
import { StopwatchTime } from "./src/components/stopwatch-time";
// import { SCOREBOARD_MAIN_TIMER } from "services/scoreboard-main-timer";

function App(): ReactElement | null {
  const { goals } = useMatchActions();
  const { localTeamSide = "LEFT" } = useTeamSide();
  return (
    <>
      {/* <div className="suspensions local-team" data-side="left">
        <ul>
          <li data-number="07" data-time="01:53"></li>
          <li data-number="18" data-time="03:53"></li>
        </ul>
      </div>

      <div className="suspensions visitor-team" data-side="right">
        <ul>
          <li data-number="16" data-time="00:53"></li>
          <li data-number="TE" data-time="01:53"></li>
        </ul>
      </div> */}

      <div className="scoreboard-container">
        <div className="scoreboard">
          <div
            className="local-team team"
            data-side={localTeamSide === "LEFT" ? "left" : "right"}
          >
            <div className="score">
              <p>{goals.local.length.toString().padStart(2, "0")}</p>
            </div>
            <div className="shield shield-local column">
              <div className="yellow-card"></div>
              <img
                src="https://balonmano.isquad.es/images/afiliacion_clubs/2898/square_35723432687275366a39.jpg"
                alt="Local Team Image"
              />
            </div>
          </div>
          <div className="stopwatch column">
            <StopwatchTime padZeroes={2} />
            <div className="info column"></div>
          </div>
          <div
            className="visitor-team team"
            data-side={localTeamSide === "LEFT" ? "right" : "left"}
          >
            <div className="score">
              <p>{goals.visitor.length.toString().padStart(2, "0")}</p>
            </div>
            <div className="shield shield-visitor column">
              <div className="yellow-card"></div>
              <img
                src="http://balonmano.isquad.es/images/afiliacion_clubs/488/square_32383967706436617972.jpg"
                alt="Visitor Team"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
