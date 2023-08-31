import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useMatchActions } from "hooks/use-match-actions";
import { Team } from "hooks/use-match-actions/types";
import { TeamSideOptions, useTeamSide } from "hooks/use-team-side";
import styled from "styled-components";

const SideShield = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  font:
    bolder 108px Cursed Timer ULiL,
    monospace;
  margin: 30px 50px 0;
  & > img {
    width: 100%;
  }
`;

export function TeamNotInMatch({ team }: { team: Team }) {
  const { localTeamSide } = useTeamSide();
  const { localShield, visitorShield } = useGraphicsReplicant();
  const { goals } = useMatchActions();

  const isLeftSide =
    (team === Team.LOCAL && localTeamSide === TeamSideOptions.LEFT) ||
    (team === Team.VISITOR && localTeamSide !== TeamSideOptions.LEFT);
  const dataPosition = isLeftSide ? "top left" : "top right";
  const src = team === Team.LOCAL ? localShield : visitorShield;
  const score = team === Team.LOCAL ? goals.local.length : goals.visitor.length;

  return (
    <SideShield data-position={dataPosition}>
      <img src={src} alt="Shield" />
      <div className="score">{score}</div>
    </SideShield>
  );
}
