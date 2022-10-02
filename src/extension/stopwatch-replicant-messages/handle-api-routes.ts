import { NodeCG } from "nodecg/types/server";
import { handleStopwatchReplicant } from "./handle-stopwatch-replicant";
import { scoreboardActions } from "./scoreboard-actions";
import { StopwatchActions } from "./types";

export function handleApiRoutes(nodecg: NodeCG) {
  const router = nodecg.Router();

  const { removeLastGoal } = scoreboardActions(nodecg);

  router.get("/stopwatch/start", (req, res) => {
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
  router.get("/stopwatch/stop", (req, res) => {
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

  // router.get("/scoreboard/visitor/add", (req, res) => {
  //   try {
  //     // addGoal(Team.VISITOR);
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   return res.sendStatus(500);
  // });

  // router.get("/scoreboard/visitor/remove", (req, res) => {
  //   try {
  //     removeLastGoal(Team.VISITOR);
  //     return res.sendStatus(200);
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   return res.sendStatus(500);
  // });

  nodecg.mount(`/${nodecg.bundleName}`, router);
}
