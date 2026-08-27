import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  Compass,
  Zap,
  Target,
  Calendar,
  Play,
  Pause,
  Layers,
  BookOpen,
  Flame,
  Check,
  Shield,
  Star,
  User,
  Briefcase,
  Building2,
  ExternalLink,
} from 'lucide-react';
import {
  UserProfile,
  IndividualDevelopmentPlan,
  CatalogueProgram,
  SkillItem,
} from '../../types';

interface EmployeeHomeProps {
  currentUser: UserProfile;
  activeIdp: IndividualDevelopmentPlan | null;
  cataloguePrograms: CatalogueProgram[];
  skills: SkillItem[];
  onOpenAIDevelopmentAdvisor: () => void;
  onNavigateToJourney: () => void;
  onOpenAICoach: () => void;
  onSelectProgramDetail: (program: CatalogueProgram) => void;
  onAddToJourneyFromHome: (program: CatalogueProgram) => void;
  onNavigateToAssessment: () => void;
  onNavigateToProfile?: (subTab?: 'MY_PROFILE' | 'MY_ASSESSMENT' | 'MY_CAREER' | 'MY_DEV_HISTORY') => void;
}

export const EmployeeHome: React.FC<EmployeeHomeProps> = ({
  currentUser,
  activeIdp,
  cataloguePrograms,
  skills,
  onOpenAIDevelopmentAdvisor,
  onNavigateToJourney,
  onOpenAICoach,
  onSelectProgramDetail,
  onAddToJourneyFromHome,
  onNavigateToAssessment,
  onNavigateToProfile,
}) => {
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);

  // Calculate skill fit statistics
  const totalSkills = skills.length;
  const totalXP = skills.reduce((acc, curr) => acc + curr.xpEarned, 0);
  const criticalGapsCount = skills.filter((s) => s.gap > 0.8).length;

  const completedActivitiesCount =
    activeIdp?.activities.filter((a) => a.status === 'COMPLETED' || a.status === 'VALIDATED').length || 0;
  const totalActivitiesCount = activeIdp?.activities.length || 0;
  const progressPercentage =
    totalActivitiesCount > 0 ? Math.round((completedActivitiesCount / totalActivitiesCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Primary Bento Grid Layout (Inspired by Bento Grid Archetype) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Bento 1: Hero Quest Card (Span 2 cols on lg, Span 2 rows) */}
        <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 bg-indigo-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between border border-indigo-800 shadow-xl text-white">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="bg-indigo-400/20 text-indigo-200 text-[10.5px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-400/30">
                Current Quest &bull; 2026 H1
              </span>
              <span className="text-xs font-semibold text-indigo-200">
                Level 5 Principal Track
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-5 sm:mt-6 leading-tight tracking-tight">
              Mastering<br />Enterprise AI Architecture
            </h2>
            <p className="text-indigo-200/90 mt-3 sm:mt-4 text-xs sm:text-sm max-w-md leading-relaxed">
              {activeIdp?.primaryObjective ||
                'Elevating architectural governance to enterprise level while mastering Agentic AI and executive influence.'}
            </p>
          </div>

          <div className="relative z-10 mt-6 sm:mt-8 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-indigo-200">IDP Roadmap Completion</span>
              <span className="text-amber-300 font-mono">{progressPercentage}% Complete</span>
            </div>
            <div className="w-full bg-indigo-950/60 h-3 rounded-full overflow-hidden p-0.5 border border-indigo-700/50">
              <div
                className="bg-gradient-to-r from-indigo-400 to-cyan-300 h-full rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(129,140,248,0.6)]"
                style={{ width: `${Math.max(progressPercentage, 12)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-indigo-300/80 pt-1">
              <span>{completedActivitiesCount} of {totalActivitiesCount} milestones verified</span>
              <span>Next Review: 15 March 2026</span>
            </div>
          </div>

          {/* Background Ambient Glow & Mesh */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
            <Compass className="w-28 h-28 text-white" />
          </div>
        </div>

        {/* Bento 2: Current Streak Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-orange-200 transition-all">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Learning Streak
          </span>
          <div className="flex items-end gap-2 my-2">
            <span className="text-4xl sm:text-5xl font-black text-orange-500">15</span>
            <span className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Days Active</span>
          </div>
          <div>
            <div className="flex gap-1.5 mt-2">
              <div className="h-2 flex-grow rounded-full bg-orange-100"></div>
              <div className="h-2 flex-grow rounded-full bg-orange-100"></div>
              <div className="h-2 flex-grow rounded-full bg-orange-500"></div>
              <div className="h-2 flex-grow rounded-full bg-orange-500"></div>
              <div className="h-2 flex-grow rounded-full bg-orange-500"></div>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium mt-2">
              Top 5% continuous learner in Tech BU
            </p>
          </div>
        </div>

        {/* Bento 3: Skill Points (XP) Card */}
        <div className="bg-indigo-50/80 rounded-3xl p-6 border border-indigo-100 shadow-2xs flex flex-col justify-between hover:border-indigo-200 transition-all">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">
            Verified Skill Points
          </span>
          <div className="my-2">
            <div className="text-3xl sm:text-4xl font-black text-indigo-950 flex items-center gap-1.5">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
              {totalXP.toLocaleString()}
            </div>
            <div className="text-xs text-indigo-700 font-bold mt-1">
              +250 XP from Manager Validation
            </div>
          </div>
          <button
            onClick={onNavigateToAssessment}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Competency Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bento 4: Next Milestone Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-emerald-200 transition-all">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Target Career Gate
          </span>
          <div className="flex items-center gap-3 my-2">
            <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-sm border border-emerald-200 shrink-0">
              L6
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Head of Enterprise Architecture
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Talent Committee: Ready 6-12 Mo
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold">78% Readiness</span>
            <span className="text-slate-400 font-medium">Q4 2026 Target</span>
          </div>
        </div>

        {/* Bento 5: Daily Challenge Tile */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Daily Architecture Drill
            </span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              +50 XP
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-snug font-medium text-slate-200 my-2">
            "Evaluate Debezium vs Kafka Connect for zero-downtime DB sync in hybrid cloud."
          </p>
          <button
            onClick={() => {
              setDailyChallengeCompleted(!dailyChallengeCompleted);
              if (!dailyChallengeCompleted) {
                onOpenAICoach();
              }
            }}
            className={`w-full py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              dailyChallengeCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
            }`}
          >
            {dailyChallengeCompleted ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Completed (+50 XP)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Solve with AI Coach</span>
              </>
            )}
          </button>
        </div>

        {/* Bento 6: Active 70:20:10 Commitments (Span 2 cols) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Active IDP Commitments
            </span>
            <button
              onClick={onNavigateToJourney}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Journey</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeIdp?.activities.slice(0, 3).map((act) => {
              const dotColor =
                act.frameworkType === '70_EXPERIENCE'
                  ? 'bg-amber-500'
                  : act.frameworkType === '20_EXPOSURE'
                  ? 'bg-purple-500'
                  : 'bg-cyan-500';

              const badgeType =
                act.frameworkType === '70_EXPERIENCE'
                  ? '70% Exp'
                  : act.frameworkType === '20_EXPOSURE'
                  ? '20% Exp'
                  : '10% Lrn';

              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {act.programName}
                      </p>
                      <span className="text-[10.5px] text-slate-400 truncate block">
                        {act.goal}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {badgeType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        act.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Alignment: Group 2026 Digital North Star</span>
            <span className="font-bold text-slate-700">70:20:10 Balanced</span>
          </div>
        </div>

        {/* Bento 7: Skill Focus Progress Tile */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Skill Gap Focus
          </span>
          <div className="space-y-3 my-1">
            <div>
              <div className="flex justify-between text-[10.5px] font-bold mb-1">
                <span className="text-slate-700">Strategic Architecture</span>
                <span className="text-slate-500">3.2 / 4.5</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-900 w-[71%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10.5px] font-bold mb-1">
                <span className="text-slate-700">GenAI Agentic Systems</span>
                <span className="text-slate-500">3.0 / 4.0</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-600 w-[75%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10.5px] font-bold mb-1">
                <span className="text-slate-700">Executive Influence</span>
                <span className="text-slate-500">2.8 / 4.0</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[70%] rounded-full"></div>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToAssessment}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 text-left pt-1"
          >
            Take Adaptive Reassessment &rarr;
          </button>
        </div>

        {/* Bento 8: AI GROW Coach & Mentor Gradient Bento Tile */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white flex flex-col justify-between shadow-md border border-indigo-500/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">
                AI Coach & Mentor
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-2 leading-snug">
              GROW Socratic Guidance
            </h3>
            <p className="text-[11px] text-indigo-100/90 mt-1 leading-relaxed">
              Confidential executive coaching with 1-click commitment export into your IDP.
            </p>
          </div>

          <button
            onClick={onOpenAICoach}
            className="mt-4 w-full py-2.5 bg-white hover:bg-indigo-50 text-indigo-950 rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Start Socratic Session
          </button>
        </div>

      </div>

      {/* 2. Bento Container: End-to-End Growth Lifecycle Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-indigo-950">
              End-to-End Growth Lifecycle (SKKNI & TOGAF Aligned)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active Phase: <strong className="text-indigo-700">Act & Track (In Progress)</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          {[
            { step: '1. Plan', desc: 'AI 70:20:10 Curation', state: 'completed' },
            { step: '2. Learn', desc: '10% Formal & Tech', state: 'completed' },
            { step: '3. Apply', desc: '70% Action Project', state: 'active' },
            { step: '4. Reflect', desc: 'Log Evidence & XP', state: 'active' },
            { step: '5. Impact', desc: 'Manager Validation', state: 'pending' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                item.state === 'completed'
                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                  : item.state === 'active'
                  ? 'bg-indigo-900 text-white border-indigo-800 shadow-sm ring-2 ring-indigo-300/40'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <span className={`text-xs font-bold block ${item.state === 'active' ? 'text-white' : 'text-slate-900'}`}>
                {item.step}
              </span>
              <span className={`text-[10px] block mt-0.5 font-medium ${item.state === 'active' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
