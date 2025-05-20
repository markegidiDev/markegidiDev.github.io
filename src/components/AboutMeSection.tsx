import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Book, Globe, Code } from "lucide-react";

const AboutMeSection = () => {
  return (
    <section className="py-8 animate-in fade-in slide-in-from-bottom-4">
      <Card className="transition-all duration-300 hover:shadow-md-3 hover:scale-105">
        <CardHeader className="bg-[#0C0C0D]/5 pb-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-foreground" />
            <div>
              <CardTitle className="text-2xl font-medium text-foreground">Chi sono?</CardTitle>
              <CardDescription className="text-muted-foreground">Un po' su di me e le mie passioni</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6 text-foreground leading-relaxed space-y-6">
          <div className="flex gap-4 items-start">
            <Code className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
            <p>
              Ciao! Mi chiamo Marco e ho 23 anni. Studio alla facoltà di informatica e nutro una grande passione per tutto ciò che riguarda lo sviluppo software, l'intelligenza artificiale e le nuove tecnologie.
            </p>
          </div>
          
          <div className="flex gap-4 items-start">
            <Book className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
            <p>
              Credo fermamente nella disciplina e nella costanza, principi che applico sia nel mio percorso di apprendimento tecnico che nella pratica sportiva.
            </p>
          </div>
          
          <div className="flex gap-4 items-start">
            <Globe className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
            <p>
              Amo viaggiare per conoscere nuove culture e ampliare i miei orizzonti.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AboutMeSection;
