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
const STOPWATCH_TICK_TIME = 10;

const defaultStopwatchValues: Stopwatch = {
  startTime: 0,
  offset: 0,
  backwards: false,
  limit: 0,
  periodTime: 0,
} as Stopwatch;

function assertPayload(
  ack: ListenForCb,
  payload: StopwatchActionPayloadType | undefined = undefined
) {
  if (typeof payload === typeof undefined || payload === null) {
    throw new Error("Payload is required");
  }
}

// Timer
let timer: NodeJS.Timeout | null = null;

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

      let currentValue: Stopwatch = {
        ...defaultStopwatchValues,
        ...stopwatch.value,
      };

      try {
        const currentTotalTime =
          Date.now() - currentValue.startTime + currentValue.offset;
        let tmpValue: number | boolean;

        if (currentTotalTime < 0) {
          throw new Error("Time is negative, reset the stopwatch");
        }

        switch (type) {
          case StopwatchActions.START:
          case StopwatchActions.RESET:
            // New possible values
            const {
              offset: newOffset = null,
              backwards: newBackwards = null,
              limit: newLimit = null,
              periodTime: newPeriodTime = null,
            } = (payload as StopwatchStartActionTypePayloadObject) || {};

            // Set common values between start and reset
            currentValue = {
              offset: newOffset ?? currentValue.offset ?? 0,
              backwards: newBackwards ?? currentValue.backwards ?? false,
              limit: newLimit ?? currentValue.limit ?? 0,
              periodTime: newPeriodTime ?? currentValue.periodTime ?? 0,
            } as Stopwatch;

            // Reset
            if (type === StopwatchActions.RESET) {
              currentValue.startTime =
                currentValue.startTime > 0 ? Date.now() : 0;
              currentValue.offset = 0;
            }

            // Start
            if (type === StopwatchActions.START) {
              currentValue.startTime = Date.now();
              currentValue.offset ??= 0;

              // Set the interval if it was not started
              // This stops the stopwatch automatically
              // at the end of each period

              timer ??= setInterval(() => {
                const stopwatchInterval = nodecg.Replicant<Stopwatch>(
                  STOPWATCH_REPLICANT_NAME,
                  nodecg.bundleName,
                  {
                    defaultValue: defaultStopwatchValues,
                    persistent: true,
                  }
                );

                const total =
                  Date.now() +
                  stopwatchInterval.value.offset -
                  stopwatchInterval.value.startTime;

                const isEndOfLimit =
                  stopwatchInterval.value.limit > 0 &&
                  total >= stopwatchInterval.value.limit;

                // Because we are only saving the duration of each period we
                // need to know current relative time
                let isEndOfPeriod = false;
                if (
                  stopwatchInterval.value.startTime > 0 &&
                  stopwatchInterval.value.periodTime > 0
                ) {
                  const periodNumber = Math.ceil(
                    total / stopwatchInterval.value.periodTime
                  );
                  const relativePeriodTime =
                    total % stopwatchInterval.value.periodTime;
                  isEndOfPeriod =
                    relativePeriodTime < STOPWATCH_TICK_TIME &&
                    periodNumber > 1;
                }

                // End of limit or period
                if (
                  stopwatchInterval.value.startTime === 0 ||
                  isEndOfLimit ||
                  isEndOfPeriod
                ) {
                  stopwatchInterval.value.startTime = 0;
                  stopwatchInterval.value.offset = total > 0 ? total : 0;
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  clearInterval(timer!);
                  timer = null;
                  return;
                }
              }, STOPWATCH_TICK_TIME);
            }
            break;

          case StopwatchActions.STOP:
            currentValue.startTime = 0;
            currentValue.offset = currentTotalTime;
            if (timer) {
              clearInterval(timer);
              timer = null;
            }
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

            if (tmpValue > currentValue.limit) {
              throw new Error("Offset cannot be greater than limit");
            }

            if (tmpValue + currentTotalTime < 0) {
              throw new Error("The time can not be less than 0");
            }

            currentValue.offset = tmpValue;
            break;

          case StopwatchActions.ADD_OFFSET:
            if (currentValue.offset + ((payload as number) ?? 0) < 0) {
              throw new Error(
                "You can not set an offset that makes the stopwatch restart or have negative values, use backwards instead"
              );
            }
            currentValue.offset += (payload as number) ?? 0;
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

          case StopwatchActions.SET_PERIOD_TIME:
            assertPayload(ack, payload);

            if (typeof payload === typeof Function) {
              const callback = payload as StopwatchSetTypeByCallback<number>;
              tmpValue = callback(
                currentValue.periodTime,
                currentValue.startTime,
                currentValue.limit,
                currentValue.offset
              );
            } else {
              tmpValue = payload as number;
            }

            if (currentValue.limit > 0 && tmpValue > currentValue.limit) {
              throw new Error("Period time cannot be greater than limit");
            }

            currentValue.periodTime = tmpValue;
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
