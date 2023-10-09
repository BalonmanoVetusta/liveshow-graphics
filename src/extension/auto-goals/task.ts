import NodeCG from "@nodecg/types";
import Cron from "croner";
import { getCurrentSeasonLabel, getMatchData } from "services/rfebm-api";
import { AutoGoals } from "types/schemas/auto-goals";
import { MatchAction } from "types/schemas/match-action";
import { MatchActions } from "types/schemas/match-actions";
import { Stopwatch } from "types/schemas/stopwatch";
import { v4 as uuidV4 } from "uuid";
import { handleStopwatchReplicant } from "extension/stopwatch-replicant-messages/handle-stopwatch-replicant";
import { StopwatchActions } from "extension/stopwatch-replicant-messages/types";

export enum AutoGoalsFetchActions {
  GOAL = "Gol",
  SUSPENSION = "Exclusión", // 2' suspension
  YELLOW_CARD = "Amonestación", // Yellow card
  DISQUALIFICATION = "Descalificación", // Red card
  TIMEOUT = "Tiempo muerto", // Timeout
}

function convertFetchAction2MatchActionType(action: string) {
  if (action === AutoGoalsFetchActions.GOAL) return "GOAL";
  if (action === AutoGoalsFetchActions.SUSPENSION) return "SUSPENSION";
  if (action === AutoGoalsFetchActions.YELLOW_CARD) return "WARNING";
  if (action === AutoGoalsFetchActions.DISQUALIFICATION) return "DISQUALIFICATION";
  if (action === AutoGoalsFetchActions.TIMEOUT) return "TIMEOUT";
  return "OTHER";
}

export enum MatchStatus {
  UNKNOWN = "desconocido",
  NO_DATA = "no-data",
  ERROR_NOT_START_VALUES = "error-not-start-values",
  ERROR_NOT_TODAY_MATCH = "not-today-match",
  PENDING = "pendiente",
  IN_PROGRESS = "live",
  FINISHED = "finalizado",
}

function getStopwatchCurrentTime(stopwatchCurrentValue: Stopwatch) {
  const { offset = 0, startTime = 0, limit = 0, backwards = false } = stopwatchCurrentValue || {};

  let totalTime = offset;
  if (startTime > 0) {
    totalTime = Date.now() - startTime;
    totalTime += offset;
  }

  if (backwards && totalTime < limit) {
    totalTime = limit - totalTime;
  } else if (backwards) {
    totalTime = 0;
  }

  return totalTime;
}

const TIMEOUT = 180_000; // 5 minutes without any change of actions or scores then we stop the auto goals and must be reactivated manually
const PULL_SECONDS = 15;
const CRON_SCHEDULE = `*/${PULL_SECONDS} * * * * *`;
let job: ReturnType<typeof Cron> | undefined;

