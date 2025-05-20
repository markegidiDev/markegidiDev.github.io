import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  badgeColor?: string;
}

const certifications: Certification[] = [
  {
    id: 1,
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "Issued: Oct 2023",
    description: "Validated foundational understanding of AWS Cloud concepts, services, and terminology.",
    badgeColor: "bg-amber-500"
  },
  {
    id: 2,
    title: "React Nanodegree",
    issuer: "Udacity",
    date: "Issued: Jan 2023",
    description: "Completed an intensive program focused on React, Redux, and React Native, building several hands-on projects.",
    badgeColor: "bg-blue-500"
  },
  {
    id: 3,
    title: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    date: "Issued: May 2022",
    description: "Mastered fundamental data structures and algorithms in JavaScript through project-based learning.",
    badgeColor: "bg-green-500"
  }
];

const CertificationsSection = () => {
  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-4">
      {certifications.map((cert) => (
        <Card
          key={cert.id}
          className="transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md-3 hover:scale-105"
        >
          <CardHeader className="bg-[#0C0C0D]/5 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-[#0C0C0D]" />
              <Badge
                variant="outline"
                className="w-fit bg-foreground/10 border-foreground/20 text-foreground"
              >
                Certificazione
              </Badge>
            </div>
            <CardTitle className="text-xl font-medium text-foreground">{cert.title}</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">{cert.issuer}</CardDescription>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-muted-foreground">{cert.date}</span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-4">
            <p className="text-foreground leading-relaxed">{cert.description}</p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-border mt-4 text-foreground hover:text-foreground/70 cursor-pointer transition-colors">
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium text-foreground">Visualizza credenziale</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CertificationsSection;
