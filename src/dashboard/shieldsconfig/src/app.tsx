import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { Asset, AssetsReplicant } from "types/Asset";
import { Graphics } from "types/schemas/graphics";

const Shield = styled.img`
  width: 80px;
`;

const ShieldsComponent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 20px 0;
`;

function App(): ReactElement {
  const [shields] = useReplicant<AssetsReplicant, AssetsReplicant>(
    "assets:shields",
    []
  );
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

  const handleChangeLocalShield = (event) => {
    event.preventDefault();
    const newShield = shields.find((s) => s.sum === event.target.value);
    setGraphics({
      ...graphics,
      localShield: newShield?.url,
    });
  };

  const handleChangeVisitorShield = (event) => {
    event.preventDefault();
    const newShield = shields.find((s) => s.sum === event.target.value);
    setGraphics({
      ...graphics,
      visitorShield: newShield?.url,
    });
  };

  useEffect(() => {
    setCurrentLocalShield(graphics.localShield);
    setCurrentVisitorShield(graphics.visitorShield);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphics]);

  return (
    <>
      <fieldset>
        <label htmlFor="local-shield">Local Team Shield</label>
        <select
          name="local-shield"
          id="local-shield-select"
          onChange={handleChangeLocalShield}
          value={
            shields.find((s) => s.url === currentLocalShield)?.sum || "DEFAULT"
          }
        >
          <option value="DEFAULT">Choose a shield</option>
          {shields.map((shield: Asset) => (
            <option key={shield.sum} value={shield.sum}>
              {shield.name}
            </option>
          ))}
        </select>
        <label htmlFor="visitor-shield">Visitor Team Shield</label>
        <select
          name="visitor-shield"
          id="visitor-shield-select"
          onChange={handleChangeVisitorShield}
          value={
            shields.find((s) => s.url === currentVisitorShield)?.sum ||
            "DEFAULT"
          }
        >
          <option value="DEFAULT">Choose a shield</option>
          {shields.map((shield: Asset) => (
            <option key={shield.sum} value={shield.sum}>
              {shield.name}
            </option>
          ))}
        </select>
      </fieldset>

      <ShieldsComponent>
        <Shield src={currentLocalShield} alt="Local Team Shield" width={80} />
        <Shield
          src={currentVisitorShield}
          alt="Visitor Team Shield"
          width={80}
        />
      </ShieldsComponent>
    </>
  );
}

export default App;
