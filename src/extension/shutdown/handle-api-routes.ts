import { spawn } from "node:child_process";
import { NodeCG } from "/.nodecg/types/server";

const SHUTDOWN_PASSWORD = process.env?.SHUTDOWN_PASSWORD; // Must be provided to perform shutdown

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();
  router.get("/", (req, res) => {
    // const { password } = req.body;
    // if (password !== SHUTDOWN_PASSWORD) {
    //   return res.status(403).send("Invalid password");
    // }

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
