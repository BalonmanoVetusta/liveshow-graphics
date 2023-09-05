import { useEffect, useState } from "react";
import { functionAsBlob } from "../lib/function-as-blob";
import {
  TimeCounterAction,
  TimeCounterActionType,
  TimeCounterMessageData,
  TimeCounterMessageDataError,
  TimeCounterMessageDataSuccess,
  TimeCounterOptions,
  TimeCounterResumeOptions,
  TimeCounterStatus,
  timeWorker,
} from "../lib/time-worker";

function useWindowEvent(event: string, fn: EventListenerOrEventListenerObject) {
  useEffect(() => {
    window.addEventListener(event, fn);

    return () => {
      window.removeEventListener(event, fn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

type UseTimeCounterOptions = {
  name: string;
  onStart: (data: Partial<TimeCounterOptions>) => void;
  onReset: (data: Partial<TimeCounterOptions>) => void;
  onPause: () => void; // Pause and stop is the same
  onResume: (data: Partial<TimeCounterOptions>) => void;
  onAdd: (data: { offset: number }) => void;
  onRunning: (data: TimeCounterMessageData) => void;
  onCleared: (data: TimeCounterMessageData) => void;
  onFinished: (data: TimeCounterMessageData) => void;
  onPaused: (data: TimeCounterMessageData) => void;
};

// It will subscribe to BroadcastChannel with "name" and you can send TimeCounterAction to it
export function useTimeCounter({
  name,
  onStart = () => undefined,
  onPause = () => undefined,
  onReset = () => undefined,
  onResume = () => undefined,
  onAdd = () => undefined,
  onCleared = () => undefined,
  onFinished = () => undefined,
  onPaused = () => undefined,
  onRunning = () => undefined,
}: Partial<UseTimeCounterOptions> = {}) {
  const [worker, setWorker] = useState<Worker | undefined>();
  const [status, setStatus] = useState<TimeCounterStatus>(TimeCounterStatus.CLEARED);
  const [time, setTime] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);
  const [isBackwards, setIsBackwards] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  useWindowEvent("beforeunload", () => {
    worker?.terminate();
  });

  useEffect(() => {
    if (!worker) {
      const wk = new Worker(functionAsBlob(timeWorker));
      setWorker(wk);
      wk.addEventListener("message", ({ data }: { data: TimeCounterMessageData }) => {
        const possibleErrors = (data as TimeCounterMessageDataError).errors ?? [];
        if (possibleErrors.length > 0) {
          setErrors(possibleErrors);
          return;
        }

        const {
          status: currentStatus,
          time: currentTime,
          limit: currentLimit,
          isBackwards: currentBackwards,
        } = data as TimeCounterMessageDataSuccess;

        if (errors.length > 0) setErrors([]); // If a new message has no errors delete
        // current errors, pay attention to this because maybe you want to store errors
        // in your component
        setStatus(currentStatus);
        setTime(currentTime);
        setLimit(currentLimit);
        setIsBackwards(currentBackwards);

        if (currentStatus === TimeCounterStatus.CLEARED) {
          onCleared(data);
        }

        if (currentStatus === TimeCounterStatus.FINISHED) {
          onFinished(data);
        }

        if (currentStatus === TimeCounterStatus.PAUSED) {
          onPaused(data);
        }

        if (currentStatus === TimeCounterStatus.RUNNING) {
          onRunning(data);
        }
      });

      const bc = new BroadcastChannel(`${name}`);
      bc.addEventListener("message", ({ data }: { data: TimeCounterAction }) => wk.postMessage(data));
    }

    return () => {
      worker?.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (payload: Partial<TimeCounterOptions> = {}) => {
    worker?.postMessage({
      type: TimeCounterActionType.START,
      payload,
    });
    onStart(payload);
  };

  const resume = (payload: Partial<TimeCounterResumeOptions> = {}) => {
    worker?.postMessage({
      type: TimeCounterActionType.RESUME,
      payload,
    });
    onResume(payload);
  };

  const pause = () => {
    worker?.postMessage({
      type: TimeCounterActionType.PAUSE,
    });
    onPause();
  };

  const reset = (payload: Partial<TimeCounterOptions> = {}) => {
    worker?.postMessage({
      type: TimeCounterActionType.RESET,
      payload,
    });
    onReset(payload);
  };

  const add = (offset: number) => {
    worker?.postMessage({
      type: TimeCounterActionType.ADD,
      payload: {
        offset,
      },
    });
    onAdd({ offset });
  };

  return { worker, start, add, resume, pause, reset, status, errors, time, limit, isBackwards };
}
