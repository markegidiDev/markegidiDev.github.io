import React from 'react';

interface Certification {
  id: number;
  name: string;
  organization: string;
  date: string;
  expirationDate?: string;
  skills: string[];
}

const certifications: Certification[] = [
  {
    id: 1,
    name: "Microsoft Azure Fundamentals",
    organization: "Microsoft",
    date: "August 2023",
    expirationDate: undefined,
    skills: ["Cloud Computing", "Azure", "Infrastructure as Service", "Platform as Service"]
  },
  {
    id: 2,
    name: "CCNA: Introduction to Networks",
    organization: "Cisco",
    date: "May 2022",
    expirationDate: "May 2025",
    skills: ["Networking", "TCP/IP", "Routing", "Switching"]
  },
  {
    id: 3,
    name: "JavaScript Algorithms and Data Structures",
    organization: "freeCodeCamp",
    date: "Jan 2022",
    expirationDate: undefined,
    skills: ["JavaScript", "Algorithms", "Data Structures", "Problem Solving"]
  },
  {
    id: 4,
    name: "Web Development with React",
    organization: "Coursera",
    date: "October 2021",
    expirationDate: undefined,
    skills: ["React", "Redux", "Hooks", "Modern JavaScript"]
  }
];

const CertificationsSectionAlt: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certifications.map((cert) => (
        <div key={cert.id} className="transition-colors duration-200 hover:shadow-md group">
          <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-accent/5">
              <div className="text-lg font-medium text-card-foreground">{cert.name}</div>
            </div>
            <div className="flex-1 flex flex-col space-y-3 p-6">
              <div className="text-sm text-muted-foreground">{cert.organization}</div>
              <div className="text-xs text-muted-foreground">
                Emesso: {cert.date}{cert.expirationDate && <span> · Scade: {cert.expirationDate}</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {cert.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-accent px-2 py-1 rounded text-accent-foreground">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CertificationsSectionAlt;
