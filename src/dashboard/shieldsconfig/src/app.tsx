import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement } from "react";
import styled from "styled-components";
import { AdvertisingConfig } from "./components/advertising-config";
import { ShieldSelector } from "./components/shield-selector";

const Shield = styled.img`
  width: 80px;
`;

const ShieldsComponent = styled.div<{ localTeamSide: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: ${(props: { localTeamSide: string }) =>
    props?.localTeamSide?.toLowerCase() !== "left" ? "row-reverse" : "row"};
  margin: 20px 0;
`;

function App(): ReactElement {
  const { localTeamSide = "LEFT", toggleSide } = useTeamSide();
  const { localShield, visitorShield, setGraphics } = useGraphicsReplicant();

  return (
    <>
      <fieldset>
        <legend>Local</legend>
        <div>
          <ShieldSelector
            key={`local-${localShield}`}
            label="Local Team Shield"
            acceptManuallyInputUrl={true}
            initialValue={localShield}
            onChange={(url) => setGraphics({ localShield: url })}
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
            key={`visitor-${visitorShield}`}
            label="Visitor Team Shield"
            acceptManuallyInputUrl={true}
            initialValue={visitorShield}
            onChange={(url) => setGraphics({ visitorShield: url })}
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
          <Shield src={localShield} alt="Local Team Shield" width={80} />
          <Shield src={visitorShield} alt="Visitor Team Shield" width={80} />
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

      <AdvertisingConfig />
    </>
  );
}

export default App;
