import type NodeCG from "@nodecg/types";
import { Scenes } from "types/schemas/scenes";
import { scenesNames } from "./scenes-names";

export async function handleScenes(nodecg: NodeCG.ServerAPI): Promise<void> {
  // Registering scenes names
  const scenes = nodecg.Replicant<Scenes>("scenes", nodecg.bundleName, {
    persistent: true,
    defaultValue: {
      active: "default",
      scenes: scenesNames,
    },
  });

  nodecg.log.info("Registering scenes", scenesNames);
  scenes.value ??= {} as Scenes;
  scenes.value.scenes = scenesNames;
  scenes.value.active ??= scenesNames[0];
  if (!scenesNames.includes(scenes.value.active)) scenes.value.active = scenesNames[0];

  // Routes

  const router = nodecg.Router();

  router.get("/list", (req, res) => res.json(scenesNames));

  router.get("/set/:name", (req, res) => {
    const { name } = req.params;

    if (!scenesNames.includes(name)) {
      return res.status(422).json({
        error: "Must be a valid scene name",
        validNames: scenesNames,
      });
    }

    scenes.value.active = name;

    return res.json({
      active: name,
      list: scenesNames,
    });
  });

  nodecg.mount(`/${nodecg.bundleName}/scene`, router);
}
