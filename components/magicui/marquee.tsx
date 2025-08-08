"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Marquee = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    reverse?: boolean;
    pauseOnHover?: boolean;
  }
>(({ className, reverse, pauseOnHover, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex overflow-hidden [--duration:50s] [--gap:1.5rem]",
        className
      )}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
      } as React.CSSProperties}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-[--gap]",
          reverse && "animate-marquee-reverse",
          !reverse && "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          "--duration": "50s",
          "--gap": "1.5rem",
          willChange: "transform",
          backfaceVisibility: "hidden",
        } as React.CSSProperties}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-[--gap] ml-[--gap]",
          reverse && "animate-marquee-reverse",
          !reverse && "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          "--duration": "50s",
          "--gap": "1.5rem",
          willChange: "transform",
          backfaceVisibility: "hidden",
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
});
Marquee.displayName = "Marquee";

export { Marquee };
