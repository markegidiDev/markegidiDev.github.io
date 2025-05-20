import { BarChart2, Code, PanelTop } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="py-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-8">
        <Card className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md-3 hover:scale-105">
          <CardHeader className="bg-[#0C0C0D]/5 pb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-foreground" />
              <CardTitle className="text-xl font-medium text-foreground">Competenze tecniche</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground mt-2">
              Di seguito sono riportate le mie competenze in diverse aree tecniche.
              Sono sempre in fase di apprendimento e miglioramento continuo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-12">
        {/* Programming Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Linguaggi di programmazione</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {skillsData
              .filter(skill => skill.category === "programming")
              .map((skill) => (
                <Card
                  key={skill.name}
                  className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md-3 hover:scale-105"
                >
                  <CardHeader className="pb-3 border-b-0 bg-[#0C0C0D]/5">
                    <CardTitle className="text-lg text-[#0C0C0D] flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      {skill.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-[#6B6B6B]">
                      Livello di competenza: <span className="font-medium">{skill.level}%</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ 
                          width: `${skill.level}%`, 
                          backgroundColor: skill.color 
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Design Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PanelTop className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Design e Multimedia</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {skillsData
              .filter(skill => skill.category === "design")
              .map((skill) => (
                <Card
                  key={skill.name}
                  className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md-3 hover:scale-105"
                >
                  <CardHeader className="pb-3 border-b-0 bg-[#0C0C0D]/5">
                    <CardTitle className="text-lg text-[#0C0C0D] flex items-center gap-2">
                      <PanelTop className="h-4 w-4" />
                      {skill.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-[#6B6B6B]">
                      Livello di competenza: <span className="font-medium">{skill.level}%</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ 
                          width: `${skill.level}%`, 
                          backgroundColor: skill.color 
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Tools Skills */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-medium text-foreground">Strumenti</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {skillsData
              .filter(skill => skill.category === "tools")
              .map((skill) => (
                <Card
                  key={skill.name}
                  className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md-3 hover:scale-105"
                >
                  <CardHeader className="pb-3 border-b-0 bg-[#0C0C0D]/5">
                    <CardTitle className="text-lg text-[#0C0C0D] flex items-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      {skill.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-[#6B6B6B]">
                      Livello di competenza: <span className="font-medium">{skill.level}%</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{ 
                          width: `${skill.level}%`, 
                          backgroundColor: skill.color 
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
