import { Graphics } from "types/schemas/graphics";
import { NodeCG, Replicant } from "/.nodecg/types/server";

const GRAPHICS_REPLICANT_NAME = "graphics";
const DEFAULT_ROTATION_TIME = 15;

let graphics: Replicant<Graphics> | undefined = undefined;

function graphicsReplicant(nodecg: NodeCG) {
  if (graphics) {
    return graphics;
  }

  graphics = nodecg.Replicant<Graphics>(GRAPHICS_REPLICANT_NAME, {});

  return graphics;
}

export default async function handleGraphicsRoutes(
  nodecg: NodeCG
): Promise<void> {
  const router = nodecg.Router();

  router.get("/advertising/:action?", (req, res) => {
    const { action = "toggle" } = req.params;
    const formatedAction = action.toLowerCase();

    const graphics = graphicsReplicant(nodecg);

    if (req.query?.advertisingTime) {
      const advertisingTime =
        Number(req.query.advertisingTime) || DEFAULT_ROTATION_TIME;
      const advertisingTimeInSeconds = advertisingTime * 1000;
      console.log({ advertisingTimeInSeconds });
      graphics.value.advertisingTime = advertisingTimeInSeconds;
    }

    if (formatedAction === "toggle") {
      graphics.value.advertising = !graphics.value.advertising;
    }

    if (formatedAction === "show") {
      graphics.value.advertising = true;
    }

    if (formatedAction === "hide") {
      graphics.value.advertising = false;
    }

    return res.json({
      ok: true,
      advertising: graphics.value.advertising,
      advertisingTime: graphics.value.advertisingTime,
    });
  });

  nodecg.mount(`/${nodecg.bundleName}/graphics`, router);
}
