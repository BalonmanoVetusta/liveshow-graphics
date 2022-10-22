import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useEffect, useId, useState } from "react";
import { Asset, AssetsReplicant } from "types/Asset";

function App(): ReactElement {
  const id = useId();
  const [shields] = useReplicant<AssetsReplicant, AssetsReplicant>(
    "assets:shields",
    [] as AssetsReplicant,
    {
      persistent: true,
    }
  );
  const [currentShield, setCurrentShield] = useState<Asset | undefined>(
    undefined
  );

  useEffect(() => {
    console.log({ shields });
  }, [shields]);

  return (
    <>
      <h1>Shields configuration</h1>
      <fieldset>
        <label htmlFor="asset">Asset</label>
        {shields.length > 0 ? (
          <select
            name="asset"
            id="asset"
            onChange={(event) => {
              if (event.target.value && shields.length > 0) {
                try {
                  setCurrentShield(shields.at(Number(event.target.value)));
                } catch (error) {}
              }
            }}
          >
            {shields.map((shield, index) => (
              <option key={`${id}-${shield.sum}`} value={index}>
                {shield.name}
              </option>
            ))}
          </select>
        ) : (
          <p>Upload any shield</p>
        )}
        {currentShield ? (
          <img
            src={currentShield.url}
            alt={currentShield.name}
            width="100px"
            height="100px"
          />
        ) : null}
      </fieldset>
    </>
  );
}

export default App;
