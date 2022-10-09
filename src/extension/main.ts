import { NodeCG } from "nodecg/types/server";
import { init } from "./init";
import { scoreboardApiRoutes } from "./scoreboard-api-routes";
import { stopwatchReplicantMessages } from "./stopwatch-replicant-messages";

export type ExtensionFunction = (nodecg: NodeCG) => Promise<void>;

function main(...calls: Array<ExtensionFunction>) {
  return (nodecg: NodeCG) => {
    calls.forEach(async (fn: ExtensionFunction) => {
      try {
        await fn(nodecg);
        nodecg.log.info(`Successfully initialized ${fn?.name ?? fn.toString}`);
      } catch (error) {
        nodecg.log.error(`Call to ${fn.toString} failed.`, { error });
      }
    });
  };
}

export default main(init, stopwatchReplicantMessages, scoreboardApiRoutes);