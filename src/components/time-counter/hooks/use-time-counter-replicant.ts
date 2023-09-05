import { useReplicant } from "hooks/use-replicant";
import { useEffect, useState } from "react";
import { NamedTimeCounters, TimeCounter } from "types/schemas/named-time-counters";
import { TimeCounterOptions, TimeCounterResumeOptions } from "../lib/time-worker";
import { useTimeCounter } from "./use-time-counter";

export function useTimeCounterReplicant({ name }: { name: string }) {
  const [initial, setInitial] = useState<boolean>(false);
  const [timers, setTimers] = useReplicant<NamedTimeCounters>(
    "named-time-counters",
    { [name]: {} },
    { persistent: true },
  );

  const updateTimerForName = (settings: Partial<TimeCounter>) =>
    setTimers((prev) => ({ ...prev, [name]: { ...prev[name], ...settings } }));

  const setTimerForName = (settings: Partial<TimeCounter>) => {
    setTimers((prev) => ({ ...prev, [name]: { ...settings } }));
  };

  const timeCounter = useTimeCounter({
    name,
    onStart: updateTimerForName,
    onRunning: updateTimerForName,
    onFinished: updateTimerForName,
    onPause: () =>
      updateTimerForName({
        status: "PAUSED",
        offset: timeCounter.time,
        startTime: 0,
      }),
    onAdd: ({ offset }) => {
      timers[name] ??= {};
      timers[name].offset ??= 0;
      const newOffset = (timers[name].offset ?? 0) + offset;
      updateTimerForName({ offset: newOffset });
    },
    onCleared: setTimerForName,
    onReset: setTimerForName,
    onPaused: updateTimerForName,
    onResume: updateTimerForName,
  });

  useEffect(() => {
    nodecg.listenFor(`${name}:start`, (data) => timeCounter.start(data));
    nodecg.listenFor(`${name}:resume`, (data) => timeCounter.resume(data));
    nodecg.listenFor(`${name}:pause`, () => timeCounter.pause());
    nodecg.listenFor(`${name}:reset`, (data) => timeCounter.reset(data));
    nodecg.listenFor(`${name}:add`, (data) => timeCounter.add(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const current = timers[name];
    if (current.startTime && current.startTime > 0 && timeCounter.status !== "RUNNING" && !initial) {
      setInitial(true);
      const offset = Date.now() - current.startTime;
      timeCounter.start({
        offset,
        limit: current.limit,
        isBackwards: current.isBackwards,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timers]);

  const start = (payload: Partial<TimeCounterOptions> = {}) => {
    nodecg.sendMessage(`${name}:start`, payload);
  };

  const resume = (payload: Partial<TimeCounterResumeOptions> = {}) => {
    nodecg.sendMessage(`${name}:resume`, payload);
  };

  const pause = () => {
    nodecg.sendMessage(`${name}:pause`);
  };

  const reset = (payload: Partial<TimeCounterOptions> = {}) => {
    nodecg.sendMessage(`${name}:reset`, payload);
  };

  const add = (offset: number) => {
    nodecg.sendMessage(`${name}:add`, { offset });
  };

  return {
    time: timeCounter.time,
    status: timeCounter.status,
    isBackwards: timeCounter.isBackwards,
    errors: timeCounter.errors,
    start,
    resume,
    pause,
    reset,
    add,
  };
}
