import { useMatchActions } from "hooks/use-match-actions";

export function App() {
  const { goals } = useMatchActions();

  return <>{goals.local.length.toString().padStart(2, "0")}</>;
}
