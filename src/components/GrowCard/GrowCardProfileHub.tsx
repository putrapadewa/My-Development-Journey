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
} from 'lucide-react';
import { UserProfile, SkillItem, IndividualDevelopmentPlan } from '../../types';

export type ProfileSubMenu = 'MY_PROFILE' | 'MY_ASSESSMENT' | 'MY_CAREER' | 'MY_DEV_HISTORY';

interface GrowCardProfileHubProps {
  user: UserProfile;
  skills: SkillItem[];
  idpHistory: IndividualDevelopmentPlan[];
  initialSubTab?: ProfileSubMenu;
  onNavigateToTab?: (tab: string) => void;
}

export const GrowCardProfileHub: React.FC<GrowCardProfileHubProps> = ({
  user,
  skills,
  idpHistory,
  initialSubTab = 'MY_PROFILE',
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProfileSubMenu>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const totalXP = skills.reduce((acc, curr) => acc + curr.xpEarned, 0);
  const totalCompletedHours = idpHistory.reduce((acc, idp) => {
    return acc + idp.activities.reduce((a, act) => a + (act.learningHours || 0), 0);
  }, 0);

  const totalAchievedSkills = skills.filter((s) => s.gap <= 0).length;
  const criticalGapsCount = skills.filter((s) => s.gap > 0.8).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Master Grow Card Bento Header */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
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

          {/* Quick Metrics Bento Tile */}
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
        </div>
      </div>

      {/* 2. Sub-Menus Navigation Bar (Mandatory 4 Sub-menus) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
              onClick={() => setActiveSubTab(tab.id as ProfileSubMenu)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-900 text-white shadow-xs scale-100 ring-2 ring-indigo-900/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Menu Content Views */}

      {/* ========================================================================= */}
      {/* SUB-MENU 1: MY PROFIL */}
      {/* ========================================================================= */}
      {activeSubTab === 'MY_PROFILE' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Employee General Data Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1 & 2: Personal & Organizational Details */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Informasi Karyawan & Organisasi</h3>
                    <p className="text-slate-500 text-xs font-medium">Data induk profil profesional dan afiliasi unit bisnis</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Status: Active Permanent
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nama Lengkap</span>
                  <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nomor Induk Karyawan (NIP)</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">{user.employeeId}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Posisi / Jabatan</span>
                  <span className="font-bold text-slate-900 text-sm">{user.position}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Level / Job Banding</span>
                  <span className="font-bold text-indigo-900 text-sm">{user.level}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Business Unit</span>
                  <span className="font-bold text-slate-900 text-sm">{user.businessUnit}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Division & Department</span>
                  <span className="font-bold text-slate-900 text-sm">{user.division} &bull; {user.department}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tanggal Bergabung</span>
                  <span className="font-bold text-slate-900 text-sm">{user.joinDate} ({user.yearsOfExperience} Tahun Pengalaman)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Lokasi Kerja</span>
                  <span className="font-bold text-slate-900 text-sm">{user.location}</span>
                </div>
              </div>

              {/* Direct Reporting Hierarchy */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs mb-3">Struktur Pelaporan & Mitra SDM:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-sm">
                      M
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Direct Line Manager</span>
                      <span className="font-bold text-slate-900">{user.managerName}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center font-bold text-sm">
                      H
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Dedicated HRBP</span>
                      <span className="font-bold text-slate-900">{user.hrbpName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Contact, Education & Certifications Preview */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Mail className="w-4 h-4 text-indigo-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Kontak & Komunikasi</h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Email Perusahaan</span>
                      <span className="font-semibold text-slate-900">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Telepon / WhatsApp</span>
                      <span className="font-semibold text-slate-900">{user.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Penempatan</span>
                      <span className="font-semibold text-slate-900">{user.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Box */}
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

              {/* Certifications Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Sertifikasi & Lisensi Profesi</h3>
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

      {/* ========================================================================= */}
      {/* SUB-MENU 2: MY ASSESSMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'MY_ASSESSMENT' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Assessment Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kompetensi Terpetakan</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{skills.length} Skill</span>
                <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">100% Assessed</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Berdasarkan role standar L5</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Achieved / Fit</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-700">{totalAchievedSkills} / {skills.length}</span>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {Math.round((totalAchievedSkills / skills.length) * 100)}% Fit
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

          {/* Skill Matrix Table Bento Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Hasil Evaluasi Kemahiran & Matriks Kompetensi (Assessment Matrix)</h3>
                <p className="text-xs text-slate-500 font-medium">Perbandingan tingkat kemahiran saat ini vs standar jabatan (Current vs Required Level)</p>
              </div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 w-fit">
                Evaluasi Terakhir: Q1 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold rounded-l-xl">Kategori Kompetensi</th>
                    <th className="py-3.5 px-4 font-bold">Nama Skill & Definisi</th>
                    <th className="py-3.5 px-4 font-bold">Tingkat Kemahiran (Saat Ini vs Target)</th>
                    <th className="py-3.5 px-4 font-bold">Status Kesenjangan (Gap)</th>
                    <th className="py-3.5 px-4 font-bold">Metode Pengujian / Assessment</th>
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
                            isGap
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            {isGap ? `-${s.gap} Level Gap` : 'Achieved / Fit'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {s.assessmentMethod}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-indigo-900">
                          +{s.xpEarned} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MENU 3: MY CAREER */}
      {/* ========================================================================= */}
      {activeSubTab === 'MY_CAREER' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Career Timeline Bento Card */}
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

            {/* Talent Committee & Readiness Review */}
            <div className="space-y-6">
              
              {/* Target Next Role Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                    Aspirasi Karir & Target Peran Berikutnya
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

              {/* Talent Committee History */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Shield className="w-5 h-5 text-indigo-700" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Hasil Kalibrasi Komite Talenta (Talent Committee)</h3>
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

      {/* ========================================================================= */}
      {/* SUB-MENU 4: MY DEVELOPMENT HISTORY */}
      {/* ========================================================================= */}
      {activeSubTab === 'MY_DEV_HISTORY' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* History KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Jam Pembelajaran</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">{totalCompletedHours} Jam</span>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Cumulative</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Dari program 70:20:10 terverifikasi</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Siklus IDP Selesai</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-900">{idpHistory.length} Siklus</span>
                <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">100% Completed</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Histori rencana pengembangan</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktivitas Tervalidasi</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-700">
                  {idpHistory.reduce((acc, h) => acc + h.activities.length, 0)} Aktivitas
                </span>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Verified</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Disetujui manajer langsung</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total XP Terkumpul</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-700">{totalXP + 800} XP</span>
                <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">Level 5 Tier</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Pertumbuhan kompetensi kumulatif</p>
            </div>
          </div>

          {/* Past IDP Periods List */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-700" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Rekam Jejak IDP & Pembelajaran Masa Lalu (IDP Archive)</h3>
                  <p className="text-xs text-slate-500 font-medium">Rencana pengembangan individu yang telah tervalidasi dan selesai pada siklus sebelumnya</p>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Sasaran Pengembangan Utama (Primary Objective):</span>
                    <p className="font-bold text-slate-900">{idp.primaryObjective}</p>
                    <p className="text-slate-600 font-medium text-[11px] mt-1"><strong>Penyelarasan Bisnis:</strong> {idp.businessGoalAlignment}</p>
                  </div>

                  {/* Activities summary in this IDP */}
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
  );
};
