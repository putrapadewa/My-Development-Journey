import { useState, useMemo } from 'react';
import {
  History, BookOpen, Users, Briefcase, Award,
  CheckCircle2, Clock, ChevronDown, ChevronUp,
  GraduationCap, Star, Filter, CalendarDays, Building2,
  Layers, TrendingUp,
} from 'lucide-react';
import type {
  UserProfile, IndividualDevelopmentPlan, DevelopmentActivity,
  ActivityFramework, DevelopmentProgramRecord,
} from '../types';

// ── helpers ──────────────────────────────────────────────────────────────────

const FRAMEWORK_META: Record<ActivityFramework, { label: string; short: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  '70_EXPERIENCE': {
    label: '70% – Experience',
    short: '70',
    color: 'text-indigo-700',
    bg: 'bg-indigo-100',
    icon: Briefcase,
  },
  '20_EXPOSURE': {
    label: '20% – Exposure',
    short: '20',
    color: 'text-violet-700',
    bg: 'bg-violet-100',
    icon: Users,
  },
  '10_LEARNING': {
    label: '10% – Learning',
    short: '10',
    color: 'text-teal-700',
    bg: 'bg-teal-100',
    icon: BookOpen,
  },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  VALIDATED:  { label: 'Validated',   color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200', dot: 'bg-emerald-500' },
  COMPLETED:  { label: 'Completed',   color: 'text-blue-700',    bg: 'bg-blue-50 border border-blue-200',       dot: 'bg-blue-500'   },
  IN_PROGRESS:{ label: 'In Progress', color: 'text-amber-700',   bg: 'bg-amber-50 border border-amber-200',     dot: 'bg-amber-500'  },
  APPROVED:   { label: 'Approved',    color: 'text-sky-700',     bg: 'bg-sky-50 border border-sky-200',         dot: 'bg-sky-500'    },
};

const RATING_META: Record<string, { label: string; color: string; stars: number }> = {
  EXCEEDED:             { label: 'Exceeded',       color: 'text-emerald-600', stars: 4 },
  DEMONSTRATED:         { label: 'Demonstrated',   color: 'text-blue-600',    stars: 3 },
  DEVELOPING:           { label: 'Developing',     color: 'text-amber-600',   stars: 2 },
  NOT_YET_DEMONSTRATED: { label: 'Not Yet',        color: 'text-slate-400',   stars: 1 },
};

function formatDate(d?: string) {
  if (!d) return '–';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── sub-components ────────────────────────────────────────────────────────────

function FrameworkBadge({ type }: { type: ActivityFramework }) {
  const m = FRAMEWORK_META[type];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${m.color} ${m.bg}`}>
      <Icon className="w-3 h-3" />
      {m.short}%
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { label: status, color: 'text-slate-600', bg: 'bg-slate-100 border border-slate-200', dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${m.color} ${m.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function StarRating({ rating }: { rating: string }) {
  const m = RATING_META[rating];
  if (!m) return <span className="text-xs text-slate-400">–</span>;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${m.color}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < m.stars ? 'fill-current' : 'opacity-20'}`} />
      ))}
      <span className="ml-1">{m.label}</span>
    </span>
  );
}

// ── activity row (expandable) ─────────────────────────────────────────────────

