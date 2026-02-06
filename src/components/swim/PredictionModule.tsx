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
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

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
    <div className="space-y-6 rounded-lg border border-border p-6 bg-card">
      <div>
        <h2 className="text-2xl font-bold mb-2">Prediction & Targets</h2>
        <p className="text-sm text-muted-foreground">
          Analizza la difficoltà del tuo obiettivo e stima il tempo necessario
        </p>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
        <div>
          <div className="text-sm text-muted-foreground">Current Time</div>
          <div className="text-xl font-bold">{formatSecondsToTime(currentTime)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Current Points</div>
          <div className="text-xl font-bold">{currentPoints}</div>
        </div>
      </div>

      {/* Target Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Set Target</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Target time (e.g., 31.45 or 1:05.30)"
            value={targetTimeInput}
            onChange={(e) => setTargetTimeInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
          />
          <Button onClick={handleCalculateDifficulty}>Calculate</Button>
        </div>
      </div>

      {/* Difficulty Analysis */}
      {difficultyInfo && (
        <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/10">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Difficulty Analysis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Target Points</div>
              <div className="text-lg font-bold">{targetPoints}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Points Gap</div>
              <div className="text-lg font-bold flex items-center gap-1">
                {difficultyInfo.deltaPoints > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {Math.abs(difficultyInfo.deltaPoints)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Improvement</div>
              <div className="text-lg font-bold">
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
            <p className="mt-2 text-sm">{difficultyInfo.description}</p>
          </div>
        </div>
      )}

      {/* Historical Data */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Historical Data (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Add at least 3 performances to enable time-to-target prediction
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="date"
            value={newHistoryDate}
            onChange={(e) => setNewHistoryDate(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          />
          <input
            type="text"
            placeholder="Time (e.g., 31.45)"
            value={newHistoryTime}
            onChange={(e) => setNewHistoryTime(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          />
          <input
            type="text"
            placeholder="Context (optional)"
            value={newHistoryContext}
            onChange={(e) => setNewHistoryContext(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          />
        </div>
        <Button onClick={handleAddHistory} size="sm">
          Add Performance
        </Button>

        {history.length > 0 && (
          <div className="mt-4 space-y-2">
            {history.map((point, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-md bg-muted/30"
              >
                <div className="flex-1">
                  <span className="font-medium">
                    {new Date(point.date).toLocaleDateString()}
                  </span>
                  {' - '}
                  <span>{formatSecondsToTime(point.time)}</span>
                  {' '}
                  <Badge variant="outline" className="ml-2">
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
        <div className="p-4 rounded-lg border border-primary bg-primary/5">
          <h3 className="text-lg font-semibold mb-3">Time-to-Target Prediction</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Days:</span>
              <span className="font-bold">
                {Math.round(predictionInfo.estimatedDays)} days (~
                {Math.round(predictionInfo.estimatedDays / 7)} weeks)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model Confidence:</span>
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

          <div className="mt-4 p-3 rounded-md bg-muted/30 text-sm">
            <strong>Note:</strong> Questa stima si basa su un modello matematico semplice.
            Fattori come allenamento, riposo, tecnica e condizioni fisiche possono
            influenzare significativamente i tempi reali.
          </div>
        </div>
      )}

      {history.length < 3 && history.length > 0 && (
        <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-sm">
          <strong>Aggiungi più dati:</strong> Servono almeno 3 performance storiche per
          abilitare la predizione del tempo necessario.
        </div>
      )}
    </div>
  );
};

export default PredictionModule;
