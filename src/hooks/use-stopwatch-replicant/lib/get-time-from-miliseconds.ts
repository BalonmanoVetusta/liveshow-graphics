export enum MaxTimeUnit {
  DAYS,
  HOURS,
  MINUTES,
  SECONDS,
  MILISECONDS,
}

export declare interface TimeUnit {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds: number;
}

export default function getTimeFromMiliseconds(
  milliseconds: number,
  maxUnit: MaxTimeUnit = MaxTimeUnit.MINUTES,
): TimeUnit {
  const result: TimeUnit = {} as TimeUnit;

  if (maxUnit === MaxTimeUnit.MILISECONDS) {
    result.milliseconds = milliseconds;
  }
  result.milliseconds = milliseconds % 1000;

  if (maxUnit === MaxTimeUnit.SECONDS) {
    return { ...result, seconds: Math.floor(milliseconds / 1000) };
  }
  result.seconds = Math.floor(milliseconds / 1000) % 60;

  if (maxUnit === MaxTimeUnit.MINUTES) {
    return { ...result, minutes: Math.floor(milliseconds / 60000) };
  }
  result.minutes = Math.floor(milliseconds / (1000 * 60)) % 60;

  if (maxUnit === MaxTimeUnit.HOURS) {
    return { ...result, hours: Math.floor(milliseconds / 3600000) };
  }
  result.hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
  result.days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  return result;
}
