import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  BookOpen,
  Calendar,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Building,
  Target,
  Layers,
  ChevronRight,
  FileText,
  BadgeCheck,
  X,
  Star,
} from 'lucide-react';
import { UserProfile, SkillItem, IndividualDevelopmentPlan } from '../../types';

export type ProfileSubMenu = 'MY_PROFILE' | 'MY_ASSESSMENT' | 'MY_CAREER' | 'MY_DEV_HISTORY';

interface GrowCardProfileHubProps {
  user: UserProfile;
  skills: SkillItem[];
  idpHistory: IndividualDevelopmentPlan[];
  activeIdp?: IndividualDevelopmentPlan;
  initialSubTab?: ProfileSubMenu;
  onNavigateToTab?: (tab: string) => void;
}

export const GrowCardProfileHub: React.FC<GrowCardProfileHubProps> = ({
  user,
  skills,
  idpHistory,
  activeIdp,
  initialSubTab = 'MY_PROFILE',
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubMenu>(initialSubTab);
  const [showProfileDetail, setShowProfileDetail] = useState(false);

  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const totalXP = skills.reduce((acc, curr) => acc + curr.xpEarned, 0);
  const totalCompletedHours = idpHistory.reduce((acc, idp) => {
    return acc + idp.activities.reduce((a, act) => a + (act.learningHours || 0), 0);
  }, 0);
  const totalAchievedSkills = skills.filter((s) => s.gap <= 0).length;
  const criticalGapsCount = skills.filter((s) => s.gap > 0.8).length;

  // Derive strengths & development areas from skills
  const strengthSkills = skills.filter((s) => s.gap <= 0).slice(0, 3);
  const gapSkills = skills.filter((s) => s.gap > 0).slice(0, 3);

  // Use activeIdp for the grow card table; fallback to latest history entry
  const currentIdp = activeIdp || idpHistory[0];
  const currentActivities = currentIdp?.activities || [];
  const currentPeriod = currentIdp?.period || '2026 H1';

  const typeMap: Record<string, { label: string; color: string }> = {
    '70_EXPERIENCE': { label: '70% Experience', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    '20_EXPOSURE': { label: '20% Exposure', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    '10_LEARNING': { label: '10% Learning', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  };

  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    VALIDATED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    NOT_STARTED: 'bg-slate-100 text-slate-600 border-slate-200',
    WAITING_FOR_APPROVAL: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <div className="space-y-6 pb-12">

      {/* ── CLICKABLE PROFILE HEADER ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setShowProfileDetail(true)}
        className="w-full text-left rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden cursor-pointer hover:bg-indigo-800 transition-colors group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-indigo-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                  {user.level}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  9-Box: High Potential
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-1 font-medium">
                {user.position} &bull; <strong className="text-white">{user.businessUnit}</strong>
              </p>
              <div className="flex items-center gap-4 text-xs text-indigo-200/80 mt-2 flex-wrap font-medium">
                <span>Employee ID: <strong className="text-white">{user.employeeId}</strong></span>
                <span>Manager: <strong className="text-white">{user.managerName}</strong></span>
                <span>HRBP: <strong className="text-white">{user.hrbpName}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-inner">
              <div className="text-center px-3 border-r border-white/15">
                <span className="text-[10px] text-indigo-200 uppercase tracking-widest block font-bold">Total XP</span>
                <span className="text-xl font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {totalXP}
                </span>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] text-indigo-200 uppercase tracking-widest block font-bold">Logged Hours</span>
                <span className="text-xl font-black text-white mt-0.5">{totalCompletedHours}h</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 group-hover:text-white transition-colors font-semibold">
              <span>Lihat Profil Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </button>

      {/* ── GROW CARD CONTENT ─────────────────────────────────────────────────── */}
      <div className="space-y-4">

        {/* Section title bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-900 text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">My GROW Card</h2>
              <p className="text-[11px] text-slate-500 font-medium">Growth &amp; Readiness for Opportunity &amp; Work</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full">
            Periode: {currentPeriod}
          </span>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">

          {/* Card banner: identity */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
              <p className="text-sm text-indigo-200 font-medium mt-0.5">{user.position}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white">
                  {user.level}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  {user.businessUnit}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300">
                  9-Box: High Potential
                </span>
              </div>
            </div>
            <div className="text-right text-xs shrink-0">
              <span className="text-indigo-300 block font-medium">ID Karyawan</span>
              <span className="font-mono font-bold text-white text-sm">{user.employeeId}</span>
              <span className="text-indigo-300 block font-medium mt-1.5">Bergabung</span>
              <span className="font-bold text-white">{user.joinDate}</span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-6 space-y-5">

            {/* Row 1: Org info + Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Org structure */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Struktur Organisasi</h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-indigo-700" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Direct Line Manager</span>
                      <span className="font-bold text-slate-900">{user.managerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5 text-purple-700" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">HRBP Partner</span>
                      <span className="font-bold text-slate-900">{user.hrbpName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Building className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Division &amp; Department</span>
                      <span className="font-bold text-slate-900">{user.division} &bull; {user.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Lokasi Penempatan</span>
                      <span className="font-bold text-slate-900">{user.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance metrics */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kinerja &amp; Pengembangan</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">Total XP</span>
                    <span className="text-lg font-black text-amber-600">{totalXP}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">Jam Belajar</span>
                    <span className="text-lg font-black text-indigo-900">{totalCompletedHours}h</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">Skill Fit</span>
                    <span className="text-lg font-black text-emerald-700">{totalAchievedSkills}/{skills.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">Gap Aktif</span>
                    <span className="text-lg font-black text-amber-600">{criticalGapsCount}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-center">
                  <span className="text-[10px] text-indigo-700 font-bold block">Talent Readiness</span>
                  <span className="text-sm font-extrabold text-indigo-900">Ready in 6–12 Months</span>
                </div>
              </div>
            </div>

            {/* Row 2: Strengths & Development Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Strengths */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-emerald-900">Kekuatan (Strengths)</h4>
                </div>
                <div className="space-y-2">
                  {strengthSkills.length > 0 ? (
                    strengthSkills.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 text-xs">
                        <span className="font-bold text-slate-900">{s.name}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Level {s.currentProficiency}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-700 font-medium">
                      Terus kembangkan kompetensi untuk mencapai proficiency target.
                    </p>
                  )}
                </div>
              </div>

              {/* Development Areas */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-900">Area Pengembangan</h4>
                </div>
                <div className="space-y-2">
                  {gapSkills.length > 0 ? (
                    gapSkills.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200 text-xs">
                        <span className="font-bold text-slate-900">{s.name}</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Gap -{s.gap}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-amber-700 font-medium">
                      Semua kompetensi telah memenuhi standar jabatan saat ini.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Row 3: Development Plan Table */}
            {currentActivities.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-700" />
                    Rencana Pengembangan — {currentPeriod}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">{currentActivities.length} aktivitas</span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">Tujuan / Goals</th>
                        <th className="py-3 px-4 font-bold">Tipe</th>
                        <th className="py-3 px-4 font-bold">Program</th>
                        <th className="py-3 px-4 font-bold">Provider</th>
                        <th className="py-3 px-4 font-bold">Timeline</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentActivities.map((act) => {
                        const typeInfo = typeMap[act.frameworkType] || {
                          label: act.frameworkType,
                          color: 'bg-slate-100 text-slate-800 border-slate-200',
                        };
                        const statusColor = statusColors[act.status] || 'bg-slate-100 text-slate-600 border-slate-200';
                        return (
                          <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-900 line-clamp-2">{act.goal}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeInfo.color}`}>
                                {typeInfo.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800">{act.programName}</td>
                            <td className="py-3 px-4 text-slate-500 font-medium">{act.provider}</td>
                            <td className="py-3 px-4 text-slate-500 font-medium whitespace-nowrap">
                              {act.timelineStart && act.timelineEnd
                                ? `${act.timelineStart.slice(0, 7)} – ${act.timelineEnd.slice(0, 7)}`
                                : '—'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                                {act.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">Belum ada rencana pengembangan aktif.</p>
                <p className="text-xs text-slate-400 mt-1">Buat Journey di tab My Development untuk memulai.</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── PROFILE DETAIL DRAWER ─────────────────────────────────────────────── */}
      {showProfileDetail && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowProfileDetail(false)}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-5xl max-h-[92vh] overflow-y-auto bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl mx-0 sm:mx-4">

            {/* Sticky drawer header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{user.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{user.position} &bull; {user.businessUnit}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileDetail(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="px-6 pt-4 flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'MY_PROFILE', label: 'My Profil', icon: User },
                { id: 'MY_ASSESSMENT', label: `My Assessment (${skills.length})`, icon: Layers },
                { id: 'MY_CAREER', label: 'My Career', icon: Briefcase },
                { id: 'MY_DEV_HISTORY', label: 'My Development History', icon: Clock },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSubTab(tab.id as ProfileSubMenu)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-900 text-white shadow-xs ring-2 ring-indigo-900/20'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-6 space-y-6">

              {/* ================================================================= */}
              {/* SUB-MENU 1: MY PROFIL */}
              {/* ================================================================= */}
              {activeSubTab === 'MY_PROFILE' && (
                <div className="space-y-6 animate-in fade-in duration-200">

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Col 1-2: Personal & Org Details */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-100">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">Informasi Karyawan &amp; Organisasi</h3>
                            <p className="text-slate-500 text-xs font-medium">Data induk profil profesional dan afiliasi unit bisnis</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Status: Active Permanent
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {[
                          { label: 'Nama Lengkap', value: user.name },
                          { label: 'Nomor Induk Karyawan (NIP)', value: user.employeeId },
                          { label: 'Posisi / Jabatan', value: user.position },
                          { label: 'Level / Job Banding', value: user.level },
                          { label: 'Business Unit', value: user.businessUnit },
                          { label: 'Division & Department', value: `${user.division} • ${user.department}` },
                          { label: 'Tanggal Bergabung', value: `${user.joinDate} (${user.yearsOfExperience} Tahun)` },
                          { label: 'Lokasi Kerja', value: user.location },
                        ].map((item) => (
                          <div key={item.label} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{item.label}</span>
                            <span className="font-bold text-slate-900 text-sm">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <h4 className="font-bold text-slate-900 text-xs mb-3">Struktur Pelaporan &amp; Mitra SDM:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">M</div>
                            <div>
                              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Direct Line Manager</span>
                              <span className="font-bold text-slate-900">{user.managerName}</span>
                            </div>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold text-sm">H</div>
                            <div>
                              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Dedicated HRBP</span>
                              <span className="font-bold text-slate-900">{user.hrbpName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Col 3: Contact, Education, Certifications */}
                    <div className="space-y-6">
                      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                          <Mail className="w-4 h-4 text-indigo-700" />
                          <h3 className="font-bold text-slate-900 text-sm">Kontak &amp; Komunikasi</h3>
                        </div>
                        <div className="space-y-3 text-xs">
                          {[
                            { icon: Mail, label: 'Email Perusahaan', value: user.email },
                            { icon: Phone, label: 'Telepon / WhatsApp', value: user.phone },
                            { icon: MapPin, label: 'Penempatan', value: user.location },
                          ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                              <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-400 block font-bold">{label}</span>
                                <span className="font-semibold text-slate-900">{value}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                          <GraduationCap className="w-5 h-5 text-purple-700" />
                          <h3 className="font-bold text-slate-900 text-sm">Pendidikan Formal</h3>
                        </div>
                        <div className="space-y-2.5 text-xs">
                          {user.education.map((edu, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                              <span className="font-bold text-slate-900 block">{edu.degree}</span>
                              <span className="text-slate-600 font-medium">{edu.institution} &bull; {edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                          <Award className="w-5 h-5 text-emerald-700" />
                          <h3 className="font-bold text-slate-900 text-sm">Sertifikasi &amp; Lisensi Profesi</h3>
                        </div>
                        <div className="space-y-2 text-xs">
                          {user.certifications.map((cert, idx) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900 block">{cert.name}</span>
                                <span className="text-slate-500 text-[11px] font-medium">{cert.issuer} &bull; {cert.issueDate}</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                Verified
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* SUB-MENU 2: MY ASSESSMENT */}
              {/* ================================================================= */}
              {activeSubTab === 'MY_ASSESSMENT' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kompetensi Terpetakan</span>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-900">{skills.length} Skill</span>
                        <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">100% Assessed</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Berdasarkan role standar {user.level}</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Achieved / Fit</span>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-emerald-700">{totalAchievedSkills} / {skills.length}</span>
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          {skills.length > 0 ? Math.round((totalAchievedSkills / skills.length) * 100) : 0}% Fit
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Memenuhi target kemahiran</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gap Prioritas Utama</span>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-amber-700">{criticalGapsCount} Gap</span>
                        <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">Focused in IDP</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Perlu penguatan 70:20:10</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Assessment XP</span>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-indigo-900">{totalXP} XP</span>
                        <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">Verified</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Akumulasi validasi kemahiran</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Hasil Evaluasi Kemahiran &amp; Matriks Kompetensi</h3>
                        <p className="text-xs text-slate-500 font-medium">Perbandingan tingkat kemahiran saat ini vs standar jabatan</p>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 w-fit">
                        Evaluasi Terakhir: Q1 2026
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="py-3.5 px-4 font-bold rounded-l-xl">Kategori</th>
                            <th className="py-3.5 px-4 font-bold">Nama Skill &amp; Definisi</th>
                            <th className="py-3.5 px-4 font-bold">Level (Saat Ini vs Target)</th>
                            <th className="py-3.5 px-4 font-bold">Status Gap</th>
                            <th className="py-3.5 px-4 font-bold">Metode Assessment</th>
                            <th className="py-3.5 px-4 text-right font-bold rounded-r-xl">XP Poin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {skills.map((s) => {
                            const isGap = s.gap > 0;
                            return (
                              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                                    {s.category.replace(/_/g, ' ')}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-slate-900 block text-xs">{s.name}</span>
                                  <span className="text-[11px] text-slate-500 font-medium line-clamp-1">{s.definition}</span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">Level {s.currentProficiency}</span>
                                      <span className="text-slate-400">/ Level {s.requiredProficiency}</span>
                                    </div>
                                    <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${isGap ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min((s.currentProficiency / s.requiredProficiency) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                                    isGap ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  }`}>
                                    {isGap ? `-${s.gap} Level Gap` : 'Achieved / Fit'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600 font-medium">{s.assessmentMethod}</td>
                                <td className="py-3.5 px-4 text-right font-black text-indigo-900">+{s.xpEarned} XP</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* SUB-MENU 3: MY CAREER */}
              {/* ================================================================= */}
              {activeSubTab === 'MY_CAREER' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                        <Briefcase className="w-5 h-5 text-indigo-700" />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Jejak Langkah Karir (Career Progression Trail)</h3>
                          <p className="text-xs text-slate-500 font-medium">Riwayat promosi, rotasi penugasan, dan kontribusi strategis</p>
                        </div>
                      </div>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                        {user.careerHistory.map((ch, idx) => (
                          <div key={idx} className="relative flex items-start gap-4 text-xs">
                            <div className="w-7 h-7 rounded-full bg-indigo-900 text-white border-2 border-white shadow-xs flex items-center justify-center shrink-0 z-10 font-bold text-[11px]">
                              {idx + 1}
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex-1 space-y-1.5">
                              <div className="flex items-center justify-between font-bold text-slate-900 flex-wrap gap-1">
                                <span className="text-sm">{ch.position}</span>
                                <span className="text-slate-500 text-[11px] font-normal">{ch.period}</span>
                              </div>
                              <p className="text-slate-600 font-medium">{ch.businessUnit}</p>
                              <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 font-semibold text-[11px] leading-relaxed">
                                &bull; <strong>Pencapaian Utama:</strong> {ch.keyAchievement}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800 shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                            Aspirasi Karir &amp; Target Peran Berikutnya
                          </span>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold text-white">Head of Enterprise Architecture</h4>
                          <p className="text-xs text-indigo-200 mt-1 font-medium leading-relaxed">
                            Kesiapan Suksesi: <strong>Ready in 6 - 12 Months</strong>. Fokus pengembangan mencakup kepemimpinan strategis dan persuasi tingkat eksekutif.
                          </p>
                        </div>
                        <div className="pt-2 flex items-center gap-3">
                          <span className="text-xs text-indigo-200">Kesesuaian Kompetensi Suksesi:</span>
                          <strong className="text-emerald-400 font-bold text-sm">84% Match</strong>
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                          <Shield className="w-5 h-5 text-indigo-700" />
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">Hasil Kalibrasi Komite Talenta</h3>
                            <p className="text-xs text-slate-500 font-medium">Catatan tinjauan performa dan kesiapan suksesi 9-Box</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {user.talentCommitteeResults.map((tc, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-950 text-sm">{tc.cycle}</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10.5px]">
                                  {tc.readinessRating}
                                </span>
                              </div>
                              <p className="text-slate-700 font-medium"><strong>Hasil Kalibrasi:</strong> {tc.calibratedAssessment}</p>
                              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 italic font-medium leading-relaxed">
                                "{tc.notes}"
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* SUB-MENU 4: MY DEVELOPMENT HISTORY */}
              {/* ================================================================= */}
              {activeSubTab === 'MY_DEV_HISTORY' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Jam Pembelajaran', value: `${totalCompletedHours} Jam`, badge: 'Cumulative', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', sub: 'Dari program 70:20:10 terverifikasi' },
                      { label: 'Siklus IDP Selesai', value: `${idpHistory.length} Siklus`, badge: '100% Completed', badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200', sub: 'Histori rencana pengembangan' },
                      { label: 'Aktivitas Tervalidasi', value: `${idpHistory.reduce((acc, h) => acc + h.activities.length, 0)} Aktivitas`, badge: 'Verified', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200', sub: 'Disetujui manajer langsung' },
                      { label: 'Total XP Terkumpul', value: `${totalXP + 800} XP`, badge: `${user.level} Tier`, badgeColor: 'text-amber-800 bg-amber-50 border-amber-200', sub: 'Pertumbuhan kompetensi kumulatif' },
                    ].map((card) => (
                      <div key={card.label} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-900">{card.value}</span>
                          <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>{card.badge}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{card.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-700" />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Rekam Jejak IDP &amp; Pembelajaran (IDP Archive)</h3>
                          <p className="text-xs text-slate-500 font-medium">Rencana pengembangan individu yang telah tervalidasi pada siklus sebelumnya</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {idpHistory.map((idp) => (
                        <div key={idp.id} className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base font-bold text-slate-900">Rencana Pengembangan Periode {idp.period}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10.5px]">
                                {idp.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">Target Role: {idp.targetNextRole}</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sasaran Utama:</span>
                            <p className="font-bold text-slate-900">{idp.primaryObjective}</p>
                            <p className="text-slate-600 font-medium text-[11px] mt-1"><strong>Penyelarasan Bisnis:</strong> {idp.businessGoalAlignment}</p>
                          </div>
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-700 block">Aktivitas 70:20:10 yang Diselesaikan:</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                              {idp.activities.map((act) => (
                                <div key={act.id} className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-2">
                                  <div>
                                    <span className="font-bold text-slate-900 block text-[11.5px]">{act.programName}</span>
                                    <span className="text-slate-500 text-[10.5px] font-medium">{act.goal}</span>
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                    Validated
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
