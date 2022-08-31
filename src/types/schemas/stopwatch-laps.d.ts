/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Start time in miliseconds since epoch, is null if the stopwatch is stopped or paused
 */
export type StartTimeInMilisecondsSinceEpoch = number;
/**
 * Offset in miliseconds, this will be added when calculate the totalTime
 */
export type Offset = number;
/**
 * Limit of time to stop the stopwatch in miliseconds. If this value is greater than 0 then stopwatch will be stopped when totalTime is equal or greater than this value
 */
export type TimeLimitToStopTheStopwatch = number;
/**
 * If this value is true and limitMiliseconds greater than 0 then stopwatch will be a countdown
 */
export type Backwards = boolean;

export interface StopwatchLaps {
  [k: string]: Stopwatch;
}
/**
 * This interface was referenced by `StopwatchLaps`'s JSON-Schema definition
 * via the `patternProperty` ".+".
 */
export interface Stopwatch {
  startTime: StartTimeInMilisecondsSinceEpoch;
  offset: Offset;
  limit: TimeLimitToStopTheStopwatch;
  backwards: Backwards;
}
