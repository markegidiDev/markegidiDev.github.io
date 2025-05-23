import { BarChart2, Code, PanelTop } from "lucide-react";
import { StaggeredBoxReveal } from "@/components/magicui/staggered-box-reveal";
import { SkillRadialChart } from "@/components/SkillRadialChart";

interface Skill {
  name: string;
  level: number; // Percentuale da 0 a 100
  color: string; // Colore per il grafico radiale
  category: "programming" | "design" | "tools";
}

const skillsData: Skill[] = [
  { name: "C++", level: 70, color: "#1d4ed8", category: "programming" },
  { name: "Python", level: 50, color: "#14b8a6", category: "programming" },
  { name: "JavaScript/TypeScript", level: 20, color: "#fde68a", category: "programming" },
  { name: "React", level: 20, color: "#5eead4", category: "programming" },
  { name: "Premiere Pro", level: 90, color: "#4f46e5", category: "design" },
  { name: "Lightroom", level: 80, color: "#4f46e5", category: "design" },
  { name: "AWS", level: 15, color: "#f97316", category: "tools" },
  { name: "Notion", level: 70, color: "#0C0C0D", category: "tools" },
];

const SkillsSection = () => {
  return (
    <section className="py-8">      <div className="mb-8">
        <div className="transition-all duration-300 hover:shadow-md hover:scale-105">
          <StaggeredBoxReveal
            width="100%"
            duration={0.5}
            index={0}
            boxColor="#0C0C0D"
          >
            <div className="flex flex-col" style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #E5E5E5"
            }}>
            <div style={{
              padding: "1.5rem",
              backgroundColor: "rgba(12, 12, 13, 0.05)"
            }}>
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-foreground" />
                <h2 className="text-xl font-medium text-foreground">Competenze tecniche</h2>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Di seguito sono riportate le mie competenze in diverse aree tecniche.
                Sono sempre in fase di apprendimento e miglioramento continuo.
              </div>            </div>
            </div>
          </StaggeredBoxReveal>
        </div>
      </div>

      <div className="space-y-12">
        {/* Programming Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Linguaggi di programmazione</h3>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem' 
          }}>
            {skillsData              .filter(skill => skill.category === "programming")
              .map((skill, index) => (                <div className="transition-all duration-300 hover:shadow-md hover:scale-105">
                  <StaggeredBoxReveal
                    key={skill.name}
                    width="100%"
                    duration={0.5}
                    index={index + 1}
                    boxColor="#0C0C0D"
                  >
                    <div className="flex flex-col h-full" style={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid #E5E5E5"
                    }}>
                      <SkillRadialChart
                        skillName={skill.name}
                        percentage={skill.level}
                        color={skill.color}
                        description={`Livello di competenza: ${skill.level}%`}
                        size={180}
                      />
                    </div>
                  </StaggeredBoxReveal>
                </div>
              ))}
          </div>
        </div>

        {/* Design Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PanelTop className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Design e Multimedia</h3>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem' 
          }}>
            {skillsData              .filter(skill => skill.category === "design")
              .map((skill, index) => (                <div className="transition-all duration-300 hover:shadow-md hover:scale-105">
                  <StaggeredBoxReveal
                    key={skill.name}
                    width="100%"
                    duration={0.5}
                    index={index + 5} // Offset for staggered animation
                    boxColor="#0C0C0D"
                  >
                    <div className="flex flex-col h-full" style={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid #E5E5E5"
                    }}>
                      <SkillRadialChart
                        skillName={skill.name}
                        percentage={skill.level}
                        color={skill.color}
                        description={`Livello di competenza: ${skill.level}%`}
                        size={180}
                      />
                    </div>
                  </StaggeredBoxReveal>
                </div>
              ))}
          </div>
        </div>

        {/* Tools Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Strumenti</h3>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem' 
          }}>
            {skillsData              .filter(skill => skill.category === "tools")
              .map((skill, index) => (                <div className="transition-all duration-300 hover:shadow-md hover:scale-105">
                  <StaggeredBoxReveal
                    key={skill.name}
                    width="100%"
                    duration={0.5}
                    index={index + 7} // Offset for staggered animation
                    boxColor="#0C0C0D"
                  >
                    <div className="flex flex-col h-full" style={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid #E5E5E5"
                    }}>
                      <SkillRadialChart
                        skillName={skill.name}
                        percentage={skill.level}
                        color={skill.color}
                        description={`Livello di competenza: ${skill.level}%`}
                        size={180}
                      />
                    </div>
                  </StaggeredBoxReveal>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
