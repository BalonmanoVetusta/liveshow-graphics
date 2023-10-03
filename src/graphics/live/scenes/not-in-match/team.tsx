import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { MaxTimeUnit, useStopwatchReplicantReader } from "hooks/use-stopwatch-replicant";
import { TeamSideOptions, useTeamSide } from "hooks/use-team-side";
import styled from "styled-components";

const SideShield = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 400px;
  height: 500px;
  margin: 30px 50px 0;
  & > img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
  & > div.score {
    text-align: center;
    position: absolute;
    left: 200px;
    top: 540px;
    transform: translateX(-50%);
    font:
      bolder 108px Cursed Timer ULiL,
      monospace;
  }
`;

export function TeamNotInMatch({ team }: { team: Team }) {
  const { localTeamSide } = useTeamSide();
  const { localShield, visitorShield } = useGraphicsReplicant();
  const { goals } = useMatchActions();
  const {
    minutes = 0,
    seconds = 0,
    // milliseconds = 0,
    // periodTime = 0,
  } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  const isLeftSide =
    (team === Team.LOCAL && localTeamSide === TeamSideOptions.LEFT) ||
    (team === Team.VISITOR && localTeamSide !== TeamSideOptions.LEFT);
  const dataPosition = isLeftSide ? "top left" : "top right";
  const src = team === Team.LOCAL ? localShield : visitorShield;
  const score = team === Team.LOCAL ? goals.local.length : goals.visitor.length;
  const scoreString = score.toString().padStart(2, "0");

  return (
    <>
      <SideShield data-position={dataPosition}>
        <img src={src} alt="Shield" />
        {minutes > 0 || seconds > 0 ? <div className="score">{scoreString}</div> : null}
      </SideShield>
    </>
  );
}
