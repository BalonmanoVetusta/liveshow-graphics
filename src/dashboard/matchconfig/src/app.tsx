import { StopwatchTimePanel } from "components/stopwatch-time";
import { ReactElement } from "react";

function App(): ReactElement {
  return (
    <>
      <StopwatchTimePanel showTime={false} showAddOffset={false} />
    </>
  );
}

export default App;
