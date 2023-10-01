/* eslint-disable compat/compat */ import type NodeCG from "@nodecg/types";
import { handleStopwatcApiRoutes } from "./handle-stopwatch-api-routes";
import { handleListener } from "./handle-listener";

// FIXME: Should use services
const STOPWATCH_MESSAGES_NAME = "stopwatchMessages";

export async function stopwatchReplicantMessages(nodecg: NodeCG.ServerAPI): Promise<void> {
  handleStopwatcApiRoutes(nodecg);

  nodecg.listenFor(STOPWATCH_MESSAGES_NAME, nodecg.bundleName, handleListener(nodecg));
}
