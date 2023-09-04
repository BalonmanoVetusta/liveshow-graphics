export const TimeCounterActionType = {
  START: "START",
  STOP: "STOP",
  PAUSE: "PAUSE",
  RESUME: "RESUME",
  RESET: "RESET",
  ADD: "ADD",
  NONE: "NONE", // No action
} as const;
export type TimeCounterActionType = keyof typeof TimeCounterActionType;

export const TimeCounterStatus = {
  CLEARED: "CLEARED",
  PAUSED: "PAUSED",
  RUNNING: "RUNNING",
  FINISHED: "FINISHED",
} as const;
export type TimeCounterStatus = keyof typeof TimeCounterStatus;

export interface TimeCounterOptions {
  offset: number;
  limit: number | Date;
  tickMs: number;
  isBackwards: boolean;
}

export interface TimeCounterResumeOptions extends TimeCounterOptions {
  startTime: number;
}

type TimeCounterStartAction = {
  type: "START";
  payload: Partial<TimeCounterOptions>;
};

type TimeCounterResumeAction = {
  type: "RESUME";
  payload: Partial<TimeCounterResumeOptions>;
};

type TimeCounterPauseAction = {
  type: "PAUSE" | "STOP";
  payload: never;
};

type TimeCounterAddAction = {
  type: "ADD";
  payload: {
    offset: number;
  };
};

type TimeCounterResetAction = {
  type: "RESET";
  payload: Partial<TimeCounterOptions>;
};

export type TimeCounterAction =
  | TimeCounterAddAction
  | TimeCounterPauseAction
  | TimeCounterResumeAction
  | TimeCounterStartAction
  | TimeCounterResetAction;

export type TimeCounterMessageDataSuccess = {
  status: TimeCounterStatus;
  limit: number;
  time: number; // Current Time in Ms
  isBackwards: boolean;
  startTime?: number;
};

export type TimeCounterMessageDataError = {
  status?: TimeCounterStatus;
  limit?: number;
  time?: number; // Current Time in Ms
  isBackwards?: boolean;
  startTime?: number;
  errors: string[];
};
export type TimeCounterMessageData = TimeCounterMessageDataSuccess | TimeCounterMessageDataError;

const DEFAULT_TICKMS = 200;
const DEFAULT_BACKWARDS = false;

