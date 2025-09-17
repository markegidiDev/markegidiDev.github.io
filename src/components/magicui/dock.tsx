import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type DockContextValue = {
  mouseX: number | null;
  containerLeft: number;
  iconMagnification: number; // percent e.g. 60 -> max scale 1.6
  iconDistance: number; // px radius in which effect applies
};

const DockContext = createContext<DockContextValue | null>(null);

export type DockProps = {
  children: React.ReactNode;
  className?: string;
  /** Max magnification in percent. 60 -> scale up to 1.6x at cursor */
  iconMagnification?: number;
  /** Distance in px for the magnification falloff */
  iconDistance?: number;
  /** Direction of the dock */
  direction?: "top" | "middle" | "bottom";
};

/**
 * MagicUI-like Dock container providing a macOS dock magnification effect.
 */
export function Dock({
  children,
  className,
  iconMagnification = 60,
  iconDistance = 100,
  direction = "middle",
}: DockProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [containerLeft, setContainerLeft] = useState(0);

  const updateContainerLeft = useCallback(() => {
    const rect = ref.current?.getBoundingClientRect();
    setContainerLeft(rect?.left ?? 0);
  }, []);

  useEffect(() => {
    updateContainerLeft();
    const onResize = () => updateContainerLeft();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateContainerLeft]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    // Track mouse X relative to container
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setContainerLeft(rect.left);
    setMouseX(e.clientX - rect.left);
  }, []);

  const onMouseLeave = useCallback(() => setMouseX(null), []);

  const value = useMemo(
    () => ({ mouseX, containerLeft, iconMagnification, iconDistance }),
    [mouseX, containerLeft, iconMagnification, iconDistance]
  );

  // Apply direction-based styles
  const directionClasses = {
    top: "items-start",
    middle: "items-center", 
    bottom: "items-end"
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "inline-flex gap-3 rounded-2xl border border-border bg-card/60 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-card/50",
        directionClasses[direction],
        className
      )}
      role="toolbar"
      aria-label="Dock"
    >
      <DockContext.Provider value={value}>{children}</DockContext.Provider>
    </div>
  );
}

export type DockIconProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Override the base size of the icon container (Tailwind classes). Defaults to h-12 w-12 */
  sizeClassName?: string;
};

/**
 * Icon wrapper to be used inside Dock. Place your SVG or <Icon className="size-full" /> inside.
 */
export function DockIcon({ className, sizeClassName = "h-12 w-12", children, ...rest }: DockIconProps) {
  const ctx = useContext(DockContext);
  const ref = useRef<HTMLDivElement | null>(null);

  const [centerX, setCenterX] = useState<number>(0);

  const updateCenter = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCenterX(rect.left + rect.width / 2 - (ctx?.containerLeft ?? 0));
  }, [ctx?.containerLeft]);

  useEffect(() => {
    updateCenter();
    const onResize = () => updateCenter();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateCenter]);

  // Compute scale based on distance to mouse
  let scale = 1;
  if (ctx?.mouseX != null) {
    const distance = Math.abs(ctx.mouseX - centerX);
    const t = Math.max(0, 1 - distance / (ctx.iconDistance || 1)); // 0..1
    const maxGain = (ctx.iconMagnification ?? 60) / 100; // e.g., 0.6 -> 1.6x
    scale = 1 + t * maxGain;
  }

  const translateY = -(scale - 1) * 12; // lift a bit when scaled

  return (
    <div
      ref={ref}
      className={cn(
        "grid place-items-center rounded-xl bg-black/10 text-foreground/90 dark:bg-white/10",
        "transition-transform duration-75 will-change-transform",
        sizeClassName,
        className
      )}
      style={{ transform: `translateY(${translateY}px) scale(${scale})` }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Dock;
