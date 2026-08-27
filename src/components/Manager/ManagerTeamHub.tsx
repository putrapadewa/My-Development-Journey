import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  MessageSquare,
  FileText,
  TrendingUp,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  IndividualDevelopmentPlan,
  UserProfile,
  DevelopmentActivity,
  CapabilityRating,
} from '../../types';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface ManagerTeamHubProps {
  idp: IndividualDevelopmentPlan;
  onUpdateIdp: (updated: IndividualDevelopmentPlan) => void;
  currentUser: UserProfile;
}

export const ManagerTeamHub: React.FC<ManagerTeamHubProps> = ({
  idp,
  onUpdateIdp,
  currentUser,
}) => {
  const [managerNotes, setManagerNotes] = useState(idp.managerNotes || '');
  const [selectedActivityForReview, setSelectedActivityForReview] = useState<DevelopmentActivity | null>(null);
  const [validationRating, setValidationRating] = useState<CapabilityRating>('DEMONSTRATED');
  const [validationFeedback, setValidationFeedback] = useState('');

  const handleApproveIDP = () => {
    const updated: IndividualDevelopmentPlan = {
      ...idp,
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      managerNotes: managerNotes || 'Approved. Great alignment with our 2026 digital and architectural priorities.',
      updatedAt: new Date().toISOString(),
    };
    onUpdateIdp(updated);
    triggerMilestoneCelebration();
  };

  const handleRequestRevision = () => {
    const updated: IndividualDevelopmentPlan = {
      ...idp,
      status: 'REQUEST_REVISION',
      managerNotes: managerNotes || 'Please add at least one cross-functional project for 70% Experience.',
      updatedAt: new Date().toISOString(),
    };
    onUpdateIdp(updated);
  };

  const handleValidateActivity = () => {
    if (!selectedActivityForReview) return;

    const updatedActivities = idp.activities.map((a) => {
      if (a.id === selectedActivityForReview.id) {
        return {
          ...a,
          status: 'VALIDATED' as const,
          managerValidationRating: validationRating,
          managerFeedback: validationFeedback || 'Verified and demonstrated high business value.',
        };
      }
      return a;
    });

    const updated: IndividualDevelopmentPlan = {
      ...idp,
      activities: updatedActivities,
      updatedAt: new Date().toISOString(),
    };

    onUpdateIdp(updated);
    setSelectedActivityForReview(null);
    triggerMilestoneCelebration();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner (Bento Hero) */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                Direct Manager Review & Coaching Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Team Development & Capability Validation
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              Evaluate IDP submissions, facilitate meaningful 1-on-1 development dialogue, and validate evidence of applied capability.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-indigo-100 shadow-inner">
            <span className="font-semibold">Direct Reports: <strong className="text-white">1 Pending Review</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Direct Report Submission Review Bento Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Budi Santoso"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">Budi Santoso</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                  Lead Architect (L5)
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    idp.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : idp.status === 'WAITING_FOR_APPROVAL'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {idp.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Target Next Role: <strong className="text-slate-900">Head of Enterprise Architecture</strong> &bull; Period: {idp.period}
              </p>
            </div>
          </div>

          {/* Quick Review Actions */}
          <div className="flex items-center gap-2">
            <button
              id="mgr-request-revision-btn"
              onClick={handleRequestRevision}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Request Revision</span>
            </button>
            <button
              id="mgr-approve-idp-btn"
              onClick={handleApproveIDP}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve IDP</span>
            </button>
          </div>
        </div>

        {/* IDP Overview & Coaching Notes */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Development Objective:</span>
              <p className="font-bold text-slate-900 text-sm mt-1">{idp.primaryObjective}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Alignment:</span>
              <p className="font-bold text-slate-900 text-sm mt-1">{idp.businessGoalAlignment}</p>
            </div>
          </div>

          {/* Manager Feedback Input */}
          <div className="space-y-2">
            <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-700" />
              Manager Coaching Notes & 1-on-1 Dialogue Summary:
            </label>
            <textarea
              rows={2}
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              placeholder="Add constructive alignment notes, sponsor support commitments, or feedback..."
              className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden transition-all"
            />
          </div>

          {/* Submitted Activities & Capability Validation Queue */}
          <div className="space-y-3.5 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Proposed 70:20:10 Activities & Evidence:</span>
              <span className="text-[11px] text-slate-500 font-normal">Click activity to review evidence & validate capability</span>
            </h4>

            <div className="space-y-3">
              {idp.activities.map((act) => {
                const isExp = act.frameworkType === '70_EXPERIENCE';
                const isExpo = act.frameworkType === '20_EXPOSURE';
                const badgeClass = isExp
                  ? 'bg-amber-100 text-amber-900 border-amber-200'
                  : isExpo
                  ? 'bg-purple-100 text-purple-900 border-purple-200'
                  : 'bg-cyan-100 text-cyan-900 border-cyan-200';

                return (
                  <div
                    key={act.id}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                          {isExp ? '70% Experience' : isExpo ? '20% Exposure' : '10% Learning'}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{act.programName}</span>
                      </div>
                      <p className="text-slate-600 font-medium"><strong>Goal:</strong> {act.goal}</p>
                      {act.evidenceText && (
                        <p className="text-emerald-950 bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl text-[11px] leading-relaxed">
                          <strong>Evidence:</strong> {act.evidenceText}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {act.managerValidationRating ? (
                        <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-900 border border-indigo-200">
                          {act.managerValidationRating}
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedActivityForReview(act)}
                          className="px-4 py-2 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          Validate Capability
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Validation Modal for Manager */}
      {selectedActivityForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <h3 className="text-sm font-bold text-slate-900">
              Capability Demonstration Assessment for "{selectedActivityForReview.programName}"
            </h3>

            {selectedActivityForReview.evidenceText && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">Employee Submitted Evidence:</span>
                <p className="leading-relaxed font-medium">{selectedActivityForReview.evidenceText}</p>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-900 block mb-2">Demonstrated Capability Rating:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['NOT_YET_DEMONSTRATED', 'DEVELOPING', 'DEMONSTRATED', 'EXCEEDED'] as CapabilityRating[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setValidationRating(r)}
                    className={`p-3 rounded-2xl font-bold text-[11px] border transition-all cursor-pointer ${
                      validationRating === r
                        ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1.5">Manager Feedback:</label>
              <textarea
                rows={2}
                value={validationFeedback}
                onChange={(e) => setValidationFeedback(e.target.value)}
                placeholder="Specific commendation or next growth step..."
                className="w-full p-3 border border-slate-200 bg-slate-50/70 rounded-2xl text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedActivityForReview(null)}
                className="px-4 py-2 rounded-2xl border border-slate-300 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleValidateActivity}
                className="px-5 py-2 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-bold cursor-pointer transition-colors shadow-xs"
              >
                Submit Validation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
