/* eslint-disable compat/compat */
import { ListenForCb } from "nodecg/types/lib/nodecg-instance";
import { NodeCG } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import {
  StopwatchAction,
  StopwatchActionPayloadType,
  StopwatchActions,
  StopwatchSetTypeByCallback,
  StopwatchStartActionTypePayloadObject,
} from "./types";

// FIXME: Should use services
const STOPWATCH_MESSAGES_NAME = "stopwatchMessages";
const STOPWATCH_REPLICANT_NAME = "stopwatch";

const defaultStopwatchValues: Stopwatch = {
  startTime: 0,
  offset: 0,
  backwards: false,
  limit: 0,
} as Stopwatch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertPayload(ack: ListenForCb, payload: any = undefined) {
  if (typeof payload === typeof undefined || !payload) {
    throw new Error("Payload is required");
  }
}

export async function stopwatchReplicantMessages(
  nodecg: NodeCG
): Promise<void> {
  return nodecg.listenFor(
    STOPWATCH_MESSAGES_NAME,
    nodecg.bundleName,
    (
      {
        type,
        payload = undefined,
      }: StopwatchAction & {
        payload: StopwatchActionPayloadType;
      },
      ack: ListenForCb
    ) => {
      // TODO: Good idea is to define in message if the replicant must be persistent or not
      const stopwatch = nodecg.Replicant<Stopwatch>(
        STOPWATCH_REPLICANT_NAME,
        nodecg.bundleName,
        {
          defaultValue: defaultStopwatchValues,
          persistent: true,
        }
      );

      let currentValue: Stopwatch = { ...stopwatch.value } || {
        ...defaultStopwatchValues,
      };
      let tmpValue: number | boolean;

      try {
        switch (type) {
          case StopwatchActions.START:
            const {
              offset: newOffset = 0,
              backwards: newBackwards = false,
              limit: newLimit = 0,
            } = (payload as StopwatchStartActionTypePayloadObject) || {};
            currentValue = {
              startTime: Date.now(),
              offset: newOffset || currentValue.offset,
              backwards: newBackwards || currentValue.backwards,
              limit: newLimit || currentValue.limit,
            } as Stopwatch;
            break;

          case StopwatchActions.STOP:
            const total =
              currentValue.startTime > 0
                ? Date.now() - currentValue.startTime + currentValue.offset
                : 0;
            currentValue.startTime = 0;
            currentValue.offset = total;
            break;

          case StopwatchActions.RESET:
            const {
              limit = currentValue.limit,
              offset = 0,
              backwards = currentValue.backwards,
            } = (payload as StopwatchStartActionTypePayloadObject) || {};
            currentValue = {
              startTime: currentValue.startTime > 0 ? Date.now() : 0,
              limit,
              offset,
              backwards,
            };
            break;

          // update, timeLimit, offset, backwards
          case StopwatchActions.SET_BACKWARDS:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<boolean>;
              tmpValue = callback(
                currentValue.backwards,
                currentValue.startTime,
                currentValue.limit,
                currentValue.offset
              );
            } else {
              tmpValue = payload as boolean;
            }

            if (currentValue.limit === 0 && tmpValue === true) {
              throw new Error("Cannot set backwards when limit is 0");
            }

            currentValue.backwards = tmpValue;
            break;

          case StopwatchActions.SET_OFFSET:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<number>;
              tmpValue = callback(
                currentValue.offset,
                currentValue.startTime,
                currentValue.limit,
                currentValue.offset
              );
            } else {
              tmpValue = payload as number;
            }

            currentValue.offset = tmpValue;
            break;

          case StopwatchActions.SET_TIME_LIMIT:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<number>;
              tmpValue = callback(
                currentValue.limit,
                currentValue.startTime,
                currentValue.limit,
                currentValue.offset
              );
            } else {
              tmpValue = payload as number;
            }

            currentValue.limit = tmpValue;
            break;

          case StopwatchActions.ADD_OFFSET:
            currentValue.offset += (payload as number) ?? 0;
            break;

          default:
            throw new Error(`Unknown action type: ${type}`);
        }

        stopwatch.value = { ...currentValue };
      } catch (error) {
        console.error(error);
        if (!ack?.handled) {
          return ack(error);
        }
        throw error;
      }

      if (!ack?.handled) {
        return ack(null, stopwatch.value);
      }
    }
  );
}
