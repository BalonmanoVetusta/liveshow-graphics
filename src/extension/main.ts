import { NodeCG } from "nodecg/types/server";
import handleGraphicsRoutes from "./graphics";
import { scoreboardApiRoutes } from "./scoreboard-api-routes";
import { stopwatchReplicantMessages } from "./stopwatch-replicant-messages";

export type ExtensionFunction = (nodecg: NodeCG) => Promise<void>;

function main(...calls: Array<ExtensionFunction>) {
  return (nodecg: NodeCG) => {
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
  handleGraphicsRoutes
);
