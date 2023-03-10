import { useMatchActions } from "hooks/use-match-actions";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const { goals } = useMatchActions();

  return <>{goals.visitor.length.toString().padStart(2, "0")}</>;
}

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
