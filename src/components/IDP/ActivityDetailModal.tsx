import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  FileText,
  Link,
  BookOpen,
  Calendar,
  Clock,
  Zap,
  Award,
  UploadCloud,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { DevelopmentActivity, CapabilityRating, UserRole } from '../../types';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface ActivityDetailModalProps {
  activity: DevelopmentActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveActivity: (updated: DevelopmentActivity) => void;
  activeRole: UserRole;
  managerName?: string;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose,
  onSaveActivity,
  activeRole,
  managerName,
}) => {
  if (!isOpen || !activity) return null;

  const [evidenceText, setEvidenceText] = useState(activity.evidenceText || '');
  const [evidenceLink, setEvidenceLink] = useState(activity.evidenceLink || '');
  const [reflectionText, setReflectionText] = useState(activity.reflectionText || '');
  const [learningHours, setLearningHours] = useState(activity.learningHours || 10);
  const [status, setStatus] = useState(activity.status);
  
  // Manager validation rating state
  const [validationRating, setValidationRating] = useState<CapabilityRating | undefined>(
    activity.managerValidationRating
  );
  const [managerFeedback, setManagerFeedback] = useState(activity.managerFeedback || '');

  const isManager = activeRole === 'MANAGER' || activeRole === 'ADMIN';

  const handleSave = () => {
    const isNowCompleted = status === 'COMPLETED' || status === 'VALIDATED';
    if (isNowCompleted && activity.status !== 'COMPLETED' && activity.status !== 'VALIDATED') {
      triggerMilestoneCelebration();
    }

    const updated: DevelopmentActivity = {
      ...activity,
      evidenceText,
      evidenceLink,
      reflectionText,
      learningHours: Number(learningHours),
      status,
      managerValidationRating: validationRating,
      managerFeedback,
      completedDate: isNowCompleted ? new Date().toISOString().split('T')[0] : activity.completedDate,
    };

    onSaveActivity(updated);
    onClose();
  };

  const badgeColor =
    activity.frameworkType === '70_EXPERIENCE'
      ? 'bg-amber-100 text-amber-900 border-amber-200'
      : activity.frameworkType === '20_EXPOSURE'
      ? 'bg-purple-100 text-purple-900 border-purple-200'
      : 'bg-cyan-100 text-cyan-900 border-cyan-200';

  const badgeText =
    activity.frameworkType === '70_EXPERIENCE'
      ? '70% Experience (Action Learning / Project)'
      : activity.frameworkType === '20_EXPOSURE'
      ? '20% Exposure (Mentoring / Shadowing)'
      : '10% Formal Learning & Lab';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
              {badgeText}
            </span>
            <h2 className="text-base font-bold text-white mt-1.5 line-clamp-1">{activity.programName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Provider</span>
              <span className="font-semibold text-slate-800 text-[11px] truncate block">{activity.provider}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Timeline</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{activity.timelineStart} - {activity.timelineEnd}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Hours Logged</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{activity.learningHours} hrs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Skill XP</span>
              <span className="font-bold text-blue-600 text-[11px] block">+{activity.xpValue} XP</span>
            </div>
          </div>

          {/* Goal & Measurement */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80">
              <h4 className="font-bold text-blue-950 mb-1">Development Goal & Outcome:</h4>
              <p className="text-blue-900 leading-relaxed">{activity.goal}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Success Measurement / KPI:</h4>
              <p className="text-slate-600 leading-relaxed">{activity.measurement}</p>
            </div>
          </div>

          {/* Targeted Skills */}
          <div>
            <label className="font-bold text-slate-900 block mb-1.5">Target Skills to Grow:</label>
            <div className="flex flex-wrap gap-1.5">
              {activity.skillNames.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-[11px]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Section 1: Evidence & Application Proof */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Evidence of Application / Completion
              </h4>
              <span className="text-[10px] text-slate-500">Required for Skill XP validation</span>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                placeholder="Describe specific work deliverables, architecture RFC links, code PRs, or project milestones achieved..."
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
              />
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="url"
                  placeholder="https://confluence / github / gdrive link for artifacts..."
                  value={evidenceLink}
                  onChange={(e) => setEvidenceLink(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Learning Reflection */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Learning Reflection (What changed / was learned?)
            </h4>
            <textarea
              rows={2}
              placeholder="Reflect on key mindset shifts, technical breakthroughs, or challenges overcome..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Activity Status Selector */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Execution Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
              >
                <option value="DRAFT">Draft</option>
                <option value="WAITING_FOR_APPROVAL">Waiting for Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed (Evidence Ready)</option>
                <option value="VALIDATED">Validated by Manager</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">Logged Learning Hours</label>
              <input
                type="number"
                value={learningHours}
                onChange={(e) => setLearningHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Section 3: Manager Capability Validation (When in Manager/Admin mode or showing feedback) */}
          {(isManager || activity.managerValidationRating) && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-700" />
                <h4 className="font-bold text-indigo-950">Manager Capability Demonstration Validation</h4>
              </div>

              {isManager ? (
                <div className="space-y-2">
                  <p className="text-[11px] text-indigo-900">
                    As manager ({managerName}), evaluate the employee's demonstrated capability based on the provided evidence:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['NOT_YET_DEMONSTRATED', 'DEVELOPING', 'DEMONSTRATED', 'EXCEEDED'] as CapabilityRating[]).map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setValidationRating(rating)}
                        className={`p-2 rounded-lg text-center font-bold text-[10.5px] border transition-all cursor-pointer ${
                          validationRating === rating
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {rating.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 text-[11px] block mt-2 mb-1">Manager Coaching Feedback & Next Steps:</label>
                    <textarea
                      rows={2}
                      value={managerFeedback}
                      onChange={(e) => setManagerFeedback(e.target.value)}
                      placeholder="Add specific constructive feedback or approval notes..."
                      className="w-full p-2 bg-white rounded-lg border border-indigo-300 text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-950">Rating:</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">
                      {activity.managerValidationRating}
                    </span>
                  </div>
                  {activity.managerFeedback && (
                    <p className="text-slate-700 mt-1 italic bg-white p-2 rounded border border-indigo-100">
                      "{activity.managerFeedback}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Activity Progress</span>
          </button>
        </div>

      </div>
    </div>
  );
};
