import { useCSSVariables } from "hooks/use-css-variables";
import { Team } from "hooks/use-match-actions/types";
import { useId } from "react";

export function ShieldBgColor({
  team,
  datalist = [
    "#f2de4c",
    "#fede58",
    "#fbc137",
    "#151111",
    "#000000",
    "#ffffff",
    "#00ff00",
    "#ff0000",
    "#ff00ff",
    "#0000ff",
  ],
}: {
  team: Team;
  datalist?: Array<string>;
}) {
  const id = useId();
  const { setCssVar, cssVariables } = useCSSVariables();
  const teamLabel = team === Team.LOCAL ? "Local" : "Visitor";
  const localShieldBgColorCssVar = "--local-shield-background-color";
  const visitorShieldBgColorCssVar = "--visitor-shield-background-color";
  const variable = team === Team.LOCAL ? localShieldBgColorCssVar : visitorShieldBgColorCssVar;

  return (
    <>
      <div>
        <label htmlFor="local-shield-bgcolor-input">Local Team Background Shield Color</label>
        <input
          type="color"
          name={`${teamLabel.toLowerCase()}-shield-bgcolor`}
          id={`${teamLabel.toLowerCase()}-shield-bgcolor-input${id}`}
          placeholder="Local Team Background Shield Color"
          list={`${teamLabel.toLowerCase()}-shield-bgcolors${id}`}
          onChange={(event) => {
            const color = event.target.value;
            setCssVar(variable, color);
          }}
          value={cssVariables[variable]?.toString() || ""}
        />
      </div>
      <datalist id={`${teamLabel.toLowerCase()}-shield-bgcolors${id}`}>
        {datalist.map((color) => (
          <option key={color} value={color} />
        ))}
      </datalist>
    </>
  );
}
