import { useAutoGoalsReplicant } from "hooks/replicants/use-auto-goals-replicant";
import { ReactElement } from "react";

function App(): ReactElement {
  const { active, status, updateValue } = useAutoGoalsReplicant();
  return (
    <>
      <fieldset>
        <input
          type="checkbox"
          name="activate"
          id="activate"
          checked={active}
          onChange={() => {
            updateValue("active", !active);
          }}
        />

        <select name="federation" id="federation"></select>
      </fieldset>

      <div>
        <p>{`Currently is ${active ? "running" : "not running"}`}</p>
        <p>{`Status is: ${
          status === "error-not-start-values" ? "There are some missing params to use auto-start" : status
        }`}</p>
      </div>
    </>
  );
}

export default App;
