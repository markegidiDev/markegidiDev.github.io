import ExperienceCardsMagic from "@/components/ExperienceCardsMagic"
import SkillsSectionModern from "@/components/SkillsSectionModern"
import CertificationsSectionModern from "@/components/CertificationsSectionModern"
import { Separator } from "@/components/ui/separator"

const centerWrapStyle = { maxWidth: "1320px", marginInline: "auto" } as const;

export default function PortfolioHome() {
  return (
    <div className="w-full px-6 py-12" style={centerWrapStyle}>
      {/* Hero replaced by existing hero in Home if needed */}

      <div className="space-y-24">
        <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

        <section id="experience" className="scroll-mt-20">
          <div className="flex flex-col items-center gap-4 mb-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Esperienza</h2>
            <Separator className="w-24 h-0.5 bg-primary/30" />
            <p className="text-muted-foreground max-w-2xl">
              Le esperienze lavorative che hanno formato le mie competenze professionali
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <ExperienceCardsMagic />
          </div>
        </section>

        <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

        <section id="skills" className="scroll-mt-20">
          <div className="flex flex-col items-center gap-4 mb-12 max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Competenze</h2>
            <Separator className="w-24 h-0.5 bg-primary/30" />
            <p className="text-muted-foreground max-w-2xl">
              Le tecnologie e strumenti che utilizzo per creare esperienze digitali
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <SkillsSectionModern />
          </div>
        </section>

        <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

        <section id="certifications" className="scroll-mt-20">
          <div className="flex flex-col items-center gap-4 mb-12 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Certificazioni</h2>
            <Separator className="w-24 h-0.5 bg-primary/30" />
            <p className="text-muted-foreground max-w-2xl">
              I corsi e le certificazioni che attestano le mie competenze tecniche
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <CertificationsSectionModern />
          </div>
        </section>
      </div>
    </div>
  )
}
