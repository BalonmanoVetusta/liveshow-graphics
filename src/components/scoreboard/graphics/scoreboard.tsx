import { StopwatchTime } from "components/stopwatch";
import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { Team } from "hooks/use-match-actions/types";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement } from "react";
import { styled } from "styled-components";
import { ScoreboardTeam } from "./scoreboard-team";

// const WARNING = "WARNING";
// const SUSPENSION = "SUSPENSION";
// const DISQUALIFICATION = "DISQUALIFICATION";
// const GOAL = "GOAL";
// const TIMEOUT = "TIMEOUT";

// const SUSPENSION_TIME = 120_000;

const StyledScoreboardContainer = styled.div`
  font:
    bolder var(--font-size, calc(22px * var(--size-scale-factor, 1))) Cursed Timer ULiL,
    monospace,
    sans-serif;
  color: var(--scoreboard-font-color, black);
  background-color: var(--background-color, #00ff00);
`;

export default function Scoreboard(): ReactElement | null {
  const { localTeamSide = "LEFT" } = useTeamSide();
  const { scoreboardPosition = "top center" } = useGraphicsReplicant();

  return (
    <>
      <StyledScoreboardContainer data-position={scoreboardPosition}>
        <div className="scoreboard" data-local-team-side={localTeamSide?.toLowerCase() === "left" ? "left" : "right"}>
          <ScoreboardTeam team={Team.LOCAL} />
          <div className="stopwatch column">
            <div className="competition-banner">
              <img src="https://www.rfebm.com/competiciones/images/logo.png" alt="" width={16} />
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
          <ScoreboardTeam team={Team.VISITOR} />
        </div>
      </StyledScoreboardContainer>
    </>
  );
}
