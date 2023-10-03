import type NodeCG from "@nodecg/types";
import { Advertising } from "types/schemas/advertising";
import { Graphics } from "types/schemas/graphics";

const GRAPHICS_REPLICANT_NAME = "graphics";
const ADVERTISING_REPLICANT_NAME = "advertising";
const DEFAULT_ROTATION_TIME = 15;

let graphics: NodeCG.ServerReplicant<Graphics> | undefined = undefined;
let advertising: NodeCG.ServerReplicant<Advertising> | undefined = undefined;

function graphicsReplicant(nodecg: NodeCG.ServerAPI) {
  if (graphics) {
    return graphics;
  }

  graphics = nodecg.Replicant<Graphics>(GRAPHICS_REPLICANT_NAME, {});

  return graphics;
}

function advertisingReplicant(nodecg: NodeCG.ServerAPI) {
  if (advertising) {
    return advertising;
  }

  advertising = nodecg.Replicant<Advertising>(ADVERTISING_REPLICANT_NAME, {});

  return advertising;
}

export default async function handleGraphicsRoutes(nodecg: NodeCG.ServerAPI): Promise<void> {
  const router = nodecg.Router();
  graphicsReplicant(nodecg);
  advertisingReplicant(nodecg);

  router.post("/advertising/:action", (req, res) => {
    const { action } = req.params;
    const formatedAction = action.toLowerCase();

    const advRpc = advertisingReplicant(nodecg);
    advRpc.value ??= {};

    if (req.query?.advertisingTime) {
      const advertisingTime = Number(req.query.advertisingTime) || DEFAULT_ROTATION_TIME;
      const advertisingTimeInSeconds = advertisingTime * 1000;
      advRpc.value.sleep = advertisingTimeInSeconds;
    }

    if (formatedAction === "toggle") {
      advRpc.value.show = !advRpc.value?.show;
    }

    if (formatedAction === "show") {
      advRpc.value.show = true;
    }

    if (formatedAction === "hide") {
      advRpc.value.show = false;
    }

    return res.json({
      ok: true,
      show: advRpc.value.show,
      advertisingTime: advRpc.value.sleep,
    });
  });

  router.get("/match-filename", (_, res) => {
    const { value } = graphicsReplicant(nodecg);

    const date = new Date(); // Will be used as fallback
    const week = value?.week
      ? `J${value.week.toString().padStart(2, "0")}`
      : `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    const local = value?.localTeamName ?? "Local";
    const visitor = value?.visitorTeamName ?? "Visitante";
    const payload = `${week} - ${local} - ${visitor}`;

    return res.json(payload);
  });

  nodecg.mount(`/${nodecg.bundleName}/graphics`, router);
}
