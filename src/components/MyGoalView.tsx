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
  Sparkles,
  Plus,
  Loader2,
} from 'lucide-react';
import { UserProfile } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type Perspective = 'Customers' | 'Finance' | 'Internal Process' | 'Learning & Growth';
type TargetType = 'Average' | 'Sum' | 'Last';
type PeriodKey = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  perspective: Perspective;
  weight: number;
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

interface MyGoalViewProps {
  currentUser?: UserProfile;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PERIODS: PeriodKey[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PERSPECTIVE_WEIGHTS: Record<Perspective, number> = {
  Customers: 30,
  Finance: 25,
  'Internal Process': 30,
  'Learning & Growth': 15,
};

const PERSPECTIVE_ORDER: Perspective[] = ['Customers', 'Finance', 'Internal Process', 'Learning & Growth'];

const PERSPECTIVE_COLORS: Record<Perspective, string> = {
  Customers: 'bg-blue-50 text-blue-700 border-blue-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Internal Process': 'bg-violet-50 text-violet-700 border-violet-200',
  'Learning & Growth': 'bg-amber-50 text-amber-700 border-amber-200',
};

// ─── AI Suggestion Generator ─────────────────────────────────────────────────

function fillPeriods(base: number): Record<PeriodKey, number> {
  return Object.fromEntries(PERIODS.map((p) => [p, base])) as Record<PeriodKey, number>;
}

function rampPeriods(start: number, end: number): Record<PeriodKey, number> {
  return Object.fromEntries(
    PERIODS.map((p, i) => [p, Math.round((start + ((end - start) * i) / 11) * 10) / 10])
  ) as Record<PeriodKey, number>;
}

function buildAiSuggestions(position: string, businessUnit: string): KpiDefinition[] {
  const pos = (position + ' ' + businessUnit).toLowerCase();

  // Technology / Digital
  if (pos.includes('tech') || pos.includes('digital') || pos.includes('it ') || pos.includes('system') || pos.includes('data')) {
    return [
      {
        id: `ai-${Date.now()}-01`,
        name: 'Digital Service Satisfaction (CSAT)',
        description: 'Average user satisfaction rating from digital service surveys.',
        perspective: 'Customers',
        weight: 50,
        uom: 'Score (1–5)',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(4.0),
      },
      {
        id: `ai-${Date.now()}-02`,
        name: 'Digital Feature Adoption Rate',
        description: 'Percentage of active users utilizing newly released digital features.',
        perspective: 'Customers',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: rampPeriods(55, 85),
      },
      {
        id: `ai-${Date.now()}-03`,
        name: 'Technology Budget Variance',
        description: 'Deviation of actual technology spend from approved annual budget. Lower is better.',
        perspective: 'Finance',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: false,
        periodTargets: fillPeriods(5),
      },
      {
        id: `ai-${Date.now()}-04`,
        name: 'Digital Initiative ROI',
        description: 'Ratio of actual value delivered vs. investment cost of digital projects.',
        perspective: 'Finance',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(100),
      },
      {
        id: `ai-${Date.now()}-05`,
        name: 'System Uptime & Availability',
        description: 'Percentage uptime of critical digital systems and platforms.',
        perspective: 'Internal Process',
        weight: 35,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(99.5),
      },
      {
        id: `ai-${Date.now()}-06`,
        name: 'Sprint / Feature Delivery Rate',
        description: 'Percentage of committed sprint deliverables completed on time.',
        perspective: 'Internal Process',
        weight: 35,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(85),
      },
      {
        id: `ai-${Date.now()}-07`,
        name: 'Incident Mean Resolution Time',
        description: 'Average time (hours) from incident detection to full resolution. Lower is better.',
        perspective: 'Internal Process',
        weight: 30,
        uom: 'Hours',
        targetType: 'Average',
        higherIsBetter: false,
        periodTargets: fillPeriods(4),
      },
      {
        id: `ai-${Date.now()}-08`,
        name: 'Team Technical Certification Rate',
        description: 'Percentage of team members completing required technical certifications.',
        perspective: 'Learning & Growth',
        weight: 60,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: rampPeriods(70, 95),
      },
      {
        id: `ai-${Date.now()}-09`,
        name: 'Team Engagement Score',
        description: 'Score from quarterly pulse survey measuring team engagement and satisfaction.',
        perspective: 'Learning & Growth',
        weight: 40,
        uom: 'Score (1–5)',
        targetType: 'Last',
        higherIsBetter: true,
        periodTargets: fillPeriods(3.8),
      },
    ];
  }

  // HR / People
  if (pos.includes('hr') || pos.includes('human') || pos.includes('people') || pos.includes('talent')) {
    return [
      {
        id: `ai-${Date.now()}-01`,
        name: 'Employee Satisfaction Index',
        description: 'Score from bi-annual employee satisfaction survey.',
        perspective: 'Customers',
        weight: 60,
        uom: 'Score (1–5)',
        targetType: 'Last',
        higherIsBetter: true,
        periodTargets: fillPeriods(4.0),
      },
      {
        id: `ai-${Date.now()}-02`,
        name: 'Internal Stakeholder Satisfaction',
        description: 'Rating of HR service quality from internal business units.',
        perspective: 'Customers',
        weight: 40,
        uom: 'Score (1–5)',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(4.0),
      },
      {
        id: `ai-${Date.now()}-03`,
        name: 'HR Cost per Employee',
        description: 'Total HR operational cost divided by total headcount.',
        perspective: 'Finance',
        weight: 50,
        uom: 'IDR (Juta)',
        targetType: 'Average',
        higherIsBetter: false,
        periodTargets: fillPeriods(2.5),
      },
      {
        id: `ai-${Date.now()}-04`,
        name: 'Training ROI',
        description: 'Return on investment of training and development programs.',
        perspective: 'Finance',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(120),
      },
      {
        id: `ai-${Date.now()}-05`,
        name: 'Time-to-Fill (Recruitment)',
        description: 'Average calendar days from job opening to accepted offer. Lower is better.',
        perspective: 'Internal Process',
        weight: 40,
        uom: 'Days',
        targetType: 'Average',
        higherIsBetter: false,
        periodTargets: fillPeriods(30),
      },
      {
        id: `ai-${Date.now()}-06`,
        name: 'Employee Retention Rate',
        description: 'Percentage of employees retained vs. previous period.',
        perspective: 'Internal Process',
        weight: 60,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(90),
      },
      {
        id: `ai-${Date.now()}-07`,
        name: 'Training Completion Rate',
        description: 'Percentage of mandatory programs completed by all employees.',
        perspective: 'Learning & Growth',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: rampPeriods(75, 95),
      },
      {
        id: `ai-${Date.now()}-08`,
        name: 'HR Digital Adoption Rate',
        description: 'Percentage of HR processes fully digitized vs. target.',
        perspective: 'Learning & Growth',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: rampPeriods(60, 90),
      },
    ];
  }

  // Finance / Accounting
  if (pos.includes('financ') || pos.includes('account') || pos.includes('treasury') || pos.includes('budget')) {
    return [
      {
        id: `ai-${Date.now()}-01`,
        name: 'Financial Report Accuracy',
        description: 'Percentage of financial reports with zero material errors.',
        perspective: 'Customers',
        weight: 60,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(99),
      },
      {
        id: `ai-${Date.now()}-02`,
        name: 'Stakeholder Reporting Timeliness',
        description: 'Percentage of financial reports delivered by agreed deadlines.',
        perspective: 'Customers',
        weight: 40,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(100),
      },
      {
        id: `ai-${Date.now()}-03`,
        name: 'Budget Utilization Rate',
        description: 'Percentage of approved budget utilized vs. plan.',
        perspective: 'Finance',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(95),
      },
      {
        id: `ai-${Date.now()}-04`,
        name: 'Cost Savings Achievement',
        description: 'Actual cost savings vs. cost-saving target.',
        perspective: 'Finance',
        weight: 50,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: fillPeriods(100),
      },
      {
        id: `ai-${Date.now()}-05`,
        name: 'Month-End Close Cycle Time',
        description: 'Business days to complete month-end close. Lower is better.',
        perspective: 'Internal Process',
        weight: 50,
        uom: 'Days',
        targetType: 'Average',
        higherIsBetter: false,
        periodTargets: fillPeriods(5),
      },
      {
        id: `ai-${Date.now()}-06`,
        name: 'Audit Finding Rate',
        description: 'Number of material findings per audit cycle. Lower is better.',
        perspective: 'Internal Process',
        weight: 50,
        uom: 'Findings',
        targetType: 'Sum',
        higherIsBetter: false,
        periodTargets: fillPeriods(2),
      },
      {
        id: `ai-${Date.now()}-07`,
        name: 'Finance Team Certification Rate',
        description: 'Percentage of finance staff holding relevant professional certifications.',
        perspective: 'Learning & Growth',
        weight: 100,
        uom: '%',
        targetType: 'Average',
        higherIsBetter: true,
        periodTargets: rampPeriods(70, 90),
      },
    ];
  }

  // Default / Generic
  return [
    {
      id: `ai-${Date.now()}-01`,
      name: 'Customer / Stakeholder Satisfaction',
      description: 'Overall satisfaction score from key customers or internal stakeholders.',
      perspective: 'Customers',
      weight: 60,
      uom: 'Score (1–5)',
      targetType: 'Average',
      higherIsBetter: true,
      periodTargets: fillPeriods(4.0),
    },
    {
      id: `ai-${Date.now()}-02`,
      name: 'Service Quality Score',
      description: 'Quality rating of delivered work or service based on defined standards.',
      perspective: 'Customers',
      weight: 40,
      uom: 'Score (1–5)',
      targetType: 'Average',
      higherIsBetter: true,
      periodTargets: fillPeriods(4.0),
    },
    {
      id: `ai-${Date.now()}-03`,
      name: 'Budget Achievement Rate',
      description: 'Actual results vs. financial target for assigned budget.',
      perspective: 'Finance',
      weight: 60,
      uom: '%',
      targetType: 'Average',
      higherIsBetter: true,
      periodTargets: fillPeriods(100),
    },
    {
      id: `ai-${Date.now()}-04`,
      name: 'Operational Cost Efficiency',
      description: 'Percentage of operational costs within approved budget. Lower variance is better.',
      perspective: 'Finance',
      weight: 40,
      uom: '%',
      targetType: 'Average',
      higherIsBetter: false,
      periodTargets: fillPeriods(5),
    },
    {
      id: `ai-${Date.now()}-05`,
      name: 'On-Time Delivery Rate',
      description: 'Percentage of tasks or deliverables completed by the agreed deadline.',
      perspective: 'Internal Process',
      weight: 50,
      uom: '%',
      targetType: 'Average',
      higherIsBetter: true,
      periodTargets: fillPeriods(90),
    },
    {
      id: `ai-${Date.now()}-06`,
      name: 'Process Compliance Rate',
      description: 'Adherence to standard operating procedures and policy requirements.',
      perspective: 'Internal Process',
      weight: 50,
      uom: '%',
      targetType: 'Average',
      higherIsBetter: true,
      periodTargets: fillPeriods(95),
    },
    {
      id: `ai-${Date.now()}-07`,
      name: 'Individual Development Plan Completion',
      description: 'Percentage of IDP activities completed vs. committed plan.',
      perspective: 'Learning & Growth',
      weight: 50,
      uom: '%',
      targetType: 'Average',
      higherIsBetter: true,
      periodTargets: rampPeriods(60, 90),
    },
    {
      id: `ai-${Date.now()}-08`,
      name: 'Competency Assessment Score',
      description: 'Score from competency evaluation aligned to role requirements.',
      perspective: 'Learning & Growth',
      weight: 50,
      uom: 'Score (1–5)',
      targetType: 'Last',
      higherIsBetter: true,
      periodTargets: fillPeriods(3.5),
    },
  ];
}

// ─── Score Helpers ────────────────────────────────────────────────────────────

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
  if (score === null) return 'from-indigo-700 to-indigo-900';
  if (score >= 4) return 'from-emerald-600 to-teal-700';
  if (score >= 3) return 'from-amber-500 to-orange-600';
  return 'from-red-600 to-rose-700';
}

// ─── Empty Target distribution helper ────────────────────────────────────────

function distributeTarget(value: number): Record<PeriodKey, number> {
  return Object.fromEntries(PERIODS.map((p) => [p, value])) as Record<PeriodKey, number>;
}

// ─── Component ───────────────────────────────────────────────────────────────

const BLANK_ACTUALS = (kpiId: string): Record<PeriodKey, PeriodActual> =>
  Object.fromEntries(PERIODS.map((p) => [p, { value: null }])) as Record<PeriodKey, PeriodActual>;

const DEFAULT_ADD_FORM = {
  name: '',
  description: '',
  perspective: 'Customers' as Perspective,
  weight: '50',
  uom: '',
  targetType: 'Average' as TargetType,
  higherIsBetter: true,
  annualTarget: '',
};

export const MyGoalView: React.FC<MyGoalViewProps> = ({ currentUser }) => {
  const position = currentUser?.position ?? 'Employee';
  const businessUnit = currentUser?.businessUnit ?? '';
  const department = currentUser?.department ?? '';

  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' }) as PeriodKey;
  const defaultPeriod: PeriodKey = PERIODS.includes(currentMonth) ? currentMonth : 'Jun';

  // ── Goal data ─────────────────────────────────────────────────────────────
  const [kpiDefs, setKpiDefs] = useState<KpiDefinition[]>([]);
  const [actuals, setActuals] = useState<ActualsMap>({});
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>(defaultPeriod);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<Perspective, boolean>>({
    Customers: false,
    Finance: false,
    'Internal Process': false,
    'Learning & Growth': false,
  });

  // ── AI generation ────────────────────────────────────────────────────────
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<KpiDefinition[] | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  // ── Add Goal modal ───────────────────────────────────────────────────────
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(DEFAULT_ADD_FORM);
  const [addFormError, setAddFormError] = useState('');

  // ── Enter Actual modal ───────────────────────────────────────────────────
  const [editingKpi, setEditingKpi] = useState<KpiDefinition | null>(null);
  const [editDraft, setEditDraft] = useState<Record<PeriodKey, string>>({} as Record<PeriodKey, string>);
  const [editComments, setEditComments] = useState<Record<PeriodKey, string>>({} as Record<PeriodKey, string>);

  // ── Detail modal ─────────────────────────────────────────────────────────
  const [detailKpi, setDetailKpi] = useState<KpiDefinition | null>(null);

  // ── Score calculations ────────────────────────────────────────────────────

  const kpiScores = useMemo(() => {
    return kpiDefs.map((kpi) => {
      const kpiActuals = actuals[kpi.id] ?? ({} as Record<PeriodKey, PeriodActual>);
      const { ytdActual, ytdTarget } = calcYtd(kpi, kpiActuals, selectedPeriod);
      const score = calcScore(kpi, ytdActual, ytdTarget);
      const achievement = ytdActual !== null && ytdTarget !== 0
        ? (kpi.higherIsBetter ? ytdActual / ytdTarget : ytdTarget / ytdActual) * 100
        : null;
      return { kpi, ytdActual, ytdTarget, score, achievement };
    });
  }, [kpiDefs, actuals, selectedPeriod]);

  const perspectiveScores = useMemo(() => {
    return PERSPECTIVE_ORDER.map((perspective) => {
      const relevant = kpiScores.filter((k) => k.kpi.perspective === perspective);
      const weightedScore = relevant.reduce((s, k) => k.score !== null ? s + k.score * k.kpi.weight : s, 0);
      const coveredWeight = relevant.reduce((s, k) => k.score !== null ? s + k.kpi.weight : s, 0);
      const perspScore = coveredWeight > 0 ? weightedScore / coveredWeight : null;
      return { perspective, perspScore, perspWeight: PERSPECTIVE_WEIGHTS[perspective] };
    });
  }, [kpiScores]);

  const overallScore = useMemo(() => {
    let wSum = 0;
    let wCov = 0;
    perspectiveScores.forEach(({ perspScore, perspWeight }) => {
      if (perspScore !== null) { wSum += perspScore * perspWeight; wCov += perspWeight; }
    });
    return wCov > 0 ? wSum / wCov : null;
  }, [perspectiveScores]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleGenerateByAi = async () => {
    setIsAiLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    const suggestions = buildAiSuggestions(position, businessUnit + ' ' + department);
    setAiSuggestions(suggestions);
    setSelectedSuggestions(new Set(suggestions.map((s) => s.id)));
    setIsAiLoading(false);
  };

  const handleAdoptSuggestions = () => {
    if (!aiSuggestions) return;
    const adopted = aiSuggestions.filter((s) => selectedSuggestions.has(s.id));
    const newActuals: ActualsMap = {};
    adopted.forEach((k) => { newActuals[k.id] = BLANK_ACTUALS(k.id); });
    setKpiDefs((prev) => [...prev, ...adopted]);
    setActuals((prev) => ({ ...prev, ...newActuals }));
    setAiSuggestions(null);
  };

  const handleAddGoal = () => {
    if (!addForm.name.trim()) { setAddFormError('Goal Name is required.'); return; }
    if (!addForm.uom.trim()) { setAddFormError('UOM is required.'); return; }
    const target = parseFloat(addForm.annualTarget);
    if (isNaN(target)) { setAddFormError('Annual Target must be a valid number.'); return; }
    const weight = parseInt(addForm.weight);
    if (isNaN(weight) || weight <= 0) { setAddFormError('Weight must be a positive number.'); return; }
    const newKpi: KpiDefinition = {
      id: `manual-${Date.now()}`,
      name: addForm.name.trim(),
      description: addForm.description.trim(),
      perspective: addForm.perspective,
      weight,
      uom: addForm.uom.trim(),
      targetType: addForm.targetType,
      higherIsBetter: addForm.higherIsBetter,
      periodTargets: distributeTarget(target),
    };
    setKpiDefs((prev) => [...prev, newKpi]);
    setActuals((prev) => ({ ...prev, [newKpi.id]: BLANK_ACTUALS(newKpi.id) }));
    setAddForm(DEFAULT_ADD_FORM);
    setAddFormError('');
    setShowAddForm(false);
  };

  const openEditModal = (kpi: KpiDefinition) => {
    const kpiActuals = actuals[kpi.id] ?? ({} as Record<PeriodKey, PeriodActual>);
    const draft = {} as Record<PeriodKey, string>;
    const comments = {} as Record<PeriodKey, string>;
    PERIODS.forEach((p) => {
      draft[p] = kpiActuals[p]?.value !== null && kpiActuals[p]?.value !== undefined ? String(kpiActuals[p].value) : '';
      comments[p] = kpiActuals[p]?.comment ?? '';
    });
    setEditDraft(draft);
    setEditComments(comments);
    setEditingKpi(kpi);
  };

  const handleSaveActuals = () => {
    if (!editingKpi) return;
    const updated = {} as Record<PeriodKey, PeriodActual>;
    PERIODS.forEach((p) => {
      const raw = editDraft[p];
      updated[p] = { value: raw !== '' && !isNaN(Number(raw)) ? Number(raw) : null, comment: editComments[p] || undefined };
    });
    setActuals((prev) => ({ ...prev, [editingKpi.id]: updated }));
    setEditingKpi(null);
  };

  const toggleGroup = (p: Perspective) => setCollapsedGroups((prev) => ({ ...prev, [p]: !prev[p] }));

  // ── AI Loading Overlay ─────────────────────────────────────────────────────

  if (isAiLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-base font-black text-slate-800">AI sedang menganalisis profil Anda...</p>
          <p className="text-sm text-slate-500">Menyesuaikan Goal dengan posisi dan unit bisnis Anda</p>
          <div className="mt-3 inline-flex flex-col items-start gap-1 px-4 py-3 rounded-xl bg-indigo-50 text-left">
            <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Konteks yang Dianalisis</p>
            <p className="text-xs font-semibold text-indigo-800">Posisi: {position}</p>
            <p className="text-xs font-semibold text-indigo-800">Business Unit: {businessUnit || '—'}</p>
            <p className="text-xs font-semibold text-indigo-800">Department: {department || '—'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── AI Suggestion Modal ────────────────────────────────────────────────────

  if (aiSuggestions) {
    return (
      <div className="pb-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">AI Generated Suggestions</p>
                <h2 className="text-sm font-black text-slate-900">Goal yang Direkomendasikan oleh AI</h2>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Berdasarkan posisi <span className="font-bold text-slate-700">{position}</span> di{' '}
              <span className="font-bold text-slate-700">{businessUnit || department || 'unit Anda'}</span>.
              Pilih Goal yang ingin diadopsi, lalu klik <strong>Adopsi Goal Terpilih</strong>.
            </p>
          </div>

          {/* Suggestion list grouped by perspective */}
          <div className="px-6 py-5 space-y-4">
            {PERSPECTIVE_ORDER.map((persp) => {
              const group = aiSuggestions.filter((s) => s.kpi?.perspective === persp || s.perspective === persp);
              if (group.length === 0) return null;
              const colorClass = PERSPECTIVE_COLORS[persp];
              return (
                <div key={persp}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorClass}`}>{persp}</span>
                    <span className="text-[10px] text-slate-400">Bobot perspektif: {PERSPECTIVE_WEIGHTS[persp]}%</span>
                  </div>
                  <div className="space-y-2">
                    {group.map((s) => {
                      const checked = selectedSuggestions.has(s.id);
                      return (
                        <label
                          key={s.id}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checked ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedSuggestions((prev) => {
                                const next = new Set(prev);
                                if (next.has(s.id)) next.delete(s.id);
                                else next.add(s.id);
                                return next;
                              });
                            }}
                            className="mt-0.5 accent-indigo-600"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs font-bold text-slate-800">{s.name}</p>
                              <span className="text-[10px] text-slate-500 bg-slate-200/70 rounded px-1.5 py-0.5">{s.uom}</span>
                              <span className="text-[10px] text-slate-500 bg-slate-200/70 rounded px-1.5 py-0.5">Weight {s.weight}</span>
                              <span className={`text-[10px] rounded px-1.5 py-0.5 ${s.higherIsBetter ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {s.higherIsBetter ? '↑ Higher is better' : '↓ Lower is better'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{s.description}</p>
                            <p className="text-[10px] text-indigo-500 mt-1">
                              Target: <span className="font-bold">{s.periodTargets.Jan.toFixed(1)}</span> {s.uom} per period &nbsp;·&nbsp; {s.targetType}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setAiSuggestions(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleAdoptSuggestions}
              disabled={selectedSuggestions.size === 0}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Adopsi Goal Terpilih ({selectedSuggestions.size})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty State ────────────────────────────────────────────────────────────

  if (kpiDefs.length === 0) {
    return (
      <div className="pb-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Target className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Belum ada Goal yang ditetapkan</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                Goal FY 2025 Anda belum dikonfigurasi oleh sistem. Pilih salah satu cara untuk memulai:
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleGenerateByAi}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Generate by AI
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Goal Manual
              </button>
            </div>
            <div className="mt-2 flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 max-w-md text-left">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700">
                <span className="font-bold">Generate by AI</span> akan membuat saran Goal berdasarkan posisi{' '}
                <span className="font-bold">{position}</span> dan unit bisnis{' '}
                <span className="font-bold">{businessUnit || 'Anda'}</span> secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Add Goal Modal (available in empty state too) */}
        {showAddForm && (
          <AddGoalModal
            form={addForm}
            error={addFormError}
            onChange={(f) => setAddForm(f)}
            onSave={handleAddGoal}
            onClose={() => { setShowAddForm(false); setAddFormError(''); setAddForm(DEFAULT_ADD_FORM); }}
          />
        )}
      </div>
    );
  }

  // ── Scorecard View ─────────────────────────────────────────────────────────

  return (
    <div className="pb-12 space-y-6">

      {/* Scorecard Header */}
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
          <div className="flex items-center gap-3 flex-wrap">
            {/* Add Goal & AI buttons */}
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-bold hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Goal
            </button>
            <button
              onClick={handleGenerateByAi}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-xs font-bold hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate AI
            </button>
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
            {/* Overall Score */}
            <div className="text-center bg-white/20 rounded-2xl px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Overall Score</p>
              <p className="text-3xl font-black text-white leading-none mt-0.5">
                {overallScore !== null ? overallScore.toFixed(2) : '—'}
              </p>
              <p className="text-[10px] text-white/60 mt-0.5">out of 5.00</p>
            </div>
          </div>
        </div>

        {/* Perspective Summary */}
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

      {/* Goals Table by Perspective */}
      {PERSPECTIVE_ORDER.map((perspective) => {
        const group = kpiScores.filter((k) => k.kpi.perspective === perspective);
        if (group.length === 0) return null;
        const perspData = perspectiveScores.find((p) => p.perspective === perspective);
        const isCollapsed = collapsedGroups[perspective];
        const colorClass = PERSPECTIVE_COLORS[perspective];

        return (
          <div key={perspective} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => toggleGroup(perspective)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${colorClass}`}>{perspective}</span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Bobot: {PERSPECTIVE_WEIGHTS[perspective]}% &nbsp;|&nbsp; KPI: {group.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {perspData?.perspScore !== null && (
                  <span className={`text-sm font-black ${scoreColor(perspData?.perspScore ?? null)}`}>
                    Score: {perspData?.perspScore?.toFixed(2)}
                  </span>
                )}
                {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-t border-b border-slate-100">
                      {['Goal Name', 'UOM', 'Weight', 'Target YTD', 'Actual YTD', 'Achievement', 'Score', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {group.map(({ kpi, ytdActual, ytdTarget, score, achievement }) => (
                      <tr key={kpi.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3.5 text-left">
                          <p className="font-semibold text-slate-800 text-xs leading-snug">{kpi.name}</p>
                          {kpi.description && <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{kpi.description}</p>}
                        </td>
                        <td className="px-4 py-3.5 text-center text-xs text-slate-500 whitespace-nowrap">{kpi.uom}</td>
                        <td className="px-4 py-3.5 text-center text-xs font-bold text-slate-700 whitespace-nowrap">{kpi.weight}</td>
                        <td className="px-4 py-3.5 text-center text-xs font-semibold text-slate-700 whitespace-nowrap">{ytdTarget.toFixed(2)}</td>
                        <td className="px-4 py-3.5 text-center text-xs font-semibold whitespace-nowrap">
                          {ytdActual !== null
                            ? <span className={scoreColor(score)}>{ytdActual.toFixed(2)}</span>
                            : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          {achievement !== null ? (
                            <div className="flex items-center justify-center gap-1">
                              {achievement >= 100 ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : achievement >= 90 ? <Minus className="w-3 h-3 text-amber-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                              <span className={`text-xs font-bold ${achievement >= 100 ? 'text-emerald-600' : achievement >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                                {achievement.toFixed(1)}%
                              </span>
                            </div>
                          ) : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          {score !== null
                            ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${scoreBadge(score)}`}>{score.toFixed(2)}</span>
                            : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => setDetailKpi(kpi)} title="View Detail" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => openEditModal(kpi)} title="Enter Actual" className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer">
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

      {/* Enter Actual Modal */}
      {editingKpi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Enter Actual</p>
                <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-snug">{editingKpi.name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{editingKpi.uom} &nbsp;·&nbsp; {editingKpi.targetType}</p>
              </div>
              <button onClick={() => setEditingKpi(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
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
                      {achiev !== null
                        ? <span className={`text-[11px] font-bold ${achiev >= 100 ? 'text-emerald-600' : achiev >= 90 ? 'text-amber-600' : 'text-red-600'}`}>{achiev.toFixed(1)}%</span>
                        : <span className="text-slate-300 text-xs">—</span>}
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
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer">
                <Paperclip className="w-3.5 h-3.5" />
                Attach Evidence
              </button>
              <div className="flex gap-2">
                <button onClick={() => setEditingKpi(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">Cancel</button>
                <button onClick={handleSaveActuals} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Actuals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Detail Modal */}
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
                <button onClick={() => setDetailKpi(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[{ label: 'UOM', val: detailKpi.uom }, { label: 'Weight', val: String(detailKpi.weight) }, { label: 'Aggregation', val: detailKpi.targetType }].map(({ label, val }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{val}</p>
                    </div>
                  ))}
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
                            <td className="px-3 py-2.5 text-center">{actual !== null ? <span className="font-semibold text-slate-800">{actual.toFixed(2)}</span> : <span className="text-slate-300">—</span>}</td>
                            <td className="px-3 py-2.5 text-center">
                              {achiev !== null
                                ? <span className={`font-bold ${achiev >= 100 ? 'text-emerald-600' : achiev >= 90 ? 'text-amber-600' : 'text-red-600'}`}>{achiev.toFixed(1)}%</span>
                                : <span className="text-slate-300">—</span>}
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

      {/* Add Goal Modal */}
      {showAddForm && (
        <AddGoalModal
          form={addForm}
          error={addFormError}
          onChange={(f) => setAddForm(f)}
          onSave={handleAddGoal}
          onClose={() => { setShowAddForm(false); setAddFormError(''); setAddForm(DEFAULT_ADD_FORM); }}
        />
      )}
    </div>
  );
};

// ─── Add Goal Modal (extracted for reuse) ────────────────────────────────────

interface AddGoalModalProps {
  form: typeof DEFAULT_ADD_FORM;
  error: string;
  onChange: (f: typeof DEFAULT_ADD_FORM) => void;
  onSave: () => void;
  onClose: () => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ form, error, onChange, onSave, onClose }) => {
  const set = (k: keyof typeof DEFAULT_ADD_FORM, v: any) => onChange({ ...form, [k]: v });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Manual Entry</p>
            <h3 className="text-sm font-black text-slate-900 mt-0.5">Tambah Goal</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Goal Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Customer Satisfaction Score"
              className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          {/* Description */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Describe what this Goal measures..."
              className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          {/* Perspective + Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Perspective</label>
              <select
                value={form.perspective}
                onChange={(e) => set('perspective', e.target.value as Perspective)}
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {PERSPECTIVE_ORDER.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Weight <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => set('weight', e.target.value)}
                placeholder="50"
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
          {/* UOM + Target Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">UOM <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.uom}
                onChange={(e) => set('uom', e.target.value)}
                placeholder="e.g. %, Score, Units"
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Aggregation</label>
              <select
                value={form.targetType}
                onChange={(e) => set('targetType', e.target.value as TargetType)}
                className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="Average">Average</option>
                <option value="Sum">Sum</option>
                <option value="Last">Last</option>
              </select>
            </div>
          </div>
          {/* Annual Target */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Annual / Period Target <span className="text-red-500">*</span></label>
            <input
              type="number"
              step="any"
              value={form.annualTarget}
              onChange={(e) => set('annualTarget', e.target.value)}
              placeholder="e.g. 90 (applied equally to all 12 periods)"
              className="mt-1 w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <p className="text-[10px] text-slate-400 mt-1">Nilai ini akan digunakan sebagai target untuk setiap periode (Jan–Dec).</p>
          </div>
          {/* Higher is Better */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => set('higherIsBetter', !form.higherIsBetter)}
              className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer focus:outline-none ${form.higherIsBetter ? 'bg-emerald-500' : 'bg-slate-300'}`}
              style={{ height: '22px', width: '40px' }}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.higherIsBetter ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
            <div>
              <p className="text-xs font-bold text-slate-700">{form.higherIsBetter ? 'Higher is Better' : 'Lower is Better'}</p>
              <p className="text-[10px] text-slate-400">{form.higherIsBetter ? 'Semakin tinggi aktual, semakin baik skornya.' : 'Semakin rendah aktual, semakin baik skornya.'}</p>
            </div>
          </div>
          {error && <p className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">Batal</button>
          <button onClick={onSave} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            Tambah Goal
          </button>
        </div>
      </div>
    </div>
  );
};
