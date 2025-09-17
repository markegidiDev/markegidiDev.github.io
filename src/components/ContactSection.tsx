import React from 'react';
import { Mail, Github, Linkedin, FileUser, ExternalLink } from 'lucide-react';

const ContactSection: React.FC = () => {
  const contactLinks = [
    {
      label: "Email",
      value: "marco.egidi.dev@gmail.com",
      href: "mailto:marco.egidi.dev@gmail.com",
      icon: Mail,
      color: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
    },
    {
      label: "GitHub",
      value: "github.com/markegidiDev",
      href: "https://github.com/markegidiDev",
      icon: Github,
      color: "bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20"
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/marco-egidi",
      href: "https://linkedin.com/in/marco-egidi",
      icon: Linkedin,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20"
    },
    {
      label: "CV",
      value: "Scarica il mio CV",
      href: "/cv-marco-egidi.pdf",
      icon: FileUser,
      color: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
    }
  ];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
      <div className="p-8 sm:p-10 lg:p-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-card-foreground mb-4">
            Mettiamoci in contatto
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sono sempre interessato a nuove opportunità e collaborazioni. 
            Non esitare a contattarmi per discutere di progetti o semplicemente per dire ciao!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactLinks.map((link, index) => {
            const IconComponent = link.icon;
            
            return (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group"
              >
                <div className={`
                  p-5 sm:p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer
                  ${link.color}
                  group-hover:scale-105 group-hover:shadow-lg
                `}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-current/10">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-current mb-1">
                        {link.label}
                      </h4>
                      <p className="text-sm opacity-80 truncate">
                        {link.value}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <ExternalLink className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-muted/30 rounded-full border border-border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Disponibile per nuove opportunità
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