export function timeWorker() {
  let interval: ReturnType<typeof setInterval> | undefined;
  let startTime: number | undefined;
  let time = 0; // Milliseconds
  let offset = 0; // Milliseconds
  let status: TimeCounterStatus = "CLEARED";
  let isBackwards = DEFAULT_BACKWARDS;
  let tickMs = DEFAULT_TICKMS;
  let limit = 0;

  function tickTime(
    startTime: number = Date.now(),
    previousTime: number = 0,
    limit: Date | number = 0,
    offset: number = 0,
    isBackwards: boolean,
  ) {
    let time = previousTime;
    const now = Date.now();

    // If the limit is a date is a backwards countdown
    if (limit instanceof Date) {
      const limitTimestamp = limit.getTime();
      // Check if it is finished
      time = limitTimestamp - now;
      if (now >= limitTimestamp) {
        time = 0;
        offset = 0;
        status = "FINISHED";
      }
    }

    const limitNumber = Number(limit);

    // Calculation with limits
    if (!isNaN(limitNumber) && limitNumber > 0 && isBackwards) {
      time = now + offset - startTime - limitNumber;
      if (time <= 0) {
        time = 0;
        offset = 0;
        status = "FINISHED";
      }
    }

    if (!isNaN(limitNumber) && limitNumber > 0 && !isBackwards) {
      time = now + offset - startTime;
      if (time >= limitNumber) {
        time = limitNumber;
        status = "FINISHED";
      }
    }

    if (!isNaN(limitNumber) && limitNumber === 0) {
      time = now + offset - startTime;
    }

    return { status, limit, time };
  }

  function isValidLimit(limit: number | Date = 0): boolean {
    if (limit instanceof Date) {
      return limit.getTime() > Date.now();
    }

    return !isNaN(limit) && isFinite(limit);
  }

  self.addEventListener("message", ({ data }: { data: TimeCounterAction }) => {
    const type = data.type as TimeCounterActionType;

    // If limit is a date and defined must be a valid date (limit > Date.getTime())
    // it also must be a finite number
    if (!isValidLimit((data.payload as Partial<TimeCounterOptions>)?.limit)) {
      self.postMessage({
        ...data.payload,
        errors: ["Limit should be a date greater than current time when is a date"],
      });
      return;
    }

    if (type === "RESUME" || type === "START") {
      const now = Date.now();

      if (type === "START") {
        const payload = (data.payload ?? {}) as TimeCounterStartAction["payload"];
        const tempLimit = payload.limit instanceof Date ? payload.limit.getTime() : payload.limit ?? 0;
        limit = tempLimit ?? 0;
        tickMs = payload.tickMs ?? DEFAULT_TICKMS;
        isBackwards = payload.limit instanceof Date ? true : payload.isBackwards ?? DEFAULT_BACKWARDS;
        offset = payload.offset ?? 0;
      }

      if (type === "RESUME") {
        const payload = (data.payload ?? {}) as TimeCounterResumeAction["payload"];
        const tempLimit = payload.limit instanceof Date ? payload.limit.getTime() : payload.limit ?? limit ?? 0;
        startTime = payload.startTime ?? startTime;
        limit = tempLimit;
        tickMs = payload.tickMs ?? tickMs;
        isBackwards = payload.limit instanceof Date ? true : payload?.isBackwards ?? isBackwards;
        offset = payload.offset ?? offset;
      }

      status = "RUNNING";
      if (!interval)
        interval = setInterval(() => {
          startTime ??= now;
          if (startTime === 0 || status !== "RUNNING") {
            if (interval) clearInterval(interval);
            return;
          }

          const result = tickTime(startTime, time, limit, offset, isBackwards);

          status = result.status;
          time = result.time;

          self.postMessage({
            status,
            limit,
            time,
            isBackwards,
            startTime,
          });
        }, tickMs);
    }

    if (type === "PAUSE" || type === "STOP") {
      if (interval) clearInterval(interval);
      // If the limit is a date, we want to show when was stopped, so we save the pause timestamp in the offset
      offset = typeof limit === typeof Date ? Date.now() : time;
      time = 0;
      interval = undefined;
      startTime = undefined;
      status = "PAUSED";
      self.postMessage({
        status,
        limit,
        time: offset,
        isBackwards,
        startTime: 0,
      });
    }

    if (type === "RESET") {
      const payload = (data.payload ?? {}) as TimeCounterResetAction["payload"];
      const payloadLimit = payload?.limit instanceof Date ? payload.limit.getTime() : payload?.limit ?? limit;
      offset = payload.offset ?? offset;
      limit = payloadLimit;
      tickMs = payload.tickMs ?? tickMs ?? DEFAULT_TICKMS;
      isBackwards = payload.limit instanceof Date ? true : payload.isBackwards ?? isBackwards ?? DEFAULT_BACKWARDS;

      if (status === "RUNNING") {
        startTime = Date.now();
      }

      if (status !== "RUNNING") {
        if (interval) clearInterval(interval);
        startTime = undefined;
        interval = undefined;
        status = "CLEARED";
      }

      self.postMessage({
        status,
        limit,
        time,
        isBackwards,
        startTime: startTime ?? 0,
      });
    }

    if (type === "ADD") {
      const timeToAdd = Number(data.payload.offset);
      if (!isNaN(timeToAdd)) offset += timeToAdd;

      const result = tickTime(startTime, time, limit, offset, isBackwards);
      self.postMessage({
        status: result.status,
        time: result.time,
        limit,
        startTime,
      });
    }
  });
}
