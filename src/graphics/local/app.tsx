import { useMatchActions } from "hooks/use-match-actions";

export function App() {
  const { goals } = useMatchActions();

  return <h1>{goals.local.length}</h1>;
}
