import type { PropsWithChildren } from "react";

type ButtonProps = {
  onClick: () => void;
};

export function Button({ onClick, children }: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className="bg-bg dark:bg-bg-dark px-4 py-2 h-12 rounded-md focus:outline-none cursor-pointer duration-200 ease-in-out dark:hover:bg-bg-dark-lighter dark:active:bg-bg-dark-darker hover:bg-bg-lighter active:bg-bg-darker"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
