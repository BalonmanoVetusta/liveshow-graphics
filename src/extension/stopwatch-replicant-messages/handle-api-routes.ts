import { NodeCG } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import { handleStopwatchReplicant } from "./handle-stopwatch-replicant";
import { StopwatchActions } from "./types";

const STOPWATCH_REPLICANT_NAME = "stopwatch";

function getCurrentTimeResponse(stopwatchCurrentValue: Stopwatch): string {
  const {
    offset = 0,
    startTime = 0,
    limit = 0,
    total = 0,
    backwards = false,
  } = stopwatchCurrentValue;

  let totalTime = offset;
  if (startTime > 0) {
    totalTime = Date.now() - startTime;
    totalTime += offset;
  }

  if (backwards && totalTime < limit) {
    totalTime = limit - totalTime;
  } else if (backwards) {
    totalTime = 0;
  }

  const minutes = Math.floor(totalTime / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((totalTime % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();

  router.get("/get", (req, res) => {
    try {
      const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(
        STOPWATCH_REPLICANT_NAME,
        nodecg.bundleName
      );

      return res
        .status(200)
        .json(getCurrentTimeResponse(stopwatchCurrentValue));
    } catch (error) {
      console.error(error);
      return res.status(500).json("00:00");
    }
  });

  router.get("/addOffset", (req, res) => {
    try {
      const { offset = 0 } = req.query;
      const offsetFormattedValue = parseInt(offset, 10) || 0;

      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.ADD_OFFSET,
        payload: offsetFormattedValue,
      });

      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
    }
    return res.sendStatus(500);
  });

  router.get("/start", (req, res) => {
    try {
      const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(
        STOPWATCH_REPLICANT_NAME,
        nodecg.bundleName
      );

      if (stopwatchCurrentValue.startTime === 0) {
        handleStopwatchReplicant(nodecg, {
          type: StopwatchActions.START,
          payload: undefined,
        });
      }

      return res.sendStatus(200);
    } catch (error) {
      console.error(error);
    }
    return res.sendStatus(500);
  });

  router.get("/stop", (req, res) => {
    try {
      const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(
        STOPWATCH_REPLICANT_NAME,
        nodecg.bundleName
      );

      if (stopwatchCurrentValue.startTime > 0) {
        handleStopwatchReplicant(nodecg, {
          type: StopwatchActions.STOP,
          payload: undefined,
        });
      }

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
      const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(
        STOPWATCH_REPLICANT_NAME,
        nodecg.bundleName
      );

      let type = StopwatchActions.STOP;

      if (stopwatchCurrentValue.startTime === 0) {
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
