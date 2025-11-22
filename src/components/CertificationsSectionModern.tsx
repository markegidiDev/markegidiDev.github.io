import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Award, ExternalLink, Building2 } from 'lucide-react';

interface Certification {
  id: number;
  name: string;
  organization: string;
  date: string;
  expirationDate?: string;
  skills: string[];
  type: string;
  link?: string;
}

const certifications: Certification[] = [
  {
    id: 1,
    name: "AWS Intro to Cost Management for SaaS",
    organization: "Amazon Web Services (AWS)",
    date: "May 2025",
    expirationDate: undefined,
    skills: ["AWS", "SaaS", "Cost Management", "Budgeting"],
    type: "Cloud Certification"
  },
  {
    id: 2,
    name: "Reply Hack the Code Challenge",
    organization: "Reply",
    date: "Mar 2025",
    expirationDate: undefined,
    skills: ["Cybersecurity", "Cryptography", "Problem Solving", "Teamwork"],
    type: "Hackathon / Competition",
    link: "https://challenges.reply.com/"
  },
  {
    id: 3,
    name: "Microsoft Azure Fundamentals",
    organization: "Microsoft",
    date: "August 2023",
    expirationDate: undefined,
    skills: ["Cloud Computing", "Azure", "Infrastructure as Service", "Platform as Service"],
    type: "Cloud Certification",
    link: "https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/"
  },
  {
    id: 4,
    name: "CCNA: Introduction to Networks",
    organization: "Cisco",
    date: "May 2022",
    expirationDate: "May 2025",
    skills: ["Networking", "TCP/IP", "Routing", "Switching"],
    type: "Network Certification"
  }
];

const CertificationsSectionModern: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {certifications.map((cert) => {
        return (
          <article
            key={cert.id}
            className="group rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Media header */}
            <div className="relative h-40 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-full w-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Award className="h-16 w-16 text-primary/60" />
              </div>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight">{cert.name}</h3>
              <div className="mt-1 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {cert.organization}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {cert.date}
                  </span>
                </div>
                {cert.expirationDate && (
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs !px-6 !py-2">
                      Scade: {cert.expirationDate}
                    </Badge>
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-card-foreground/90">
                Competenze acquisite in {cert.skills.slice(0, 2).join(", ")}{cert.skills.length > 2 ? "..." : ""}
              </p>

              {/* Skills badges */}
              {cert.skills?.length ? (
                <div className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                  {cert.skills.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-[10px] !px-6 !py-2 whitespace-nowrap"
                      title={skill}
                    >
                      {skill}
                    </Badge>
                  ))}
                  {cert.skills.length > 4 && (
                    <Badge variant="outline" className="text-[10px] !px-6 !py-2 whitespace-nowrap">
                      +{cert.skills.length - 4}
                    </Badge>
                  )}
                </div>
              ) : null}

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] !px-6 !py-2">
                  {cert.type}
                </Badge>
                {cert.link ? (
                  <Button asChild size="sm" variant="default" className="bg-foreground text-background hover:bg-foreground/90">
                    <a href={cert.link} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Certificato
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" disabled>
                    <ExternalLink className="mr-2 h-4 w-4" /> Certificato
                  </Button>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  );
};

export default CertificationsSectionModern;
