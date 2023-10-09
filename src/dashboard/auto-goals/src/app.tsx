import { useAutoGoalsReplicant } from "hooks/replicants/use-auto-goals-replicant";
import { ReactElement } from "react";

function App(): ReactElement {
  const { active, updateValue } = useAutoGoalsReplicant();
  return (
    <>
      <input
        type="checkbox"
        name="activate"
        id="activate"
        checked={active}
        onChange={() => {
          updateValue("active", !active);
        }}
      />
    </>
  );
}

export default App;
