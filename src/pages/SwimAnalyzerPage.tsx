import React, { useState, useEffect } from 'react';
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
import baseTimesData from '@/data/worldAquaticsBaseTimes.json';
import SegmentTable from '@/components/swim/SegmentTable';
import SegmentCharts from '@/components/swim/SegmentCharts';
import PredictionModule from '@/components/swim/PredictionModule';
import { Save, Upload, Download, Plus, Trash2, Timer, Waves, Activity, Zap, Trophy, Gauge, Clock, TrendingUp, BarChart3, LineChart, Table2 } from 'lucide-react';

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

const SwimAnalyzerPage: React.FC = () => {
  // Form state
  const [event, setEvent] = useState<EventKey>('50_FREE');
  const [course, setCourse] = useState<Course>('SCM');
  const [sex, setSex] = useState<Sex>('M');
  const [finalTimeInput, setFinalTimeInput] = useState('');
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [raceName, setRaceName] = useState('');

  // Advanced mode segments
  const [customSegments, setCustomSegments] = useState<Segment[]>([
    { startDistance: 0, endDistance: 15, splitTime: undefined },
    { startDistance: 15, endDistance: 50, splitTime: undefined },
  ]);

  // Results
  const [results, setResults] = useState<{
    finalTime: number;
    baseTime: number;
    points: number;
    metrics: SegmentMetrics[];
  } | null>(null);

  // Saved races
  const [savedRaces, setSavedRaces] = useState<RaceData[]>([]);

  // Load saved races from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('swimAnalyzer:savedRaces');
    if (saved) {
      try {
        setSavedRaces(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved races', error);
      }
    }
  }, []);

  // Get event info
  const eventInfo = baseTimesData.events.find((e) => e.key === event);
  const eventDistance = eventInfo?.distance || 50;

  const handleAnalyze = () => {
    try {
      const finalTime = parseTimeToSeconds(finalTimeInput);
      const baseTime = getBaseTime(course, sex, event);
      const points = computeWorldAquaticsPoints(finalTime, baseTime);

      let segments: Segment[];
      if (mode === 'quick') {
        segments = generateDefaultSegments(eventDistance, finalTime);
      } else {
        segments = normalizeSegments(customSegments, finalTime);
      }

      const metrics = computeSegmentMetrics(segments);

      setResults({
        finalTime,
        baseTime,
        points,
        metrics,
      });

      // Save to localStorage as last session
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
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  const handleSaveRace = () => {
    if (!results) return;

    const newRace: RaceData = {
      event,
      course,
      sex,
      finalTime: results.finalTime,
      segments: mode === 'quick' 
        ? generateDefaultSegments(eventDistance, results.finalTime)
        : customSegments,
      mode,
      date: new Date().toISOString(),
      name: raceName || `${eventInfo?.label} - ${formatSecondsToTime(results.finalTime)}`,
    };

    const updated = [...savedRaces, newRace];
    setSavedRaces(updated);
    localStorage.setItem('swimAnalyzer:savedRaces', JSON.stringify(updated));
    alert('Race saved successfully!');
  };

  const handleLoadRace = (race: RaceData) => {
    setEvent(race.event);
    setCourse(race.course);
    setSex(race.sex);
    setFinalTimeInput(formatSecondsToTime(race.finalTime));
    setMode(race.mode);
    setCustomSegments(race.segments);
    setRaceName(race.name || '');

    // Trigger analysis
    setTimeout(() => {
      const baseTime = getBaseTime(race.course, race.sex, race.event);
      const points = computeWorldAquaticsPoints(race.finalTime, baseTime);
      const metrics = computeSegmentMetrics(race.segments);

      setResults({
        finalTime: race.finalTime,
        baseTime,
        points,
        metrics,
      });
    }, 100);
  };

  const handleDeleteRace = (index: number) => {
    const updated = savedRaces.filter((_, i) => i !== index);
    setSavedRaces(updated);
    localStorage.setItem('swimAnalyzer:savedRaces', JSON.stringify(updated));
  };

  const handleExportJSON = () => {
    if (!results) return;

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
  };

  const handleExportCSV = () => {
    if (!results) return;

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

    const rows = results.metrics.map((seg) => [
      seg.segment,
      seg.distance,
      seg.splitTime,
      seg.cumulativeTime,
      seg.velocity.toFixed(3),
      seg.strokeCount ?? 'N/A',
      seg.strokeRate?.toFixed(1) ?? 'N/A',
      seg.strokeTempo?.toFixed(2) ?? 'N/A',
      seg.dps?.toFixed(1) ?? 'N/A',
      seg.strokeIndex?.toFixed(2) ?? 'N/A',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swim-segments-${event}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddSegment = () => {
    const lastSeg = customSegments[customSegments.length - 1];
    const newStart = lastSeg ? lastSeg.endDistance : 0;
    const newEnd = Math.min(newStart + 15, eventDistance);
    setCustomSegments([
      ...customSegments,
      { startDistance: newStart, endDistance: newEnd, splitTime: undefined },
    ]);
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Waves className="h-4 w-4" />
            World Aquatics Points
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">Swim Race Analyzer</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Analizza le tue gare di nuoto con metriche World Aquatics ufficiali
          </p>
        </div>

        {/* Input Form */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm mb-10">
          {/* Form Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Race Details
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Inserisci i dati della gara per iniziare l'analisi</p>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Event</label>
                <Select value={event} onValueChange={(v) => setEvent(v as EventKey)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {baseTimesData.events.map((e) => (
                      <SelectItem key={e.key} value={e.key}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Course</label>
                <Select value={course} onValueChange={(v) => setCourse(v as Course)}>
                  <SelectTrigger className="h-11">
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
                <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                  Final Time
                </label>
                <input
                  type="text"
                  placeholder="es. 31.45 o 1:05.30"
                  value={finalTimeInput}
                  onChange={(e) => setFinalTimeInput(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Race Name (Optional) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Race Name <span className="text-muted-foreground font-normal">(opzionale)</span>
              </label>
              <input
                type="text"
                placeholder="es. Campionati Nazionali 2026"
                value={raceName}
                onChange={(e) => setRaceName(e.target.value)}
                className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors max-w-xl"
              />
            </div>

            {/* Mode Tabs */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'quick' | 'advanced')}>
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
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Quick Mode:</strong> Inserisci solo il tempo finale. Genereremo una stima
                    dei segmenti basata su profili tipici di gara.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-5">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Advanced Mode:</strong> Definisci i tuoi segmenti personalizzati con split
                    times, stroke count, ecc.
                  </p>
                </div>

                {/* Custom Segments */}
                <div className="space-y-3">
                  {customSegments.map((seg, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-4 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Start (m)</label>
                        <input
                          type="number"
                          value={seg.startDistance}
                          onChange={(e) =>
                            handleUpdateSegment(idx, 'startDistance', parseFloat(e.target.value))
                          }
                          className="w-full h-9 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">End (m)</label>
                        <input
                          type="number"
                          value={seg.endDistance}
                          onChange={(e) =>
                            handleUpdateSegment(idx, 'endDistance', parseFloat(e.target.value))
                          }
                          className="w-full h-9 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Split (s)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={seg.splitTime ?? ''}
                          onChange={(e) =>
                            handleUpdateSegment(
                              idx,
                              'splitTime',
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )
                          }
                          className="w-full h-9 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Strokes</label>
                        <input
                          type="number"
                          value={seg.strokeCount ?? ''}
                          onChange={(e) =>
                            handleUpdateSegment(
                              idx,
                              'strokeCount',
                              e.target.value ? parseInt(e.target.value) : undefined
                            )
                          }
                          className="w-full h-9 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Notes</label>
                        <input
                          type="text"
                          value={seg.notes ?? ''}
                          onChange={(e) => handleUpdateSegment(idx, 'notes', e.target.value)}
                          className="w-full h-9 px-2.5 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSegment(idx)}
                          disabled={customSegments.length === 1}
                          className="h-9 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddSegment} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Segment
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Analyze Button Footer */}
          <div className="px-6 sm:px-8 py-5 border-t border-border/40 bg-muted/20 rounded-b-2xl">
            <Button onClick={handleAnalyze} size="lg" className="w-full sm:w-auto gap-2 text-base px-8">
              <Activity className="h-4.5 w-4.5" />
              Analyze Race
            </Button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Summary */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              {/* Summary Header */}
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Race Summary
                </h2>
                {raceName && <p className="text-sm text-muted-foreground mt-1">{raceName}</p>}
              </div>

              {/* Metric Cards */}
              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="group p-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 hover:border-border/60 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-foreground/5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Final Time</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {formatSecondsToTime(results.finalTime)}
                    </div>
                  </div>

                  <div className="group p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Trophy className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">WA Points</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{results.points}</div>
                  </div>

                  <div className="group p-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 hover:border-border/60 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-foreground/5">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Base Time</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {formatSecondsToTime(results.baseTime)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">1000 punti</div>
                  </div>

                  <div className="group p-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 hover:border-border/60 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-foreground/5">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Velocity</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {(eventDistance / results.finalTime).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">m/s</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-border/40 bg-muted/20 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveRace} className="gap-2">
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
            </div>

            {/* Segment Table */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Table2 className="h-5 w-5 text-primary" />
                  Segment Analysis
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Dettaglio metriche per ogni segmento di gara</p>
              </div>
              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <SegmentTable segments={results.metrics} />
              </div>
            </div>

            {/* Charts */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-border/40">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Performance Graphs
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Visualizzazione grafica delle performance</p>
              </div>
              <div className="px-6 sm:px-8 py-6 sm:py-8">
                <SegmentCharts segments={results.metrics} />
              </div>
            </div>

            {/* Prediction Module */}
            <PredictionModule
              currentTime={results.finalTime}
              baseTime={results.baseTime}
              currentPoints={results.points}
            />
          </div>
        )}

        {/* Saved Races */}
        {savedRaces.length > 0 && (
          <div className="mt-10 rounded-2xl border border-border/60 p-6 sm:p-8 bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-5">Saved Races</h2>
            <div className="space-y-3">
              {savedRaces.map((race, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{race.name || 'Unnamed Race'}</div>
                    <div className="text-sm text-muted-foreground">
                      {baseTimesData.events.find((e) => e.key === race.event)?.label} •{' '}
                      {race.course} • {race.sex} • {formatSecondsToTime(race.finalTime)}
                      {race.date && ` • ${new Date(race.date).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleLoadRace(race)} className="gap-2">
                      <Upload className="h-4 w-4" />
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRace(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwimAnalyzerPage;
