import { useMatchActions } from "hooks/use-match-actions";
import {
  MatchActionType,
  MatchSuspensionActionType,
  Team,
} from "hooks/use-match-actions/types";
import { useId, useState } from "react";

interface AddSuspensionFormProps {
  team: Team;
}

export function AddSuspensionForm({ team }: AddSuspensionFormProps) {
  const id = useId();
  const [isDoubleSuspension, setIsDoubleSuspension] = useState<boolean>(false);
  const [playerNumber, setPlayerNumber] = useState<number>(0);
  const [customMinutes, setCustomMinutes] = useState<number>(0);
  const [customSeconds, setCustomSeconds] = useState<number>(0);
  const [isCustomTime, setIsCustomTime] = useState<boolean>(false);
  const { addAction } = useMatchActions();
  return (
    <>
      <label htmlFor={`player-number-${team.toLowerCase()}-${id}`}>
        Player number
      </label>
      <input
        type="number"
        name="playerNumber"
        id={`player-number-${team.toLowerCase()}-${id}`}
        value={playerNumber}
        onChange={(event) => {
          event.preventDefault();
          const value = Number(event.target.value);
          setPlayerNumber(value);
        }}
      />
      <label htmlFor={`minutes-${team.toLowerCase()}-${id}`}>
        Check for custom time
      </label>
      <input
        type="checkbox"
        name={`current-time-checkbox-${team.toLowerCase()}-${id}`}
        id={`current-time-checkbox-${team.toLowerCase()}-${id}`}
        key={`current-time-checkbox-${team.toLowerCase()}-${id}-${isCustomTime.toString()}`}
        checked={isCustomTime}
        onChange={(event) => {
          event.preventDefault();
          setIsCustomTime(event.target.checked);
        }}
      />
      {isCustomTime ? (
        <>
          <input
            type="number"
            name={`player-suspensions-time-minutes-${team.toLowerCase()}-${id}`}
            id={`player-suspensions-time-minutes-${team.toLowerCase()}-${id}`}
            value={customMinutes}
            onChange={(event) => {
              event.preventDefault();
              const value = Number(event.target.value);
              setCustomMinutes(value);
            }}
          />{" "}
          :{" "}
          <input
            type="number"
            name={`player-suspensions-time-seconds-${team.toLowerCase()}-${id}`}
            id={`player-suspensions-time-minutes-${team.toLowerCase()}-${id}`}
            value={customSeconds}
            onChange={(event) => {
              event.preventDefault();
              const value = Number(event.target.value);
              setCustomSeconds(value);
            }}
          />
        </>
      ) : null}
      <label htmlFor={`double-suspension-${team.toLowerCase}-${id}`}>
        Double suspension
      </label>
      <input
        type="checkbox"
        name="doubleSuspension"
        id={`double-suspension-${team.toLowerCase}-${id}`}
        key={`double-suspension-${
          team.toLowerCase
        }-${id}-${isDoubleSuspension.toString()}`}
        checked={isDoubleSuspension}
        onChange={(event) => {
          event.preventDefault();
          setIsDoubleSuspension(!!event.target.checked);
        }}
      />
      <button
        onClick={(event) => {
          event.preventDefault();
          const actionValues: MatchSuspensionActionType = {
            action: MatchActionType.SUSPENSION,
            team,
            payload: {
              number: playerNumber,
              team,
            },
          };

          if (isCustomTime) {
            const matchMinutes = customMinutes * 60000;
            const matchSeconds = customSeconds * 1000;
            const matchTime = matchMinutes + matchSeconds;
            actionValues.matchTime = matchTime;
          }

          if (isDoubleSuspension) {
            addAction(actionValues);
          }
          addAction(actionValues);
        }}
      >
        Add Suspension
      </button>
    </>
  );
}
