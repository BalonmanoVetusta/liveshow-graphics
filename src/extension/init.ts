import { NodeCG } from "nodecg/types/server";

export const init = async (nodecg: NodeCG) => {
  nodecg.log.info("Initializing backend...");
  nodecg.log.info("Hello, from your bundle's extension!");
  nodecg.log.info("I'm where you put all your server-side code.");

  nodecg.listenFor("close", () => {
    nodecg.log.info("Closing backend...");
    process.exit(0);
  });
};
