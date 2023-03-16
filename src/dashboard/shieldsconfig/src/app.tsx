import { useReplicant } from "hooks/use-replicant";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { Graphics } from "types/schemas/graphics";
import { ShieldSelector } from "./components/shield-selector";

const Shield = styled.img`
  width: 80px;
`;

const ShieldsComponent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: ${(props: { localTeamSide: string }) =>
    props?.localTeamSide !== "LEFT" ? "row-reverse" : "row"};
  margin: 20px 0;
`;

function App(): ReactElement {
  const { localTeamSide = "LEFT", toggleSide } = useTeamSide();

  const [currentLocalShield, setCurrentLocalShield] = useState<
    string | undefined
  >();

  const [currentVisitorShield, setCurrentVisitorShield] = useState<
    string | undefined
  >();

  const [graphics, setGraphics] = useReplicant<Graphics, Graphics>(
    "graphics",
    {}
  );

  useEffect(() => {
    setCurrentLocalShield(graphics.localShield);
    setCurrentVisitorShield(graphics.visitorShield);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphics]);

  return (
    <>
      <ShieldSelector
        key={`local-${currentLocalShield}`}
        label="Local Team Shield"
        acceptManuallyInputUrl={true}
        initialValue={currentLocalShield}
        onChange={(url) => setGraphics({ ...graphics, localShield: url })}
      />

      <ShieldSelector
        key={`visitor-${currentVisitorShield}`}
        label="Visitor Team Shield"
        acceptManuallyInputUrl={true}
        initialValue={currentVisitorShield}
        onChange={(url) => setGraphics({ ...graphics, visitorShield: url })}
      />

      <ShieldsComponent localTeamSide={localTeamSide}>
        <Shield src={currentLocalShield} alt="Local Team Shield" width={80} />
        <Shield
          src={currentVisitorShield}
          alt="Visitor Team Shield"
          width={80}
        />
      </ShieldsComponent>

      <fieldset>
        <button
          id="changeSide"
          onClick={(event) => {
            event.preventDefault();
            toggleSide();
          }}
        >
          Toggle Sides
        </button>
      </fieldset>
    </>
  );
}

export default App;
