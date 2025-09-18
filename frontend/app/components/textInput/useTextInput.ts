import type { ChangeEventHandler } from "react";
import { useCallback, useId } from "react";

type UseTextInputParams = {
  onChange: (value: string) => void;
};

export function useTextInput({ onChange }: UseTextInputParams) {
  const onChangeWrapper: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [],
  );

  const textInputId = useId();

  return { onChangeWrapper, textInputId };
}
