import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useEffect, useId, useState } from "react";
import { Asset, AssetsReplicant } from "types/Asset";

function App(): ReactElement {
  const id = useId();
  const { visitorShield } = useGraphicsReplicant();
  const [shields] = useReplicant<AssetsReplicant>("assets:shields", [], {
    persistent: false,
  });
  const [selectedShield, setSelectedShield] = useState<string>(visitorShield || "");
  const [subtitle, setSubtitle] = useState("PRIMERA NACIONAL");
  const [week, setWeek] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const searchShieldAsset = (value: string) => shields.find((s) => s.url === value || s.sum === value);

  const handleImageCreation = (isDownload = false) => {
    let url = `/${nodecg.bundleName}/thumbnail/png${isDownload ? `/download` : ""}`;
    url += "?shield=" + selectedShield;
    if (week > 0 && !isNaN(week)) {
      url += "&week=" + week.toString();
    }

    if (subtitle.length > 0) {
      url += "&subtitle=" + subtitle;
    }

    window.open(url);

    setTimeout(() => setIsDisabled(false), 5000);
  };

  useEffect(() => {
    setTimeout(() => setIsDisabled(false), 5000);
  }, [subtitle, selectedShield, week]);

  return (
    <>
      <fieldset>
        <legend>Opciones para hacer la miniatura de Youtube</legend>
        <div>
          <select
            name={`${id}-shield`}
            id={`${id}-shield`}
            onChange={(event) => {
              event.preventDefault();
              const newShield = shields.find((s) => s.sum === event.target.value);
              setSelectedShield(newShield?.sum || "");
            }}
            value={searchShieldAsset(selectedShield)?.sum ?? "0"}
          >
            <option value={0} aria-readonly disabled>
              Choose from the list
            </option>
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
        </div>

        <div>
          <label htmlFor="week">Jornada (opcional, si es 0 es como no poner nada)</label>
          <input
            type="number"
            name="week"
            id="week"
            step={1}
            min={0}
            max={50}
            onChange={(event) => setWeek(+event.target.value)}
            value={week}
          />
        </div>

        <div>
          <label htmlFor="category">Categoria o subtitulo (opcional)</label>
          <input
            type="text"
            name="category"
            id="category"
            onChange={(event) => setSubtitle(event.target.value)}
            placeholder="Texto que va justo debajo de 'Partido'"
            value={subtitle}
          />
        </div>

        <div>
          <button
            onClick={() => {
              setIsDisabled(true);
              handleImageCreation(false);
            }}
            disabled={isDisabled}
          >
            Ver Miniatura
          </button>
          <button
            onClick={() => {
              setIsDisabled(true);
              handleImageCreation(true);
            }}
            disabled={isDisabled}
          >
            Descargar Miniatura
          </button>
        </div>
      </fieldset>
    </>
  );
}

export default App;
