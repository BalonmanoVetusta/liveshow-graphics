import { useEffect, useState } from "react";

export function useRotationValue(duration = 10_000, visible = 2000, auto = true) {
  const [rotationValue, setRotationValue] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const forward = (index?: number) => {
    if (index) {
      setRotationValue(index);
    } else {
      setRotationValue((prev) => ++prev);
    }

    setIsVisible(false);
    setTimeout(() => setIsVisible(true), visible - visible * 0.2);
  };

  const backward = (index?: number) => {
    if (index) {
      setRotationValue(index);
    } else {
      setRotationValue((prev) => --prev);
    }

    setIsVisible(false);
    setTimeout(() => setIsVisible(true), visible - visible * 0.2);
  };

  useEffect(() => {
    if (auto) {
      const interval = setInterval(() => {
        forward();
      }, duration);
      return () => clearInterval(interval);
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, auto]);

  return { value: rotationValue, isVisible, forward, backward };
}
