import { useReplicant } from "hooks/use-replicant";
import { useTeamSide } from "hooks/use-team-side";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Graphics } from "types/schemas/graphics";
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
  const { localTeamSide = "LEFT", toggleSide } = useTeamSide();

  const [currentLocalShield, setCurrentLocalShield] = useState<
    string | undefined
  >();

  const [currentVisitorShield, setCurrentVisitorShield] = useState<
    string | undefined
  >();

  const [graphics, setGraphics] = useReplicant<Graphics>("graphics", {});

  useEffect(() => {
    setCurrentLocalShield(graphics.localShield);
    setCurrentVisitorShield(graphics.visitorShield);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphics]);

  return (
    <ShieldsComponent localTeamSide={localTeamSide}>
      <Shield src={currentLocalShield} alt="Local Team Shield" width={80} />
      <Shield src={currentVisitorShield} alt="Visitor Team Shield" width={80} />
    </ShieldsComponent>
  );
}
