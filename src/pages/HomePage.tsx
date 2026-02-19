import AboutMeSectionAlt from "@/components/AboutMeSectionAlt";
import ExperienceCardsMagic from "@/components/ExperienceCardsMagic";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSectionModern from "@/components/SkillsSectionModern";
import CertificationsSectionModern from "@/components/CertificationsSectionModern";
import ContactDock from "../components/ContactDock";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { LightRays } from "@/registry/magicui/light-rays";

const centerWrapStyle = { maxWidth: "1320px", marginInline: "auto" } as const;

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <LightRays className="fixed inset-0 z-0 pointer-events-none" />
      <div className="relative z-10 w-full px-6 py-12" style={centerWrapStyle}>
        {/* Hero section - with animations */}
        <div className="mb-24 flex min-h-[40vh] w-full flex-col items-center justify-center text-center">
          {/* Style 1: Name - Gradient & Massive */}
          <TypingAnimation 
            startOnView={true} 
            className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 drop-shadow-2xl"
          >
            Marco Egidi
          </TypingAnimation>

          {/* Style 2: Title - Clean & Primary Color */}
          <TextAnimate 
            animation="blurInUp" 
            by="word" 
            delay={1.5} 
            className="mt-8 text-xl sm:text-2xl md:text-4xl font-light tracking-wide text-primary"
          >
            Full Stack Developer & AI Enthusiast
          </TextAnimate>

          {/* Style 3: Subtitle - Monospace Pill */}
          <TextAnimate 
            animation="fadeIn" 
            by="word" 
            delay={2.2} 
            className="mt-6 inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm sm:text-base font-mono text-muted-foreground/90"
          >
            Studente di Informatica presso UniPD
          </TextAnimate>
        </div>

        {/* Main Content */}
        <div className="w-full space-y-24">
          <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />
          
          {/* About Me Section */}
          <BlurFade delay={0.2} inView>
            <section id="about-me" className="scroll-mt-20">
              <div className="w-full mx-auto text-center flex flex-col items-center gap-4 mb-12">
                <TextAnimate animation="blurInUp" by="character" className="text-3xl sm:text-4xl font-bold text-foreground">
                  Chi sono
                </TextAnimate>
                <Separator className="w-24 h-0.5 bg-primary/30" />
                <TextAnimate animation="fadeIn" by="word" delay={0.3} className="text-muted-foreground">
                  Scopri di più sulla mia passione per lo sviluppo web e il mio percorso di studi
                </TextAnimate>
              </div>
              <div className="max-w-6xl mx-auto">
                <AboutMeSectionAlt />
              </div>
            </section>
          </BlurFade>

          <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

          {/* Experience Section */}
          <BlurFade delay={0.4} inView>
            <section id="experience" className="scroll-mt-20">
              <div className="w-full mx-auto text-center flex flex-col items-center gap-4 mb-12">
                <TextAnimate animation="blurInUp" by="character" className="text-3xl sm:text-4xl font-bold text-foreground">
                  Esperienza
                </TextAnimate>
                <Separator className="w-24 h-0.5 bg-primary/30" />
                <TextAnimate animation="fadeIn" by="word" delay={0.3} className="text-muted-foreground">
                  Le esperienze lavorative che hanno formato le mie competenze professionali
                </TextAnimate>
              </div>
              <div className="max-w-6xl mx-auto">
                <ExperienceCardsMagic />
              </div>
            </section>
          </BlurFade>

          <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

          {/* Projects Section */}
          <BlurFade delay={0.5} inView>
            <section id="projects" className="scroll-mt-20">
              <div className="w-full mx-auto text-center flex flex-col items-center gap-4 mb-12">
                <TextAnimate animation="blurInUp" by="character" className="text-3xl sm:text-4xl font-bold text-foreground">
                  Progetti
                </TextAnimate>
                <Separator className="w-24 h-0.5 bg-primary/30" />
                <TextAnimate animation="fadeIn" by="word" delay={0.3} className="text-muted-foreground">
                  Alcuni dei progetti open source e accademici a cui ho lavorato
                </TextAnimate>
              </div>
              <div className="max-w-6xl mx-auto">
                <ProjectsSection />
              </div>
            </section>
          </BlurFade>

          <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

          {/* Skills Section */}
          <BlurFade delay={0.6} inView>
            <section id="skills" className="scroll-mt-20">
              <div className="flex flex-col items-center gap-4 mb-12 w-full mx-auto text-center">
                <TextAnimate animation="blurInUp" by="character" className="text-3xl sm:text-4xl font-bold text-foreground">
                  Competenze
                </TextAnimate>
                <Separator className="w-24 h-0.5 bg-primary/30" />
                <TextAnimate animation="fadeIn" by="word" delay={0.3} className="text-muted-foreground">
                  Le tecnologie e strumenti che utilizzo per creare esperienze digitali
                </TextAnimate>
              </div>
              <div className="max-w-6xl mx-auto">
                <SkillsSectionModern />
              </div>
            </section>
          </BlurFade>

          <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

          {/* Certifications Section */}
          <BlurFade delay={0.8} inView>
            <section id="certifications" className="scroll-mt-20">
              <div className="flex flex-col items-center gap-4 mb-12 w-full mx-auto text-center">
                <TextAnimate animation="blurInUp" by="character" className="text-3xl sm:text-4xl font-bold text-foreground">
                  Certificazioni
                </TextAnimate>
                <Separator className="w-24 h-0.5 bg-primary/30" />
                <TextAnimate animation="fadeIn" by="word" delay={0.3} className="text-muted-foreground">
                  I corsi e le certificazioni che attestano le mie competenze tecniche
                </TextAnimate>
              </div>
              <div className="max-w-5xl mx-auto">
                <CertificationsSectionModern />
              </div>
            </section>
          </BlurFade>

          <Separator className="w-full max-w-2xl mx-auto h-px bg-border/50" />

          {/* Contact Section - Dock */}
          <BlurFade delay={1.0} inView>
            <section id="contact" className="scroll-mt-20">
              <div className="w-full mx-auto text-center flex flex-col items-center gap-4 mb-8">
                <TextAnimate animation="blurInUp" by="character" className="text-3xl sm:text-4xl font-bold text-foreground">
                  Contatti
                </TextAnimate>
                <Separator className="w-24 h-0.5 bg-primary/30" />
                <TextAnimate animation="fadeIn" by="word" delay={0.3} className="text-muted-foreground">
                  Seguimi o scrivimi su questi canali
                </TextAnimate>
              </div>
              <div className="w-full flex justify-center">
                <ContactDock />
              </div>
            </section>
          </BlurFade>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
