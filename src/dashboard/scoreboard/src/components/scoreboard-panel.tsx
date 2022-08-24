import { ReactElement } from "react";

export function ScoreboardPanel(): ReactElement {
  return (
    <div>
      <fieldset>
        <h3>Local Team Score</h3>
        <button>+1</button>
        <button>-1</button>
      </fieldset>
      <fieldset>
        <h3>Visitor Team Score</h3>
        <button>+1</button>
        <button>-1</button>
      </fieldset>
    </div>
  );
}
