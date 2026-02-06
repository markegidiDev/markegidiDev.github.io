import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  calculateDifficulty,
  computeWorldAquaticsPoints,
  invertWorldAquaticsPoints,
  predictTimeToTarget,
  formatSecondsToTime,
  parseTimeToSeconds,
  type PerformancePoint,
} from '@/lib/swimMath';
import { AlertCircle, TrendingDown, TrendingUp, Target, History, Sparkles } from 'lucide-react';

interface PredictionModuleProps {
  currentTime: number;
  baseTime: number;
  currentPoints: number;
}

const PredictionModule: React.FC<PredictionModuleProps> = ({
  currentTime,
  baseTime,
  currentPoints,
}) => {
  const [targetTimeInput, setTargetTimeInput] = useState('');
  const [targetPoints, setTargetPoints] = useState<number | null>(null);
  const [history, setHistory] = useState<PerformancePoint[]>([]);
  const [newHistoryDate, setNewHistoryDate] = useState('');
  const [newHistoryTime, setNewHistoryTime] = useState('');
  const [newHistoryContext, setNewHistoryContext] = useState('');

  const handleCalculateDifficulty = () => {
    try {
      const targetTime = parseTimeToSeconds(targetTimeInput);
      const pts = computeWorldAquaticsPoints(targetTime, baseTime);
      setTargetPoints(pts);
    } catch {
      alert('Invalid target time format');
    }
  };

  const handleAddHistory = () => {
    try {
      if (!newHistoryDate || !newHistoryTime) {
        alert('Date and time are required');
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
      setHistory([...history, newPoint].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      setNewHistoryDate('');
      setNewHistoryTime('');
      setNewHistoryContext('');
    } catch {
      alert('Invalid time format');
    }
  };

  const handleRemoveHistory = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  let difficultyInfo = null;
  let predictionInfo = null;

  if (targetPoints !== null) {
    const targetTime = invertWorldAquaticsPoints(targetPoints, baseTime);
    difficultyInfo = calculateDifficulty(currentPoints, targetPoints, currentTime, baseTime);

    if (history.length >= 3) {
      predictionInfo = predictTimeToTarget(history, targetTime, baseTime);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Prediction & Targets
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analizza la difficolta del tuo obiettivo e stima il tempo necessario
        </p>
      </div>

      <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Current Time</div>
            <div className="text-xl sm:text-2xl font-bold">{formatSecondsToTime(currentTime)}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Current Points</div>
            <div className="text-xl sm:text-2xl font-bold text-primary">{currentPoints}</div>
          </div>
        </div>

        {/* Target Input */}
        <div className="space-y-3">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            Set Target
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="es. 31.45 o 1:05.30"
              value={targetTimeInput}
              onChange={(e) => setTargetTimeInput(e.target.value)}
              className="flex-1 h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            <Button onClick={handleCalculateDifficulty} className="h-11 px-6">Calculate</Button>
          </div>
        </div>

        {/* Difficulty Analysis */}
        {difficultyInfo && (
          <div className="space-y-4 p-5 rounded-xl border border-border/60 bg-muted/10">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Difficulty Analysis
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Target Points</div>
                <div className="text-lg font-bold mt-1">{targetPoints}</div>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Points Gap</div>
                <div className="text-lg font-bold flex items-center gap-1 mt-1">
                  {difficultyInfo.deltaPoints > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  {Math.abs(difficultyInfo.deltaPoints)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Improvement</div>
                <div className="text-lg font-bold mt-1">
                  {difficultyInfo.percentImprovement.toFixed(2)}%
                </div>
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

        {/* Historical Data */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            Historical Data
            <span className="text-xs text-muted-foreground font-normal">(opzionale)</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Aggiungi almeno 3 performance per abilitare la predizione
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="date"
              value={newHistoryDate}
              onChange={(e) => setNewHistoryDate(e.target.value)}
              className="h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="es. 31.45"
              value={newHistoryTime}
              onChange={(e) => setNewHistoryTime(e.target.value)}
              className="h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Contesto (opzionale)"
              value={newHistoryContext}
              onChange={(e) => setNewHistoryContext(e.target.value)}
              className="h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          <Button onClick={handleAddHistory} size="sm" variant="outline" className="gap-2">
            <History className="h-3.5 w-3.5" />
            Add Performance
          </Button>

          {history.length > 0 && (
            <div className="mt-4 space-y-2">
              {history.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">
                      {new Date(point.date).toLocaleDateString()}
                    </span>
                    {' - '}
                    <span className="text-sm">{formatSecondsToTime(point.time)}</span>
                    {' '}
                    <Badge variant="outline" className="ml-1">
                      {point.points}pt
                    </Badge>
                    {point.context && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({point.context})
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveHistory(idx)}
                    className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prediction Results */}
        {predictionInfo && (
          <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Time-to-Target Prediction
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimated Days:</span>
                <span className="font-bold">
                  {Math.round(predictionInfo.estimatedDays)} days (~
                  {Math.round(predictionInfo.estimatedDays / 7)} weeks)
                </span>
              </div>
              <div className="flex justify-between items-center">
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
              {predictionInfo.model && (
                <div className="text-xs text-muted-foreground mt-2">
                  Model R²: {predictionInfo.model.r_squared.toFixed(3)} |
                  Predicted limit: {formatSecondsToTime(predictionInfo.model.T_infinity)}
                </div>
              )}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Questa stima si basa su un modello matematico semplice.
              Fattori come allenamento, riposo, tecnica e condizioni fisiche possono
              influenzare significativamente i tempi reali.
            </div>
          </div>
        )}

        {history.length < 3 && history.length > 0 && (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm">
            <strong>Aggiungi piu dati:</strong> Servono almeno 3 performance storiche per
            abilitare la predizione del tempo necessario.
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionModule;
