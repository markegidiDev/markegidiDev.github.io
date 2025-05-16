import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl bg-[#F7F7F7]">
      <Card className="border rounded-lg overflow-hidden bg-white shadow-md">
        <CardHeader className="bg-[#0C0C0D]/5 pb-6">
          <CardTitle className="text-2xl font-medium text-[#0C0C0D] text-center">Contattami</CardTitle>
          <CardDescription className="text-center text-[#6B6B6B]">
            Compila il form sottostante per inviarmi un messaggio
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#0C0C0D] mb-1">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="w-full border border-[#E5E5E5] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0C0C0D] focus:border-transparent" 
                placeholder="Mario Rossi" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0C0C0D] mb-1">Indirizzo Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full border border-[#E5E5E5] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0C0C0D] focus:border-transparent" 
                placeholder="tu@esempio.com" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#0C0C0D] mb-1">Messaggio</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                className="w-full border border-[#E5E5E5] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#0C0C0D] focus:border-transparent" 
                placeholder="Scrivi il tuo messaggio..." 
              />
            </div>
            <div>
              <Button 
                type="submit" 
                className="w-full bg-[#0C0C0D] text-white hover:bg-[#0C0C0D]/90 flex items-center justify-center gap-2"
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
