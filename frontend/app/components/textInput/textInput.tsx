import { useTextInput } from "./useTextInput";

type TextInputProps = {
  onChange: (value: string) => void;
  value: string;
  label: string;
};

export function TextInput({ onChange, value, label }: TextInputProps) {
  const { onChangeWrapper, textInputId } = useTextInput({ onChange });

  return (
    <div className="flex flex-col gap-2 items-start">
      <label htmlFor={textInputId}>{label}</label>
      <input id={textInputId} onChange={onChangeWrapper} value={value} />
    </div>
  );
}
