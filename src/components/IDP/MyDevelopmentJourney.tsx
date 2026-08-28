import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  ChevronRight,
  Shield,
  Trash2,
  ExternalLink,
  ArrowRight,
  Target,
  Plus,
  Edit2,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import mdjLogo from '../../assets/images/mdj_logo_vector_1787760001788.jpg';
import {
  IndividualDevelopmentPlan,
  DevelopmentActivity,
  UserProfile,
  ActivityFramework,
} from '../../types';
import { ActivityDetailModal } from './ActivityDetailModal';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface MyDevelopmentJourneyProps {
  currentUser: UserProfile;
  idp: IndividualDevelopmentPlan;
  onUpdateIdp: (updated: IndividualDevelopmentPlan) => void;
  onOpenAICoach: () => void;
}

type JourneyView = 'WELCOME' | 'AI_SETUP' | 'AI_REVIEW' | 'JOURNEY';

const SCAN_ITEMS = (name: string, bu: string, actCount: number) => [
  `Membaca profil: ${name}`,
  `Menganalisa skill gaps di ${bu}`,
  'Menelaah histori IDP dan aktivitas sebelumnya',
  `Mencocokkan dengan ${actCount > 0 ? actCount + ' aktivitas tersimpan & ' : ''}katalog programme`,
  'Menyiapkan rekomendasi personal 70:20:10...',
];

