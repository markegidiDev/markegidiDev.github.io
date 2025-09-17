import AboutMeSectionAlt from "@/components/AboutMeSectionAlt";
import ExperienceCardsMagic from "@/components/ExperienceCardsMagic";
import SkillsSectionModern from "@/components/SkillsSectionModern";
import CertificationsSectionModern from "@/components/CertificationsSectionModern";
import ContactDock from "../components/ContactDock";
import { Separator } from "@/components/ui/separator";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TypingAnimation } from "@/components/magicui/typing-animation";


const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full mx-auto px-6 py-12">
        {/* Hero section - with animations */}
        <div className="w-full mx-auto mb-16 text-center">
          <TypingAnimation startOnView={true} className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Marco Egidi
          </TypingAnimation>
          <TextAnimate animation="blurInUp" by="word" delay={1.5} className="mt-3 text-base sm:text-lg md:text-xl text-muted-foreground">
            Sviluppatore Web Frontend
          </TextAnimate>
          <TextAnimate animation="fadeIn" by="word" delay={2.2} className="mt-1 text-sm sm:text-base text-muted-foreground/80">
            Studente di Informatica presso UniPD
          </TextAnimate>
        </div>

        {/* Main Content */}
        <div className="space-y-24 w-full mx-auto">
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
