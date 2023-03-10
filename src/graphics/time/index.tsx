import {
  MaxTimeUnit,
  useStopwatchReplicantReader,
} from "hooks/use-stopwatch-replicant";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const { minutes = 0, seconds = 0 } = useStopwatchReplicantReader({
    maxTimeUnit: MaxTimeUnit.MINUTES,
  });

  return (
    <>
      <div className="time">
        <p>
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
      </div>
    </>
  );
}

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
