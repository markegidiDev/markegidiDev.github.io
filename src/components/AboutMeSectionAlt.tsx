import React from 'react';

const AboutMeSectionAlt: React.FC = () => {
  return (
    <div className="wb-card transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:shadow-md-3 hover:scale-105" style={{
      backgroundColor: "white",
      borderRadius: "0.5rem",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      border: "1px solid #E5E5E5"
    }}>
      
      
      <div className="wb-card-content" style={{
        padding: "1.5rem",
      }}>
        <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
          Sono Marco Egidi, un appassionato sviluppatore web con una forte propensione verso le tecnologie frontend. 
          Attualmente frequento il corso di Informatica presso l'Università di Padova, dove sto approfondendo le mie 
          competenze tecniche e teoriche nel campo dell'informatica.
        </p>
        
        <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
          La mia passione per la tecnologia mi ha portato a esplorare diversi linguaggi di programmazione e framework, 
          con una particolare predilezione per React e TypeScript, che utilizzo quotidianamente per creare interfacce 
          web responsive e intuitive.
        </p>
        
        <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
          Nel tempo libero mi piace tenermi aggiornato sulle ultime tendenze tecnologiche, contribuire a progetti 
          open source e partecipare ad hackathon, dove posso mettere alla prova le mie capacità di risoluzione dei 
          problemi e lavorare in team.
        </p>
      </div>
    </div>
  );
};

export default AboutMeSectionAlt;
