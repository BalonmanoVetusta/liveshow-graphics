import { StopwatchTimePanel } from "components/stopwatch-time";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <StrictMode>
    <StopwatchTimePanel showTimeControls={false} />
  </StrictMode>
);
