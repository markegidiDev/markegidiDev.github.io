import { BarChart2, Code, PanelTop } from "lucide-react";
import { SkillRadialChart } from "@/components/SkillRadialChart";

interface Skill {
  name: string;
  level: number; // Percentuale da 0 a 100
  color: string; // Colore per il grafico radiale
  category: "programming" | "design" | "tools";
}

const skillsData: Skill[] = [
  { name: "C++", level: 70, color: "hsl(var(--chart-1))", category: "programming" },
  { name: "Python", level: 50, color: "hsl(var(--chart-2))", category: "programming" },
  { name: "JavaScript/TypeScript", level: 20, color: "hsl(var(--chart-3))", category: "programming" },
  { name: "React", level: 20, color: "hsl(var(--chart-4))", category: "programming" },
  { name: "Premiere Pro", level: 90, color: "hsl(var(--chart-5))", category: "design" },
  { name: "Lightroom", level: 80, color: "hsl(var(--primary))", category: "design" },
  { name: "AWS", level: 15, color: "hsl(var(--chart-1))", category: "tools" },
  { name: "Notion", level: 70, color: "hsl(var(--foreground))", category: "tools" },
];

const SkillsSection = () => {
  return (
    <section className="py-8">
      <div className="mb-8">
        <div className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="p-6 bg-muted/50">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-medium text-foreground">Competenze tecniche</h2>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Di seguito sono riportate le mie competenze in diverse aree tecniche.
              Sono sempre in fase di apprendimento e miglioramento continuo.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Programming Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Linguaggi di programmazione</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData
              .filter(skill => skill.category === "programming")
              .map((skill) => (
                <div key={skill.name} className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <SkillRadialChart
                    skillName={skill.name}
                    percentage={skill.level}
                    color={skill.color}
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData
              .filter(skill => skill.category === "design")
              .map((skill) => (
                <div key={skill.name} className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <SkillRadialChart
                    skillName={skill.name}
                    percentage={skill.level}
                    color={skill.color}
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsData
              .filter(skill => skill.category === "tools")
              .map((skill) => (
                <div key={skill.name} className="bg-card text-card-foreground rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <SkillRadialChart
                    skillName={skill.name}
                    percentage={skill.level}
                    color={skill.color}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
