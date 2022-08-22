import createNewContextOf from "lib/createNewContextOf";
import { PropsWithChildren } from "react";
import useStopWatch, {
  UseStopwatchProps,
  UseStopwatchReturn,
} from "../use-stopwatch";

const [useStopwatchContext, SWProvider] =
  createNewContextOf<UseStopwatchReturn>();

export function StopwatchProvider(props: PropsWithChildren<UseStopwatchProps>) {
  const hook: UseStopwatchReturn = useStopWatch(props);
  return <SWProvider value={hook}>{props.children}</SWProvider>;
}

export { useStopwatchContext };
