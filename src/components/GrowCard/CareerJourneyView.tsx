import React from 'react';
import { Target, Users, Briefcase, LayoutGrid, Building } from 'lucide-react';
import { UserProfile } from '../../types';

// ── 12-Box cell definitions ───────────────────────────────────────────────────
type BoxCell = {
  perf: number;
  pot: number;
  label: string;
  bg: string;
  text: string;
  bgActive: string;
};

const CELLS: BoxCell[] = [
  // High Potential (pot=3)
  { perf: 1, pot: 3, label: 'Uncertain\nPotential',   bg: '#f1f5f9', text: '#475569', bgActive: '#475569' },
  { perf: 2, pot: 3, label: 'Emerging\nTalent',       bg: '#ede9fe', text: '#6d28d9', bgActive: '#7c3aed' },
  { perf: 3, pot: 3, label: 'High\nPotential',        bg: '#c7d2fe', text: '#3730a3', bgActive: '#4338ca' },
  { perf: 4, pot: 3, label: 'Exceptional\nTalent',    bg: '#312e81', text: '#c7d2fe', bgActive: '#1e1b4b' },
  // Medium Potential (pot=2)
  { perf: 1, pot: 2, label: 'Inconsistent\nPlayer',   bg: '#fff7ed', text: '#c2410c', bgActive: '#ea580c' },
  { perf: 2, pot: 2, label: 'Core\nContributor',      bg: '#e0f2fe', text: '#0369a1', bgActive: '#0284c7' },
  { perf: 3, pot: 2, label: 'Skilled\nPerformer',     bg: '#dbeafe', text: '#1e40af', bgActive: '#2563eb' },
  { perf: 4, pot: 2, label: 'High\nImpact',           bg: '#cffafe', text: '#0e7490', bgActive: '#0891b2' },
  // Low Potential (pot=1)
  { perf: 1, pot: 1, label: 'Under\nPerformer',       bg: '#fee2e2', text: '#b91c1c', bgActive: '#dc2626' },
  { perf: 2, pot: 1, label: 'Steady\nPerformer',      bg: '#fef9c3', text: '#854d0e', bgActive: '#ca8a04' },
  { perf: 3, pot: 1, label: 'Strong\nContributor',    bg: '#dcfce7', text: '#166534', bgActive: '#16a34a' },
  { perf: 4, pot: 1, label: 'Consistent\nStar',       bg: '#bbf7d0', text: '#14532d', bgActive: '#15803d' },
];

const PERF_LABELS = [
  'Needs\nImprovement',
  'Meets\nExpectations',
  'Exceeds\nExpectations',
  'Outstanding',
];
const POT_LABELS: Record<number, string> = { 3: 'High', 2: 'Medium', 1: 'Low' };

