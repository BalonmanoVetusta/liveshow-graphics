/* eslint-disable compat/compat */
import { ListenForCb } from "nodecg/types/lib/nodecg-instance";
import { NodeCG } from "nodecg/types/server";
import { STOPWATCH_MESSAGES_NAME } from "services/stopwatch-messages-name";
import { STOPWATCH_REPLICANT_NAME } from "services/stopwatch-replicant-name";
import { Stopwatch, StopwatchLap } from "types/schemas/stopwatch";
import {
  StopwatchAction,
  StopwatchActionPayloadType,
  StopwatchActions,
  StopwatchSetTypeByCallback,
  StopwatchStartActionTypePayloadObject,
} from "./types";

const defaultStopwatchLapValues: StopwatchLap = {
  startTime: 0,
  offset: 0,
  backwards: false,
  limit: 0,
} as StopwatchLap;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertPayload(ack: ListenForCb, payload: any = undefined) {
  if (typeof payload === typeof undefined || !payload) {
    throw new Error("Payload is required");
  }
}

export async function stopwatchReplicantMessages(
  nodecg: NodeCG
): Promise<void | StopwatchLap> {
  return nodecg.listenFor(
    STOPWATCH_MESSAGES_NAME,
    nodecg.bundleName,
    (
      {
        type,
        context,
        payload = undefined,
      }: StopwatchAction & {
        payload: StopwatchActionPayloadType;
      },
      ack: ListenForCb
    ) => {
      const stopwatch = nodecg.Replicant<Stopwatch>(STOPWATCH_REPLICANT_NAME, {
        [context]: defaultStopwatchLapValues,
      } as Stopwatch);

      const { startTime, offset, backwards, limit } = stopwatch[context];
      let newValue: number | boolean;

      try {
        switch (type) {
          case StopwatchActions.START:
            const {
              offset: newOffset = offset ?? 0,
              backwards: newBackwards = backwards ?? false,
              limit: newLimit = limit ?? 0,
            } = payload as StopwatchStartActionTypePayloadObject;
            stopwatch[context].startTime = Date.now();
            stopwatch[context].offset = newOffset;
            stopwatch[context].backwards = newBackwards;
            stopwatch[context].limit = newLimit;

            break;
          case StopwatchActions.STOP:
            stopwatch[context].start = 0;
            break;
          case StopwatchActions.RESET:
            if (stopwatch[context].startTime) {
              stopwatch[context].startTime = Date.now();
            }
            stopwatch[context] = {
              start: 0,
              limit: 0,
              offset: 0,
              backwards: false,
            };
            break;

          // update, timeLimit, offset, backwards
          case StopwatchActions.SET_BACKWARDS:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<boolean>;
              newValue = callback(backwards, startTime);
            } else {
              newValue = payload as boolean;
            }

            stopwatch[context].backwards = newValue;
            break;
          case StopwatchActions.SET_OFFSET:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<number>;
              newValue = callback(offset, startTime);
            } else {
              newValue = payload as number;
            }

            stopwatch[context].offset = newValue;
            break;
          case StopwatchActions.SET_TIME_LIMIT:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<number>;
              newValue = callback(limit, startTime);
            } else {
              newValue = payload as number;
            }

            stopwatch[context].limit = newValue;
            break;
          case StopwatchActions.ADD_OFFSET:
            stopwatch[context].offset += (payload as number) ?? 0;
            break;
          default:
            throw new Error(`Unknown action type: ${type}`);
        }
      } catch (error) {
        if (!ack?.handled) {
          return ack(error);
        }
        throw error;
      }

      if (!ack?.handled) {
        return ack(null, stopwatch[context]);
      }
    }
  );
}
