import React from 'react';
import { StaggeredBoxReveal } from "@/components/magicui/staggered-box-reveal";

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
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem' 
    }}>      {certifications.map((cert, index) => (
        <div className="transition-all duration-300 hover:shadow-md hover:scale-105" key={cert.id}>
          <StaggeredBoxReveal
            width="100%"
            duration={0.5}
            index={index}
            boxColor="#0C0C0D"
          >            <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="text-lg font-medium text-foreground">{cert.name}</div>
            </div>            <div className="wb-card-content flex-1 flex flex-col space-y-3 p-6">
              <div className="text-sm text-muted-foreground">{cert.organization}</div>
              <div className="text-xs text-muted-foreground">
                Emesso: {cert.date}{cert.expirationDate && <span> · Scade: {cert.expirationDate}</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {cert.skills.map((skill, idx) => (
                  <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">{skill}</span>
                ))}
              </div>            </div>
            </div>
          </StaggeredBoxReveal>
        </div>
      ))}
    </div>
  );
};

export default CertificationsSectionAlt;
