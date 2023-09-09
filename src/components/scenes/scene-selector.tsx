import { useSceneReplicant } from "hooks/replicants/use-scene-replicant";

export function SceneSelector() {
  const { active, setActiveScene, scenes } = useSceneReplicant();

  return (
    <fieldset>
      <legend>Select current scene to view</legend>
      <select
        onChange={(e) => {
          setActiveScene(e.target.value);
        }}
        value={active}
      >
        <optgroup label="Scenes">
          {scenes?.map((scene) => (
            <option key={scene} value={scene}>
              {scene}
            </option>
          ))}
        </optgroup>
      </select>
    </fieldset>
  );
}