function ActivityRow({
  activity, idpPeriod, index,
}: {
  activity: DevelopmentActivity;
  idpPeriod: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        {/* No */}
        <td className="px-4 py-3 text-center text-xs text-slate-400 font-mono">{index + 1}</td>

        {/* Program / Activity */}
        <td className="px-4 py-3">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{activity.programName}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">{activity.goal}</p>
        </td>

        {/* Framework */}
        <td className="px-4 py-3 text-center">
          <FrameworkBadge type={activity.frameworkType} />
        </td>

        {/* Provider */}
        <td className="px-4 py-3">
          <p className="text-xs text-slate-600 leading-snug">{activity.provider}</p>
        </td>

        {/* Period */}
        <td className="px-4 py-3 whitespace-nowrap">
          <p className="text-xs text-slate-500">{formatDate(activity.timelineStart)}</p>
          <p className="text-xs text-slate-400">s/d {formatDate(activity.timelineEnd)}</p>
        </td>

        {/* IDP Period */}
        <td className="px-4 py-3">
          <p className="text-xs text-slate-500 line-clamp-2">{idpPeriod}</p>
        </td>

        {/* Status */}
        <td className="px-4 py-3 text-center">
          <StatusBadge status={activity.status} />
        </td>

        {/* Hours */}
        <td className="px-4 py-3 text-center">
          <span className="text-sm font-bold text-slate-700">{activity.learningHours}</span>
          <span className="text-xs text-slate-400 ml-0.5">jam</span>
        </td>

        {/* Rating */}
        <td className="px-4 py-3">
          {activity.managerValidationRating
            ? <StarRating rating={activity.managerValidationRating} />
            : <span className="text-xs text-slate-300">–</span>}
        </td>

        {/* Expand */}
        <td className="px-4 py-3 text-center">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-slate-400 mx-auto" />
            : <ChevronDown className="w-4 h-4 text-slate-400 mx-auto" />}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-slate-50 border-b border-slate-100">
          <td />
          <td colSpan={9} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Skills */}
              <div>
                <p className="font-semibold text-slate-500 uppercase tracking-wide mb-1">Skills Terkait</p>
                <div className="flex flex-wrap gap-1">
                  {activity.skillNames.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">{s}</span>
                  ))}
                </div>
              </div>

              {/* Measurement */}
              <div>
                <p className="font-semibold text-slate-500 uppercase tracking-wide mb-1">Ukuran Keberhasilan</p>
                <p className="text-slate-600 leading-relaxed">{activity.measurement}</p>
              </div>

              {/* Evidence + Reflection */}
              <div className="space-y-2">
                {activity.evidenceText && (
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Evidence</p>
                    <p className="text-slate-600 leading-relaxed">{activity.evidenceText}</p>
                  </div>
                )}
                {activity.reflectionText && (
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Refleksi</p>
                    <p className="text-slate-600 leading-relaxed">{activity.reflectionText}</p>
                  </div>
                )}
                {activity.managerFeedback && (
                  <div>
                    <p className="font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Feedback Manager</p>
                    <p className="text-slate-600 leading-relaxed">{activity.managerFeedback}</p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── development program card ──────────────────────────────────────────────────

function DevProgramCard({ prog, index }: { prog: DevelopmentProgramRecord; index: number }) {
  const isInclusive = prog.category === 'INCLUSIVE';
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 text-center text-xs text-slate-400 font-mono">{index + 1}</td>

      {/* Code */}
      <td className="px-4 py-3">
        <span className={`inline-block px-2.5 py-1 rounded-lg text-sm font-black tracking-tight ${isInclusive ? 'bg-indigo-600 text-white' : 'bg-violet-600 text-white'}`}>
          {prog.programCode}
        </span>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{prog.programName}</p>
        <p className="text-xs text-slate-500 mt-0.5">{prog.batch}</p>
      </td>

      {/* Category */}
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${isInclusive ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-violet-50 text-violet-700 border border-violet-200'}`}>
          {isInclusive ? 'Inclusive' : 'Exclusive'}
        </span>
      </td>

      {/* Organizer */}
      <td className="px-4 py-3">
        <p className="text-xs text-slate-600">{prog.organizer}</p>
      </td>

      {/* Period */}
      <td className="px-4 py-3 whitespace-nowrap">
        <p className="text-xs text-slate-500">{formatDate(prog.startDate)}</p>
        <p className="text-xs text-slate-400">s/d {formatDate(prog.endDate)}</p>
      </td>

      {/* Duration */}
      <td className="px-4 py-3 text-center">
        <span className="text-xs font-semibold text-slate-600">{prog.duration}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3 text-center">
        <StatusBadge status={prog.status} />
      </td>

      {/* Notes */}
      <td className="px-4 py-3">
        <p className="text-xs text-slate-500 leading-snug">{prog.notes ?? '–'}</p>
      </td>
    </tr>
  );
}

// ── main view ─────────────────────────────────────────────────────────────────

type FilterType = 'ALL' | ActivityFramework;

interface DevHistoryViewProps {
  user: UserProfile;
  idpHistory: IndividualDevelopmentPlan[];
  activeIdp?: IndividualDevelopmentPlan;
}

export function DevHistoryView({ user, idpHistory, activeIdp }: DevHistoryViewProps) {
  const [filter, setFilter] = useState<FilterType>('ALL');

  // Flatten all activities from all IDPs (history + active)
  const allActivities = useMemo(() => {
    const entries: { activity: DevelopmentActivity; idpPeriod: string }[] = [];
    [...idpHistory, ...(activeIdp ? [activeIdp] : [])].forEach(idp => {
      idp.activities.forEach(act => {
        entries.push({ activity: act, idpPeriod: idp.period });
      });
    });
    // Sort newest first (by timelineEnd desc)
    return entries.sort((a, b) =>
      new Date(b.activity.timelineEnd).getTime() - new Date(a.activity.timelineEnd).getTime()
    );
  }, [idpHistory, activeIdp]);

  const filtered = useMemo(() =>
    filter === 'ALL'
      ? allActivities
      : allActivities.filter(e => e.activity.frameworkType === filter),
    [allActivities, filter]
  );

  // Summary stats
  const totalHours = allActivities.reduce((s, e) => s + e.activity.learningHours, 0);
  const totalXP = allActivities.reduce((s, e) => s + e.activity.xpValue, 0);
  const completedCount = allActivities.filter(e =>
    e.activity.status === 'COMPLETED' || e.activity.status === 'VALIDATED'
  ).length;
  const programs = user.developmentPrograms ?? [];

  const filterOptions: { key: FilterType; label: string; color: string }[] = [
    { key: 'ALL',           label: 'Semua Aktivitas',  color: 'slate' },
    { key: '70_EXPERIENCE', label: '70% – Experience', color: 'indigo' },
    { key: '20_EXPOSURE',   label: '20% – Exposure',   color: 'violet' },
    { key: '10_LEARNING',   label: '10% – Learning',   color: 'teal' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

      {/* ── page header ── */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
          <History className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Dev History</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Rekam jejak seluruh aktivitas pengembangan berdasarkan kerangka 70:20:10 — termasuk riwayat program inklusif yang pernah diikuti.
          </p>
        </div>
      </div>

      {/* ── summary stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Aktivitas', value: allActivities.length, icon: Layers, color: 'from-slate-600 to-slate-800' },
          { label: 'Selesai / Tervalidasi', value: completedCount, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-700' },
          { label: 'Total Jam Belajar', value: `${totalHours} jam`, icon: Clock, color: 'from-indigo-500 to-indigo-700' },
          { label: 'Total XP Diperoleh', value: `${totalXP.toLocaleString()} XP`, icon: TrendingUp, color: 'from-violet-500 to-violet-700' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-black text-slate-800 leading-tight">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 70:20:10 activity table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-black text-slate-800">Riwayat Aktivitas 70:20:10</h2>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
              {filtered.length} aktivitas
            </span>
          </div>

          {/* filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            {filterOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  filter === opt.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">Tidak ada aktivitas untuk filter ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-center w-10">#</th>
                  <th className="px-4 py-3 min-w-[200px]">Program / Aktivitas</th>
                  <th className="px-4 py-3 text-center">Framework</th>
                  <th className="px-4 py-3 min-w-[140px]">Provider</th>
                  <th className="px-4 py-3 whitespace-nowrap">Periode</th>
                  <th className="px-4 py-3 min-w-[140px]">IDP Cycle</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Jam</th>
                  <th className="px-4 py-3 min-w-[120px]">Validasi Manager</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <ActivityRow
                    key={e.activity.id}
                    activity={e.activity}
                    idpPeriod={e.idpPeriod}
                    index={i}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 70:20:10 breakdown footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-4">
          {(['70_EXPERIENCE', '20_EXPOSURE', '10_LEARNING'] as ActivityFramework[]).map(f => {
            const m = FRAMEWORK_META[f];
            const Icon = m.icon;
            const count = allActivities.filter(e => e.activity.frameworkType === f).length;
            const hours = allActivities
              .filter(e => e.activity.frameworkType === f)
              .reduce((s, e) => s + e.activity.learningHours, 0);
            return (
              <div key={f} className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                </span>
                <div>
                  <p className={`text-xs font-bold ${m.color}`}>{m.label}</p>
                  <p className="text-xs text-slate-500">{count} aktivitas · {hours} jam</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── development programs section ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-violet-500" />
          <h2 className="text-base font-black text-slate-800">Development Program</h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-violet-50 text-xs font-bold text-violet-700 border border-violet-100">
            {programs.length} program
          </span>
          <div className="ml-auto flex gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Building2 className="w-3 h-3" /> Inclusive
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
              <Award className="w-3 h-3" /> Exclusive
            </span>
          </div>
        </div>

        {programs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">Belum ada riwayat development program.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-center w-10">#</th>
                  <th className="px-4 py-3 w-20 text-center">Kode</th>
                  <th className="px-4 py-3 min-w-[200px]">Nama Program</th>
                  <th className="px-4 py-3 text-center">Kategori</th>
                  <th className="px-4 py-3 min-w-[160px]">Penyelenggara</th>
                  <th className="px-4 py-3 whitespace-nowrap">Periode</th>
                  <th className="px-4 py-3 text-center">Durasi</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 min-w-[200px]">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog, i) => (
                  <DevProgramCard key={prog.id} prog={prog} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* legend */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-indigo-600">Inclusive Program</span> — program kepemimpinan wajib berdasarkan level (JNDP, MDP, SMDP, dll.). &nbsp;
            <span className="font-semibold text-violet-600">Exclusive Program</span> — program seleksi khusus untuk talent terpilih (ECDP, LDP, dll.).
          </p>
        </div>
      </div>

      {/* ── XP timeline strip ── */}
      <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-300" />
          <h3 className="text-sm font-black">Rekam Jejak XP per IDP Cycle</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {[...(activeIdp ? [activeIdp] : []), ...idpHistory].map(idp => {
            const cycleXP = idp.activities.reduce((s, a) => s + a.xpValue, 0);
            const cycleHours = idp.activities.reduce((s, a) => s + a.learningHours, 0);
            const doneCount = idp.activities.filter(a => a.status === 'COMPLETED' || a.status === 'VALIDATED').length;
            return (
              <div key={idp.id} className="bg-white/10 rounded-xl px-4 py-3 min-w-[180px] border border-white/20 backdrop-blur-sm">
                <p className="text-xs text-indigo-200 mb-1 font-medium leading-snug">{idp.period}</p>
                <p className="text-lg font-black">{cycleXP.toLocaleString()} XP</p>
                <p className="text-xs text-indigo-300 mt-0.5">
                  {doneCount}/{idp.activities.length} selesai · {cycleHours} jam
                </p>
                <div className="mt-2">
                  <StatusBadge status={idp.status} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── calendar strip: all completed dates ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-black text-slate-700">Aktivitas Selesai Terbaru</h3>
        </div>
        <div className="space-y-2">
          {allActivities
            .filter(e => e.activity.status === 'COMPLETED' || e.activity.status === 'VALIDATED')
            .slice(0, 6)
            .map(e => (
              <div key={e.activity.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 leading-snug truncate">{e.activity.programName}</p>
                  <p className="text-xs text-slate-400">{e.idpPeriod}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <FrameworkBadge type={e.activity.frameworkType} />
                  <p className="text-xs text-slate-400 mt-1">{formatDate(e.activity.timelineEnd)}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}
