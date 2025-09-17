import { Code, Palette, Wrench } from 'lucide-react';
import { SkillRadialChart } from "@/components/SkillRadialChart";

interface Skill {
  name: string;
  level: number;
  color: string;
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'programming':
      return <Code className="h-5 w-5" />;
    case 'design':
      return <Palette className="h-5 w-5" />;
    case 'tools':
      return <Wrench className="h-5 w-5" />;
    default:
      return <Code className="h-5 w-5" />;
  }
};


// Modern Skills Section with bento-box style grid
const SkillsSectionModern = () => {
  const categories = ['programming', 'design', 'tools'] as const;
  
  return (
    <div className="space-y-16">
      {categories.map((category) => {
        const categorySkills = skillsData.filter(skill => skill.category === category);
        const categoryTitle = category === 'programming' ? 'Programmazione' 
                            : category === 'design' ? 'Design' 
                            : 'Strumenti';
        
        return (
          <div key={category} className="space-y-8">
            {/* Category Header */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground">{categoryTitle}</h3>
                <p className="text-base text-muted-foreground">
                  {categorySkills.length} competenz{categorySkills.length === 1 ? 'a' : 'e'}
                </p>
              </div>
            </div>
            
            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorySkills.map((skill) => (
                <article
                  key={skill.name}
                  className="group rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
                >
                  <div className="p-5 sm:p-6 flex flex-col items-center flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-center">
                      {skill.name}
                    </h3>
                    <div className="mt-4 w-full flex-1 flex items-center justify-center">
                      <SkillRadialChart
                        skillName={skill.name}
                        percentage={skill.level}
                        color={skill.color}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsSectionModern;
