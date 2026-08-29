import { useState } from 'react';
import {
  Brain, BarChart3, Target, Star, AlertTriangle, Heart,
  ChevronDown, ChevronUp, Award, Users, TrendingUp,
  Lightbulb, Shield, Zap, BookOpen, ClipboardList,
} from 'lucide-react';
import type { UserProfile, HoganScaleScore } from '../../types';

interface AssessmentViewProps {
  user: UserProfile;
}

type ActiveTab = 'overview' | 'hpi' | 'hds' | 'mvpi' | 'reasoning' | 'other';

const TAB_CONFIG: { id: ActiveTab; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'overview', label: 'Overview', icon: Brain, color: 'indigo' },
  { id: 'hpi', label: 'HPI – Personality', icon: Star, color: 'violet' },
  { id: 'hds', label: 'HDS – Derailers', icon: AlertTriangle, color: 'amber' },
  { id: 'mvpi', label: 'MVPI – Values', icon: Heart, color: 'emerald' },
  { id: 'reasoning', label: 'Business Reasoning', icon: BarChart3, color: 'sky' },
  { id: 'other', label: 'Other Assessments', icon: ClipboardList, color: 'rose' },
];

const LEVEL_COLORS: Record<string, { bar: string; badge: string; text: string }> = {
  low:      { bar: 'bg-slate-300',  badge: 'bg-slate-100 text-slate-600 border-slate-200',   text: 'text-slate-600' },
  moderate: { bar: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200',    text: 'text-amber-700' },
  high:     { bar: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', text: 'text-indigo-700' },
};

const HDS_LEVEL_COLORS: Record<string, { bar: string; badge: string; text: string }> = {
  low:      { bar: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'text-emerald-700' },
  moderate: { bar: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-200',       text: 'text-amber-700' },
  high:     { bar: 'bg-rose-400',    badge: 'bg-rose-50 text-rose-700 border-rose-200',           text: 'text-rose-700' },
};

function ScaleBar({ scale, isDerailer = false, expanded, onToggle }: {
  scale: HoganScaleScore;
  isDerailer?: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colors = isDerailer ? HDS_LEVEL_COLORS[scale.level] : LEVEL_COLORS[scale.level];
  const levelLabel = isDerailer
    ? ({ low: 'Low Risk', moderate: 'Moderate Risk', high: 'High Risk' }[scale.level])
    : ({ low: 'Low', moderate: 'Moderate', high: 'High' }[scale.level]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50/60 transition-colors"
      >
        <div className="w-10 text-center">
          <span className="text-[11px] font-black text-slate-500 tracking-widest uppercase">{scale.abbreviation}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] font-bold text-slate-800">{scale.scale}</span>
            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${colors.badge}`}>{levelLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                style={{ width: `${scale.score}%` }}
              />
            </div>
            <span className={`text-[13px] font-black w-8 text-right ${colors.text}`}>{scale.score}</span>
          </div>
        </div>
        <div className="text-slate-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-4 pt-0 border-t border-slate-100">
          <p className="text-[12.5px] text-slate-600 leading-relaxed mt-3">{scale.interpretation}</p>
        </div>
      )}
    </div>
  );
}

function RadarStat({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    violet: 'text-violet-600 bg-violet-50 border-violet-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
    sky: 'text-sky-600 bg-sky-50 border-sky-200',
    rose: 'text-rose-600 bg-rose-50 border-rose-200',
  };
  const barMap: Record<string, string> = {
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-400',
    sky: 'bg-sky-500',
    rose: 'bg-rose-500',
  };
  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={`text-[11px] font-black border px-2 py-0.5 rounded-full ${colorMap[color]}`}>{value}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barMap[color]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function AssessmentView({ user }: AssessmentViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [expandedScales, setExpandedScales] = useState<Record<string, boolean>>({});
  const hogan = user.hoganAssessment;
  const others = user.otherAssessments ?? [];

  const toggleScale = (key: string) =>
    setExpandedScales(prev => ({ ...prev, [key]: !prev[key] }));

  if (!hogan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">My Assessment</h2>
        <p className="text-sm text-slate-500">Belum ada data asesmen yang tersedia.</p>
      </div>
    );
  }

  const hp = hogan.highPotential;
  const br = hogan.businessReasoning;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Page Header ── */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Brain className="w-7 h-7 text-indigo-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-black tracking-tight">My Assessment</h1>
              <span className="text-[10.5px] font-bold bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-indigo-200">
                Hogan Suite · {hogan.reportVersion ?? ''}
              </span>
            </div>
            <p className="text-sm text-indigo-200/80 mb-3">
              Hasil asesmen psikometrik &amp; kompetensi kepemimpinan · {user.name}
            </p>
            <div className="flex flex-wrap gap-3 text-[11.5px] text-slate-300">
              <span className="flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5 text-indigo-300" /> Tanggal: {hogan.assessmentDate}</span>
              {hogan.assessedBy && (
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-300" /> {hogan.assessedBy}</span>
              )}
            </div>
          </div>
          {hp && (
            <div className="shrink-0 flex flex-col items-center bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-1">High Potential Score</span>
              <span className="text-4xl font-black text-white">{hp.overallScore}</span>
              <span className="text-[10.5px] font-bold text-emerald-300 mt-0.5 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">{hp.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-1.5 flex-wrap">
        {TAB_CONFIG.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const activeStyle: Record<string, string> = {
            indigo: 'bg-indigo-600 text-white shadow-md',
            violet: 'bg-violet-600 text-white shadow-md',
            amber:  'bg-amber-500 text-white shadow-md',
            emerald:'bg-emerald-600 text-white shadow-md',
            sky:    'bg-sky-600 text-white shadow-md',
            rose:   'bg-rose-600 text-white shadow-md',
          };
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all ${
                isActive
                  ? activeStyle[tab.color]
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          TAB: OVERVIEW
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in duration-200">

          {/* Quick stats row */}
          {hp && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <RadarStat label="Leadership Foundations" value={hp.leadershipFoundations} color="indigo" />
              <RadarStat label="Leadership Emergence" value={hp.leadershipEmergence} color="violet" />
              <RadarStat label="Leadership Effectiveness" value={hp.leadershipEffectiveness} color="emerald" />
              {br && <RadarStat label="Business Reasoning" value={br.overallPercentile} color="sky" />}
            </div>
          )}

          {/* Executive Summary */}
          {hogan.executiveSummary && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-700">Executive Summary</span>
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed">{hogan.executiveSummary}</p>
            </div>
          )}

          {/* High Potential narrative */}
          {hp?.narrative && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">High Potential Assessment</span>
                <span className="ml-auto text-[10.5px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">{hp.category}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Foundations', val: hp.leadershipFoundations, color: 'bg-indigo-500' },
                  { label: 'Emergence', val: hp.leadershipEmergence, color: 'bg-violet-500' },
                  { label: 'Effectiveness', val: hp.leadershipEffectiveness, color: 'bg-emerald-500' },
                ].map(d => (
                  <div key={d.label} className="bg-white/70 rounded-xl p-3 text-center border border-white">
                    <div className="text-2xl font-black text-slate-800 mb-1">{d.val}</div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.val}%` }} />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{d.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed">{hp.narrative}</p>
            </div>
          )}

          {/* HPI Top-3 highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-violet-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-violet-700">Top Personality Strengths (HPI)</span>
              </div>
              {[...hogan.hpi].sort((a, b) => b.score - a.score).slice(0, 3).map(s => (
                <div key={s.scale} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12.5px] font-semibold text-slate-700">{s.scale}</span>
                      <span className="text-[12px] font-black text-indigo-600">{s.score}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-400 rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-700">Watch-Out Derailers (HDS)</span>
              </div>
              {[...hogan.hds].filter(s => s.level === 'high').slice(0, 3).map(s => (
                <div key={s.scale} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12.5px] font-semibold text-slate-700">{s.scale}</span>
                      <span className="text-[12px] font-black text-rose-600">{s.score}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {hogan.hds.filter(s => s.level === 'high').length === 0 && (
                <p className="text-[12px] text-emerald-600 font-medium">No high-risk derailers identified.</p>
              )}
            </div>
          </div>

          {/* Top MVPI values */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700">Core Values & Motivators (MVPI)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[...hogan.mvpi].sort((a, b) => b.score - a.score).slice(0, 5).map(s => (
                <div key={s.scale} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-2xl font-black text-emerald-700">{s.score}</span>
                  <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{s.scale}</span>
                  <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: HPI
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'hpi' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
            <div className="flex items-start gap-3">
              <Star className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[12px] font-black text-violet-800 mb-0.5">HPI – Hogan Personality Inventory</p>
                <p className="text-[11.5px] text-violet-700 leading-relaxed">
                  Mengukur kepribadian normal sehari-hari yang mempengaruhi efektivitas kerja, gaya kepemimpinan, dan hubungan antarpribadi.
                  Skor dinyatakan dalam persentil (0–99). Skor tinggi mencerminkan kekuatan utama.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {hogan.hpi.map(s => (
              <ScaleBar
                key={s.scale}
                scale={s}
                isDerailer={false}
                expanded={!!expandedScales[`hpi-${s.scale}`]}
                onToggle={() => toggleScale(`hpi-${s.scale}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: HDS
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'hds' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[12px] font-black text-amber-800 mb-0.5">HDS – Hogan Development Survey (Derailers)</p>
                <p className="text-[11.5px] text-amber-700 leading-relaxed">
                  Mengidentifikasi perilaku counter-productive yang muncul saat stres atau tekanan. Skor <strong>tinggi</strong> menunjukkan risiko derailment lebih besar.
                  Skor rendah berarti risiko minim pada skala tersebut.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-1">
            {(['low', 'moderate', 'high'] as const).map(lvl => (
              <div key={lvl} className={`p-3 rounded-xl text-center border ${HDS_LEVEL_COLORS[lvl].badge}`}>
                <div className="text-[10px] font-black uppercase tracking-wider mb-0.5">
                  {lvl === 'low' ? 'Low Risk' : lvl === 'moderate' ? 'Moderate Risk' : 'High Risk'}
                </div>
                <div className="text-lg font-black">
                  {hogan.hds.filter(s => s.level === lvl).length}
                </div>
                <div className="text-[10px]">skala</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {hogan.hds.map(s => (
              <ScaleBar
                key={s.scale}
                scale={s}
                isDerailer={true}
                expanded={!!expandedScales[`hds-${s.scale}`]}
                onToggle={() => toggleScale(`hds-${s.scale}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: MVPI
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'mvpi' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[12px] font-black text-emerald-800 mb-0.5">MVPI – Motives, Values, Preferences Inventory</p>
                <p className="text-[11.5px] text-emerald-700 leading-relaxed">
                  Mengidentifikasi nilai-nilai inti, motivator karir, dan lingkungan kerja ideal.
                  Skor tinggi menunjukkan nilai yang sangat penting bagi individu dan mempengaruhi budaya yang dipilih.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-2">
            {[...hogan.mvpi].sort((a, b) => b.score - a.score).map((s, i) => (
              <div
                key={s.scale}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border ${
                  i < 3
                    ? 'bg-emerald-50 border-emerald-200'
                    : i >= hogan.mvpi.length - 2
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-slate-100'
                }`}
              >
                <span className={`text-2xl font-black ${i < 3 ? 'text-emerald-700' : 'text-slate-600'}`}>{s.score}</span>
                <span className="text-[9.5px] font-bold text-slate-600 text-center leading-tight">{s.scale}</span>
                {i < 3 && <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">TOP</span>}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[...hogan.mvpi].sort((a, b) => b.score - a.score).map(s => (
              <ScaleBar
                key={s.scale}
                scale={s}
                isDerailer={false}
                expanded={!!expandedScales[`mvpi-${s.scale}`]}
                onToggle={() => toggleScale(`mvpi-${s.scale}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: BUSINESS REASONING
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'reasoning' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {br ? (
            <>
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-black text-sky-800 mb-0.5">Hogan Business Reasoning Inventory (HBRI)</p>
                    <p className="text-[11.5px] text-sky-700 leading-relaxed">
                      Mengukur kemampuan penalaran strategis dan analitis. Skor dinyatakan dalam persentil relatif terhadap populasi manajer global.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Qualitative Reasoning</span>
                  <span className="text-5xl font-black text-sky-600 block mb-2">{br.qualitative}</span>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mx-4">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${br.qualitative}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Persentil</p>
                </div>
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Quantitative Reasoning</span>
                  <span className="text-5xl font-black text-indigo-600 block mb-2">{br.quantitative}</span>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mx-4">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${br.quantitative}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">Persentil</p>
                </div>
                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 shadow-xs text-center flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-2">Overall Percentile</span>
                  <span className="text-5xl font-black text-indigo-700 block mb-2">{br.overallPercentile}</span>
                  <span className="text-[11px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-0.5 rounded-full">{br.cognitiveStyle}</span>
                </div>
              </div>

              {/* Cognitive style diagram */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Cognitive Style Quadrant</p>
                <div className="relative h-48 bg-gradient-to-br from-sky-50 via-white to-indigo-50 rounded-2xl border border-slate-100 overflow-hidden">
                  {/* Axis labels */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">High Qualitative</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Low Qualitative</div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)' }}>Low Quant</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-wider" style={{ writingMode: 'vertical-rl' }}>High Quant</div>
                  {/* Crosshairs */}
                  <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-slate-200" /></div>
                  <div className="absolute inset-0 flex justify-center"><div className="h-full w-px bg-slate-200" /></div>
                  {/* Dot */}
                  <div
                    className="absolute w-5 h-5 rounded-full bg-indigo-600 border-2 border-white shadow-lg flex items-center justify-center"
                    style={{
                      left: `${(br.quantitative / 100) * 85 + 7}%`,
                      top: `${(1 - br.qualitative / 100) * 80 + 10}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span className="text-[7px] font-black text-white">★</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[12.5px] text-slate-700 leading-relaxed">{br.description}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Data Business Reasoning belum tersedia.</p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          TAB: OTHER ASSESSMENTS
      ════════════════════════════════════════════════════════ */}
      {activeTab === 'other' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {others.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Belum ada asesmen lain yang terdaftar.</p>
            </div>
          ) : (
            others.map(assess => {
              const dimMax = assess.dimensions?.[0]?.maxScore ?? 100;
              return (
                <div key={assess.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-rose-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-[14px] font-black text-slate-800">{assess.name}</span>
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">{assess.result}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{assess.provider} · {assess.assessmentDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-rose-400" />
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-[12.5px] text-slate-600 leading-relaxed">{assess.description}</p>

                    {assess.dimensions && assess.dimensions.length > 0 && (
                      <div className="space-y-2.5">
                        {assess.dimensions.map(dim => {
                          const pct = Math.round((dim.score / dimMax) * 100);
                          const barColors: Record<string, string> = {
                            red: 'bg-red-500', yellow: 'bg-amber-400', green: 'bg-emerald-500',
                            blue: 'bg-blue-500', indigo: 'bg-indigo-500', violet: 'bg-violet-500',
                            emerald: 'bg-emerald-500', amber: 'bg-amber-400', sky: 'bg-sky-500',
                            cyan: 'bg-cyan-500', rose: 'bg-rose-500',
                          };
                          const barColor = barColors[dim.color ?? 'indigo'] ?? 'bg-indigo-500';
                          return (
                            <div key={dim.label}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] font-semibold text-slate-700">{dim.label}</span>
                                <span className="text-[12px] font-black text-slate-800">
                                  {dim.score}{dimMax !== 100 ? ` / ${dimMax}` : ''}
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {assess.narrative && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Narrative</span>
                        </div>
                        <p className="text-[12px] text-slate-600 leading-relaxed">{assess.narrative}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <Shield className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Hasil asesmen ini bersifat <strong>rahasia</strong> dan hanya dapat diakses oleh individu yang bersangkutan, manajer langsung, dan HRBP.
          Digunakan semata-mata untuk keperluan pengembangan karir dan perencanaan suksesi.
          © Hogan Assessment Systems · Data Terlindungi.
        </p>
      </div>
    </div>
  );
}
