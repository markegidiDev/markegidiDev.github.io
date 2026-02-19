import { memo } from 'react';

interface SwimPace {
  id: number;
  date: string;
  totalMeters: number;
  movingSeconds: number;
  pace100m: number;
  paceFormatted: string;
}

interface Props {
  swimPaces: SwimPace[];
}

export const SwimPacesTable = memo(function SwimPacesTable({ swimPaces }: Props) {
  // Prendi le ultime 4 nuotate
  const last4Swims = swimPaces.slice(0, 4);
  
  // Se non abbiamo abbastanza dati, mostra un messaggio
  if (last4Swims.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nessuna nuotata recente disponibile
      </div>
    );
  }

  // Riempi con celle vuote se abbiamo meno di 4 nuotate
  const paddedSwims: (SwimPace | null)[] = [...last4Swims];
  while (paddedSwims.length < 4) {
    paddedSwims.push(null);
  }

  // Organizza in griglia 2x2
  const rows = [
    [paddedSwims[0], paddedSwims[1]],
    [paddedSwims[2], paddedSwims[3]]
  ];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateStr;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${meters}m`;
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {rows.flat().map((swim, idx) => (
          <div 
            key={idx} 
            className="flex min-h-[86px] flex-col justify-center rounded-xl border border-border/70 bg-card/70 p-3 transition-colors hover:bg-card"
          >
            {swim ? (
              <>
                <div className="flex justify-between items-start">
                   <div className="text-xs text-muted-foreground">
                     {formatDate(swim.date)}
                   </div>
                   <div className="text-xs font-medium text-muted-foreground">
                     {formatDistance(swim.totalMeters)}
                   </div>
                </div>
                <div className="mt-1 text-xl font-bold text-primary">
                  {swim.paceFormatted}<span className="text-xs font-normal text-muted-foreground ml-1">/100m</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-muted-foreground text-center opacity-30">
                -
              </div>
            )}
          </div>
        ))}
      </div>
      {last4Swims.length > 0 && (
        <div className="text-[10px] text-muted-foreground/50 text-center uppercase tracking-widest">
          Passo reale (esclude pause)
        </div>
      )}
    </div>
  );
});
