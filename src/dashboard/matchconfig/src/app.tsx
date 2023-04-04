import { StopwatchDashboard } from "components/stopwatch";
import { ReactElement } from "react";

function App(): ReactElement {
  return (
    <>
      <StopwatchDashboard showTime={false} showAddOffset={false} />
    </>
  );
}

export default App;
