import type { PropsWithChildren } from "react";

type ButtonProps = {
  onClick: () => void;
};

export function Button({ onClick, children }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className="bg-bg dark:bg-bg-dark px-4 py-2 rounded-md focus:outline-none cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
