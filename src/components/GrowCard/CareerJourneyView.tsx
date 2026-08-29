import React, { useState } from 'react';
import {
  Briefcase,
  Target,
  Users,
  LayoutGrid,
  Building,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  Rocket,
  Wrench,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Star,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { UserProfile } from '../../types';

// ── 12-Box cells ──────────────────────────────────────────────────────────────
type BoxCell = { perf: number; pot: number; label: string; bg: string; text: string; bgActive: string };
const CELLS: BoxCell[] = [
  { perf: 1, pot: 3, label: 'Uncertain\nPotential',  bg: '#f1f5f9', text: '#475569', bgActive: '#475569' },
  { perf: 2, pot: 3, label: 'Emerging\nTalent',      bg: '#ede9fe', text: '#6d28d9', bgActive: '#7c3aed' },
  { perf: 3, pot: 3, label: 'High\nPotential',       bg: '#c7d2fe', text: '#3730a3', bgActive: '#4338ca' },
  { perf: 4, pot: 3, label: 'Exceptional\nTalent',   bg: '#312e81', text: '#c7d2fe', bgActive: '#1e1b4b' },
  { perf: 1, pot: 2, label: 'Inconsistent\nPlayer',  bg: '#fff7ed', text: '#c2410c', bgActive: '#ea580c' },
  { perf: 2, pot: 2, label: 'Core\nContributor',     bg: '#e0f2fe', text: '#0369a1', bgActive: '#0284c7' },
  { perf: 3, pot: 2, label: 'Skilled\nPerformer',    bg: '#dbeafe', text: '#1e40af', bgActive: '#2563eb' },
  { perf: 4, pot: 2, label: 'High\nImpact',          bg: '#cffafe', text: '#0e7490', bgActive: '#0891b2' },
  { perf: 1, pot: 1, label: 'Under\nPerformer',      bg: '#fee2e2', text: '#b91c1c', bgActive: '#dc2626' },
  { perf: 2, pot: 1, label: 'Steady\nPerformer',     bg: '#fef9c3', text: '#854d0e', bgActive: '#ca8a04' },
  { perf: 3, pot: 1, label: 'Strong\nContributor',   bg: '#dcfce7', text: '#166534', bgActive: '#16a34a' },
  { perf: 4, pot: 1, label: 'Consistent\nStar',      bg: '#bbf7d0', text: '#14532d', bgActive: '#15803d' },
];
const PERF_LABELS = ['Needs\nImprovement', 'Meets\nExpectations', 'Exceeds\nExpectations', 'Outstanding'];
const POT_LABELS: Record<number, string> = { 3: 'High', 2: 'Medium', 1: 'Low' };

// ── Helpers ───────────────────────────────────────────────────────────────────
function readiness(score: number) {
  if (score >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-700', card: 'bg-emerald-50 border-emerald-200', label: 'Ready Now' };
  if (score >= 50) return { bar: 'bg-amber-400',   text: 'text-amber-700',   card: 'bg-amber-50 border-amber-200',   label: 'Ready 1–2 Thn' };
  return           { bar: 'bg-orange-400',  text: 'text-orange-700',  card: 'bg-orange-50 border-orange-200',  label: 'Ready 3+ Thn' };
}

function kpiColor(score: number) {
  if (score >= 90) return { text: 'text-emerald-700', bg: 'bg-emerald-50', bar: 'bg-emerald-500' };
  if (score >= 80) return { text: 'text-indigo-700',  bg: 'bg-indigo-50',  bar: 'bg-indigo-500'  };
  if (score >= 70) return { text: 'text-amber-700',   bg: 'bg-amber-50',   bar: 'bg-amber-400'   };
  return           { text: 'text-red-700',    bg: 'bg-red-50',    bar: 'bg-red-400'   };
}

function yearFrom(period: string) {
  return period.split(/[-–—]/)[0].trim().slice(-4);
}

// ── Step header ───────────────────────────────────────────────────────────────
function StepHeader({ step, icon: Icon, title, subtitle, color }: {
  step: number; icon: React.ElementType; title: string; subtitle: string; color: string;
}) {
  return (
    <div className={`flex items-center gap-3 pb-3 border-b border-slate-100`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-black ${color}`}>
        {step}
      </div>
      <Icon className="w-5 h-5 text-slate-600 shrink-0" />
      <div>
        <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export const CareerJourneyView: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const toggleSection = (i: number) => setExpandedSections(prev => ({ ...prev, [i]: !prev[i] }));

  const careerPaths    = user.careerPaths   ?? [];
  const isSuccessor    = user.isSuccessor   ?? false;
  const successorFor   = user.successorFor  ?? [];
  const successorRecs  = user.successorRecords ?? [];
  const kpiHistory     = user.kpiHistory    ?? [];
  const insight        = user.careerChatInsight;
  const perfRating     = user.performanceRating;
  const potRating      = user.potentialRating;
  const activeCell     = CELLS.find(c => c.perf === perfRating && c.pot === potRating);

  // KPI trend
  const kpiScores = kpiHistory.map(k => k.kpiScore);
  const kpiTrend  = kpiScores.length >= 2
    ? kpiScores[kpiScores.length - 1] - kpiScores[kpiScores.length - 2]
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* ════════════════════════════════════════════════════════════════
          NARRATIVE INTRO
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Rocket className="w-5 h-5 text-indigo-300" />
          </div>
          <div className="space-y-2">
            <h2 className="font-black text-lg text-white">My Career Journey</h2>
            <p className="text-sm text-indigo-200 leading-relaxed font-medium">
              Perjalanan karir {user.name.split(' ')[0]} disusun dalam empat dimensi yang saling terhubung:
              rekam jejak &amp; performa masa lalu, posisi talenta saat ini, perencanaan ke depan, dan perspektif AI dari career chat.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { n: 1, label: 'Rekam Jejak & Performa', color: 'bg-slate-700' },
                { n: 2, label: 'Posisi Talenta', color: 'bg-indigo-700' },
                { n: 3, label: 'Perencanaan & Suksesi', color: 'bg-emerald-700' },
                { n: 4, label: 'Career Chat Insight', color: 'bg-violet-700' },
              ].map(({ n, label, color }) => (
                <span key={n} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold text-white ${color} bg-opacity-80`}>
                  <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-black">{n}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 1: REKAM JEJAK & PERFORMA
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
        <StepHeader step={1} icon={Briefcase} color="bg-slate-700"
          title="Rekam Jejak & Performa"
          subtitle="Riwayat karir dan pencapaian KPI/PAT tiga tahun terakhir yang membentuk fondasi perjalanan ini"
        />

        {/* Career History Table */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Riwayat Karir</p>
          {user.careerHistory.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada riwayat karir.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs min-w-[400px]">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left px-4 py-3 font-bold text-[11px] w-16">Tahun</th>
                    <th className="text-left px-4 py-3 font-bold text-[11px]">Posisi</th>
                    <th className="text-left px-4 py-3 font-bold text-[11px]">Perusahaan / Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {user.careerHistory.map((ch, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3 font-bold text-indigo-900 whitespace-nowrap">{yearFrom(ch.period)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{ch.position}</td>
                      <td className="px-4 py-3 text-slate-600">{ch.company ?? ch.businessUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* KPI / PAT */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">KPI / PAT — 3 Tahun Terakhir</p>
            {kpiHistory.length >= 2 && (
              <span className={`flex items-center gap-1 text-xs font-bold ${kpiTrend > 0 ? 'text-emerald-600' : kpiTrend < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                {kpiTrend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : kpiTrend < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {kpiTrend > 0 ? `+${kpiTrend.toFixed(0)}` : kpiTrend.toFixed(0)} poin vs tahun lalu
              </span>
            )}
          </div>
          {kpiHistory.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4 text-center">Data KPI belum tersedia.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left px-4 py-3 font-bold text-[11px] w-28">Tahun</th>
                    <th className="text-center px-4 py-3 font-bold text-[11px]">Skor KPI</th>
                    <th className="text-center px-4 py-3 font-bold text-[11px]">Skor PAT</th>
                    <th className="text-left px-4 py-3 font-bold text-[11px]">Rating</th>
                    <th className="text-left px-4 py-3 font-bold text-[11px]">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiHistory.map((k, idx) => {
                    const col = kpiColor(k.kpiScore);
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{k.year}</td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-black text-base ${col.text}`}>{k.kpiScore}</span>
                            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${k.kpiScore}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {k.patScore !== undefined ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className={`font-black text-base ${kpiColor(k.patScore).text}`}>{k.patScore}</span>
                              <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div className={`h-full rounded-full ${kpiColor(k.patScore).bar}`} style={{ width: `${k.patScore}%` }} />
                              </div>
                            </div>
                          ) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${col.bg} ${col.text} border-current/20`}>{k.rating}</span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 text-[11px] leading-relaxed">{k.notes ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 2: POSISI TALENTA — 12-BOX
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <StepHeader step={2} icon={LayoutGrid} color="bg-indigo-700"
          title="Posisi Talenta Saat Ini — Matriks 12-Box"
          subtitle="Hasil kalibrasi performa (sumbu X) vs potensi (sumbu Y) dalam talent review"
        />

        <div className="overflow-x-auto">
          <div className="min-w-[540px]">
            {/* Column header */}
            <div className="flex gap-2 mb-2 pl-[88px]">
              {PERF_LABELS.map((label, i) => (
                <div key={i} className={`flex-1 text-center text-[10px] font-bold uppercase tracking-wide leading-tight px-1 py-1 rounded-lg ${perfRating === i + 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500'}`}>
                  {label.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                  <span className="text-[9px] opacity-60 font-normal">({i + 1})</span>
                </div>
              ))}
            </div>
            {/* Rows */}
            {[3, 2, 1].map((pot) => (
              <div key={pot} className="flex items-stretch gap-2 mb-2">
                <div className={`w-20 shrink-0 flex items-center justify-end pr-2 text-[10px] font-bold text-right leading-tight rounded-lg ${potRating === pot ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500'}`}>
                  <span>{POT_LABELS[pot]}<br /><span className="opacity-60 font-normal">({pot})</span></span>
                </div>
                {[1, 2, 3, 4].map((perf) => {
                  const cell = CELLS.find(c => c.perf === perf && c.pot === pot)!;
                  const isActive = perf === perfRating && pot === potRating;
                  return (
                    <div key={perf} className="flex-1 relative rounded-xl p-2.5 flex flex-col items-center justify-center text-center" style={{ minHeight: 72, background: isActive ? cell.bgActive : cell.bg, color: isActive ? '#fff' : cell.text, border: isActive ? '2.5px solid #312e81' : '1.5px solid rgba(0,0,0,0.07)', boxShadow: isActive ? '0 0 0 3px rgba(99,102,241,0.25)' : undefined, transform: isActive ? 'scale(1.04)' : undefined, zIndex: isActive ? 1 : undefined, transition: 'all 0.15s' }}>
                      <p className="text-[9.5px] font-bold leading-tight">{cell.label.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}</p>
                      <p className="text-[8px] mt-1 opacity-50 font-medium">P{perf}×T{pot}</p>
                      {isActive && <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-indigo-900 text-white flex items-center justify-center text-[9px] font-black shadow-md border-2 border-white" style={{ zIndex: 2 }}>★</span>}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="pl-[88px] text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Performance →</div>
          </div>
        </div>

        {activeCell ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: activeCell.bgActive }}>★</div>
            <div>
              <p className="text-sm font-bold text-indigo-900">{activeCell.label.replace('\n', ' ')} — P{perfRating} × T{potRating}</p>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">Performa Level {perfRating} × Potensi Level {potRating}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center">Data performa dan potensi belum dikonfigurasi.</p>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 3: PERENCANAAN KARIR & SUKSESI
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
        <StepHeader step={3} icon={Target} color="bg-emerald-700"
          title="Perencanaan Karir & Suksesi"
          subtitle="Jalur karir ke depan, status sebagai suksesor, dan data succession planning untuk posisi saat ini"
        />

        {/* Career Path */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Career Path — Next Positions (maks. 3)</p>
          {careerPaths.length === 0 ? (
            <p className="text-sm text-slate-400 italic py-4 text-center">Belum ada data career path.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {careerPaths.slice(0, 3).map((cp, idx) => {
                const col = readiness(cp.readinessScore);
                return (
                  <div key={idx} className={`rounded-2xl border p-4 space-y-3 ${col.card}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-black shrink-0">{idx + 1}</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-snug">{cp.position}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1"><Building className="w-3 h-3 shrink-0" /> {cp.businessUnit}</p>
                        </div>
                      </div>
                      {cp.targetYear && <span className="text-[10px] font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap shrink-0">{cp.targetYear}</span>}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-600 font-medium">Readiness</span>
                        <span className={`font-black text-base ${col.text}`}>{cp.readinessScore}%</span>
                      </div>
                      <div className="w-full bg-white/70 rounded-full h-2.5 overflow-hidden border border-slate-200">
                        <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${cp.readinessScore}%` }} />
                      </div>
                      <span className={`text-[10.5px] font-bold ${col.text}`}>{col.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Connector arrow */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-dashed border-slate-200" />
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ArrowRight className="w-3.5 h-3.5" /> Succession Planning
          </div>
          <div className="flex-1 border-t border-dashed border-slate-200" />
        </div>

        {/* Suksesor — status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status Suksesor</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isSuccessor ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              {isSuccessor ? 'Ya — Suksesor Aktif' : 'Tidak'}
            </span>
          </div>
          {isSuccessor && successorFor.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs min-w-[440px]">
                <thead>
                  <tr className="bg-emerald-900 text-white">
                    <th className="text-left px-4 py-3 font-bold text-[11px]">#</th>
                    <th className="text-left px-4 py-3 font-bold text-[11px]">Suksesor Untuk Posisi</th>
                    <th className="text-left px-4 py-3 font-bold text-[11px]">Business Unit</th>
                    <th className="text-right px-4 py-3 font-bold text-[11px]">Readiness</th>
                  </tr>
                </thead>
                <tbody>
                  {successorFor.map((sf, idx) => {
                    const col = readiness(sf.readinessScore);
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3.5 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{sf.position}</td>
                        <td className="px-4 py-3.5 text-slate-600">{sf.businessUnit}</td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={`font-black text-sm ${col.text}`}>{sf.readinessScore}%</span>
                            <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${sf.readinessScore}%` }} />
                            </div>
                            <span className={`text-[10px] font-semibold ${col.text}`}>{col.label}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!isSuccessor && <p className="text-sm text-slate-500">Karyawan ini saat ini tidak terdaftar sebagai suksesor untuk posisi apapun.</p>}
        </div>

        {/* Succession Records — who succeeds ME */}
        {successorRecs.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detail Perencanaan Suksesi — Posisi Saya</p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs min-w-[640px]">
                <thead>
                  <tr className="bg-emerald-900 text-white">
                    <th className="text-left px-3 py-3 font-bold text-[11px]">Posisi</th>
                    <th className="text-left px-3 py-3 font-bold text-[11px]">BU</th>
                    <th className="text-left px-3 py-3 font-bold text-[11px]">Kategori</th>
                    <th className="text-left px-3 py-3 font-bold text-[11px]">Incumbent / PS</th>
                    <th className="text-left px-3 py-3 font-bold text-[11px]">Suksesor / PS</th>
                    <th className="text-center px-3 py-3 font-bold text-[11px]">Readiness</th>
                    <th className="text-center px-3 py-3 font-bold text-[11px]">Status</th>
                    <th className="text-center px-3 py-3 font-bold text-[11px]">Grow Card</th>
                  </tr>
                </thead>
                <tbody>
                  {successorRecs.map((sr, idx) => {
                    const col = readiness(sr.readinessScore);
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-3 py-3.5 font-semibold text-slate-900 text-[11px]">{sr.positionName}</td>
                        <td className="px-3 py-3.5 text-slate-600 text-[11px]">{sr.businessUnit}</td>
                        <td className="px-3 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">{sr.category ?? '—'}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="text-[11px]">
                            <p className="font-semibold text-slate-900">{sr.incumbentName}</p>
                            {sr.incumbentPS && <p className="text-slate-400">{sr.incumbentPS}</p>}
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="text-[11px]">
                            <p className="font-semibold text-emerald-800">{sr.successorName}</p>
                            {sr.successorPS && <p className="text-slate-400">{sr.successorPS}</p>}
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-black text-sm ${col.text}`}>{sr.readinessScore}%</span>
                            <div className="w-14 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${sr.readinessScore}%` }} />
                            </div>
                            <span className={`text-[9.5px] font-semibold ${col.text}`}>{sr.readinessLabel ?? col.label}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          {sr.status && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{sr.status}</span>}
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          {sr.hasGrowCard
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                            : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {successorRecs[0]?.notes && (
              <p className="text-xs text-slate-500 italic px-1">{successorRecs[0].notes}</p>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STEP 4: CAREER CHAT INSIGHT
      ════════════════════════════════════════════════════════════════ */}
      {insight ? (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
          <StepHeader step={4} icon={MessageSquare} color="bg-violet-700"
            title="Career Chat Insight"
            subtitle={`${insight.source ?? 'Career Chat'} · ${insight.chatCount ? `${insight.chatCount} percakapan` : ''} · Generated ${insight.generatedDate}`}
          />

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium -mt-2">
            <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-bold">{insight.source ?? 'myCareer+'}</span>
            <span>Chat pada {insight.chatDate}</span>
            {insight.chatCount && <span>· {insight.chatCount} record</span>}
          </div>

          {/* AI Summary 4-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'strengths',               label: 'Strength',                icon: Star,         items: insight.aiSummary.strengths,                color: 'bg-emerald-50 border-emerald-200', iconColor: 'text-emerald-600', titleColor: 'text-emerald-800' },
              { key: 'opportunities',           label: 'Opportunity',             icon: Lightbulb,    items: insight.aiSummary.opportunities,            color: 'bg-amber-50 border-amber-200',   iconColor: 'text-amber-600',   titleColor: 'text-amber-800'   },
              { key: 'aspirations',             label: 'Aspiration',              icon: Rocket,       items: insight.aiSummary.aspirations,              color: 'bg-blue-50 border-blue-200',     iconColor: 'text-blue-600',    titleColor: 'text-blue-800'    },
              { key: 'recommendedInterventions',label: 'Recommended Intervention',icon: Wrench,       items: insight.aiSummary.recommendedInterventions, color: 'bg-violet-50 border-violet-200', iconColor: 'text-violet-600',  titleColor: 'text-violet-800'  },
            ].map(({ key, label, icon: Icon, items, color, iconColor, titleColor }) => (
              <div key={key} className={`rounded-2xl border p-4 space-y-3 ${color}`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                  <span className={`text-xs font-bold uppercase tracking-wide ${titleColor}`}>{label}</span>
                </div>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11.5px] text-slate-700 font-medium leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${iconColor.replace('text-', 'bg-')}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Numbered sections — collapsible */}
          {insight.sections.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detail Narasi</p>
              <div className="space-y-1.5">
                {insight.sections.map((sec, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleSection(i)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 text-left">{sec.title}</span>
                      {expandedSections[i]
                        ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        : <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    </button>
                    {expandedSections[i] && (
                      <div className="px-4 py-3 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 bg-white">
                        {sec.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development Plan */}
          {(insight.developmentPlanIndividual?.length || insight.developmentPlanTeam?.length) && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Development Plan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {insight.developmentPlanIndividual?.length ? (
                  <div className="rounded-2xl border border-indigo-200 p-4 bg-indigo-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">For the Individual</span>
                    </div>
                    <ul className="space-y-2">
                      {insight.developmentPlanIndividual.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11.5px] text-slate-700 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-indigo-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {insight.developmentPlanTeam?.length ? (
                  <div className="rounded-2xl border border-emerald-200 p-4 bg-emerald-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">For the Team</span>
                    </div>
                    <ul className="space-y-2">
                      {insight.developmentPlanTeam.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11.5px] text-slate-700 font-medium leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {insight.willingnessToMentor && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wide mb-0.5">Willingness to Mentor</p>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{insight.willingnessToMentor}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Notes */}
          {insight.additionalNotes && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10.5px] font-bold text-rose-700 uppercase tracking-wide mb-1">Additional Notes</p>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{insight.additionalNotes}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs">
          <StepHeader step={4} icon={MessageSquare} color="bg-violet-700"
            title="Career Chat Insight"
            subtitle="AI-generated summary dari percakapan career chat"
          />
          <p className="text-sm text-slate-400 italic py-6 text-center">Belum ada data Career Chat Insight untuk karyawan ini.</p>
        </div>
      )}

    </div>
  );
};
