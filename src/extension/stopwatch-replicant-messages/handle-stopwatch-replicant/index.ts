import { NodeCG } from "nodecg/types/server";
import { Stopwatch } from "types/schemas/stopwatch";
import defaultStopwatchValues from "../default-stopwatch-values";
import {
  StopwatchAction,
  StopwatchActionPayloadType,
  StopwatchActions,
  StopwatchSetTypeByCallback,
  StopwatchStartActionTypePayloadObject,
} from "../types";
import handleStart from "./actions/start";
import { clearHandleInterval } from "./actions/start/handle-interval";

// FIXME: Should use services
const STOPWATCH_REPLICANT_NAME = "stopwatch";
const STOPWATCH_TICK_TIME = 10;

function assertPayload(
  payload: StopwatchActionPayloadType | undefined = undefined
) {
  if (typeof payload === typeof undefined || payload === null) {
    throw new Error("Payload is required");
  }
}

export type HandleStopwatchReplicantParams = StopwatchAction & {
  payload: StopwatchActionPayloadType;
};

export function handleStopwatchReplicant(
  nodecg: NodeCG,
  { type: actionType, payload = undefined }: HandleStopwatchReplicantParams
) {
  // TODO: Good idea is to define in message if the replicant must be persistent or not
  const stopwatch = nodecg.Replicant<Stopwatch>(
    STOPWATCH_REPLICANT_NAME,
    nodecg.bundleName,
    {
      defaultValue: defaultStopwatchValues,
      persistent: true,
    }
  );

  const currentValue: Stopwatch = {
    ...defaultStopwatchValues,
    ...stopwatch.value,
  };

  let newValue: Stopwatch = { ...currentValue };

  const currentTotalTime =
    Date.now() - currentValue.startTime + currentValue.offset;
  let tmpValue: number | boolean;

  if (currentTotalTime < 0) {
    throw new Error("Time is negative, reset the stopwatch");
  }

  switch (actionType) {
    case StopwatchActions.START:
    case StopwatchActions.RESET:
      newValue = handleStart(
        nodecg,
        actionType,
        currentValue,
        STOPWATCH_REPLICANT_NAME,
        STOPWATCH_TICK_TIME,
        payload as StopwatchStartActionTypePayloadObject
      );
      break;

    case StopwatchActions.STOP:
      newValue.startTime = 0;
      newValue.offset = currentTotalTime;
      clearHandleInterval();
      break;

    // update, timeLimit, offset, backwards
    case StopwatchActions.SET_BACKWARDS:
      assertPayload(payload);

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

      newValue.backwards = tmpValue;
      break;

    case StopwatchActions.SET_OFFSET:
      assertPayload(payload);

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

      newValue.offset = tmpValue;
      break;

    case StopwatchActions.ADD_OFFSET:
      if (currentValue.offset + ((payload as number) ?? 0) < 0) {
        throw new Error(
          "You can not set an offset that makes the stopwatch restart or have negative values, use backwards instead"
        );
      }
      newValue.offset += (payload as number) ?? 0;
      break;

    case StopwatchActions.SET_TIME_LIMIT:
      assertPayload(payload);

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

      newValue.limit = tmpValue;
      break;

    case StopwatchActions.SET_PERIOD_TIME:
      assertPayload(payload);

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

      newValue.periodTime = tmpValue;
      break;

    default:
      throw new Error(`Unknown action type: ${actionType}`);
  }

  stopwatch.value = { ...newValue };
  return newValue;
}
