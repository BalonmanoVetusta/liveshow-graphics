import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useTeamSide } from "hooks/use-team-side";
import styled from "styled-components";
import { Shield } from "./shield";

const ShieldsComponent = styled.div<{ localTeamSide: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: ${(props: { localTeamSide: string }) =>
    props?.localTeamSide?.toLowerCase() !== "left" ? "row-reverse" : "row"};
  margin: 20px 0;
`;

export function PreviewShield() {
  const { localTeamSide = "LEFT" } = useTeamSide();
  const { localShield, visitorShield } = useGraphicsReplicant();

  return (
    <ShieldsComponent localTeamSide={localTeamSide}>
      <Shield src={localShield} alt="Local Team Shield" width={80} />
      <Shield src={visitorShield} alt="Visitor Team Shield" width={80} />
    </ShieldsComponent>
  );
}
