import { useLayoutEffect, useRef, useState } from "react";

type UseRotationProps = {
  timeShowElement: number;
  transitionDuration: number;
  waitPreviousDisappear: boolean;
  classNameIn: string;
  classNameOut: string;
  initial: number;
  initialStart: boolean;
  onNewIndex: (current: number) => void;
};

export function useRotation({
  timeShowElement = 5,
  transitionDuration = 1,
  waitPreviousDisappear = true,
  classNameIn = "in",
  classNameOut = "out",
  initial = 0,
  initialStart = true,
  onNewIndex = () => undefined,
}: Partial<UseRotationProps> = {}) {
  const intervalTime = 1000 * (waitPreviousDisappear ? timeShowElement + transitionDuration : timeShowElement);
  const ref = useRef(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [current, setCurrent] = useState<number>(initial); // Current element index
  const [start, setStart] = useState<boolean>(initialStart);

  useLayoutEffect(() => {
    const adverts = Array.from((ref.current as unknown as HTMLDivElement)?.children ?? []);
    if (adverts.length === 0) return;

    if (!start) {
      if (interval.current) clearInterval(interval.current);
      adverts.forEach((el) => el.classList.remove(classNameIn, classNameOut));
      return;
    }

    setTimeout(() => adverts?.[current]?.classList.add(classNameIn), 1);
    interval.current = setInterval(() => {
      setCurrent((prev = 0) => {
        const next = (prev + 1) % adverts.length;
        adverts[prev].classList.replace(classNameIn, classNameOut);
        adverts[next].classList.add(classNameIn); // Add in class to current element
        setTimeout(() => {
          adverts.forEach((el) => el.classList.remove(classNameOut));
        }, transitionDuration * 1000); // Remove out class after transition
        // New element is shown
        onNewIndex(next);

        return next;
      });
    }, intervalTime);

    return () => {
      if (interval.current) clearInterval(interval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, start]);

  return { ref, current, setStart };
}
