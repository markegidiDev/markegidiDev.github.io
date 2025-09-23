import { memo } from 'react';

interface SwimPace {
  date: string;
  id: number;
  distance: number;
  totalMeters: number;
  movingSeconds: number;
  paceSeconds100m: number;
  paceFormatted: string;
}

interface Props {
  swimPaces: SwimPace[];
}

export const SwimPacesGrid = memo(function SwimPacesGrid({ swimPaces }: Props) {
  // Prendi le ultime 4 nuotate e completa con slot vuoti se necessario
  const displayPaces: (SwimPace | null)[] = [...swimPaces.slice(0, 4)];
  while (displayPaces.length < 4) {
    displayPaces.push(null);
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('it-IT', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString;
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}k`;
    }
    return `${meters}m`;
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Ultime 4 nuotate</div>
      <div className="grid grid-cols-2 gap-3">
        {displayPaces.map((pace, index) => (
          <div 
            key={pace?.id || `empty-${index}`}
            className="rounded-xl bg-gd-main neumorphism-border-1 p-3"
          >
            {pace ? (
              <>
                <div className="text-xs text-muted-foreground">
                  {formatDate(pace.date)}
                </div>
                <div className="text-lg font-semibold text-blue-400">
                  {pace.paceFormatted}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistance(pace.totalMeters)} • {Math.round(pace.movingSeconds / 60)}'
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-muted-foreground">-</div>
                <div className="text-lg font-semibold text-muted-foreground">
                  --:--
                </div>
                <div className="text-xs text-muted-foreground">-</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});