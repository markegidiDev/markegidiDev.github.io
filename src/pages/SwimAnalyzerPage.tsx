import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  parseTimeToSeconds,
  formatSecondsToTime,
  getBaseTime,
  computeWorldAquaticsPoints,
  generateDefaultSegments,
  computeSegmentMetrics,
  normalizeSegments,
  type Course,
  type Sex,
  type EventKey,
  type Segment,
  type SegmentMetrics,
} from '@/lib/swimMath';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { SaaSCard, SaaSEmptyState, SaaSHeader, SaaSPage, SaaSSkeleton } from '@/components/ui/saas';
import baseTimesData from '@/data/worldAquaticsBaseTimes.json';
import SegmentTable from '@/components/swim/SegmentTable';
import SegmentCharts from '@/components/swim/SegmentCharts';
import PredictionModule from '@/components/swim/PredictionModule';
import GaussianDistributionChart from '@/components/swim/GaussianDistributionChart';
import {
  Activity,
  Clock,
  Download,
  Gauge,
  LineChart,
  Loader2,
  Plus,
  Save,
  Table2,
  Timer,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  Waves,
  Zap,
} from 'lucide-react';

interface RaceData {
  event: EventKey;
  course: Course;
  sex: Sex;
  finalTime: number;
  segments: Segment[];
  mode: 'quick' | 'advanced';
  date?: string;
  name?: string;
}

const inputClassName =
  'h-11 w-full rounded-xl border border-border/70 bg-background/80 px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring';

const segmentInputClassName =
  'h-9 w-full rounded-lg border border-border/70 bg-background/80 px-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring';
const cardInsetStyle = { paddingInline: '1.75rem', paddingBlock: '1.5rem' } as const;

