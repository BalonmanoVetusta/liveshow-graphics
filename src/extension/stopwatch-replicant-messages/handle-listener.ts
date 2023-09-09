import type NodeCG from "@nodecg/types";
import { Stopwatch } from "types/schemas/stopwatch";
import { handleStopwatchReplicant } from "./handle-stopwatch-replicant";
import { StopwatchAction, StopwatchActionPayloadType } from "./types";

export function handleListener(nodecg: NodeCG.ServerAPI) {
  return (
    {
      type,
      payload = undefined,
    }: StopwatchAction & {
      payload: StopwatchActionPayloadType;
    },
    ack: NodeCG.Acknowledgement,
  ) => {
    let sw: Stopwatch;

    try {
      sw = handleStopwatchReplicant(nodecg, { type, payload });
    } catch (error) {
      console.error(error);
      if (!ack?.handled) {
        return ack(error);
      }
      throw error;
    }

    if (!ack?.handled) {
      return ack(null, sw);
    }
  };
}
