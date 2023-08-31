import { StopwatchDashboard } from "components/stopwatch";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <StrictMode>
    <StopwatchDashboard />
  </StrictMode>,
);
