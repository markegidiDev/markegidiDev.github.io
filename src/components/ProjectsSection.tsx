import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, FolderGit2 } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  tech: string[];
  link: string;
  role?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Real-Time Crypto Social Trading",
    description: "Estensione Chrome (MV3) per il social trading di criptovalute. Integra analisi real-time, WebSocket e metriche 'fresh' per ottimizzare le decisioni di trading, risolvendo l'information overload.",
    tech: ["Chrome MV3", "React", "WebSocket", "Data Analytics", "Performance Optimization"],
    link: "https://github.com/markegidiDev/pulse-buddy",
    role: "Creator"
  },
  {
    id: 2,
    name: "Workflow Automation Cloud System",
    description: "Piattaforma cloud-native per automatizzare workflow digitali tramite AI Generativa (Amazon Bedrock). Progetto universitario con Var Group S.p.A. (Partner AWS).",
    tech: ["React", "Python Flask", "AWS (EC2, Cognito)", "Docker", "GenAI (Llama 3, DeepSeek)"],
    link: "https://github.com/Sigma18Unipd/docs",
    role: "Full Stack Developer"
  },
  {
    id: 3,
    name: "AI LiveBot (Odoo Assistant)",
    description: "Agente conversazionale per Odoo 18 che automatizza i flussi di magazzino usando il linguaggio naturale. Integra LLM Function Calling per eseguire query sicure e gestire ordini.",
    tech: ["Python", "Odoo 18", "LangChain", "PostgreSQL", "AI"],
    link: "https://github.com/markegidiDev/ERP-ChatBot-LLM",
    role: "Creator"
  }
];

const ProjectsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => {
        return (
          <article
            key={project.id}
            className="group rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
          >
            {/* Header Image Placeholder or Icon */}
            <div className="relative h-32 w-full overflow-hidden bg-muted/30 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
               <FolderGit2 className="h-12 w-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight leading-tight">{project.name}</h3>
              </div>
              
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
                {project.description}
              </p>

              {/* Tech badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="text-[10px] !px-6 !py-2"
                  >
                    {t}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                 <span className="text-xs text-muted-foreground font-medium">
                    {project.role}
                 </span>
                 <Button asChild size="sm" variant="outline" className="gap-2">
                    <a href={project.link} target="_blank" rel="noreferrer">
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </a>
                 </Button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  );
};

export default ProjectsSection;
