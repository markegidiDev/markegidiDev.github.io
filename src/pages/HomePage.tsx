import AboutMeSectionAlt from "@/components/AboutMeSectionAlt";
import ExperienceSectionAlt from "@/components/ExperienceSectionAlt";
import SkillsSectionAlt from "@/components/SkillsSectionAlt";
import CertificationsSectionAlt from "@/components/CertificationsSectionAlt";
import { TextAnimate } from "@/components/magicui/text-animate";
import { TextAnimateEnhanced } from "@/registry/magicui/text-animate-enhanced";
import { AuroraText } from "@/registry/magicui/aurora-text";


const HomePage = () => {  return (
    <div className="animate-fade-in transition-opacity duration-700"
      style={{
        backgroundColor: "#F7F7F7",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "3rem 1rem",
        display: "block",
        visibility: "visible",
        opacity: 1
      }}>
      {/* Hero section */}
      <div
        style={{
          backgroundColor: "white",
          maxWidth: "56rem",
          margin: "0 auto 4rem auto",
          padding: "4rem 1.5rem",
          textAlign: "center",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          display: "block",
          visibility: "visible",
          opacity: 1
        }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            marginBottom: "1.5rem",
            color: "#0C0C0D",
            display: "block",
            visibility: "visible",
            opacity: 1
          }}>
          Marco Egidi
        </h1>
        <div style={{
          height: "0.25rem",
          width: "6rem",
          backgroundColor: "#0C0C0D",
          margin: "0 auto 1.5rem auto",
          borderRadius: "9999px"
        }}></div>        <div
          style={{
            fontSize: "1.5rem",
            color: "#6B6B6B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem"
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <TextAnimate 
              animation="blurInUp" 
              by="word" 
              once={true}
              delay={0.3}
            >
              Sviluppatore web e studente di
            </TextAnimate>
          </div>
          <div className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
            <TextAnimateEnhanced 
              animation="blurInUp" 
              delay={0.6}
            >
              <AuroraText>Informatica</AuroraText>
            </TextAnimateEnhanced>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4rem"
      }}>        {/* About Me Section */}
        <section id="about-me" style={{scrollMarginTop: "5rem", marginBottom: "4rem"}}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem"
          }}>
            <h2 style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#0C0C0D"
            }}>Chi sono</h2>
          </div>
          <AboutMeSectionAlt />
        </section>     
      
           {/* Experience Section */}
        <section id="experience" style={{scrollMarginTop: "5rem", marginBottom: "4rem"}}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem"
          }}>
            <h2 style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#0C0C0D"
            }}>Esperienza</h2>
            <div style={{
              marginLeft: "auto",
              fontSize: "0.875rem",
              color: "#6B6B6B"
            }}>Esperienze lavorative rilevanti</div>
          </div>
          <ExperienceSectionAlt />
        </section>{/* Skills Section */}
        <section id="skills" style={{scrollMarginTop: "5rem", marginBottom: "4rem"}}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem"
          }}>
            <h2 style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#0C0C0D"
            }}>Competenze</h2>
          </div>
          <SkillsSectionAlt />
        </section>       {/* Certifications Section */}
        <section id="certifications" style={{scrollMarginTop: "5rem", marginBottom: "4rem"}}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem"
          }}>
            <h2 style={{
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "#0C0C0D"
            }}>Certificazioni</h2>
          </div>
          <CertificationsSectionAlt />
        </section>
      </div>
    </div>
    
  );
};

export default HomePage;
