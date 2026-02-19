import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  calculateDifficulty,
  computeWorldAquaticsPoints,
  fitExponentialModel,
  invertWorldAquaticsPoints,
  MIN_PREDICTION_R2,
  predictTimeToTarget,
  formatSecondsToTime,
  parseTimeToSeconds,
  type PerformancePoint,
} from '@/lib/swimMath';
import { AlertCircle, History, Sparkles, Target, TrendingDown, TrendingUp } from 'lucide-react';

interface PredictionModuleProps {
  currentTime: number;
  baseTime: number;
  currentPoints: number;
  onTargetTimeChange?: (time: number | null) => void;
}

const inputClassName =
  'h-11 rounded-xl border border-input bg-background/80 px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';
const cardInsetStyle = { paddingInline: '1.75rem', paddingBlock: '1.5rem' } as const;

const PredictionModule: React.FC<PredictionModuleProps> = ({
  currentTime,
  baseTime,
  currentPoints,
  onTargetTimeChange,
}) => {
  const { toast } = useToast();

  const [targetTimeInput, setTargetTimeInput] = useState('');
  const [targetPoints, setTargetPoints] = useState<number | null>(null);
  const [history, setHistory] = useState<PerformancePoint[]>([]);
  const [newHistoryDate, setNewHistoryDate] = useState('');
  const [newHistoryTime, setNewHistoryTime] = useState('');
  const [newHistoryContext, setNewHistoryContext] = useState('');

  const handleCalculateDifficulty = () => {
    try {
      const targetTime = parseTimeToSeconds(targetTimeInput);
      const points = computeWorldAquaticsPoints(targetTime, baseTime);
      setTargetPoints(points);
      onTargetTimeChange?.(targetTime);
    } catch {
      toast({
        variant: 'error',
        title: 'Formato tempo non valido',
        description: 'Usa un formato come 31.45 oppure 1:05.30.',
      });
    }
  };

  const handleAddHistory = () => {
    try {
      if (!newHistoryDate || !newHistoryTime) {
        toast({
          variant: 'error',
          title: 'Dati incompleti',
          description: 'Inserisci almeno data e tempo della performance.',
        });
        return;
      }

      const time = parseTimeToSeconds(newHistoryTime);
      const points = computeWorldAquaticsPoints(time, baseTime);
      const newPoint: PerformancePoint = {
        date: newHistoryDate,
        time,
        points,
        context: newHistoryContext || undefined,
      };

      setHistory([...history, newPoint].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewHistoryDate('');
      setNewHistoryTime('');
      setNewHistoryContext('');
    } catch {
      toast({
        variant: 'error',
        title: 'Formato tempo non valido',
      });
    }
  };

  const handleRemoveHistory = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  let difficultyInfo = null;
  let predictionInfo = null;
  let predictionUnavailableReason: string | null = null;

  if (targetPoints !== null) {
    const targetTime = invertWorldAquaticsPoints(targetPoints, baseTime);
    difficultyInfo = calculateDifficulty(currentPoints, targetPoints, currentTime, baseTime);

    if (history.length >= 3) {
      predictionInfo = predictTimeToTarget(history, targetTime, baseTime);
      if (!predictionInfo) {
        const model = fitExponentialModel(history, baseTime);
        if (!model) {
          predictionUnavailableReason = 'Dati storici non sufficienti per il modello.';
        } else if (model.r_squared < MIN_PREDICTION_R2) {
          predictionUnavailableReason = `Trend poco stabile (R^2 ${model.r_squared.toFixed(2)}). Aggiungi piu storico.`;
        } else if (targetTime < model.T_infinity) {
          predictionUnavailableReason = `Target troppo aggressivo per il trend attuale (limite stimato ${formatSecondsToTime(model.T_infinity)}).`;
        } else {
          predictionUnavailableReason = 'Il modello non e riuscito a convergere con i dati correnti.';
        }
      }
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
      <div className="border-b border-border/40 px-6 pb-5 pt-7 sm:px-10 sm:pt-10" style={cardInsetStyle}>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Target className="h-5 w-5 text-primary" />
          Prediction & Targets
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Analizza la difficolta del target e stima il tempo necessario.
        </p>
      </div>

      <div className="space-y-6 px-6 py-8 sm:px-10 sm:py-10" style={cardInsetStyle}>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/70 bg-card/70 p-4">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Time</div>
            <div className="text-xl font-bold sm:text-2xl">{formatSecondsToTime(currentTime)}</div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/12 p-4">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Points</div>
            <div className="text-xl font-bold text-primary sm:text-2xl">{currentPoints}</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <Target className="h-4 w-4 text-muted-foreground" />
            Set Target
          </h3>
          <p className="text-xs text-muted-foreground">
            La predizione parte automaticamente dopo <strong>Calculate</strong> quando hai almeno 3 performance storiche.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="es. 31.45 o 1:05.30"
              value={targetTimeInput}
              onChange={(eventInput) => setTargetTimeInput(eventInput.target.value)}
              className={`flex-1 ${inputClassName}`}
            />
            <Button onClick={handleCalculateDifficulty} className="h-11 px-6">
              Calculate
            </Button>
          </div>
        </div>

        {difficultyInfo && (
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4 sm:p-5">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Difficulty Analysis
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Target Points</div>
                <div className="mt-1 text-lg font-bold">{targetPoints}</div>
              </div>

              <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Points Gap</div>
                <div className="mt-1 flex items-center gap-1 text-lg font-bold">
                  {difficultyInfo.deltaPoints > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {Math.abs(difficultyInfo.deltaPoints)}
                </div>
              </div>

              <div className="rounded-lg border border-border/30 bg-background/50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Improvement</div>
                <div className="mt-1 text-lg font-bold">{difficultyInfo.percentImprovement.toFixed(2)}%</div>
              </div>
            </div>

            <div>
              <Badge
                variant={
                  difficultyInfo.difficulty === 'easy'
                    ? 'default'
                    : difficultyInfo.difficulty === 'medium'
                    ? 'secondary'
                    : 'destructive'
                }
                className="text-sm"
              >
                {difficultyInfo.difficulty.toUpperCase()}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">{difficultyInfo.description}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <History className="h-4 w-4 text-muted-foreground" />
            Historical Data
            <span className="text-xs font-normal text-muted-foreground">(opzionale)</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Servono almeno 3 performance; oltre al numero conta anche la coerenza del trend.
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input
              type="date"
              value={newHistoryDate}
              onChange={(eventInput) => setNewHistoryDate(eventInput.target.value)}
              className={inputClassName}
            />
            <input
              type="text"
              placeholder="es. 31.45"
              value={newHistoryTime}
              onChange={(eventInput) => setNewHistoryTime(eventInput.target.value)}
              className={inputClassName}
            />
            <input
              type="text"
              placeholder="Contesto (opzionale)"
              value={newHistoryContext}
              onChange={(eventInput) => setNewHistoryContext(eventInput.target.value)}
              className={inputClassName}
            />
          </div>

          <Button onClick={handleAddHistory} size="sm" variant="outline" className="gap-2">
            <History className="h-3.5 w-3.5" />
            Add Performance
          </Button>

          {history.length > 0 && (
            <div className="mt-4 space-y-2">
              {history.map((point, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{new Date(point.date).toLocaleDateString()}</span>
                    {' - '}
                    <span className="text-sm">{formatSecondsToTime(point.time)}</span>{' '}
                    <Badge variant="outline" className="ml-1">
                      {point.points}pt
                    </Badge>
                    {point.context ? (
                      <span className="ml-2 text-xs text-muted-foreground">({point.context})</span>
                    ) : null}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHistory(idx)}
                    className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {predictionInfo && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Time-to-Target Prediction
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated Days:</span>
                <span className="font-bold">
                  {Math.round(predictionInfo.estimatedDays)} days (~
                  {Math.round(predictionInfo.estimatedDays / 7)} weeks)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model Confidence:</span>
                <Badge
                  variant={
                    predictionInfo.confidence === 'high'
                      ? 'default'
                      : predictionInfo.confidence === 'medium'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {predictionInfo.confidence.toUpperCase()}
                </Badge>
              </div>

              {predictionInfo.model ? (
                <div className="mt-2 text-xs text-muted-foreground">
                  Model R^2: {predictionInfo.model.r_squared.toFixed(3)} | Predicted limit:{' '}
                  {formatSecondsToTime(predictionInfo.model.T_infinity)}
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Questa stima usa un modello matematico semplice.
              Allenamento, recupero, tecnica e condizione fisica possono cambiare i tempi reali.
            </div>
          </div>
        )}

        {targetPoints !== null && history.length >= 3 && !predictionInfo && predictionUnavailableReason && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100">
            <strong>Predizione non disponibile:</strong> {predictionUnavailableReason}
          </div>
        )}

        {history.length < 3 && history.length > 0 && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm">
            <strong>Aggiungi piu dati:</strong> servono almeno 3 performance storiche per abilitare la predizione.
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionModule;