// ── Readiness colour helper ───────────────────────────────────────────────────
function readiness(score: number) {
  if (score >= 80) return { bar: 'bg-emerald-500', text: 'text-emerald-700', card: 'bg-emerald-50 border-emerald-200', label: 'Ready Now' };
  if (score >= 50) return { bar: 'bg-amber-400',   text: 'text-amber-700',   card: 'bg-amber-50 border-amber-200',   label: 'Ready 1–2 Thn' };
  return           { bar: 'bg-orange-400',  text: 'text-orange-700',  card: 'bg-orange-50 border-orange-200',  label: 'Ready 3+ Thn' };
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props { user: UserProfile }

export const CareerJourneyView: React.FC<Props> = ({ user }) => {
  const careerPaths    = user.careerPaths   ?? [];
  const isSuccessor    = user.isSuccessor   ?? false;
  const successorFor   = user.successorFor  ?? [];
  const perfRating     = user.performanceRating;
  const potRating      = user.potentialRating;
  const activeCell     = CELLS.find(c => c.perf === perfRating && c.pot === potRating);

  // Extract starting year from a period string like "2019 – 2022"
  const yearFrom = (period: string) => period.split(/[-–—]/)[0].trim().slice(-4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — CAREER PATH (NEXT POSITIONS)
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Target className="w-5 h-5 text-indigo-700 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Career Path — Next Positions</h3>
            <p className="text-xs text-slate-500 font-medium">
              Posisi target berikutnya beserta tingkat kesiapan per peran (maks. 3)
            </p>
          </div>
        </div>

        {careerPaths.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-6 text-center">
            Belum ada data career path yang dikonfigurasi.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careerPaths.slice(0, 3).map((cp, idx) => {
              const col = readiness(cp.readinessScore);
              return (
                <div key={idx} className={`rounded-2xl border p-5 space-y-4 ${col.card}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-snug">{cp.position}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                          <Building className="w-3 h-3 shrink-0" /> {cp.businessUnit}
                        </p>
                      </div>
                    </div>
                    {cp.targetYear && (
                      <span className="text-[10px] font-bold text-slate-400 bg-white/60 px-2 py-0.5 rounded-full border border-slate-200 whitespace-nowrap shrink-0">
                        {cp.targetYear}
                      </span>
                    )}
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

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — SUCCESSOR
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Users className="w-5 h-5 text-indigo-700 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Suksesor</h3>
            <p className="text-xs text-slate-500 font-medium">
              Status karyawan sebagai suksesor untuk posisi tertentu
            </p>
          </div>
          <span
            className={`ml-auto px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${
              isSuccessor
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            {isSuccessor ? 'Ya — Suksesor Aktif' : 'Tidak'}
          </span>
        </div>

        {isSuccessor && successorFor.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs min-w-[480px]">
              <thead>
                <tr className="bg-indigo-900 text-white">
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
                          <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
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
        ) : isSuccessor ? (
          <p className="text-sm text-slate-400 italic py-2 text-center">
            Data posisi suksesor belum dikonfigurasi.
          </p>
        ) : (
          <p className="text-sm text-slate-500 py-2">
            Karyawan ini saat ini tidak terdaftar sebagai suksesor untuk posisi apapun.
          </p>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — CAREER HISTORY TABLE
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Briefcase className="w-5 h-5 text-indigo-700 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Riwayat Karir</h3>
            <p className="text-xs text-slate-500 font-medium">
              Histori posisi, perusahaan, dan tahun penugasan
            </p>
          </div>
        </div>

        {user.careerHistory.length === 0 ? (
          <p className="text-sm text-slate-400 italic py-6 text-center">
            Belum ada riwayat karir yang tercatat.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr className="bg-indigo-900 text-white">
                  <th className="text-left px-4 py-3 font-bold text-[11px] w-20">Tahun</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px]">Posisi</th>
                  <th className="text-left px-4 py-3 font-bold text-[11px]">Perusahaan / Unit</th>
                </tr>
              </thead>
              <tbody>
                {user.careerHistory.map((ch, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3.5 font-bold text-indigo-900 whitespace-nowrap">
                      {yearFrom(ch.period)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{ch.position}</td>
                    <td className="px-4 py-3.5 text-slate-600">{ch.company ?? ch.businessUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 4 — 12-BOX TALENT MATRIX
      ════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <LayoutGrid className="w-5 h-5 text-indigo-700 shrink-0" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Matriks Talenta 12-Box</h3>
            <p className="text-xs text-slate-500 font-medium">
              Kalibrasi performa (sumbu X) vs potensi (sumbu Y)
            </p>
          </div>
          {activeCell && (
            <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold border bg-indigo-50 text-indigo-700 border-indigo-200 whitespace-nowrap">
              Posisi Teridentifikasi ★
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[540px]">

            {/* ── Column header (performance labels) ── */}
            <div className="flex gap-2 mb-2 pl-[88px]">
              {PERF_LABELS.map((label, i) => (
                <div
                  key={i}
                  className={`flex-1 text-center text-[10px] font-bold uppercase tracking-wide leading-tight px-1 py-1 rounded-lg ${
                    perfRating === i + 1 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {label.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                  <span className="text-[9px] opacity-60 font-normal">({i + 1})</span>
                </div>
              ))}
            </div>

            {/* ── Rows: high potential at top ── */}
            {[3, 2, 1].map((pot) => (
              <div key={pot} className="flex items-stretch gap-2 mb-2">
                {/* Row label */}
                <div
                  className={`w-20 shrink-0 flex items-center justify-end pr-2 text-[10px] font-bold text-right leading-tight rounded-lg ${
                    potRating === pot ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500'
                  }`}
                >
                  <span>{POT_LABELS[pot]}<br /><span className="opacity-60 font-normal">({pot})</span></span>
                </div>

                {/* Cells */}
                {[1, 2, 3, 4].map((perf) => {
                  const cell = CELLS.find(c => c.perf === perf && c.pot === pot)!;
                  const isActive = perf === perfRating && pot === potRating;
                  return (
                    <div
                      key={perf}
                      className="flex-1 relative rounded-xl p-2.5 flex flex-col items-center justify-center text-center"
                      style={{
                        minHeight: 72,
                        background: isActive ? cell.bgActive : cell.bg,
                        color: isActive ? '#fff' : cell.text,
                        border: isActive ? '2.5px solid #312e81' : '1.5px solid rgba(0,0,0,0.07)',
                        boxShadow: isActive ? '0 0 0 3px rgba(99,102,241,0.25)' : undefined,
                        transform: isActive ? 'scale(1.04)' : undefined,
                        zIndex: isActive ? 1 : undefined,
                        transition: 'all 0.15s',
                      }}
                    >
                      <p className="text-[9.5px] font-bold leading-tight">
                        {cell.label.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                      </p>
                      <p className="text-[8px] mt-1 opacity-50 font-medium">P{perf}×T{pot}</p>
                      {isActive && (
                        <span
                          className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-indigo-900 text-white flex items-center justify-center text-[9px] font-black shadow-md border-2 border-white"
                          style={{ zIndex: 2 }}
                        >
                          ★
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* ── X-axis label ── */}
            <div className="pl-[88px] text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Performance →
            </div>
          </div>
        </div>

        {/* ── Summary badge ── */}
        {activeCell ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
              style={{ background: activeCell.bgActive }}
            >
              ★
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">
                {activeCell.label.replace('\n', ' ')}
              </p>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">
                Performa Level {perfRating} × Potensi Level {potRating}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center">
            Data performa dan potensi belum dikonfigurasi untuk karyawan ini.
          </p>
        )}
      </div>

    </div>
  );
};
