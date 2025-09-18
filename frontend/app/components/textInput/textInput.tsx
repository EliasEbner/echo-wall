import { useTextInput } from "./useTextInput";

type TextInputProps = {
  onChange: (value: string) => void;
  value: string;
  label: string;
};

export function TextInput({ onChange, value, label }: TextInputProps) {
  const { onChangeWrapper, textInputId } = useTextInput({ onChange });

  return (
    <div className="flex flex-col gap-1 items-start">
      <label className="pl-4" htmlFor={textInputId}>
        {label}
      </label>
      <input
        id={textInputId}
        onChange={onChangeWrapper}
        value={value}
        className="bg-bg dark:bg-bg-dark focus:outline-none px-4 py-2 rounded-md"
      />
    </div>
  );
}
