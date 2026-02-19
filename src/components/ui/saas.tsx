import React from 'react';
import { cn } from '@/lib/utils';

type SaaSPageProps = React.PropsWithChildren<{
  className?: string;
  contentClassName?: string;
}>;

export function SaaSPage({ className, contentClassName, children }: SaaSPageProps) {
  return (
    <div className={cn('relative min-h-screen overflow-x-clip bg-background', className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -left-32 -top-36 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, rgba(var(--blob-green), 0.24) 0%, rgba(var(--blob-green), 0) 68%)',
          }}
        />
        <div
          className="absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, rgba(var(--blob-sky), 0.22) 0%, rgba(var(--blob-sky), 0) 70%)',
          }}
        />
      </div>

      <div
        className={cn('relative w-full px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8', contentClassName)}
        style={{ maxWidth: '1320px', marginInline: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
}

type SaaSHeaderProps = {
  icon?: React.ReactNode;
  badge?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function SaaSHeader({ icon, badge, title, subtitle, actions, className }: SaaSHeaderProps) {
  return (
    <header
      style={{ paddingInline: '1.75rem', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
      className={cn(
        'sticky top-[5.25rem] z-20 mb-8 rounded-2xl border border-border/70 bg-glass px-6 py-5 shadow-soft sm:px-8',
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          {badge ? (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {icon}
              {badge}
            </div>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}

type SaaSCardProps = React.PropsWithChildren<{
  className?: string;
  contentClassName?: string;
}>;

export function SaaSCard({ className, contentClassName, children }: SaaSCardProps) {
  return (
    <section className={cn('overflow-hidden rounded-2xl border border-border/70 bg-glass shadow-soft', className)}>
      <div className={cn('p-6 sm:p-7', contentClassName)}>{children}</div>
    </section>
  );
}

type SaaSEmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
};

export function SaaSEmptyState({ icon, title, description, className }: SaaSEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/60 px-6 py-10 text-center',
        className
      )}
    >
      {icon ? <div className="mb-3 text-muted-foreground">{icon}</div> : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

type SaaSSkeletonProps = {
  className?: string;
};

export function SaaSSkeleton({ className }: SaaSSkeletonProps) {
  return <div className={cn('animate-pulse rounded-xl bg-muted/60', className)} />;
}
