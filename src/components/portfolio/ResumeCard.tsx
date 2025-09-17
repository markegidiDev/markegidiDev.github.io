import { Calendar, Building2, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ResumeCardProps = {
  title: string
  org: string
  period: string
  location?: string
  summary?: string
  chips?: string[]
  className?: string
}

export function ResumeCard({ title, org, period, location, summary, chips = [], className }: ResumeCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-shadow overflow-hidden",
        className
      )}
    >
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h3>
        <div className="mt-1 text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-4 w-4" /> {org}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {period}
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {location}
            </span>
          ) : null}
        </div>

        {summary ? (
          <p className="mt-3 text-sm leading-relaxed text-card-foreground/90">{summary}</p>
        ) : null}

        {chips.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <Badge key={c} variant="secondary" className="text-[10px] !px-6 !py-2">
                {c}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
