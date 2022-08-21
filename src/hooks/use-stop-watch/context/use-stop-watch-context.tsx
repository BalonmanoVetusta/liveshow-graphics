import createNewContextOf from "lib/createNewContextOf";
import { PropsWithChildren } from "react";
import useStopWatch, {
  useStopwatchProps,
  UseStopwatchReturn,
} from "../use-stopwatch";

const [useStopwatchContext, SWProvider] =
  createNewContextOf<UseStopwatchReturn>();

export function StopwatchProvider(props: PropsWithChildren<useStopwatchProps>) {
  const hook: UseStopwatchReturn = useStopWatch(props);
  return <SWProvider value={hook}>{props.children}</SWProvider>;
}

export { useStopwatchContext };
