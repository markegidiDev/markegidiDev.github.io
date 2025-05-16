import { useState, useEffect } from 'react';
import { DirectionCombobox } from "@/components/ui/direction-combobox";

type LightColor = 'red' | 'yellow' | 'green';
export type Direction = 'caerano' | 'monte' | 'ospedale' | 'ospedaleVecchio' | 'default';

const LIGHTS: LightColor[] = ['red', 'yellow', 'green'];

// Configurazione per diverse direzioni
const TRAFFIC_CONFIG: Record<Direction, Record<LightColor, number>> = {
  default: {
    red: 10, // Durata in secondi
    yellow: 3,
    green: 10,
  },
  caerano: {
    red: 15,
    yellow: 3,
    green: 12,
  },
  monte: {
    red: 20,
    yellow: 4,
    green: 15,
  },
  ospedale: {
    red: 12,
    yellow: 3,
    green: 18,
  },
  ospedaleVecchio: {
    red: 18,
    yellow: 2,
    green: 10,
  },
};

interface TrafficLightProps {
  selectedDirection?: Direction;
  onDirectionChange?: (direction: Direction) => void;
}

export default function TrafficLight({ selectedDirection = 'default', onDirectionChange }: TrafficLightProps) {
  const [active, setActive] = useState<LightColor>('red');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // Mantenere totalTime potrebbe essere utile se in futuro volessimo calcolare una percentuale

  useEffect(() => {
    // Otteniamo la durata dal config in base alla direzione selezionata
    const durations = TRAFFIC_CONFIG[selectedDirection];
    const currentDuration = durations[active];
    
    // Impostiamo il tempo totale per il colore attuale
    setTimeLeft(currentDuration);
    
    // Aggiorniamo il timer ogni secondo
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Quando il timer scade, cambia il colore
          const nextIdx = (LIGHTS.indexOf(active) + 1) % LIGHTS.length;
          const next = LIGHTS[nextIdx];
          setActive(next);
          return durations[next]; // Reset timer con la durata del prossimo colore
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [active, selectedDirection]);

  // La percentuale potrebbe essere usata in futuro per animazioni o barre di progresso

  return (
    <div className="max-w-md mx-auto bg-background/50 backdrop-blur-sm border border-border/60 rounded-[var(--radius)] p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="mb-6">        <h3 className="text-xl font-medium mb-2">Semaforo Incroci</h3>        <p className="text-muted-foreground mb-4">
          Seleziona la direzione per vedere il tempo rimanente
        </p>
        <div className="mb-5">
          <DirectionCombobox 
            value={selectedDirection}
            onValueChange={onDirectionChange || (() => {})}
            buttonClassName="w-full shadow-sm traffic-light-combobox"
            dropdownClassName="max-w-[280px]"
          />        </div>
      
        <div className={`traffic-light-housing flex flex-col items-center p-4 rounded-lg mx-auto mb-4 mt-2 
          ${selectedDirection === 'default' ? 'bg-[oklch(0.274_0.006_286.033)]' : 
            selectedDirection === 'caerano' ? 'bg-[oklch(var(--chart-1))]' : 
            selectedDirection === 'monte' ? 'bg-[oklch(var(--chart-2))]' : 
            selectedDirection === 'ospedale' ? 'bg-[oklch(var(--chart-3))]' : 
            'bg-[oklch(var(--chart-4))]'} bg-opacity-20`}>
          <div className={`
            traffic-light-light flex items-center justify-center
            ${active === 'red' ? 'red active' : 'inactive'}
          `}>
            {active === 'red' && timeLeft}
          </div>
          
          <div className={`
            traffic-light-light flex items-center justify-center
            ${active === 'yellow' ? 'yellow active' : 'inactive'}
          `}>
            {active === 'yellow' && timeLeft}
          </div>
          
          <div className={`
            traffic-light-light flex items-center justify-center
            ${active === 'green' ? 'green active' : 'inactive'}
          `}>
            {active === 'green' && timeLeft}
          </div>
        </div>
      </div>
       
      <div className="pt-4 mt-4 flex flex-col text-center border-t border-border">
        <p className={`font-medium ${
          selectedDirection === 'default' ? 'text-primary' : 
          selectedDirection === 'caerano' ? 'text-[oklch(var(--chart-1))]' : 
          selectedDirection === 'monte' ? 'text-[oklch(var(--chart-2))]' : 
          selectedDirection === 'ospedale' ? 'text-[oklch(var(--chart-3))]' : 
          'text-[oklch(var(--chart-4))]'}`}>
          {selectedDirection !== 'default' ? `Direzione: ${selectedDirection.charAt(0).toUpperCase() + selectedDirection.slice(1)}` : 'Semaforo Predefinito'}
        </p>
        <p className="text-sm text-muted-foreground">
          {active.charAt(0).toUpperCase() + active.slice(1)} - Cambio in {timeLeft} secondi
        </p>
      </div>
    </div>
  );
}
