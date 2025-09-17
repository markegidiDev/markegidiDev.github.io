import React from 'react';
import IconCloud from '@/components/magicui/icon-cloud';
import { Highlighter } from '@/components/magicui/highlighter';

// Tech / tool names (mapped to simpleicons via cdn.simpleicons.org/<slug>/<colorSlug>)
// NOTE: Some slugs may not exist on simpleicons; they will gracefully fallback to text badges.
const rawTech: string[] = [
  'langflow', 'langchain', 'mongodb', 'pytest', 'amazoncognito', 'octopusdeploy', 'boto3', 'awsvpc',
  'amazonkinesis', 'amazonses', 'googlecloud', 'firebase', 'python', 'anaconda', 'html5', 'css3',
  'typescript', 'react', 'reactrouter', 'vite', 'tailwindcss', 'docker', 'drizzle', 'zod', 'axios',
  'cypress', 'flask', 'yaml', 'json'
];

const imageUrls = rawTech.map(slug => `https://cdn.simpleicons.org/${slug}/${slug}`);

const AboutMeSectionAlt: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-10 items-stretch">
      {/* Text Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-colors duration-200 hover:shadow-lg md:flex-1 relative">
        <div className="p-8 space-y-6">
          <p className="leading-relaxed text-card-foreground text-lg">
            Mi chiamo <Highlighter action="highlight" color="#FF9800" iterations={3} animationDuration={900} isView>Marco Egidi</Highlighter> e sono uno sviluppatore web con forte focus <Highlighter action="underline" color="#3178C6" strokeWidth={2} isView>frontend</Highlighter>. Sono laureando in Scienze Informatiche (BSc) all’Università di Padova, dove unisco basi teoriche solide a progetti pratici. Lavoro ogni giorno con <Highlighter action="highlight" color="#61DAFB" iterations={2} isView>React</Highlighter> e <Highlighter action="highlight" color="#3178C6" iterations={2} isView>TypeScript</Highlighter> per creare interfacce pulite, accessibili e performanti; a livello accademico programmo anche in C/C++, JavaScript e Python.
          </p>
          <p className="leading-relaxed text-card-foreground text-lg">
            Ho esperienza con <Highlighter action="highlight" color="#0db7ed" isView>Docker</Highlighter> e con il deploy di web app nel cloud, in particolare su <Highlighter action="underline" color="#4285F4" strokeWidth={2} isView>Google Cloud</Highlighter> (Cloud Run, Firebase/Firestore) e con servizi equivalenti in <Highlighter action="highlight" color="#FF9900" iterations={2} isView>AWS</Highlighter>. Mi piace curare il flusso end-to-end: integrazione API, gestione dei dati, testing e automazione dei workflow. Nel tempo libero contribuisco a <Highlighter action="highlight" color="#16A34A" isView>progetti open source</Highlighter>, partecipo ad hackathon e a CTF di cybersecurity. Ho inoltre sviluppato estensioni Chrome (Manifest V3) sfruttando le API del browser.
          </p>
            <p className="leading-relaxed text-card-foreground text-lg">
            Cerco contesti dinamici in cui crescere rapidamente, lavorare in team e portare <Highlighter action="underline" color="#F59E0B" strokeWidth={2} isView>impatto concreto</Highlighter> sul prodotto.
          </p>
        </div>
      </div>

      {/* Icon Cloud (kept outside card on the right) */}
      <div className="md:w-[360px] lg:w-[420px] shrink-0 flex flex-col items-center justify-center gap-4">
        <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">Stack & Tools</div>
  <IconCloud images={imageUrls} size={360} />
        <a href="#skills" className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/60 rounded px-2 py-1">Vai alle competenze</a>
      </div>
    </div>
  );
};

export default AboutMeSectionAlt;
