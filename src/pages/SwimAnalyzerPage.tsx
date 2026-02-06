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
import { Save, Upload, Download, Plus, Trash2 } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Swim Race Analyzer</h1>
          <p className="text-muted-foreground">
            Analizza le tue gare di nuoto con metriche World Aquatics ufficiali
          </p>
        </div>

        {/* Input Form */}
        <div className="rounded-lg border border-border p-6 bg-card mb-8">
          <h2 className="text-2xl font-bold mb-6">Race Details</h2>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event</label>
              <Select value={event} onValueChange={(v) => setEvent(v as EventKey)}>
                <SelectTrigger>
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

            <div>
              <label className="block text-sm font-medium mb-2">Course</label>
              <Select value={course} onValueChange={(v) => setCourse(v as Course)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCM">SCM (25m)</SelectItem>
                  <SelectItem value="LCM">LCM (50m)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sex</label>
              <Select value={sex} onValueChange={(v) => setSex(v as Sex)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Final Time</label>
              <input
                type="text"
                placeholder="e.g., 31.45 or 1:05.30"
                value={finalTimeInput}
                onChange={(e) => setFinalTimeInput(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              />
            </div>
          </div>

          {/* Race Name (Optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Race Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g., National Championships 2026"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
            />
          </div>

          {/* Mode Tabs */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'quick' | 'advanced')}>
            <TabsList className="mb-4">
              <TabsTrigger value="quick">Quick Mode</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="quick" className="space-y-4">
              <div className="p-4 rounded-md bg-muted/30">
                <p className="text-sm">
                  <strong>Quick Mode:</strong> Inserisci solo il tempo finale. Genereremo una stima
                  dei segmenti basata su profili tipici di gara.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="p-4 rounded-md bg-muted/30 mb-4">
                <p className="text-sm">
                  <strong>Advanced Mode:</strong> Definisci i tuoi segmenti personalizzati con split
                  times, stroke count, ecc.
                </p>
              </div>

              {/* Custom Segments */}
              <div className="space-y-3">
                {customSegments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 rounded-md border border-border"
                  >
                    <div>
                      <label className="text-xs text-muted-foreground">Start (m)</label>
                      <input
                        type="number"
                        value={seg.startDistance}
                        onChange={(e) =>
                          handleUpdateSegment(idx, 'startDistance', parseFloat(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">End (m)</label>
                      <input
                        type="number"
                        value={seg.endDistance}
                        onChange={(e) =>
                          handleUpdateSegment(idx, 'endDistance', parseFloat(e.target.value))
                        }
                        className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Split (s)</label>
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
                        className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Strokes</label>
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
                        className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Notes</label>
                      <input
                        type="text"
                        value={seg.notes ?? ''}
                        onChange={(e) => handleUpdateSegment(idx, 'notes', e.target.value)}
                        className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSegment(idx)}
                        disabled={customSegments.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddSegment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Segment
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button onClick={handleAnalyze} size="lg" className="w-full md:w-auto">
              Analyze Race
            </Button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Summary */}
            <div className="rounded-lg border border-border p-6 bg-card">
              <h2 className="text-2xl font-bold mb-4">Race Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">Final Time</div>
                  <div className="text-2xl font-bold">
                    {formatSecondsToTime(results.finalTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">World Aquatics Points</div>
                  <div className="text-2xl font-bold text-primary">{results.points}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Base Time (1000pt)</div>
                  <div className="text-2xl font-bold">
                    {formatSecondsToTime(results.baseTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Average Velocity</div>
                  <div className="text-2xl font-bold">
                    {(eventDistance / results.finalTime).toFixed(2)} m/s
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveRace}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Race
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Segment Table */}
            <div className="rounded-lg border border-border p-6 bg-card">
              <h2 className="text-2xl font-bold mb-4">Segment Analysis</h2>
              <SegmentTable segments={results.metrics} />
            </div>

            {/* Charts */}
            <div className="rounded-lg border border-border p-6 bg-card">
              <h2 className="text-2xl font-bold mb-4">Performance Graphs</h2>
              <SegmentCharts segments={results.metrics} />
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
          <div className="mt-8 rounded-lg border border-border p-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">Saved Races</h2>
            <div className="space-y-2">
              {savedRaces.map((race, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{race.name || 'Unnamed Race'}</div>
                    <div className="text-sm text-muted-foreground">
                      {baseTimesData.events.find((e) => e.key === race.event)?.label} •{' '}
                      {race.course} • {race.sex} • {formatSecondsToTime(race.finalTime)}
                      {race.date && ` • ${new Date(race.date).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleLoadRace(race)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRace(idx)}
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
