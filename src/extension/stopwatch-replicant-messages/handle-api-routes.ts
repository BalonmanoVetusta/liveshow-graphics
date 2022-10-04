import { NodeCG } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import { handleStopwatchReplicant } from "./handle-stopwatch-replicant";
import { StopwatchActions } from "./types";

const STOPWATCH_REPLICANT_NAME = "stopwatch";

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();

  router.get("/start", (req, res) => {
    try {
      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.START,
        payload: undefined,
      });
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
    }
    return res.sendStatus(500);
  });

  router.get("/stop", (req, res) => {
    try {
      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.STOP,
        payload: undefined,
      });
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
    }
    return res.sendStatus(500);
  });

  router.get("/reset", (req, res) => {
    try {
      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.RESET,
        payload: undefined,
      });
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
    }
    return res.sendStatus(500);
  });

  router.get("/toggle", (req, res) => {
    try {
      const stopwwatchCurrentValue = nodecg.readReplicant<Stopwatch>(
        STOPWATCH_REPLICANT_NAME,
        nodecg.bundleName
      );

      let type = StopwatchActions.STOP;

      if (stopwwatchCurrentValue.startTime === 0) {
        type = StopwatchActions.START;
      }

      handleStopwatchReplicant(nodecg, {
        type,
        payload: undefined,
      });
      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
    }

    return res.sendStatus(500);
  });

  nodecg.mount(`/${nodecg.bundleName}/stopwatch`, router);
}
