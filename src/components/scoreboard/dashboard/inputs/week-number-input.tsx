import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useId } from "react";

type WeekInputProps = {
  label?: string;
  numberOfWeeks: number;
  onChange: (newValue: number, previousValue?: number) => void;
};
const defaultProps = {
  numberOfWeeks: 99,
  onChange: () => {},
};

export function WeekNumberInput({ label, numberOfWeeks, onChange }: Partial<WeekInputProps> = defaultProps) {
  const id = useId();
  const { week, setGraphics } = useGraphicsReplicant();
  return (
    <>
      {/* <fieldset> */}
      {label ? <label htmlFor={`week-number-${id}`}>{label}</label> : null}
      <input
        placeholder="Week Number"
        type="number"
        name="week-number"
        id={`week-number-${id}`}
        min={0}
        max={numberOfWeeks}
        step={1}
        value={week}
        onChange={(event) => {
          event.preventDefault();
          const newValue = parseInt(event.target.value, 10);
          onChange?.(newValue, week);
          setGraphics({ week: newValue });
        }}
      />
      <button
        onClick={(event) => {
          event.preventDefault();
          setGraphics({ week: undefined });
        }}
      >
        Delete Week
      </button>
      {/* </fieldset> */}
    </>
  );
}
WeekNumberInput.displayName = "WeekInput";
