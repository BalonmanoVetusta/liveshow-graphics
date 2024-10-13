import { spawn } from "node:child_process";
import type NodeCG from "@nodecg/types";

const SHUTDOWN_PASSWORD = process.env?.SHUTDOWN_PASSWORD; // Must be provided to perform shutdown

export function handleApiRoutes(nodecg: NodeCG.ServerAPI) {
  nodecg.log.info("Setting up shutdown API routes...");
  if (!process.env.SHUTDOWN_AUTH_KEY) {
    nodecg.log.warn("No shutdown auth key provided, shutdown API will be open to anyone");
  }

  if (!process.env.SHUTDOWN_PASSWORD) {
    nodecg.log.warn("No shutdown password provided, shutdown API will not work");
  }

  const router = nodecg.Router();
  router.post("/", (req, res) => {
    // const { password } = req.body;
    // if (password !== SHUTDOWN_PASSWORD) {
    //   return res.status(403).send("Invalid password");
    // }

    if (process.env.SHUTDOWN_AUTH_KEY && !req.headers.authorization?.includes(process.env.SHUTDOWN_AUTH_KEY)) {
      return res.status(403).send("Invalid password");
    }

    if (typeof SHUTDOWN_PASSWORD === typeof undefined)
      return res.status(500).json({
        payload: "No shutdown password provided",
        ok: false,
      });

    // Shutdown the computer
    const proc = spawn("sh", [
      "-c",
      `echo ${SHUTDOWN_PASSWORD} | sudo -S bash -c "shutdown -h now"`, // This should not be done this way, but it works for now
    ]);

    proc.stderr.on("data", (data) => {
      nodecg.log.error(`Error from shutdown process: ${data}`);
    });

    proc.stdout.on("data", (data) => {
      nodecg.log.info(`Shutdown process: ${data}`);
    });

    return res.status(200).json({
      ok: true,
      payload: "Shutting down message sent...",
    });
  });

  nodecg.mount(`/${nodecg.bundleName}/shutdown`, router);
}
