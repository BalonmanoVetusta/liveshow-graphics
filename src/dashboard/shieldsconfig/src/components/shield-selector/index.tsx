import { useId, useState } from "react";
import { Asset, AssetsReplicant } from "types/Asset";
import { useReplicant } from "../../../../../hooks/use-replicant";

const DEFAULT_OPTION_VALUE = "DEFAULT";

// TODO: This component logic is too complicated, use directly the replicants instead of a callback
export function ShieldSelector({
  label = "Shield",
  initialValue = DEFAULT_OPTION_VALUE,
  onChange = () => undefined,
  acceptManuallyInputUrl = true,
}: {
  label: string;
  initialValue: string | undefined;
  onChange: (url: string, previous?: string) => void;
  acceptManuallyInputUrl: boolean | undefined;
}) {
  const id = useId();
  const [shields] = useReplicant<AssetsReplicant>("assets:shields", [], {
    persistent: false,
  });
  const [selectedShield, setSelectedShield] = useState<string>(initialValue);
  const [shieldUrl, setShieldUrl] = useState<string>(initialValue !== DEFAULT_OPTION_VALUE ? initialValue : "");

  const searchShieldAsset = (value: string) => shields.find((s) => s.url === value || s.sum === value);

  return (
    <>
      <label htmlFor={`shield-${id}`}>{label}</label>
      <select
        name={`shield-${id}`}
        id={`shield-${id}`}
        onChange={(event) => {
          event.preventDefault();
          const newValue = event.target.value;
          if (newValue.startsWith("http")) {
            setShieldUrl(newValue);
            onChange(newValue, shieldUrl);
            return;
          }
          const newShield = shields.find((s) => s.sum === newValue);
          onChange(newShield?.url || DEFAULT_OPTION_VALUE, shieldUrl);
          setSelectedShield(newShield?.sum || DEFAULT_OPTION_VALUE);
          setShieldUrl(newShield?.url || "");
        }}
        value={searchShieldAsset(selectedShield)?.sum ?? DEFAULT_OPTION_VALUE}
      >
        <option value={DEFAULT_OPTION_VALUE}>Choose from the list</option>
        {/* <option value="https://www.rfebm.com/competiciones/images/escudos/sinescudo.jpg">No shield</option> */}
        {shields.length > 0 ? (
          shields.map((shield: Asset) => (
            <option key={shield.sum} value={shield.sum}>
              {shield.name}
            </option>
          ))
        ) : (
          <option>-- NO SHIELDS --</option>
        )}
      </select>
      {!searchShieldAsset(selectedShield) && acceptManuallyInputUrl ? (
        <>
          <input
            type="url"
            name="url"
            id="url"
            onChange={(event) => {
              event.preventDefault();
              setShieldUrl(event.target.value);
              onChange(event.target.value);
            }}
            value={shieldUrl}
          />
        </>
      ) : null}
    </>
  );
}