export const MyDevelopmentJourney: React.FC<MyDevelopmentJourneyProps> = ({
  currentUser,
  idp,
  onUpdateIdp,
  onOpenAICoach,
}) => {
  const [journeyView, setJourneyView] = useState<JourneyView>('WELCOME');
  const [selectedActivity, setSelectedActivity] = useState<DevelopmentActivity | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | ActivityFramework>('ALL');

  // AI Setup states
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(-1);
  const [focusArea, setFocusArea] = useState('');
  const [aiAspiration, setAiAspiration] = useState('');
  const [aiStrengths, setAiStrengths] = useState('');
  const [aiPeriod, setAiPeriod] = useState('2026 H1 (Jan - Jun 2026)');
  const [isAiSetupLoading, setIsAiSetupLoading] = useState(false);
  const [aiSetupError, setAiSetupError] = useState('');

  // AI Review states
  const [pendingActivities, setPendingActivities] = useState<DevelopmentActivity[]>([]);
  const [pendingObjective, setPendingObjective] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DevelopmentActivity>>({});

  const activities = idp.activities || [];
  const total = activities.length;

  const learningCount = activities.filter((a) => a.frameworkType === '10_LEARNING').length;
  const exposureCount = activities.filter((a) => a.frameworkType === '20_EXPOSURE').length;
  const experienceCount = activities.filter((a) => a.frameworkType === '70_EXPERIENCE').length;

  const completedActivities = activities.filter((a) => a.status === 'COMPLETED' || a.status === 'VALIDATED');
  const validatedActivities = activities.filter((a) => a.status === 'VALIDATED' || a.managerValidationRating);
  const withEvidenceActivities = activities.filter((a) => Boolean(a.evidenceText || a.evidenceLink));

  const planProgress = total > 0 ? (idp.status === 'APPROVED' || idp.status === 'IN_PROGRESS' || idp.status === 'COMPLETED' ? 100 : idp.status === 'WAITING_FOR_APPROVAL' ? 75 : 40) : 0;
  const learningProgress = total > 0 ? Math.round((completedActivities.length / total) * 100) : 0;
  const applicationProgress = total > 0 ? Math.round((withEvidenceActivities.length / total) * 100) : 0;
  const capabilityProgress = total > 0 ? Math.round((validatedActivities.length / total) * 100) : 0;

  const totalLearningHours = activities.reduce((acc, curr) => acc + (curr.learningHours || 0), 0);
  const totalXP = activities.reduce((acc, curr) => acc + (curr.xpValue || 0), 0);

  // Derive banner content from selected activities so it stays in sync
  const displayObjective = activities.length > 0
    ? activities.map((a) => a.goal).join(' · ')
    : (idp.primaryObjective || `${idp.period} Development Journey`);
  const allSkillNames = [...new Set(activities.flatMap((a) => a.skillNames || []))];
  const displayAlignment = activities.length > 0 && allSkillNames.length > 0
    ? `Berfokus pada pengembangan: ${allSkillNames.join(', ')}.`
    : idp.businessGoalAlignment;

  // Scan animation when entering AI_SETUP
  useEffect(() => {
    if (journeyView !== 'AI_SETUP') return;
    setIsAiScanning(true);
    setScanProgress(0);
    const items = SCAN_ITEMS(currentUser.name, currentUser.businessUnit, activities.length);
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setScanProgress(idx);
      if (idx >= items.length - 1) {
        clearInterval(timer);
        setTimeout(() => setIsAiScanning(false), 700);
      }
    }, 550);
    return () => clearInterval(timer);
  }, [journeyView]);

  const handleApplyAIPlan = (newActivities: DevelopmentActivity[]) => {
    const updated: IndividualDevelopmentPlan = {
      ...idp,
      activities: newActivities,
      status: 'DRAFT',
      updatedAt: new Date().toISOString(),
    };
    onUpdateIdp(updated);
    triggerMilestoneCelebration();
  };

  const handleGenerateAI = async () => {
    setIsAiSetupLoading(true);
    setAiSetupError('');
    try {
      const response = await fetch('/api/claude/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationGoal: 'Group 2026 Digital North Star: 40% reduction in cloud latency, $500k FinOps optimization, and 3 enterprise AI copilot rollouts.',
          individualKpi: 'Lead zero-downtime microservices migration and establish enterprise GenAI guardrails.',
          currentPosition: currentUser.position,
          businessUnit: currentUser.businessUnit,
          areasOfImprovement: focusArea || 'Executive leadership and strategic communication',
          strengths: aiStrengths || 'Technical expertise and problem-solving',
          aspiration: aiAspiration || `Senior ${currentUser.position}`,
          nextPosition: aiAspiration || `Senior ${currentUser.position}`,
          targetBusinessUnit: currentUser.businessUnit,
          period: aiPeriod,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).error || `Server error ${response.status}`);
      }

      const data = await response.json();

      if (!data.recommendedActivities || data.recommendedActivities.length === 0) {
        throw new Error('AI tidak menghasilkan rekomendasi. Coba lagi atau ubah input.');
      }

      const mappedActivities: DevelopmentActivity[] = (data.recommendedActivities || []).map(
        (rec: any, idx: number) => ({
          id: `act-gen-${Date.now()}-${idx}`,
          idpId: idp.id,
          goal: rec.goal || 'Develop enterprise capability',
          programName: rec.programName || 'Development Activity',
          provider: rec.provider || 'Internal / External',
          frameworkType: rec.frameworkType || '10_LEARNING',
          timelineStart: '2026-01-15',
          timelineEnd: '2026-06-30',
          status: 'DRAFT',
          measurement: rec.measurement || 'To be defined based on project deliverables',
          skillIds: [],
          skillNames: rec.skillNames || [],
          expectedImpact: rec.expectedImpact || 'Bridges critical skill gaps for target role',
          learningHours: rec.learningHours || 8,
          xpValue: rec.frameworkType === '70_EXPERIENCE' ? 300 : rec.frameworkType === '20_EXPOSURE' ? 180 : 120,
        })
      );

      const objective = data.primaryObjective || `Develop strategic capabilities aligned to ${aiAspiration || currentUser.position} — ${aiPeriod}`;
      setPendingActivities(mappedActivities);
      setPendingObjective(objective);
      setSelectedIds(mappedActivities.map((a) => a.id));
      setEditingId(null);
      setJourneyView('AI_REVIEW');
    } catch (err) {
      console.error('AI generation error:', err);
      setAiSetupError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
      setJourneyView('AI_SETUP');
    } finally {
      setIsAiSetupLoading(false);
    }
  };

  const handleSubmitForApproval = () => {
    const updated: IndividualDevelopmentPlan = {
      ...idp,
      status: 'WAITING_FOR_APPROVAL',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onUpdateIdp(updated);
  };

  const handleSaveActivity = (updatedAct: DevelopmentActivity) => {
    const updatedActivities = activities.map((a) => (a.id === updatedAct.id ? updatedAct : a));
    onUpdateIdp({ ...idp, activities: updatedActivities, updatedAt: new Date().toISOString() });
  };

  const handleDeleteActivity = (actId: string) => {
    onUpdateIdp({ ...idp, activities: activities.filter((a) => a.id !== actId), updatedAt: new Date().toISOString() });
  };

  const filteredActivities = activeFilter === 'ALL' ? activities : activities.filter((a) => a.frameworkType === activeFilter);

  // ─── WELCOME VIEW ───────────────────────────────────────────────────────────
  if (journeyView === 'WELCOME') {
    return (
      <div className="pb-12">
        {/* Card with sprout background pattern */}
        <div
          className="rounded-3xl border border-blue-200 shadow-lg overflow-hidden"
          style={{
            backgroundColor: '#f0f7ff',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cline x1='24' y1='44' x2='24' y2='26' stroke='%2322c55e' stroke-width='1.8' stroke-linecap='round' opacity='0.22'/%3E%3Cpath d='M24 36 Q16 30 14 22 Q21 22 24 30' fill='%234ade80' opacity='0.18'/%3E%3Cpath d='M24 30 Q32 24 34 16 Q27 16 24 24' fill='%2316a34a' opacity='0.18'/%3E%3C/svg%3E\")",
            backgroundSize: '48px 48px',
          }}
        >
          {/* ── 1-4: Logo, Title, Quote, Description ── */}
          <div className="px-10 sm:px-20 py-12 flex flex-col items-center text-center">

            {/* 1. MDJ Logo */}
            <div className="w-24 h-24 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shadow-md mb-6 overflow-hidden">
              <img src={mdjLogo} alt="My Development Journey Logo" className="w-full h-full object-contain p-2" />
            </div>

            {/* 2. Invitation title */}
            <h2 className="text-3xl font-extrabold text-slate-800 leading-tight">
              My Development Journey
            </h2>
            <p className="mt-2 text-base text-blue-600 font-medium">
              Start creating your personalized learning and development plan.
            </p>

            {/* 3. Motivational quote */}
            <blockquote className="mt-6 max-w-lg text-sm text-slate-500 italic leading-relaxed">
              "An investment in knowledge pays the best interest."
              <span className="block text-slate-400 not-italic text-xs font-medium mt-1">— Benjamin Franklin</span>
            </blockquote>

            {/* 4. Description — wide (max-w-2xl ≈ 2 lines) */}
            <p className="mt-4 max-w-2xl text-sm text-slate-600 leading-relaxed">
              AI will analyze your profile, skill gaps, and career goals to help build a personalized development plan using the <strong className="text-blue-700">70:20:10 Learning and Development</strong> model.
            </p>

          </div>

          {/* ── 5: What is the 70:20:10 L&D Model? ── */}
          <div className="bg-white/70 border-t border-blue-100 px-10 sm:px-20 py-8">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest text-center mb-5">What is the 70:20:10 Learning and Development Model?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* 70% */}
              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
                <div className="text-4xl font-extrabold text-blue-500 leading-none mb-2">70%</div>
                <div className="text-sm font-bold text-blue-700 mb-2">Experience</div>
                <p className="text-sm text-blue-800/80 leading-relaxed mb-3">Learn directly from real work: projects, new challenges, and role rotations.</p>
                <div className="flex flex-col gap-1">
                  {['On-the-job project', 'Rotation / stretch role', 'Strategic project'].map((ex) => (
                    <span key={ex} className="text-sm text-blue-700 flex items-center gap-1.5"><span className="shrink-0">▸</span>{ex}</span>
                  ))}
                </div>
              </div>

              {/* 20% */}
              <div className="rounded-2xl bg-sky-50 border border-sky-200 p-5">
                <div className="text-4xl font-extrabold text-sky-500 leading-none mb-2">20%</div>
                <div className="text-sm font-bold text-sky-700 mb-2">Exposure</div>
                <p className="text-sm text-sky-800/80 leading-relaxed mb-3">Learn from others through interaction, observation, and collaboration with mentors.</p>
                <div className="flex flex-col gap-1">
                  {['Mentoring / coaching', 'Shadowing senior', 'Peer feedback & discussion'].map((ex) => (
                    <span key={ex} className="text-sm text-sky-700 flex items-center gap-1.5"><span className="shrink-0">▸</span>{ex}</span>
                  ))}
                </div>
              </div>

              {/* 10% */}
              <div className="rounded-2xl bg-green-50 border border-green-200 p-5">
                <div className="text-4xl font-extrabold text-green-500 leading-none mb-2">10%</div>
                <div className="text-sm font-bold text-green-700 mb-2">Education</div>
                <p className="text-sm text-green-800/80 leading-relaxed mb-3">Structured learning through formal training, classes, e-learning, and certifications.</p>
                <div className="flex flex-col gap-1">
                  {['Training & workshop', 'E-learning / class', 'Professional certification'].map((ex) => (
                    <span key={ex} className="text-sm text-green-700 flex items-center gap-1.5"><span className="shrink-0">▸</span>{ex}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── 6-7: CTA button + feature pills ── */}
          <div className="bg-blue-50/60 border-t border-blue-100 px-10 sm:px-20 py-8 flex flex-col items-center gap-4">
            <button
              onClick={() => setJourneyView('AI_SETUP')}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Create My Development Journey
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex flex-wrap justify-center gap-2">
              {['Personalized by AI', 'Skill Gap Analysis', '70:20:10 Model', 'Programme Recommendations'].map((f) => (
                <span key={f} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 border border-blue-200 text-blue-700">
                  {f}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ─── AI SETUP VIEW ───────────────────────────────────────────────────────────
  if (journeyView === 'AI_SETUP') {
    const scanItems = SCAN_ITEMS(currentUser.name, currentUser.businessUnit, activities.length);

    return (
      <div className="max-w-3xl mx-auto space-y-5 pb-12">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg">AI Development Advisor</h2>
                <p className="text-xs text-indigo-200 mt-0.5">Menyusun rencana pengembangan yang dipersonalisasi untuk {currentUser.name}</p>
              </div>
            </div>
          </div>

          {/* AI Scanning Section */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/60">
            {isAiScanning ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center animate-pulse shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">AI sedang membaca data yang tersedia...</p>
                    <p className="text-xs text-slate-500">Harap tunggu sebentar</p>
                  </div>
                </div>
                <div className="space-y-2 pl-12">
                  {scanItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                        idx <= scanProgress ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {idx < scanProgress ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : idx === scanProgress ? (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0" />
                      )}
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Analisa profil selesai</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AI telah membaca profil, skill gaps, dan target karier kamu. Tambahkan informasi di bawah untuk rekomendasi yang lebih akurat — atau langsung klik Generate.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Input Fields */}
          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Perkuat Analisa AI</h3>
              <p className="text-xs text-slate-500 mt-0.5">Semua field di bawah bersifat opsional — AI akan menggunakan data profil sebagai dasar analisa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Focus Area */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Fokus Area Development
                </label>
                <textarea
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="Mis: Ingin meningkatkan executive presence dan kemampuan memimpin tim lintas fungsi, atau fokus pada data storytelling untuk C-Suite presentation..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none bg-white"
                  rows={3}
                />
              </div>

              {/* Aspiration */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-500" />
                  Target Role / Aspirasi Karier
                </label>
                <input
                  type="text"
                  value={aiAspiration}
                  onChange={(e) => setAiAspiration(e.target.value)}
                  placeholder="Mis: Head of Digital Strategy, VP Technology..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white"
                />
              </div>

              {/* Strengths */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Kekuatan / Kompetensi yang Sudah Ada
                </label>
                <input
                  type="text"
                  value={aiStrengths}
                  onChange={(e) => setAiStrengths(e.target.value)}
                  placeholder="Mis: Cloud Architecture, Stakeholder Engagement, Agile..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white"
                />
              </div>

              {/* Period */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Periode Development
                </label>
                <select
                  value={aiPeriod}
                  onChange={(e) => setAiPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 bg-white cursor-pointer"
                >
                  <option>2026 H1 (Jan - Jun 2026)</option>
                  <option>2026 H2 (Jul - Des 2026)</option>
                  <option>Full Year 2026</option>
                </select>
              </div>
            </div>

            {/* Note about 70:20:10 */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
              <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-800 leading-relaxed">
                AI akan menyusun <strong>minimum 5 aktivitas</strong> dengan komposisi ideal: 70% Experience (Action Project), 20% Exposure (Mentoring/Shadowing), dan 10% Formal Learning (Pelatihan/Kursus).
              </p>
            </div>

            {/* Error Banner */}
            {aiSetupError && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 leading-relaxed">{aiSetupError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setJourneyView('WELCOME')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                ← Kembali
              </button>
              <button
                onClick={handleGenerateAI}
                disabled={isAiSetupLoading || isAiScanning}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAiSetupLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    AI Sedang Menyusun Rencana...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-white" />
                    Generate Rekomendasi 70:20:10
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── AI REVIEW VIEW ──────────────────────────────────────────────────────────
  if (journeyView === 'AI_REVIEW') {
    const frameworkLabel = (ft: ActivityFramework) =>
      ft === '70_EXPERIENCE' ? '70 – Experience' : ft === '20_EXPOSURE' ? '20 – Exposure' : '10 – Learning';

    const frameworkColor = (ft: ActivityFramework) =>
      ft === '70_EXPERIENCE'
        ? 'bg-violet-100 text-violet-700 border-violet-200'
        : ft === '20_EXPOSURE'
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200';

    const toggleSelect = (id: string) => {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
      setSelectedIds(selectedIds.length === pendingActivities.length ? [] : pendingActivities.map((a) => a.id));
    };

    const handleStartEdit = (act: DevelopmentActivity) => {
      setEditingId(act.id);
      setEditForm({ ...act });
    };

    const handleSaveEdit = () => {
      if (!editingId) return;
      setPendingActivities((prev) =>
        prev.map((a) => (a.id === editingId ? ({ ...a, ...editForm } as DevelopmentActivity) : a))
      );
      setEditingId(null);
      setEditForm({});
    };

    const handleCancelEdit = () => {
      setEditingId(null);
      setEditForm({});
    };

    const handleDeletePending = (id: string) => {
      setPendingActivities((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleAddRow = () => {
      const newId = `act-new-${Date.now()}`;
      const newAct: DevelopmentActivity = {
        id: newId,
        idpId: idp.id,
        goal: '',
        programName: '',
        provider: '',
        frameworkType: '10_LEARNING',
        timelineStart: '2026-01-15',
        timelineEnd: '2026-06-30',
        status: 'DRAFT',
        measurement: '',
        skillIds: [],
        skillNames: [],
        expectedImpact: '',
        learningHours: 8,
        xpValue: 120,
      };
      setPendingActivities((prev) => [...prev, newAct]);
      setSelectedIds((prev) => [...prev, newId]);
      setEditingId(newId);
      setEditForm({ ...newAct });
    };

    const handleConfirmReview = () => {
      const chosen = pendingActivities.filter((a) => selectedIds.includes(a.id));
      handleApplyAIPlan(chosen);
      setJourneyView('JOURNEY');
    };

    const expCount70 = pendingActivities.filter((a) => selectedIds.includes(a.id) && a.frameworkType === '70_EXPERIENCE').length;
    const expCount20 = pendingActivities.filter((a) => selectedIds.includes(a.id) && a.frameworkType === '20_EXPOSURE').length;
    const learnCount10 = pendingActivities.filter((a) => selectedIds.includes(a.id) && a.frameworkType === '10_LEARNING').length;

    return (
      <div className="space-y-5 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Review Rekomendasi AI</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tinjau, edit, atau hapus rekomendasi sebelum menyimpan ke journey kamu.
            </p>
          </div>
          <button
            onClick={() => setJourneyView('AI_SETUP')}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            ← Kembali
          </button>
        </div>

        {/* Objective banner */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wide">AI-Generated Objective</p>
            <p className="text-sm font-semibold text-indigo-900 mt-0.5">{pendingObjective}</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 text-center w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === pendingActivities.length && pendingActivities.length > 0}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 rounded cursor-pointer"
                    />
                  </th>
                  <th className="p-3 text-left text-slate-500 font-semibold w-8">No.</th>
                  <th className="p-3 text-left text-slate-500 font-semibold whitespace-nowrap">Framework</th>
                  <th className="p-3 text-left text-slate-500 font-semibold min-w-[160px]">Goal</th>
                  <th className="p-3 text-left text-slate-500 font-semibold min-w-[160px]">Program / Aktivitas</th>
                  <th className="p-3 text-left text-slate-500 font-semibold">Provider</th>
                  <th className="p-3 text-left text-slate-500 font-semibold whitespace-nowrap">Timeline</th>
                  <th className="p-3 text-center text-slate-500 font-semibold whitespace-nowrap">Jam</th>
                  <th className="p-3 text-left text-slate-500 font-semibold min-w-[140px]">Measurement</th>
                  <th className="p-3 text-center text-slate-500 font-semibold w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingActivities.map((act, idx) => {
                  const isEditing = editingId === act.id;
                  const isSelected = selectedIds.includes(act.id);

                  if (isEditing) {
                    return (
                      <tr key={act.id} className="bg-indigo-50/60">
                        <td className="p-3 text-center">
                          <input type="checkbox" checked disabled className="w-3.5 h-3.5 rounded opacity-40" />
                        </td>
                        <td className="p-3 text-slate-400">{idx + 1}</td>
                        <td className="p-3">
                          <select
                            value={(editForm.frameworkType as string) || act.frameworkType}
                            onChange={(e) => setEditForm((f) => ({ ...f, frameworkType: e.target.value as ActivityFramework }))}
                            className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          >
                            <option value="70_EXPERIENCE">70 – Experience</option>
                            <option value="20_EXPOSURE">20 – Exposure</option>
                            <option value="10_LEARNING">10 – Learning</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            value={editForm.goal ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, goal: e.target.value }))}
                            placeholder="Goal..."
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            value={editForm.programName ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, programName: e.target.value }))}
                            placeholder="Nama program..."
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            value={editForm.provider ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, provider: e.target.value }))}
                            placeholder="Provider..."
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col gap-1">
                            <input
                              type="date"
                              value={editForm.timelineStart ?? ''}
                              onChange={(e) => setEditForm((f) => ({ ...f, timelineStart: e.target.value }))}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                            <input
                              type="date"
                              value={editForm.timelineEnd ?? ''}
                              onChange={(e) => setEditForm((f) => ({ ...f, timelineEnd: e.target.value }))}
                              className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            value={editForm.learningHours ?? 8}
                            onChange={(e) => setEditForm((f) => ({ ...f, learningHours: Number(e.target.value) }))}
                            className="w-14 px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 text-center"
                            min={1}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            value={editForm.measurement ?? ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, measurement: e.target.value }))}
                            placeholder="Ukuran keberhasilan..."
                            className="w-full px-2 py-1 rounded-lg border border-slate-200 text-[11px] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 justify-center">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors cursor-pointer"
                              title="Simpan"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                              title="Batal"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={act.id} className={`transition-colors ${isSelected ? 'bg-white hover:bg-slate-50/50' : 'bg-slate-50/70 opacity-60'}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(act.id)}
                          className="w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-3 text-slate-400 font-medium">{idx + 1}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${frameworkColor(act.frameworkType)}`}>
                          {frameworkLabel(act.frameworkType)}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 font-medium leading-snug">{act.goal}</td>
                      <td className="p-3 text-slate-700 leading-snug">{act.programName}</td>
                      <td className="p-3 text-slate-500">{act.provider}</td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <div className="text-[10px]">{act.timelineStart}</div>
                        <div className="text-[10px] text-slate-400">→ {act.timelineEnd}</div>
                      </td>
                      <td className="p-3 text-center text-slate-700 font-semibold">{act.learningHours}h</td>
                      <td className="p-3 text-slate-500 leading-snug">{act.measurement}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            onClick={() => handleStartEdit(act)}
                            className="p-1.5 rounded-lg hover:bg-indigo-100 text-indigo-500 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePending(act.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add row button */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={handleAddRow}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-dashed border-indigo-300 transition-colors cursor-pointer w-full justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Aktivitas
            </button>
          </div>
        </div>

        {/* Summary + Confirm */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-900">{selectedIds.length}</span> dari{' '}
              <span className="font-bold text-slate-900">{pendingActivities.length}</span> aktivitas dipilih
            </div>
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold border border-violet-200">
                {expCount70} Experience (70)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
                {expCount20} Exposure (20)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200">
                {learnCount10} Learning (10)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length === 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600">
                <AlertCircle className="w-4 h-4" />
                Pilih minimal 1 aktivitas
              </div>
            )}
            <button
              onClick={handleConfirmReview}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Simpan Journey Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── JOURNEY VIEW ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12">

      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                {idp.period} Roadmap
              </span>
              <span
                className={`text-[10.5px] font-bold px-3 py-1 rounded-full ${
                  idp.status === 'APPROVED' || idp.status === 'IN_PROGRESS'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : idp.status === 'WAITING_FOR_APPROVAL'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-indigo-400/20 text-indigo-200 border border-indigo-300/30'
                }`}
              >
                Status: {idp.status.replace(/_/g, ' ')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-tight tracking-tight">
              {displayObjective}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-2 max-w-3xl leading-relaxed">
              <strong className="text-white">Business Alignment:</strong> {displayAlignment}
            </p>
          </div>

          {/* Action CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setJourneyView('AI_SETUP')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Susun Ulang dengan AI</span>
            </button>

            {idp.status === 'DRAFT' || idp.status === 'REQUEST_REVISION' ? (
              <button
                id="idp-submit-manager-btn"
                onClick={handleSubmitForApproval}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Manager ({currentUser.managerName})</span>
              </button>
            ) : idp.status === 'WAITING_FOR_APPROVAL' ? (
              <div className="px-4 py-2.5 rounded-2xl bg-orange-500/20 border border-orange-400/30 text-orange-200 text-xs font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Awaiting {currentUser.managerName}'s Review</span>
              </div>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Approved by {currentUser.managerName}</span>
              </div>
            )}
          </div>
        </div>

        {idp.managerNotes && (
          <div className="relative z-10 mt-5 pt-3.5 border-t border-white/15 text-xs text-indigo-100 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Manager Feedback:</strong> "{idp.managerNotes}"
            </div>
          </div>
        )}
      </div>

      {/* 2. Four Progress Dimensions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-indigo-200 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">1. Plan Progress</span>
            <span className="font-mono font-bold text-indigo-900">{planProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-indigo-900 rounded-full transition-all" style={{ width: `${planProgress}%` }} />
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">IDP Governance & Goal Alignment</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-cyan-200 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">2. Learning Progress</span>
            <span className="font-mono font-bold text-cyan-700">{learningProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-cyan-600 rounded-full transition-all" style={{ width: `${learningProgress}%` }} />
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">{completedActivities.length} of {total} activities marked complete</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">3. Application Progress</span>
            <span className="font-mono font-bold text-amber-600">{applicationProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${applicationProgress}%` }} />
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">{withEvidenceActivities.length} of {total} have verified evidence/links</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5 hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">4. Capability Progress</span>
            <span className="font-mono font-bold text-emerald-700">{capabilityProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${capabilityProgress}%` }} />
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">{validatedActivities.length} validated by Manager</p>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: `All Activities (${total})`, active: 'bg-indigo-900 text-white shadow-xs', inactive: 'bg-slate-100 text-slate-600 hover:bg-slate-200' },
            { id: '70_EXPERIENCE', label: `70% Experience (${experienceCount})`, active: 'bg-amber-600 text-white shadow-xs', inactive: 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100' },
            { id: '20_EXPOSURE', label: `20% Exposure (${exposureCount})`, active: 'bg-purple-600 text-white shadow-xs', inactive: 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100' },
            { id: '10_LEARNING', label: `10% Learning (${learningCount})`, active: 'bg-cyan-600 text-white shadow-xs', inactive: 'bg-cyan-50 text-cyan-900 border border-cyan-200 hover:bg-cyan-100' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === f.id ? f.active : f.inactive
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600 justify-between sm:justify-end font-medium">
          <span>Total Learning: <strong className="text-slate-900 font-bold">{totalLearningHours} Hours</strong></span>
          <span>Potential XP: <strong className="text-indigo-700 font-bold">+{totalXP} XP</strong></span>
        </div>
      </div>

      {/* 4. Activity Cards */}
      <div className="space-y-4">
        {filteredActivities.map((act) => {
          const isExp = act.frameworkType === '70_EXPERIENCE';
          const isExpo = act.frameworkType === '20_EXPOSURE';
          const badgeClass = isExp
            ? 'bg-amber-100 text-amber-900 border-amber-200'
            : isExpo
            ? 'bg-purple-100 text-purple-900 border-purple-200'
            : 'bg-cyan-100 text-cyan-900 border-cyan-200';
          const hasEvidence = Boolean(act.evidenceText || act.evidenceLink);

          return (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${badgeClass}`}>
                      {isExp ? '70% Experience (Project/Action)' : isExpo ? '20% Exposure (Mentoring/Shadowing)' : '10% Formal Learning'}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        act.status === 'COMPLETED' || act.status === 'VALIDATED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : act.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {act.status.replace(/_/g, ' ')}
                    </span>
                    {act.managerValidationRating && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-indigo-700" />
                        Manager Validated: {act.managerValidationRating}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{act.programName}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    <strong className="text-slate-900">Goal:</strong> {act.goal}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-indigo-950 bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-200">
                    +{act.xpValue} XP
                  </span>
                  <button
                    onClick={() => setSelectedActivity(act)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{hasEvidence ? 'View & Edit Evidence' : 'Log Evidence & Hours'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(act.id)}
                    className="p-2 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove from IDP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Success Measurement:</span>
                  <p className="text-slate-800 mt-1 font-medium leading-relaxed">{act.measurement}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Target Skills & Competency:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {act.skillNames.map((s, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-xl bg-white border border-slate-200 text-[10.5px] font-bold text-indigo-950">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {hasEvidence && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Logged Application Evidence:
                    </span>
                    {act.evidenceLink && (
                      <a
                        href={act.evidenceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-700 hover:underline font-bold flex items-center gap-1"
                      >
                        Artifact Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-emerald-950 leading-relaxed">{act.evidenceText}</p>
                  {act.reflectionText && (
                    <p className="text-slate-600 italic text-[11px] pt-1">
                      <strong>Reflection:</strong> "{act.reflectionText}"
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {act.timelineStart} &rarr; {act.timelineEnd}
                </span>
                <span>Provider: <strong className="text-slate-800">{act.provider}</strong></span>
                <span>Learning Hours: <strong className="text-slate-800">{act.learningHours} hrs</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={Boolean(selectedActivity)}
        onClose={() => setSelectedActivity(null)}
        onSaveActivity={handleSaveActivity}
        activeRole={currentUser.activeRole}
        managerName={currentUser.managerName}
      />
    </div>
  );
};
