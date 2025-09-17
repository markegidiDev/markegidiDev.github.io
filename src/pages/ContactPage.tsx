import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl bg-background">
      <Card className="border border-border rounded-lg overflow-hidden bg-card shadow-md">
        <CardHeader className="bg-accent/10 pb-6">
          <CardTitle className="text-2xl font-medium text-card-foreground text-center">Contattami</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Compila il form sottostante per inviarmi un messaggio
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                placeholder="Mario Rossi" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">Indirizzo Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                placeholder="tu@esempio.com" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-1">Messaggio</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                className="w-full border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" 
                placeholder="Scrivi il tuo messaggio..." 
              />
            </div>
            <div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Invia Messaggio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
