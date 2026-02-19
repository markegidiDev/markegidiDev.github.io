import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToastContext, type ToastInput, type ToastVariant } from './toast-context';

type ToastItem = ToastInput & {
  id: number;
  variant: ToastVariant;
  durationMs: number;
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-500/30 bg-emerald-500/12 text-emerald-800 dark:text-emerald-200',
  error: 'border-red-500/30 bg-red-500/12 text-red-800 dark:text-red-200',
  info: 'border-sky-500/30 bg-sky-500/12 text-sky-800 dark:text-sky-200',
};

const variantIcon: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    const timerId = timersRef.current.get(id);
    if (timerId !== undefined) {
      window.clearTimeout(timerId);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', durationMs = 4200 }: ToastInput) => {
      const id = Date.now() + Math.round(Math.random() * 1000);
      const entry: ToastItem = { id, title, description, variant, durationMs };
      setItems((prev) => [...prev, entry]);

      const timerId = window.setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, timerId);
    },
    [dismiss]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[120] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto rounded-2xl border border-border/70 bg-glass p-3 shadow-soft"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className={cn('mt-0.5 rounded-full border p-1', variantStyles[item.variant])}>{variantIcon[item.variant]}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{item.title}</div>
                {item.description ? <div className="mt-0.5 text-xs text-muted-foreground">{item.description}</div> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-md p-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Dismiss notification"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
