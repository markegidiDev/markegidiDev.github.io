import { cn } from "@/lib/utils";
import React from "react";

type Props = React.PropsWithChildren<{
  className?: string;
  contentClassName?: string;
}>;

export function GdCard({ className, contentClassName, children }: Props) {
  return (
    <section className={cn("rounded-[18px] p-[1px] shadow-main bg-gd-border-main overflow-hidden", className)}>
      <div className={cn("h-full w-full rounded-[17px] bg-gd-main p-5", contentClassName)}>{children}</div>
    </section>
  );
}
