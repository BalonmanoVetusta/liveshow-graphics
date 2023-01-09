import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useId, useRef } from "react";
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
  const selectedShield = useRef<Asset | undefined>(undefined);

  // const handleShieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   selectedShield.current = event.target.value;
  //   setGraphics({
  //     ...graphics,
  //     shield: selectedShield.current,
  //   });

  // useEffect(() => {
  //   selectedShield.current = graphics.shield;
  //   setCurrentShield(shields.find((shields) => shield.sum === selectedShield.current));
  // }, [graphics, shields]);

  const handleShieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log({ event });
  };

  return (
    <>
      <h1>Shields configuration</h1>
      <fieldset>
        <label htmlFor="asset">Asset</label>
        {shields.length > 0 ? (
          <select
            name="asset"
            id="asset"
            onChange={handleShieldChange}
            value={selectedShield?.current?.name ?? "DEFAULT"}
          >
            <option value="DEFAULT" disabled>
              Choose a shield
            </option>
            {shields.map((shield) => (
              <option key={`${id}-${shield.sum}`} value={shield.sum}>
                {shield.name}
              </option>
            ))}
          </select>
        ) : (
          <p>Upload any shield</p>
        )}
        {selectedShield.current ? (
          // <img
          //   src={shields[currentShield].url}
          //   alt={shields[currentShield].name}
          //   width="100px"
          //   height="100px"
          // />
          <h3>Img</h3>
        ) : null}
      </fieldset>
    </>
  );
}

export default App;
