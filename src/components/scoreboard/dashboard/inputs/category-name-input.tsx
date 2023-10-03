import { useGraphicsReplicant } from "hooks/replicants/use-graphics-replicant";
import { useId } from "react";

type CategoryNameInputProps = {
  label?: string;
  onChange: (newValue: string, previousValue?: string) => void;
};

export function CategoryNameInput({ onChange }: Partial<CategoryNameInputProps> = { onChange: () => {} }) {
  const id = useId();
  const { category, setGraphics } = useGraphicsReplicant();
  return (
    <>
      <input
        type="text"
        name="category-name"
        id={`category-name-${id}`}
        value={category}
        placeholder="Category Name"
        onChange={(event) => {
          event.preventDefault();
          const newValue = event.target.value;
          onChange?.(newValue, category);
          setGraphics({ category: newValue });
        }}
      />
    </>
  );
}
