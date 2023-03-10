import { StopwatchTimePanel } from "components/stopwatch-time";
import { useTeamSide } from "hooks/use-team-side";
import { ReactElement } from "react";

function App(): ReactElement {
  const { toggleSide } = useTeamSide();
  return (
    <>
      <StopwatchTimePanel showTime={false} showAddOffset={false} />
      <fieldset>
        <button
          id="changeSide"
          onClick={(event) => {
            event.preventDefault();
            toggleSide();
          }}
        >
          Toggle Sides
        </button>
      </fieldset>
    </>
  );
}

export default App;
