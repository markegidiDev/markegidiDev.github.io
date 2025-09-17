import { Calendar, Building2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { experiences } from "@/components/experiences"

type Tech = string

// Optional mapping from experience id to image and tech stack
const showcase: Record<number, { image?: string; tech?: Tech[]; link?: string }> = {
  1: {
    image: "/vite.svg", // placeholder
    tech: ["Windows", "Networking", "Hardware", "Support"],
  },
  2: {
    image: "/vite.svg",
    tech: ["PC Assembly", "Office", "Adobe", "Security Basics"],
  },
  3: {
    image: "/vite.svg",
    tech: ["Customer Care", "Teamwork", "Service"],
  },
  4: {
    image: "/vite.svg",
    tech: ["Safety", "Operations", "Access Mgmt"],
  },
}

export default function ExperienceCardsMagic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {experiences.map((exp) => {
        const meta = showcase[exp.id]
  const [first] = exp.description
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)

        return (
          <article
            key={exp.id}
            className="group rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Media header */}
            <div className="relative h-40 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {meta?.image ? (
                <img
                  src={meta.image}
                  alt="cover"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{exp.title}</h3>
              <div className="mt-1 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {exp.company}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {exp.duration}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-card-foreground/90">
                {first}
              </p>

              {/* Tech/skill badges */}
              {meta?.tech?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {meta.tech.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] !px-6 !py-2">
                      {t}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] !px-6 !py-2">
                  {exp.type}
                </Badge>
                {meta?.link ? (
                  <Button asChild size="sm" variant="default" className="bg-foreground text-background hover:bg-foreground/90">
                    <a href={meta.link} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Website
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <ExternalLink className="mr-2 h-4 w-4" /> Website
                  </Button>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
