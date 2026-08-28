import React, { useState, useMemo } from 'react';
import {
  Target,
  ChevronDown,
  ChevronUp,
  Eye,
  Pencil,
  X,
  CheckCircle2,
  Paperclip,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Perspective = 'Customers' | 'Finance' | 'Internal Process' | 'Learning & Growth';
type TargetType = 'Average' | 'Sum' | 'Last';
type PeriodKey = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  perspective: Perspective;
  weight: number; // percentage, e.g. 10
  uom: string;
  targetType: TargetType;
  higherIsBetter: boolean;
  periodTargets: Record<PeriodKey, number>;
}

interface PeriodActual {
  value: number | null;
  comment?: string;
}

type ActualsMap = Record<string, Record<PeriodKey, PeriodActual>>;

// ─── Static KPI Definitions (injected by Admin) ──────────────────────────────

const PERIODS: PeriodKey[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PERSPECTIVE_WEIGHTS: Record<Perspective, number> = {
  Customers: 30,
  Finance: 25,
  'Internal Process': 30,
  'Learning & Growth': 15,
};

const KPI_DEFINITIONS: KpiDefinition[] = [
  // Customers 30%
  {
    id: 'kpi-01',
    name: 'Customer Satisfaction Score (CSAT)',
    description: 'Average satisfaction rating collected from customer surveys each month.',
    perspective: 'Customers',
    weight: 15,
    uom: 'Score (1–5)',
    targetType: 'Average',
    higherIsBetter: true,
    periodTargets: { Jan: 4.2, Feb: 4.2, Mar: 4.3, Apr: 4.3, May: 4.3, Jun: 4.4, Jul: 4.4, Aug: 4.4, Sep: 4.5, Oct: 4.5, Nov: 4.5, Dec: 4.5 },
  },
  {
    id: 'kpi-02',
    name: 'Customer Complaint Resolution Rate',
    description: 'Percentage of customer complaints resolved within SLA period.',
    perspective: 'Customers',
    weight: 15,
    uom: '%',
    targetType: 'Average',
    higherIsBetter: true,
    periodTargets: { Jan: 90, Feb: 90, Mar: 90, Apr: 92, May: 92, Jun: 92, Jul: 93, Aug: 93, Sep: 93, Oct: 95, Nov: 95, Dec: 95 },
  },
  // Finance 25%
  {
    id: 'kpi-03',
    name: 'Revenue Achievement',
    description: 'Actual revenue vs. revenue target for the period.',
    perspective: 'Finance',
    weight: 15,
    uom: '%',
    targetType: 'Average',
    higherIsBetter: true,
    periodTargets: { Jan: 100, Feb: 100, Mar: 100, Apr: 100, May: 100, Jun: 100, Jul: 100, Aug: 100, Sep: 100, Oct: 100, Nov: 100, Dec: 100 },
  },
  {
    id: 'kpi-04',
    name: 'Budget Variance',
    description: 'Percentage deviation of actual spend from approved budget. Lower is better.',
    perspective: 'Finance',
    weight: 10,
    uom: '%',
    targetType: 'Average',
    higherIsBetter: false,
    periodTargets: { Jan: 5, Feb: 5, Mar: 5, Apr: 5, May: 5, Jun: 5, Jul: 5, Aug: 5, Sep: 5, Oct: 5, Nov: 5, Dec: 5 },
  },
  // Internal Process 30%
  {
    id: 'kpi-05',
    name: 'Process Cycle Time Reduction',
    description: 'Reduction in average end-to-end process cycle time vs. baseline.',
    perspective: 'Internal Process',
    weight: 10,
    uom: '%',
    targetType: 'Average',
    higherIsBetter: true,
    periodTargets: { Jan: 5, Feb: 5, Mar: 7, Apr: 7, May: 8, Jun: 8, Jul: 10, Aug: 10, Sep: 10, Oct: 12, Nov: 12, Dec: 12 },
  },
  {
    id: 'kpi-06',
    name: 'On-Time Delivery Rate',
    description: 'Percentage of deliverables/projects completed by agreed deadline.',
    perspective: 'Internal Process',
    weight: 10,
    uom: '%',
    targetType: 'Average',
    higherIsBetter: true,
    periodTargets: { Jan: 85, Feb: 85, Mar: 87, Apr: 87, May: 88, Jun: 88, Jul: 90, Aug: 90, Sep: 90, Oct: 92, Nov: 92, Dec: 92 },
  },
  {
    id: 'kpi-07',
    name: 'Compliance Audit Score',
    description: 'Score from internal/external compliance audit (scale 0–100).',
    perspective: 'Internal Process',
    weight: 10,
    uom: 'Score',
    targetType: 'Last',
    higherIsBetter: true,
    periodTargets: { Jan: 80, Feb: 80, Mar: 80, Apr: 82, May: 82, Jun: 82, Jul: 85, Aug: 85, Sep: 85, Oct: 88, Nov: 88, Dec: 88 },
  },
  // Learning & Growth 15%
  {
    id: 'kpi-08',
    name: 'Training Completion Rate',
    description: 'Percentage of mandatory training programs completed by team members.',
    perspective: 'Learning & Growth',
    weight: 8,
    uom: '%',
    targetType: 'Average',
    higherIsBetter: true,
    periodTargets: { Jan: 80, Feb: 80, Mar: 85, Apr: 85, May: 90, Jun: 90, Jul: 90, Aug: 90, Sep: 90, Oct: 95, Nov: 95, Dec: 95 },
  },
  {
    id: 'kpi-09',
    name: 'Employee Engagement Score',
    description: 'Score from quarterly pulse survey measuring team engagement and morale.',
    perspective: 'Learning & Growth',
    weight: 7,
    uom: 'Score (1–5)',
    targetType: 'Last',
    higherIsBetter: true,
    periodTargets: { Jan: 3.8, Feb: 3.8, Mar: 3.9, Apr: 3.9, May: 3.9, Jun: 4.0, Jul: 4.0, Aug: 4.0, Sep: 4.0, Oct: 4.1, Nov: 4.1, Dec: 4.1 },
  },
];

// ─── Pre-populated actuals (Jan–Jun 2025) ────────────────────────────────────

const INITIAL_ACTUALS: ActualsMap = {
  'kpi-01': { Jan: { value: 4.1 }, Feb: { value: 4.3 }, Mar: { value: 4.2 }, Apr: { value: 4.4 }, May: { value: 4.3 }, Jun: { value: 4.5 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-02': { Jan: { value: 88 }, Feb: { value: 91 }, Mar: { value: 93 }, Apr: { value: 90 }, May: { value: 94 }, Jun: { value: 96 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-03': { Jan: { value: 98 }, Feb: { value: 102 }, Mar: { value: 100 }, Apr: { value: 97 }, May: { value: 101 }, Jun: { value: 103 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-04': { Jan: { value: 4.2 }, Feb: { value: 3.8 }, Mar: { value: 5.1 }, Apr: { value: 4.5 }, May: { value: 3.9 }, Jun: { value: 4.7 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-05': { Jan: { value: 4 }, Feb: { value: 6 }, Mar: { value: 7 }, Apr: { value: 8 }, May: { value: 9 }, Jun: { value: 10 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-06': { Jan: { value: 83 }, Feb: { value: 86 }, Mar: { value: 88 }, Apr: { value: 87 }, May: { value: 90 }, Jun: { value: 92 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-07': { Jan: { value: null }, Feb: { value: null }, Mar: { value: 81 }, Apr: { value: null }, May: { value: null }, Jun: { value: 84 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-08': { Jan: { value: 78 }, Feb: { value: 82 }, Mar: { value: 85 }, Apr: { value: 88 }, May: { value: 90 }, Jun: { value: 92 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
  'kpi-09': { Jan: { value: null }, Feb: { value: null }, Mar: { value: 3.8 }, Apr: { value: null }, May: { value: null }, Jun: { value: 4.0 }, Jul: { value: null }, Aug: { value: null }, Sep: { value: null }, Oct: { value: null }, Nov: { value: null }, Dec: { value: null } },
};

// ─── Score helpers ────────────────────────────────────────────────────────────

function calcYtd(kpi: KpiDefinition, actuals: Record<PeriodKey, PeriodActual>, upTo: PeriodKey): { ytdActual: number | null; ytdTarget: number } {
  const upToIdx = PERIODS.indexOf(upTo);
  const slice = PERIODS.slice(0, upToIdx + 1);
  const filled = slice.map((p) => actuals[p]?.value ?? null).filter((v): v is number => v !== null);
  const targets = slice.map((p) => kpi.periodTargets[p]);

  let ytdActual: number | null = null;
  let ytdTarget: number;

  if (kpi.targetType === 'Average') {
    ytdActual = filled.length > 0 ? filled.reduce((a, b) => a + b, 0) / filled.length : null;
    ytdTarget = targets.reduce((a, b) => a + b, 0) / targets.length;
  } else if (kpi.targetType === 'Sum') {
    ytdActual = filled.length > 0 ? filled.reduce((a, b) => a + b, 0) : null;
    ytdTarget = targets.reduce((a, b) => a + b, 0);
  } else {
    // Last
    const lastFilled = [...filled].reverse()[0] ?? null;
    ytdActual = lastFilled;
    ytdTarget = [...targets].reverse()[0];
  }

  return { ytdActual, ytdTarget };
}

function calcScore(kpi: KpiDefinition, ytdActual: number | null, ytdTarget: number): number | null {
  if (ytdActual === null || ytdTarget === 0) return null;
  const ratio = kpi.higherIsBetter ? ytdActual / ytdTarget : ytdTarget / ytdActual;
  return Math.min(5, Math.max(1, ratio * 3));
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-slate-400';
  if (score >= 4) return 'text-emerald-600';
  if (score >= 3) return 'text-amber-600';
  return 'text-red-600';
}

function scoreBadge(score: number | null): string {
  if (score === null) return 'bg-slate-100 text-slate-500';
  if (score >= 4) return 'bg-emerald-100 text-emerald-700';
  if (score >= 3) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function overallBg(score: number | null): string {
  if (score === null) return 'from-slate-600 to-slate-700';
  if (score >= 4) return 'from-emerald-600 to-teal-700';
  if (score >= 3) return 'from-amber-500 to-orange-600';
  return 'from-red-600 to-rose-700';
}

const PERSPECTIVE_ORDER: Perspective[] = ['Customers', 'Finance', 'Internal Process', 'Learning & Growth'];

const PERSPECTIVE_COLORS: Record<Perspective, string> = {
  Customers: 'bg-blue-50 text-blue-700 border-blue-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Internal Process': 'bg-violet-50 text-violet-700 border-violet-200',
  'Learning & Growth': 'bg-amber-50 text-amber-700 border-amber-200',
};

// ─── Component ───────────────────────────────────────────────────────────────

export const MyGoalView: React.FC = () => {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }) as PeriodKey;
  const defaultPeriod: PeriodKey = PERIODS.includes(currentMonth) ? currentMonth : 'Jun';

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>(defaultPeriod);
  const [actuals, setActuals] = useState<ActualsMap>(INITIAL_ACTUALS);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<Perspective, boolean>>({
    Customers: false,
    Finance: false,
    'Internal Process': false,
    'Learning & Growth': false,
  });

  // Enter Actual modal
  const [editingKpi, setEditingKpi] = useState<KpiDefinition | null>(null);
  const [editDraft, setEditDraft] = useState<Record<PeriodKey, string>>({} as Record<PeriodKey, string>);
  const [editComments, setEditComments] = useState<Record<PeriodKey, string>>({} as Record<PeriodKey, string>);

  // Detail modal
  const [detailKpi, setDetailKpi] = useState<KpiDefinition | null>(null);

  // ── Score calculations ─────────────────────────────────────────────────────

  const kpiScores = useMemo(() => {
    return KPI_DEFINITIONS.map((kpi) => {
      const kpiActuals = actuals[kpi.id] ?? ({} as Record<PeriodKey, PeriodActual>);
      const { ytdActual, ytdTarget } = calcYtd(kpi, kpiActuals, selectedPeriod);
      const score = calcScore(kpi, ytdActual, ytdTarget);
      const achievement = ytdActual !== null && ytdTarget !== 0
        ? (kpi.higherIsBetter ? (ytdActual / ytdTarget) * 100 : (ytdTarget / ytdActual) * 100)
        : null;
      return { kpi, ytdActual, ytdTarget, score, achievement };
    });
  }, [actuals, selectedPeriod]);

  const perspectiveScores = useMemo(() => {
    return PERSPECTIVE_ORDER.map((perspective) => {
      const relevant = kpiScores.filter((k) => k.kpi.perspective === perspective);
      const totalWeight = relevant.reduce((s, k) => s + k.kpi.weight, 0);
      const weightedScore = relevant.reduce((s, k) => {
        if (k.score === null) return s;
        return s + (k.score * k.kpi.weight);
      }, 0);
      const coveredWeight = relevant.reduce((s, k) => k.score !== null ? s + k.kpi.weight : s, 0);
      const perspScore = coveredWeight > 0 ? weightedScore / coveredWeight : null;
      const perspWeight = PERSPECTIVE_WEIGHTS[perspective];
      return { perspective, perspScore, perspWeight, totalWeight };
    });
  }, [kpiScores]);

  const overallScore = useMemo(() => {
    let weightedSum = 0;
    let coveredWeight = 0;
    perspectiveScores.forEach(({ perspScore, perspWeight }) => {
      if (perspScore !== null) {
        weightedSum += perspScore * perspWeight;
        coveredWeight += perspWeight;
      }
    });
    return coveredWeight > 0 ? weightedSum / coveredWeight : null;
  }, [perspectiveScores]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const openEditModal = (kpi: KpiDefinition) => {
    const kpiActuals = actuals[kpi.id] ?? ({} as Record<PeriodKey, PeriodActual>);
    const draft: Record<PeriodKey, string> = {} as Record<PeriodKey, string>;
    const comments: Record<PeriodKey, string> = {} as Record<PeriodKey, string>;
    PERIODS.forEach((p) => {
      draft[p] = kpiActuals[p]?.value !== null && kpiActuals[p]?.value !== undefined
        ? String(kpiActuals[p].value)
        : '';
      comments[p] = kpiActuals[p]?.comment ?? '';
    });
    setEditDraft(draft);
    setEditComments(comments);
    setEditingKpi(kpi);
  };

  const handleSaveActuals = () => {
    if (!editingKpi) return;
    const updated: Record<PeriodKey, PeriodActual> = {} as Record<PeriodKey, PeriodActual>;
    PERIODS.forEach((p) => {
      const raw = editDraft[p];
      updated[p] = {
        value: raw !== '' && !isNaN(Number(raw)) ? Number(raw) : null,
        comment: editComments[p] || undefined,
      };
    });
    setActuals((prev) => ({ ...prev, [editingKpi.id]: updated }));
    setEditingKpi(null);
  };

  const toggleGroup = (p: Perspective) => {
    setCollapsedGroups((prev) => ({ ...prev, [p]: !prev[p] }));
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="pb-12 space-y-6">

      {/* ── Scorecard Header ── */}
      <div className={`rounded-2xl bg-gradient-to-br ${overallBg(overallScore)} text-white shadow-lg overflow-hidden`}>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Annual Scorecard</p>
              <h1 className="text-lg font-black text-white leading-tight">My Goal — FY 2025</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as PeriodKey)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p} className="text-slate-800 bg-white">{p} 2025</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/70 pointer-events-none" />
            </div>
            {/* Overall Score Badge */}
            <div className="text-center bg-white/20 rounded-2xl px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Overall Score</p>
              <p className="text-3xl font-black text-white leading-none mt-0.5">
                {overallScore !== null ? overallScore.toFixed(2) : '—'}
              </p>
              <p className="text-[10px] text-white/60 mt-0.5">out of 5.00</p>
            </div>
          </div>
        </div>

        {/* Perspective Summary Row */}
        <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {perspectiveScores.map(({ perspective, perspScore, perspWeight }) => (
            <div key={perspective} className="bg-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/60 truncate">{perspective}</p>
              <p className="text-[10px] text-white/50">{perspWeight}% weight</p>
              <p className={`text-xl font-black leading-tight mt-1 ${perspScore !== null ? 'text-white' : 'text-white/40'}`}>
                {perspScore !== null ? perspScore.toFixed(2) : '—'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Goals Table by Perspective ── */}
      {PERSPECTIVE_ORDER.map((perspective) => {
        const group = kpiScores.filter((k) => k.kpi.perspective === perspective);
        const perspData = perspectiveScores.find((p) => p.perspective === perspective);
        const isCollapsed = collapsedGroups[perspective];
        const colorClass = PERSPECTIVE_COLORS[perspective];

        return (
          <div key={perspective} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(perspective)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${colorClass}`}>
                  {perspective}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Weight: {PERSPECTIVE_WEIGHTS[perspective]}% &nbsp;|&nbsp; KPIs: {group.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {perspData?.perspScore !== null && (
                  <span className={`text-sm font-black ${scoreColor(perspData?.perspScore ?? null)}`}>
                    Score: {perspData?.perspScore?.toFixed(2)}
                  </span>
                )}
                {isCollapsed
                  ? <ChevronDown className="w-4 h-4 text-slate-400" />
                  : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-t border-b border-slate-100">
                      {['Goal Name', 'UOM', 'Weight', 'Target YTD', 'Actual YTD', 'Achievement', 'Score', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.map(({ kpi, ytdActual, ytdTarget, score, achievement }) => (
                      <tr key={kpi.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5 text-left">
                          <p className="font-semibold text-slate-800 text-xs leading-snug">{kpi.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{kpi.description}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center text-xs text-slate-500 whitespace-nowrap">{kpi.uom}</td>
                        <td className="px-4 py-3.5 text-center text-xs font-bold text-slate-700 whitespace-nowrap">{kpi.weight}%</td>
                        <td className="px-4 py-3.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap">
                          {ytdTarget.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-center text-xs font-semibold whitespace-nowrap">
                          {ytdActual !== null
                            ? <span className={scoreColor(score)}>{ytdActual.toFixed(2)}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          {achievement !== null ? (
                            <div className="flex items-center justify-center gap-1">
                              {achievement >= 100
                                ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                                : achievement >= 90
                                ? <Minus className="w-3 h-3 text-amber-500" />
                                : <TrendingDown className="w-3 h-3 text-red-500" />}
                              <span className={`text-xs font-bold ${achievement >= 100 ? 'text-emerald-600' : achievement >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                                {achievement.toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          {score !== null ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${scoreBadge(score)}`}>
                              {score.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setDetailKpi(kpi)}
                              title="View Detail"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(kpi)}
                              title="Enter Actual"
                              className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Enter Actual Modal ── */}
      {editingKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Enter Actual</p>
                <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-snug">{editingKpi.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{editingKpi.uom} &nbsp;·&nbsp; {editingKpi.targetType}</p>
              </div>
              <button onClick={() => setEditingKpi(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Period Rows */}
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
              <div className="grid grid-cols-12 gap-2 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <div className="col-span-2">Period</div>
                <div className="col-span-2 text-right">Target</div>
                <div className="col-span-3 text-center">Actual</div>
                <div className="col-span-2 text-center">Achievement</div>
                <div className="col-span-3 text-center">Comment</div>
              </div>
              {PERIODS.map((period) => {
                const target = editingKpi.periodTargets[period];
                const rawVal = editDraft[period];
                const numVal = rawVal !== '' && !isNaN(Number(rawVal)) ? Number(rawVal) : null;
                const achiev = numVal !== null && target !== 0
                  ? (editingKpi.higherIsBetter ? numVal / target : target / numVal) * 100
                  : null;
                const isPast = PERIODS.indexOf(period) <= PERIODS.indexOf(selectedPeriod);
                return (
                  <div key={period} className={`grid grid-cols-12 gap-2 items-center rounded-xl px-3 py-2 ${isPast ? 'bg-slate-50' : 'bg-white border border-dashed border-slate-200'}`}>
                    <div className="col-span-2">
                      <span className={`text-[11px] font-bold ${isPast ? 'text-slate-700' : 'text-slate-400'}`}>{period} 2025</span>
                    </div>
                    <div className="col-span-2 text-right text-[11px] text-slate-500 font-semibold">{target.toFixed(2)}</div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="any"
                        placeholder="—"
                        value={editDraft[period]}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, [period]: e.target.value }))}
                        className="w-full text-center text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                    <div className="col-span-2 text-center">
                      {achiev !== null ? (
                        <span className={`text-[11px] font-bold ${achiev >= 100 ? 'text-emerald-600' : achiev >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                          {achiev.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Notes..."
                        value={editComments[period]}
                        onChange={(e) => setEditComments((prev) => ({ ...prev, [period]: e.target.value }))}
                        className="w-full text-[11px] border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">
                <Paperclip className="w-3.5 h-3.5" />
                Attach Evidence
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingKpi(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveActuals}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Actuals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── KPI Detail Modal ── */}
      {detailKpi && (() => {
        const kpiActuals = actuals[detailKpi.id] ?? ({} as Record<PeriodKey, PeriodActual>);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">{detailKpi.perspective}</p>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">{detailKpi.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{detailKpi.description}</p>
                </div>
                <button onClick={() => setDetailKpi(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">UOM</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{detailKpi.uom}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Weight</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{detailKpi.weight}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Aggregation</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{detailKpi.targetType}</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Period', 'Target', 'Actual', 'Achievement', 'Comment'].map((h) => (
                          <th key={h} className="px-3 py-2.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PERIODS.map((period) => {
                        const target = detailKpi.periodTargets[period];
                        const actual = kpiActuals[period]?.value ?? null;
                        const comment = kpiActuals[period]?.comment;
                        const achiev = actual !== null && target !== 0
                          ? (detailKpi.higherIsBetter ? actual / target : target / actual) * 100
                          : null;
                        return (
                          <tr key={period} className="hover:bg-slate-50/60">
                            <td className="px-3 py-2.5 text-center font-semibold text-slate-700">{period}</td>
                            <td className="px-3 py-2.5 text-center text-slate-600">{target.toFixed(2)}</td>
                            <td className="px-3 py-2.5 text-center">
                              {actual !== null ? <span className="font-semibold text-slate-800">{actual.toFixed(2)}</span> : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {achiev !== null ? (
                                <span className={`font-bold ${achiev >= 100 ? 'text-emerald-600' : achiev >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                                  {achiev.toFixed(1)}%
                                </span>
                              ) : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-3 py-2.5 text-center text-slate-500 text-[11px]">{comment ?? '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