async function startAutoGoals(nodecg: NodeCG.ServerAPI) {
  const matchActions = nodecg.Replicant<MatchActions>("match-actions", nodecg.bundleName, { defaultValue: [] });
  const autoGoals = nodecg.Replicant<AutoGoals>("auto-goals", nodecg.bundleName, { defaultValue: {} });
  const stopwatch = nodecg.Replicant("stopwatch", nodecg.bundleName, { defaultValue: {} as Stopwatch });
  // reset the data before start
  matchActions.value.length = 0;
  matchActions.value = [];

  // Automations for when actions are added
  let wasTimeoutCalled = false;
  matchActions.on("change", (newValue) => {
    if (newValue.length === 0) return;
    const lastInput = newValue[newValue.length - 1];
    const { action, matchTime } = lastInput;

    if (action === "TIMEOUT" && !wasTimeoutCalled) {
      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.STOP,
        payload: undefined,
      });

      // On timeout fix the time to the current match time
      const currentTimeMs = getStopwatchCurrentTime(stopwatch.value);
      if (currentTimeMs !== matchTime) {
        stopwatch.value.offset = matchTime;
        stopwatch.value.startTime = 0;
      }

      wasTimeoutCalled = true;
    }

    // Start automatically if other action is called
    if (action !== "TIMEOUT" && wasTimeoutCalled) {
      handleStopwatchReplicant(nodecg, {
        type: StopwatchActions.START,
        payload: undefined,
      });
      wasTimeoutCalled = false;
    }
  });

  // Reset all autoGoals data
  autoGoals.value = {
    federationId: autoGoals.value?.federationId ?? 0,
    subfederationId: autoGoals.value?.subfederationId ?? 0,
    seasonId: autoGoals.value?.seasonId ?? 0,
    seasonLabel: getCurrentSeasonLabel(),
    categoryId: autoGoals.value?.categoryId ?? 0,
    championshipId: autoGoals.value?.championshipId ?? 0,
    championshipName: "Liga",
    tournamentId: autoGoals.value?.tournamentId ?? 0,
    week: autoGoals.value?.week ?? 0,
    matchId: autoGoals.value?.matchId ?? 0,
    active: autoGoals.value?.active ?? false,
    status: MatchStatus.UNKNOWN,
    people: [],
    court: {},
    local: {},
    visitor: {},
  };

  // Should put as inactive if any value change
  autoGoals.on("change", (newValue) => {
    nodecg.log.debug(`Auto goals change`, { newValue });
    const { active = false, tournamentId = 0, matchId = 0, week = 0 } = newValue ?? {};
    if (active === false) {
      if (job) job.stop();
      return;
    }

    if (tournamentId === 0 || matchId === 0 || week === 0) {
      autoGoals.value!.active = false;
      autoGoals.value!.status = MatchStatus.ERROR_NOT_START_VALUES;
      if (job) job.stop();
    }
  });

  let lastMatchCheckTimestamp = 0;
  // Initial check to allow the auto goals start
  // This is duplicated because the onchange happen while running in case any data change and this is a starting check
  const {
    tournamentId: initialTournament = 0,
    matchId: initialMatchId = 0,
    week: initialWeekNumber = 0,
  } = autoGoals.value ?? {};

  if (initialTournament === 0 || initialMatchId === 0 || initialWeekNumber === 0) {
    autoGoals.value!.active = false;
    autoGoals.value!.status = MatchStatus.ERROR_NOT_START_VALUES;
    return null;
  }

  // Scoped to avoid name collision & free allocated memory for the variables, some can be heavy =)
  {
    // Check if the given match is a today match and has a valid status
    const data = (await getMatchData({
      tournamentId: initialTournament,
      matchId: initialMatchId,
      week: initialWeekNumber,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch(() => undefined)) as any;

    // Not valid match data or past matches that are finished
    const status = data?.status?.toLowerCase() ?? MatchStatus.UNKNOWN;
    if (!data || Object.keys(data).length === 0 || ![MatchStatus.IN_PROGRESS, MatchStatus.PENDING].includes(status)) {
      autoGoals.value!.active = false;
      lastMatchCheckTimestamp = 0;
      autoGoals.value!.status = status === MatchStatus.UNKNOWN ? MatchStatus.NO_DATA : status;
      return null;
    }

    // Check if match is a future match and not today match
    if (status === MatchStatus.PENDING) {
      const { date = "" } = data;
      const now = new Date();
      const [day, month, year] = date.split("-").map(Number);
      const [todayDay, todayMonth, todayYear] = now.toLocaleDateString().split("/").map(Number);
      // Is the match today?
      if (todayDay !== day || todayMonth !== month || todayYear !== year) {
        autoGoals.value!.active = false;
        autoGoals.value!.status = MatchStatus.ERROR_NOT_TODAY_MATCH;
        return null;
      }
    }

    // Now adds initial data
    autoGoals.value!.local = structuredClone(data.local);
    autoGoals.value!.visitor = structuredClone(data.visitor);
    autoGoals.value!.championshipName = data.championship.name;
    autoGoals.value!.seasonLabel = data.season.label ?? getCurrentSeasonLabel();
    autoGoals.value!.people = structuredClone(data.people);
    autoGoals.value!.court = structuredClone(data.court);
  }

  return async () => {
    nodecg.log.debug(`Running auto goals task =)`);
    const time = lastMatchCheckTimestamp > 0 ? Date.now() - lastMatchCheckTimestamp : 0;
    if (time > TIMEOUT) autoGoals.value!.active = false;

    const { tournamentId = 0, matchId = 0, week = 0 } = autoGoals.value ?? {};

    if (tournamentId === 0 || matchId === 0 || week === 0) {
      autoGoals.value!.active = false;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await getMatchData({ tournamentId, matchId, week }).catch(() => undefined)) as any;

    // Alawys update fields
    autoGoals.value!.status = data.status.toLowerCase();
    autoGoals.value!.local ??= structuredClone(data.local) ?? {};
    autoGoals.value!.local!.score = data.local?.score ?? 0; // Should be defined but just in case...
    autoGoals.value!.visitor ??= structuredClone(data.visitor) ?? {};
    autoGoals.value!.visitor!.score = data.visitor?.score ?? 0;

    // TODO: Match actions implementation here it should add only new actions
    data.actions.forEach((action) => {
      if (matchActions.value.some((matchAction) => JSON.stringify(matchAction.payload) === JSON.stringify(action)))
        return;
      nodecg.log.debug(`Adding new action`, { action });
      const periodTime = stopwatch.value.periodTime ?? 1_800_000;
      const period = (action.period ?? 1) - 1;
      const [minute, second] = action.time.split(":").map(Number);
      const minutesOffsetInMs = period * periodTime;
      const totalMinutes = minute * 60_000 + minutesOffsetInMs;
      const totalSeconds = second * 1_000;
      const totalMatchTime = totalMinutes + totalSeconds;

      const team = action.team === data.local.name ? "LOCAL" : "VISITOR";

      const newAction: MatchAction = {
        id: uuidV4(),
        gmtTimestamp: Date.now(),
        matchTime: totalMatchTime,
        team,
        action: convertFetchAction2MatchActionType(action.action),
        payload: action,
      };
      matchActions.value.push(newAction);
      lastMatchCheckTimestamp = Date.now();
    });

    // Not in progress or pending stop after get all posible data
    // Because status of the match can change here...
    const status = data?.status?.toLowerCase() ?? MatchStatus.UNKNOWN;
    if (![MatchStatus.IN_PROGRESS, MatchStatus.PENDING].includes(status)) autoGoals.value!.active = false;
  };
}

export async function handleAutoGoalsTasks(nodecg: NodeCG.ServerAPI) {
  if (job) return job;

  const autoGoalsTask = await startAutoGoals(nodecg);
  if (!autoGoalsTask) return;

  job = Cron(CRON_SCHEDULE, autoGoalsTask);

  return job;
}
