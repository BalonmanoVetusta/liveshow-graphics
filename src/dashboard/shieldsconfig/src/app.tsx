import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { Team } from "hooks/use-match-actions/types";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement } from "react";
import styled from "styled-components";
import { AdvertisingConfig } from "./components/advertising-config";
import { ShieldBgColor } from "./components/shield-bg-color";
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
  const {
    localShield,
    visitorShield,
    showShields = true,
    setGraphics,
  } = useGraphicsReplicant();

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

        <ShieldBgColor team={Team.LOCAL} />
      </fieldset>

      <fieldset>
        <legend>Show shields in scoreboard</legend>
        <div>
          <label htmlFor="show-shields-input">Show shields</label>
          <input
            type="checkbox"
            name="show-shields"
            id="show-shields-input"
            checked={showShields}
            onChange={(event) =>
              setGraphics({ showShields: event.target.checked })
            }
          />
        </div>
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

        <ShieldBgColor team={Team.VISITOR} />
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
