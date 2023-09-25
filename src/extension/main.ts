import type NodeCG from "@nodecg/types";
import handleGraphicsRoutes from "./graphics";
import { handleScenes } from "./scenes";
import { scoreboardApiRoutes } from "./scoreboard-api-routes";
import shutdownApi from "./shutdown";
import { stopwatchReplicantMessages } from "./stopwatch-replicant-messages";
import { convertAssetsToWebp } from "./thumbnail/convert-assets-to-webp";
import { createThumnail } from "./thumbnail/create-thumbnail";

export type ExtensionFunction = (nodecg: NodeCG.ServerAPI) => Promise<void>;

function main(...calls: Array<ExtensionFunction>) {
  return (nodecg: NodeCG.ServerAPI) => {
    calls.forEach(async (fn: ExtensionFunction) => {
      nodecg.log.info(`Calling ${fn.name}`);
      try {
        await fn(nodecg);
        nodecg.log.info(`Successfully initialized ${fn.name}`);
      } catch (error) {
        nodecg.log.error(`Call to ${fn} failed.`, { error });
      }
    });
  };
}

export default main(
  stopwatchReplicantMessages,
  scoreboardApiRoutes,
  handleGraphicsRoutes,
  shutdownApi,
  handleScenes,
  convertAssetsToWebp,
  createThumnail,
);
