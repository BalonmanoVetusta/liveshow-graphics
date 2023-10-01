import type NodeCG from "@nodecg/types";
import { Stopwatch } from "types/schemas/stopwatch";
import { handleStopwatchReplicant } from "./handle-stopwatch-replicant";
import { StopwatchActions } from "./types";

const STOPWATCH_REPLICANT_NAME = "stopwatch";

function getCurrentTimeResponse(stopwatchCurrentValue: Stopwatch): string {
  const { offset = 0, startTime = 0, limit = 0, backwards = false } = stopwatchCurrentValue || {};

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

export function handleStopwatcApiRoutes(nodecg: NodeCG.ServerAPI) {
  nodecg.log.info("Initializing stopwatch-api-routes");
  const router = nodecg.Router();

  function handleGetTime() {
    const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(STOPWATCH_REPLICANT_NAME, nodecg.bundleName);
    try {
      if (!stopwatchCurrentValue) throw new Error("stopwatchCurrentValue is undefined");

      return getCurrentTimeResponse(stopwatchCurrentValue);
    } catch (error) {
      // console.error(error);
    }

    return "00:00";
  }

  router.get("/", (req, res) => {
    return res.json(handleGetTime());
  });

  router.post("/add-offset", (req, res) => {
    try {
      const { offset = "0" } = req.body || {};
      nodecg.log.info(`Adding offset: ${offset}`);
      const offsetFormattedValue = parseInt(offset as string, 10) || 0;
      nodecg.log.info(`Formatted offset value: ${offsetFormattedValue}`);

      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.ADD_OFFSET,
        payload: offsetFormattedValue,
      });
    } catch (error) {
      console.error(error);
    }

    return res.json(handleGetTime());
  });

  router.put("/set-time", (req, res) => {
    try {
      const timeString = req.body?.timeString?.toString() || "";
      const { time = "0" } = req.body || {};
      let { minutes = "0", seconds = "0" } = req.body || {};

      if (timeString.length > 0 && timeString.includes(":")) {
        [minutes, seconds] = timeString.split(":");
      }

      if (timeString.length > 0 && !timeString.includes(":")) {
        if (timeString.length === 4) {
          minutes = timeString.slice(0, 2);
          seconds = timeString.slice(2);
        } else if (timeString.length === 3) {
          minutes = timeString.slice(0, 1);
          seconds = timeString.slice(1);
        } else {
          // I know this is weird, but to set seconds simply use addOffset and you will set 0 to 59 seconds fast
          // But to set minutes can be difficult with the streamdeck =)
          minutes = timeString;
        }
      }

      let timeFormattedValue = parseInt(time as string, 10) || 0;

      if (minutes !== "0" || seconds !== "0") {
        const minutesFormattedValue = parseInt(minutes as string, 10) || 0;
        const secondsFormattedValue = parseInt(seconds as string, 10) || 0;

        timeFormattedValue = (minutesFormattedValue * 60 + secondsFormattedValue) * 1000;
      }

      if (timeFormattedValue < 0) throw new Error("Time must be positive");

      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.SET_OFFSET,
        payload: timeFormattedValue,
      });
    } catch (error) {
      console.error(error);
    }

    return res.json(handleGetTime());
  });

  router.post("/start", (req, res) => {
    try {
      const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(STOPWATCH_REPLICANT_NAME, nodecg.bundleName);

      if (!stopwatchCurrentValue) return res.status(204).send();

      if (stopwatchCurrentValue.startTime === 0) {
        handleStopwatchReplicant(nodecg, {
          type: StopwatchActions.START,
          payload: undefined,
        });
      }
    } catch (error) {
      // console.error(error);
    }

    return res.json(handleGetTime());
  });

  router.post("/stop", (req, res) => {
    try {
      const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(STOPWATCH_REPLICANT_NAME, nodecg.bundleName);

      if (!stopwatchCurrentValue) return res.status(204).send();

      if (stopwatchCurrentValue.startTime > 0) {
        handleStopwatchReplicant(nodecg, {
          type: StopwatchActions.STOP,
          payload: undefined,
        });
      }
    } catch (error) {
      // console.error(error);
    }

    return res.json(handleGetTime());
  });

  router.delete("/reset", (req, res) => {
    try {
      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.RESET,
        payload: undefined,
      });
    } catch (error) {
      // console.error(error);
    }

    return res.json("00:00");
  });

  router.post("/toggle", (req, res) => {
    const stopwatchCurrentValue = nodecg.readReplicant<Stopwatch>(STOPWATCH_REPLICANT_NAME, nodecg.bundleName);
    try {
      if (!stopwatchCurrentValue) throw new Error("stopwatchCurrentValue is undefined");

      let type = StopwatchActions.STOP;

      if (stopwatchCurrentValue.startTime === 0) {
        type = StopwatchActions.START;
      }

      handleStopwatchReplicant(nodecg, {
        type,
        payload: undefined,
      });
    } catch (error) {
      // console.error(error);
    }

    return res.json(handleGetTime());
  });

  nodecg.mount(`/${nodecg.bundleName}/stopwatch`, router);
}
