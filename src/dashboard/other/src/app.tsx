import { CategoryNameInput } from "components/scoreboard/dashboard/inputs/category-name-input";
import { WeekNumberInput } from "components/scoreboard/dashboard/inputs/week-number-input";
import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useReplicant } from "hooks/use-replicant";
import { ReactElement, useEffect, useId, useState } from "react";
import { Asset, AssetsReplicant } from "types/Asset";

function App(): ReactElement {
  const id = useId();
  const [shields] = useReplicant<AssetsReplicant>("assets:shields", [], {
    persistent: false,
  });
  const [selectedShield, setSelectedShield] = useState<string>("");
  const { week, category } = useGraphicsReplicant();
  const [isDisabled, setIsDisabled] = useState(false);

  const searchShieldAsset = (value: string) => shields.find((s) => s.url === value || s.sum === value);

  const handleImageCreation = (isDownload = false) => {
    let url = `/${nodecg.bundleName}/thumbnail/png${isDownload ? `/download` : ""}`;
    url += "?shield=" + selectedShield;
    if (week && week > 0 && !isNaN(week)) {
      url += "&week=" + week.toString();
    }

    if (category && category.length > 0) {
      url += "&subtitle=" + category;
    }

    window.open(url);

    setTimeout(() => setIsDisabled(false), 5000);
  };

  useEffect(() => {
    setTimeout(() => setIsDisabled(false), 5000);
  }, [category, selectedShield, week]);

  return (
    <>
      <fieldset>
        <legend>Opciones para hacer la miniatura de Youtube</legend>
        <div>
          <select
            name={`shield-${id}`}
            id={`shield-${id}`}
            onChange={(event) => {
              event.preventDefault();
              const newShield = shields.find((s) => s.sum === event.target.value);
              setSelectedShield(newShield?.sum || "");
            }}
            value={searchShieldAsset(selectedShield)?.sum ?? "0"}
          >
            <option value={0} aria-readonly disabled>
              Escoge de la lista
            </option>
            {/* <option value="https://www.rfebm.com/competiciones/images/escudos/sinescudo.jpg">No shield</option> */}
            {shields.length > 0 ? (
              shields.map((shield: Asset) => (
                <option key={shield.sum} value={shield.sum}>
                  {shield.name}
                </option>
              ))
            ) : (
              <option aria-readonly disabled>
                -- No hay escudos --
              </option>
            )}
          </select>
        </div>

        <div>
          <WeekNumberInput label="Jornada (opcional, si es 0 es como no poner nada)" numberOfWeeks={50} />
        </div>

        <div>
          <label htmlFor="category">Categoria o subtitulo (opcional)</label>
          <CategoryNameInput />
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
