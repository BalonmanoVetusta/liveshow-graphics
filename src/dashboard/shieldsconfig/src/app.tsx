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
      <fieldset>
        <legend>Local</legend>
        <div>
          <ShieldSelector
            key={`local-${currentLocalShield}`}
            label="Local Team Shield"
            acceptManuallyInputUrl={true}
            initialValue={currentLocalShield}
            onChange={(url) => setGraphics({ ...graphics, localShield: url })}
          />
        </div>

        <div>
          <label htmlFor="local-shield-bgcolor-input">
            Local Team Background Shield Color
          </label>
          <input
            type="color"
            name="local-shield-bgcolor"
            id="local-shield-bgcolor-input"
            placeholder="Local Team Background Shield Color"
            list="local-team-colors"
          />
        </div>
        <datalist id="local-team-colors">
          <option value="#F2DE4C" />
          <option value="#151111" />
          <option value="#000000" />
          <option value="#ffffff" />
          <option value="#00ff00" />
        </datalist>
      </fieldset>

      <fieldset>
        <legend>Visitor</legend>
        <div>
          <ShieldSelector
            key={`visitor-${currentVisitorShield}`}
            label="Visitor Team Shield"
            acceptManuallyInputUrl={true}
            initialValue={currentVisitorShield}
            onChange={(url) => setGraphics({ ...graphics, visitorShield: url })}
          />
        </div>

        <div>
          <label htmlFor="visitor-shield-bgcolor-input">
            Visitor Team Background Shield Color
          </label>
          <input
            type="color"
            name="visitor-shield-bgcolor"
            id="visitor-shield-bgcolor-input"
            placeholder="Visitor Team Background Shield Color"
            list="visitor-team-colors"
          />
        </div>
        <datalist id="visitor-team-colors">
          <option value="#F2DE4C" />
          <option value="#151111" />
          <option value="#000000" />
          <option value="#ffffff" />
          <option value="#00ff00" />
        </datalist>
      </fieldset>

      <fieldset>
        <legend>Shields preview</legend>
        <ShieldsComponent localTeamSide={localTeamSide}>
          <Shield src={currentLocalShield} alt="Local Team Shield" width={80} />
          <Shield
            src={currentVisitorShield}
            alt="Visitor Team Shield"
            width={80}
          />
        </ShieldsComponent>
      </fieldset>

      <fieldset>
        <legend>Common shield configuration</legend>
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