const SwimAnalyzerPage: React.FC = () => {
  const [event, setEvent] = useState<EventKey>('50_FREE');
  const [course, setCourse] = useState<Course>('SCM');
  const [sex, setSex] = useState<Sex>('M');
  const [finalTimeInput, setFinalTimeInput] = useState('');
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [raceName, setRaceName] = useState('');

  const [customSegments, setCustomSegments] = useState<Segment[]>([
    { startDistance: 0, endDistance: 15, splitTime: undefined },
    { startDistance: 15, endDistance: 50, splitTime: undefined },
  ]);

  const [results, setResults] = useState<{
    finalTime: number;
    baseTime: number;
    points: number;
    metrics: SegmentMetrics[];
  } | null>(null);
  const [targetTime, setTargetTime] = useState<number | null>(null);

  const [savedRaces, setSavedRaces] = useState<RaceData[]>([]);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsStorageLoading(true);
    const saved = localStorage.getItem('swimAnalyzer:savedRaces');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RaceData[];
        setSavedRaces(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('swimAnalyzer:savedRaces parse failed', error);
        }
        toast({
          variant: 'error',
          title: 'Archivio gare non leggibile',
          description: 'Il contenuto salvato in locale non e valido.',
        });
      }
    }
    setIsStorageLoading(false);
  }, [toast]);

  const eventInfo = baseTimesData.events.find((entry) => entry.key === event);
  const eventDistance = eventInfo?.distance || 50;

  const persistSavedRaces = (next: RaceData[]) => {
    setSavedRaces(next);
    localStorage.setItem('swimAnalyzer:savedRaces', JSON.stringify(next));
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);

    window.setTimeout(() => {
      try {
        const finalTime = parseTimeToSeconds(finalTimeInput);
        const baseTime = getBaseTime(course, sex, event);
        const points = computeWorldAquaticsPoints(finalTime, baseTime);

        const segments =
          mode === 'quick'
            ? generateDefaultSegments(eventDistance, finalTime)
            : normalizeSegments(customSegments, finalTime);

        const metrics = computeSegmentMetrics(segments);

        setResults({
          finalTime,
          baseTime,
          points,
          metrics,
        });

        const sessionData: RaceData = {
          event,
          course,
          sex,
          finalTime,
          segments,
          mode,
          date: new Date().toISOString(),
          name: raceName || undefined,
        };

        localStorage.setItem('swimAnalyzer:lastSession', JSON.stringify(sessionData));

        toast({
          variant: 'success',
          title: 'Analisi completata',
          description: `${eventInfo?.label ?? event} in ${formatSecondsToTime(finalTime)}`,
        });
      } catch (error) {
        toast({
          variant: 'error',
          title: 'Analisi non riuscita',
          description: error instanceof Error ? error.message : 'Controlla i dati inseriti e riprova.',
        });
      } finally {
        setIsAnalyzing(false);
      }
    }, 160);
  };

  const handleSaveRace = () => {
    if (!results) {
      toast({
        variant: 'error',
        title: 'Nessun risultato da salvare',
        description: 'Esegui prima un analisi della gara.',
      });
      return;
    }

    const newRace: RaceData = {
      event,
      course,
      sex,
      finalTime: results.finalTime,
      segments: mode === 'quick' ? generateDefaultSegments(eventDistance, results.finalTime) : customSegments,
      mode,
      date: new Date().toISOString(),
      name: raceName || `${eventInfo?.label} - ${formatSecondsToTime(results.finalTime)}`,
    };

    const updated = [...savedRaces, newRace];
    persistSavedRaces(updated);

    toast({
      variant: 'success',
      title: 'Gara salvata',
      description: newRace.name ?? 'Sessione aggiunta all archivio locale.',
    });
  };

  const handleLoadRace = (race: RaceData) => {
    setEvent(race.event);
    setCourse(race.course);
    setSex(race.sex);
    setFinalTimeInput(formatSecondsToTime(race.finalTime));
    setMode(race.mode);
    setCustomSegments(race.segments);
    setRaceName(race.name || '');

    const baseTime = getBaseTime(race.course, race.sex, race.event);
    const points = computeWorldAquaticsPoints(race.finalTime, baseTime);
    const metrics = computeSegmentMetrics(race.segments);

    setResults({
      finalTime: race.finalTime,
      baseTime,
      points,
      metrics,
    });

    toast({
      variant: 'info',
      title: 'Sessione caricata',
      description: race.name || 'Gara ripristinata con successo.',
    });
  };

  const handleDeleteRace = (index: number) => {
    const updated = savedRaces.filter((_, i) => i !== index);
    persistSavedRaces(updated);
    toast({
      variant: 'success',
      title: 'Gara rimossa',
    });
  };

  const handleExportJSON = () => {
    if (!results) {
      toast({
        variant: 'error',
        title: 'Nessun risultato da esportare',
      });
      return;
    }

    const exportData = {
      race: {
        event,
        course,
        sex,
        finalTime: results.finalTime,
        name: raceName,
        date: new Date().toISOString(),
      },
      analysis: {
        baseTime: results.baseTime,
        points: results.points,
        segments: results.metrics,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swim-analysis-${event}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      variant: 'success',
      title: 'Export JSON completato',
    });
  };

  const handleExportCSV = () => {
    if (!results) {
      toast({
        variant: 'error',
        title: 'Nessun risultato da esportare',
      });
      return;
    }

    const headers = [
      'Segment',
      'Distance(m)',
      'Split(s)',
      'Cumulative(s)',
      'Velocity(m/s)',
      'Strokes',
      'StrokeRate(c/min)',
      'Tempo(s/c)',
      'DPS(cm/c)',
      'StrokeIndex',
    ];

    const rows = results.metrics.map((segment) => [
      segment.segment,
      segment.distance,
      segment.splitTime,
      segment.cumulativeTime,
      segment.velocity.toFixed(3),
      segment.strokeCount ?? 'N/A',
      segment.strokeRate?.toFixed(1) ?? 'N/A',
      segment.strokeTempo?.toFixed(2) ?? 'N/A',
      segment.dps?.toFixed(1) ?? 'N/A',
      segment.strokeIndex?.toFixed(2) ?? 'N/A',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swim-segments-${event}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      variant: 'success',
      title: 'Export CSV completato',
    });
  };

  const handleAddSegment = () => {
    const lastSegment = customSegments[customSegments.length - 1];
    const newStart = lastSegment ? lastSegment.endDistance : 0;

    if (newStart >= eventDistance) {
      toast({
        variant: 'info',
        title: 'Distanza massima gia raggiunta',
      });
      return;
    }

    const newEnd = Math.min(newStart + 15, eventDistance);
    setCustomSegments([...customSegments, { startDistance: newStart, endDistance: newEnd, splitTime: undefined }]);
  };

  const handleRemoveSegment = (index: number) => {
    setCustomSegments(customSegments.filter((_, i) => i !== index));
  };

  const handleUpdateSegment = (index: number, field: keyof Segment, value: number | string | undefined) => {
    const updated = [...customSegments];
    updated[index] = { ...updated[index], [field]: value };
    setCustomSegments(updated);
  };

  return (
    <SaaSPage>
      <div className="mx-auto flex w-full flex-col gap-8">
        <SaaSHeader
          badge="World Aquatics Points"
          icon={<Waves className="h-3.5 w-3.5" />}
          title="Swim Race Analyzer"
          subtitle="Analisi gara con punti WA, segmentazione e moduli di predizione"
        />

        <SaaSCard className="overflow-visible" contentClassName="p-0">
          <div className="border-b border-border/70 px-6 pb-5 pt-7 sm:px-10 sm:pt-10" style={cardInsetStyle}>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Activity className="h-5 w-5 text-primary" />
              Race Details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Inserisci i dati della gara per avviare l analisi</p>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10" style={cardInsetStyle}>
            <div className="grid grid-cols-1 gap-5 rounded-2xl border border-border/70 bg-card/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Event</label>
                <Select value={event} onValueChange={(value) => setEvent(value as EventKey)}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {baseTimesData.events.map((entry) => (
                      <SelectItem key={entry.key} value={entry.key}>
                        {entry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Course</label>
                <Select value={course} onValueChange={(value) => setCourse(value as Course)}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCM">SCM (25m)</SelectItem>
                    <SelectItem value="LCM">LCM (50m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Sex</label>
                <Select value={sex} onValueChange={(value) => setSex(value as Sex)}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  Final Time
                </label>
                <input
                  type="text"
                  placeholder="es. 31.45 o 1:05.30"
                  value={finalTimeInput}
                  onChange={(eventInput) => setFinalTimeInput(eventInput.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Race Name <span className="font-normal text-muted-foreground">(opzionale)</span>
              </label>
              <input
                type="text"
                placeholder="es. Campionati Nazionali 2026"
                value={raceName}
                onChange={(eventInput) => setRaceName(eventInput.target.value)}
                className={cn(inputClassName, 'max-w-xl')}
              />
            </div>

            <Tabs value={mode} onValueChange={(value) => setMode(value as 'quick' | 'advanced')}>
              <TabsList className="mb-5">
                <TabsTrigger value="quick" className="gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Quick Mode
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  Advanced Mode
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="space-y-4">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Quick Mode:</strong> Inserisci solo il tempo finale. I segmenti
                    vengono stimati su un profilo standard della gara.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-5">
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Advanced Mode:</strong> Definisci segmenti custom con split,
                    stroke count e note tecniche.
                  </p>
                </div>

                <div className="space-y-3">
                  {customSegments.map((segment, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-card/60 p-4 sm:grid-cols-3 md:grid-cols-6"
                    >
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Start (m)</label>
                        <input
                          type="number"
                          value={segment.startDistance}
                          onChange={(eventInput) =>
                            handleUpdateSegment(index, 'startDistance', Number(eventInput.target.value))
                          }
                          className={segmentInputClassName}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">End (m)</label>
                        <input
                          type="number"
                          value={segment.endDistance}
                          onChange={(eventInput) =>
                            handleUpdateSegment(index, 'endDistance', Number(eventInput.target.value))
                          }
                          className={segmentInputClassName}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Split (s)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={segment.splitTime ?? ''}
                          onChange={(eventInput) =>
                            handleUpdateSegment(
                              index,
                              'splitTime',
                              eventInput.target.value ? Number(eventInput.target.value) : undefined
                            )
                          }
                          className={segmentInputClassName}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Strokes</label>
                        <input
                          type="number"
                          value={segment.strokeCount ?? ''}
                          onChange={(eventInput) =>
                            handleUpdateSegment(
                              index,
                              'strokeCount',
                              eventInput.target.value ? Number(eventInput.target.value) : undefined
                            )
                          }
                          className={segmentInputClassName}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Notes</label>
                        <input
                          type="text"
                          value={segment.notes ?? ''}
                          onChange={(eventInput) => handleUpdateSegment(index, 'notes', eventInput.target.value)}
                          className={segmentInputClassName}
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSegment(index)}
                          disabled={customSegments.length === 1}
                          className="h-9 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="secondary" size="sm" onClick={handleAddSegment} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Segment
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="border-t border-border/70 bg-card/55 px-6 py-6 sm:px-10 sm:py-7" style={cardInsetStyle}>
            <Button
              onClick={runAnalysis}
              size="lg"
              disabled={isAnalyzing}
              className="w-full gap-2 px-10 text-base sm:w-auto"
            >
              {isAnalyzing ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Activity className="h-4.5 w-4.5" />}
              {isAnalyzing ? 'Analisi in corso...' : 'Analyze Race'}
            </Button>
          </div>
        </SaaSCard>

        {isAnalyzing ? (
          <AnalysisSkeleton />
        ) : results ? (
          <div className="flex flex-col gap-6">
            <SaaSCard className="overflow-hidden" contentClassName="p-0">
              <div className="border-b border-border/70 px-6 pb-5 pt-7 sm:px-10 sm:pt-10" style={cardInsetStyle}>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Trophy className="h-5 w-5 text-primary" />
                  Race Summary
                </h2>
                {raceName ? <p className="mt-1 text-sm text-muted-foreground">{raceName}</p> : null}
              </div>

              <div className="px-6 py-8 sm:px-10 sm:py-10" style={cardInsetStyle}>
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4 md:gap-6">
                  <SummaryMetric
                    icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                    label="Final Time"
                    value={formatSecondsToTime(results.finalTime)}
                  />
                  <SummaryMetric
                    icon={<Trophy className="h-4 w-4 text-primary" />}
                    label="WA Points"
                    value={String(results.points)}
                    highlight
                  />
                  <SummaryMetric
                    icon={<Gauge className="h-4 w-4 text-muted-foreground" />}
                    label="Base Time"
                    value={formatSecondsToTime(results.baseTime)}
                    note="1000 punti"
                  />
                  <SummaryMetric
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    label="Avg Velocity"
                    value={(eventDistance / results.finalTime).toFixed(2)}
                    note="m/s"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border/70 bg-card/55 px-6 py-5 sm:px-10" style={cardInsetStyle}>
                <Button variant="secondary" size="sm" onClick={handleSaveRace} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Race
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportJSON} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </SaaSCard>

            <SaaSCard className="overflow-hidden" contentClassName="p-0">
              <div className="border-b border-border/70 px-6 pb-5 pt-7 sm:px-10 sm:pt-10" style={cardInsetStyle}>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <Table2 className="h-5 w-5 text-primary" />
                  Segment Analysis
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Dettaglio metriche per segmento</p>
              </div>
              <div className="px-6 py-8 sm:px-10 sm:py-10" style={cardInsetStyle}>
                <SegmentTable segments={results.metrics} />
              </div>
            </SaaSCard>

            <SaaSCard className="overflow-hidden" contentClassName="p-0">
              <div className="border-b border-border/70 px-6 pb-5 pt-7 sm:px-10 sm:pt-10" style={cardInsetStyle}>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <LineChart className="h-5 w-5 text-primary" />
                  Performance Graphs
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Visualizzazione grafica delle metriche</p>
              </div>
              <div className="px-6 py-8 sm:px-10 sm:py-10" style={cardInsetStyle}>
                <SegmentCharts segments={results.metrics} />
              </div>
            </SaaSCard>

            <GaussianDistributionChart
              event={event}
              course={course}
              sex={sex}
              userTime={results.finalTime}
              predictionTime={targetTime}
            />

            <PredictionModule
              currentTime={results.finalTime}
              baseTime={results.baseTime}
              currentPoints={results.points}
              onTargetTimeChange={setTargetTime}
            />
          </div>
        ) : (
          <SaaSCard>
            <SaaSEmptyState
              icon={<Activity className="h-8 w-8" />}
              title="Nessuna analisi disponibile"
              description="Compila i dettagli gara e premi Analyze Race per generare metriche e grafici."
            />
          </SaaSCard>
        )}

        <SaaSCard className="overflow-hidden" contentClassName="p-6 sm:p-10">
          <h2 className="mb-5 text-xl font-semibold">Saved Races</h2>

          {isStorageLoading ? (
            <div className="space-y-3">
              <SaaSSkeleton className="h-16 w-full" />
              <SaaSSkeleton className="h-16 w-full" />
              <SaaSSkeleton className="h-16 w-full" />
            </div>
          ) : savedRaces.length === 0 ? (
            <SaaSEmptyState
              title="Nessuna gara salvata"
              description="Quando salvi una sessione, la trovi qui pronta da ricaricare."
              className="min-h-[180px]"
            />
          ) : (
            <div className="space-y-3">
              {savedRaces.map((race, index) => (
                <div
                  key={`${race.name ?? 'race'}-${index}`}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card/70 p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">{race.name || 'Unnamed Race'}</div>
                    <div className="break-words text-sm text-muted-foreground">
                      {baseTimesData.events.find((entry) => entry.key === race.event)?.label} • {race.course} • {race.sex} •{' '}
                      {formatSecondsToTime(race.finalTime)}
                      {race.date ? ` • ${new Date(race.date).toLocaleDateString()}` : ''}
                    </div>
                  </div>

                  <div className="ml-0 flex shrink-0 gap-2 sm:ml-4">
                    <Button variant="secondary" size="sm" onClick={() => handleLoadRace(race)} className="gap-2">
                      <Upload className="h-4 w-4" />
                      Load
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteRace(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SaaSCard>
      </div>
    </SaaSPage>
  );
};

type SummaryMetricProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
};

function SummaryMetric({ icon, label, value, note, highlight = false }: SummaryMetricProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 sm:p-5',
        highlight ? 'border-primary/30 bg-primary/12' : 'border-border/70 bg-card/70'
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-lg bg-muted/70 p-1.5">{icon}</div>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</span>
      </div>
      <div className={cn('text-lg font-bold tracking-tight sm:text-2xl', highlight ? 'text-primary' : 'text-foreground')}>
        {value}
      </div>
      {note ? <div className="mt-1 text-[11px] text-muted-foreground">{note}</div> : null}
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <SaaSCard>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SaaSSkeleton className="h-24 w-full" />
          <SaaSSkeleton className="h-24 w-full" />
          <SaaSSkeleton className="h-24 w-full" />
          <SaaSSkeleton className="h-24 w-full" />
        </div>
      </SaaSCard>
      <SaaSCard>
        <SaaSSkeleton className="h-60 w-full" />
      </SaaSCard>
      <SaaSCard>
        <SaaSSkeleton className="h-72 w-full" />
      </SaaSCard>
    </div>
  );
}

export default SwimAnalyzerPage;
