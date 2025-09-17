import { type PropsWithChildren } from "react";

type BoxProps = {
  title?: string;
};

export function Box({ children, title }: PropsWithChildren<BoxProps>) {
  return (
    <div className="flex flex-col gap-4 py-4 px-6 bg-bg rounded-2xl dark:bg-bg-dark">
      {title && <h2 className="font-semibold text-xl">{title}</h2>}
      <div>{children}</div>
    </div>
  );
}
