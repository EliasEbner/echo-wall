import type { KeyboardEventHandler } from "react";
import { useTextInput } from "./useTextInput";

type TextInputProps = {
  onChange: (value: string) => void;
  value: string;
  label: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

export function TextInput({
  onChange,
  value,
  label,
  onKeyDown,
}: TextInputProps) {
  const { onChangeWrapper, textInputId } = useTextInput({ onChange });

  return (
    <div className="flex flex-col gap-1 items-start">
      <label className="pl-4 text-font-secondary" htmlFor={textInputId}>
        {label}
      </label>
      <input
        id={textInputId}
        onChange={onChangeWrapper}
        value={value}
        onKeyDown={onKeyDown}
        className="bg-bg dark:bg-bg-dark focus:outline-none h-12 px-4 py-2 rounded-md duration-200 ease-in-out focus:bg-bg-darker dark:focus:bg-bg-dark-lighter"
      />
    </div>
  );
}
