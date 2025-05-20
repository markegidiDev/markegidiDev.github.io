import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm transition-all focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border/50 bg-background hover:bg-muted/50",
        // Material You elevation style badges
        elevated: "border-transparent bg-background shadow-md hover:shadow-lg transition-shadow",
        // Material You tonal badges
        tonal: "border-transparent bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25",
        // Material You branded accent colors
        purple: "border-transparent bg-[rgb(var(--md-accent-purple-rgb))] text-white dark:bg-[rgb(var(--md-accent-purple-rgb))] dark:text-white",
        teal: "border-transparent bg-[rgb(var(--md-accent-teal-rgb))] text-white dark:bg-[rgb(var(--md-accent-teal-rgb))] dark:text-white",
        green: "border-transparent bg-[rgb(var(--md-accent-green-rgb))] text-white dark:bg-[rgb(var(--md-accent-green-rgb))] dark:text-white",
        amber: "border-transparent bg-[rgb(var(--md-accent-amber-rgb))] text-black dark:bg-[rgb(var(--md-accent-amber-rgb))] dark:text-black",
      },
      size: {
        default: "h-6 text-xs",
        sm: "h-5 text-[10px]",
        lg: "h-7 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
