import { createContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

export type ToastContextType = {
  toast: (payload: ToastInput) => void;
  dismiss: (id: number) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
