import { Graphics } from "types/schemas/graphics";
import { NodeCG, Replicant } from "/.nodecg/types/server";

const GRAPHICS_REPLICANT_NAME = "graphics";

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
      graphics.value.advertisingTime = Number(req.query?.advertisingTime);
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

    res.json({
      ok: true,
      advertising: graphics.value.advertising,
      advertisingTime: graphics.value.advertisingTime,
    });
  });

  nodecg.mount(`/${nodecg.bundleName}/graphics`, router);
}
