import { useLayoutEffect, useRef, useState } from "react";

type UseRotationProps = {
  timeShowElement: number;
  transitionDuration: number;
  waitPreviousDisappear: boolean;
  classNameIn: string;
  classNameOut: string;
  initial: number;
  onNewIndex: (current: number) => void;
};

export function useRotation({
  timeShowElement = 5,
  transitionDuration = 1,
  waitPreviousDisappear = true,
  classNameIn = "in",
  classNameOut = "out",
  initial = 0,
  onNewIndex = () => undefined,
}: Partial<UseRotationProps> = {}) {
  const intervalTime = 1000 * (waitPreviousDisappear ? timeShowElement + transitionDuration : timeShowElement);
  const ref = useRef(null);
  const [current, setCurrent] = useState(initial);

  useLayoutEffect(() => {
    const adverts = Array.from((ref.current as unknown as HTMLDivElement)?.children ?? []);
    setTimeout(() => adverts[current].classList.add(classNameIn), 1);
    const interval = setInterval(() => {
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

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, current };
}
