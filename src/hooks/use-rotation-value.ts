import { useEffect, useState } from "react";

export function useRotationValue(duration = 10_000, visible = 2000, auto = true) {
  const [rotationValue, setRotationValue] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const forward = (index?: number) => {
    setTimeout(() => {
      setIsVisible(false);
    }, visible);
    setTimeout(
      () => {
        if (index) {
          setRotationValue(index);
        } else {
          setRotationValue((prev) => ++prev);
        }
      },
      2 * visible + 1,
    );
  };

  const backward = (index?: number) => {
    setTimeout(() => {
      setIsVisible(false);
    }, visible);
    setTimeout(
      () => {
        if (index) {
          setRotationValue(index);
        } else {
          setRotationValue((prev) => --prev);
        }
      },
      2 * visible + 1,
    );
  };

  useEffect(() => {
    if (auto) {
      const interval = setInterval(() => {
        forward();
      }, duration + visible);
      return () => clearInterval(interval);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, auto]);

  useEffect(() => {
    setIsVisible(true);
  }, [rotationValue]);

  return { value: rotationValue, isVisible, forward, backward };
}
