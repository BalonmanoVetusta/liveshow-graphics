/* eslint-disable */
// TODO: WIP hook (Work in progress; not finished) ** Optional hook
// 1. Add type annotations to useScoreboard hook, now it is incomplete
// 2. Implement the actions for the useScoreboard hook
// 3. This will use match-action json schema to validate the actions

export declare interface UseScoreboardReturn {}

export enum ScoreboardTeam {
  LOCAL = "LOCAL",
  VISITOR = "VISITOR",
}

export enum ScoreboardEvent {
  SHOOT = "SHOOT",
  TIME = "TIME",
  YELLOW_CARD = "YELLOW_CARD",
  RED_CARD = "RED_CARD",
  FAULT = "FAULT",
  PENALTY_FAULT = "PENALTY_FAULT",
  PENALTY_GOAL = "PENALTY_GOAL",
  PENALTY_MISSED = "PENALTY_MISSED",
  PENALTY_SAVED = "PENALTY_SAVED",
  BALL_LOST = "BALL_LOST", // Number of player lost the ball and generate a Possesion Event
  BALL_POSSESSION = "BALL_POSSESSION",
  FASTBREAK = "FASTBREAK", // Result should be the same as ShootType any other is a regular ball lost
  ASSIST = "ASSIST",
  POSSESION_CHANGE = "POSSESION_CHANGE",
  PLAYER_CHANGE = "PLAYER_CHANGE",
}

export enum TimeEvent {
  START = "START",
  END_OF_PERIOD = "END_OF_PERIOD",
  END_OF_GAME = "END_OF_GAME",
  TIMEOUT = "TIMEOUT",
}

export enum PlayerAction {
  STEPS = "STEPS",
  DOUBLES = "DOUBLES",
  MISSED_PASS = "MISSED_PASS",
  BALL_RECOVERY = "BALL_RECOVERY",
}

export enum PossesionEvent { // This should register the player and a player action
  TO_LOCAL = "TO_LOCAL",
  TO_VISITOR = "TO_VISITOR",
}

export enum ShootType {
  FASTBREAK = "FASTBREAK",
  F6M = "6M", // F means "from", enums cases can not start with number
  F9M = "9M",
  F7M = "7M",
  FREE_THROW = "FREE_THROW",
}

export enum ShootResult {
  THROW_IN = "THROW_IN", // Goal
  THROW_OUT = "THROW_OUT", // Missed
  BLOCKED = "BLOCKED", // Blocked
  SAVE = "SAVE",
}

export function useScoreboard(): UseScoreboardReturn {
  // TODO: implement useScoreboard

  return {};
}
