import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Shield,
  Zap,
  Edit3,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import {
  IndividualDevelopmentPlan,
  DevelopmentActivity,
  UserProfile,
  IDPStatus,
  ActivityFramework,
} from '../../types';
import { AIRecommendationModal } from './AIRecommendationModal';
import { ActivityDetailModal } from './ActivityDetailModal';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface MyDevelopmentJourneyProps {
  currentUser: UserProfile;
  idp: IndividualDevelopmentPlan;
  onUpdateIdp: (updated: IndividualDevelopmentPlan) => void;
  onOpenAICoach: () => void;
}

export const MyDevelopmentJourney: React.FC<MyDevelopmentJourneyProps> = ({
  currentUser,
  idp,
  onUpdateIdp,
  onOpenAICoach,
}) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<DevelopmentActivity | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | ActivityFramework>('ALL');

  // Calculate 4 separate progress dimensions
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

  const handleApplyAIPlan = (newActivities: DevelopmentActivity[], objective: string, businessGoal: string) => {
    const updated: IndividualDevelopmentPlan = {
      ...idp,
      primaryObjective: objective,
      businessGoalAlignment: businessGoal,
      activities: newActivities,
      status: 'DRAFT',
      updatedAt: new Date().toISOString(),
    };
    onUpdateIdp(updated);
    triggerMilestoneCelebration();
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
    const updated: IndividualDevelopmentPlan = {
      ...idp,
      activities: updatedActivities,
      updatedAt: new Date().toISOString(),
    };
    onUpdateIdp(updated);
  };

  const handleDeleteActivity = (actId: string) => {
    const updatedActivities = activities.filter((a) => a.id !== actId);
    onUpdateIdp({
      ...idp,
      activities: updatedActivities,
      updatedAt: new Date().toISOString(),
    });
  };

  const filteredActivities = activeFilter === 'ALL'
    ? activities
    : activities.filter((a) => a.frameworkType === activeFilter);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner Bento Container */}
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
              {idp.primaryObjective}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-2 max-w-3xl leading-relaxed">
              <strong className="text-white">Business Alignment:</strong> {idp.businessGoalAlignment}
            </p>
          </div>

          {/* Action CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="idp-launch-ai-advisor-btn"
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950" />
              <span>AI 70:20:10 Curation</span>
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

      {/* 2. Four Separate Progress Dimensions (Bento Tiles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Dimension 1: Plan Progress */}
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

        {/* Dimension 2: Learning Progress */}
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

        {/* Dimension 3: Application Progress */}
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

        {/* Dimension 4: Capability & Impact Progress */}
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

      {/* 3. Framework Filter Bar & Stats Bento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === 'ALL'
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Activities ({total})
          </button>
          <button
            onClick={() => setActiveFilter('70_EXPERIENCE')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === '70_EXPERIENCE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            70% Experience ({experienceCount})
          </button>
          <button
            onClick={() => setActiveFilter('20_EXPOSURE')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === '20_EXPOSURE'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
            }`}
          >
            20% Exposure ({exposureCount})
          </button>
          <button
            onClick={() => setActiveFilter('10_LEARNING')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === '10_LEARNING'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-cyan-50 text-cyan-900 border border-cyan-200 hover:bg-cyan-100'
            }`}
          >
            10% Learning ({learningCount})
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 justify-between sm:justify-end font-medium">
          <span>Total Learning: <strong className="text-slate-900 font-bold">{totalLearningHours} Hours</strong></span>
          <span>Potential XP: <strong className="text-indigo-700 font-bold">+{totalXP} XP</strong></span>
        </div>
      </div>

      {/* 4. Activities Cards List (Bento Tile Cards) */}
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
              {/* Card Top */}
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

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {act.programName}
                  </h3>
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

              {/* Card Details Grid */}
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

              {/* Evidence & Reflection Preview if logged */}
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

              {/* Card Footer */}
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

      {/* AI Recommendation Modal */}
      <AIRecommendationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentUser={currentUser}
        onApplyPlan={handleApplyAIPlan}
      />

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
