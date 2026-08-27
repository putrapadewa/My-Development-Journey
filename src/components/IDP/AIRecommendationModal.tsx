import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Compass,
  Zap,
} from 'lucide-react';
import { UserProfile, DevelopmentActivity, ActivityFramework } from '../../types';

interface AIRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onApplyPlan: (newActivities: DevelopmentActivity[], primaryObjective: string, businessGoal: string) => void;
}

export const AIRecommendationModal: React.FC<AIRecommendationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onApplyPlan,
}) => {
  // Input Context Form
  const [orgGoal, setOrgGoal] = useState('Group 2026 Digital North Star: 40% reduction in cloud latency, $500k FinOps optimization, and 3 enterprise AI copilot rollouts.');
  const [individualKpi, setIndividualKpi] = useState('Lead zero-downtime microservices migration and establish enterprise GenAI guardrails.');
  const [currentPosition, setCurrentPosition] = useState(currentUser.position);
  const [businessUnit, setBusinessUnit] = useState(currentUser.businessUnit);
  const [improvementArea, setImprovementArea] = useState('Executive Boardroom Persuasion & C-Suite Alignment, Enterprise P&L Valuation');
  const [strengths, setStrengths] = useState('Distributed Cloud Systems, Agentic AI Architectures, FinOps IaC Governance');
  const [aspiration, setAspiration] = useState('Head of Enterprise Architecture & Cloud Engineering (L6 / Director)');
  const [targetNextPosition, setTargetNextPosition] = useState('Head of Enterprise Architecture');
  const [targetBu, setTargetBu] = useState('Group Technology & Digital Transformation');

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'INPUT' | 'CURATION'>('INPUT');
  const [confidenceScore, setConfidenceScore] = useState(94);
  const [prioritySkillGaps, setPrioritySkillGaps] = useState<any[]>([]);
  const [generatedObjective, setGeneratedObjective] = useState('');
  const [curatedActivities, setCuratedActivities] = useState<DevelopmentActivity[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/claude/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationGoal: orgGoal,
          individualKpi,
          currentPosition,
          businessUnit,
          areasOfImprovement: improvementArea,
          strengths,
          aspiration,
          nextPosition: targetNextPosition,
          targetBusinessUnit: targetBu,
        }),
      });

      const data = await response.json();
      setConfidenceScore(data.confidenceScore || 92);
      setPrioritySkillGaps(data.prioritySkillGaps || []);
      setGeneratedObjective(data.primaryObjective || `Master Strategic Architecture & Executive Influence to transition to ${targetNextPosition}.`);

      const mappedActivities: DevelopmentActivity[] = (data.recommendedActivities || []).map(
        (rec: any, idx: number) => ({
          id: `act-gen-${Date.now()}-${idx}`,
          idpId: 'idp-draft',
          goal: rec.goal || 'Develop enterprise capability',
          programName: rec.programName || 'Enterprise Program',
          provider: rec.provider || 'Internal Guild',
          frameworkType: (rec.frameworkType as ActivityFramework) || (idx === 0 ? '70_EXPERIENCE' : idx === 1 ? '20_EXPOSURE' : '10_LEARNING'),
          timelineStart: rec.timelineStart || '2026-03-01',
          timelineEnd: rec.timelineEnd || '2026-06-30',
          status: 'DRAFT',
          measurement: rec.measurement || 'Demonstrated success metric',
          skillIds: ['skl-001'],
          skillNames: rec.skillNames || ['Strategic Architecture & Systems Thinking'],
          expectedImpact: rec.expectedImpact || 'Elevates proficiency and business impact.',
          learningHours: rec.learningHours || 20,
          xpValue: rec.xpValue || 250,
        })
      );

      setCuratedActivities(mappedActivities);
      setStep('CURATION');
    } catch (err) {
      console.error('Error in generation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveActivity = (index: number) => {
    setCuratedActivities(curatedActivities.filter((_, i) => i !== index));
  };

  const handleAddCustomActivity = (framework: ActivityFramework) => {
    const newAct: DevelopmentActivity = {
      id: `act-custom-${Date.now()}`,
      idpId: 'idp-draft',
      goal: 'New custom development goal',
      programName: 'Custom Development Project / Masterclass',
      provider: 'Internal / Self-Directed',
      frameworkType: framework,
      timelineStart: '2026-03-01',
      timelineEnd: '2026-06-30',
      status: 'DRAFT',
      measurement: 'Measured via capability demonstration and milestone review',
      skillIds: ['skl-001'],
      skillNames: ['Strategic Architecture & Systems Thinking'],
      expectedImpact: 'Direct capability improvement for target role.',
      learningHours: framework === '70_EXPERIENCE' ? 30 : framework === '20_EXPOSURE' ? 15 : 10,
      xpValue: framework === '70_EXPERIENCE' ? 300 : framework === '20_EXPOSURE' ? 180 : 120,
    };
    setCuratedActivities([...curatedActivities, newAct]);
  };

  const handleApply = () => {
    onApplyPlan(curatedActivities, generatedObjective, orgGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Development Recommendation Engine</h2>
              <p className="text-xs text-blue-200">
                Translating Organizational Need + Individual Context + Skill Gaps into a Complete 70:20:10 Journey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Input Context */}
        {step === 'INPUT' ? (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
              <Compass className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Enterprise Context Injection:</strong> The AI will not simply recommend generic courses. It analyzes business goals, committee calibrations, skill gaps, and your target role to formulate balanced 70:20:10 recommendations.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-slate-800">1. Organization Goal & Strategic Priorities</label>
                <input
                  type="text"
                  value={orgGoal}
                  onChange={(e) => setOrgGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-blue-600 focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-slate-800">2. Individual KPI & Work Objectives</label>
                <input
                  type="text"
                  value={individualKpi}
                  onChange={(e) => setIndividualKpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-blue-600 focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">3. Current Position & BU</label>
                <input
                  type="text"
                  value={`${currentPosition} (${businessUnit})`}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">4. Target Next Position & BU</label>
                <input
                  type="text"
                  value={`${targetNextPosition} (${targetBu})`}
                  onChange={(e) => setTargetNextPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">5. Known Areas of Improvement (Skill Gaps)</label>
                <textarea
                  rows={2}
                  value={improvementArea}
                  onChange={(e) => setImprovementArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">6. Core Strengths to Leverage</label>
                <textarea
                  rows={2}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="font-semibold text-slate-800">7. Career Aspiration / Talent Committee Notes</label>
                <input
                  type="text"
                  value={aspiration}
                  onChange={(e) => setAspiration(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-blue-600 text-xs"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                AI powered by Gemini 3.7 & Enterprise Skill Taxonomies
              </span>
              <button
                id="modal-generate-recommendations-btn"
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Competency Matrix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate 70:20:10 Development Journey</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Employee Curation Mode */
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* AI Summary Banner */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    AI Confidence: {confidenceScore}%
                  </span>
                  <span className="text-xs text-slate-400">Employee Curation Stage</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5">{generatedObjective}</h3>
              </div>

              <button
                onClick={() => setStep('INPUT')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white border border-white/20 transition-colors whitespace-nowrap cursor-pointer"
              >
                &larr; Re-adjust Inputs
              </button>
            </div>

            {/* Priority Skill Gaps Breakdown */}
            {prioritySkillGaps.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  Targeted Skill Gaps & Rationale:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {prioritySkillGaps.map((g: any, i: number) => (
                    <div key={i} className="p-2 bg-white rounded-lg border border-amber-200/80 text-[11px]">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{g.skill}</span>
                        <span className="text-red-600 font-bold">Gap: {g.gap}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5 line-clamp-2">{g.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curated Activities List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">
                  Recommended Activities (70:20:10 Framework) — You Own and Curate this Draft
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAddCustomActivity('70_EXPERIENCE')}
                    className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-medium border border-amber-200 transition-colors cursor-pointer"
                  >
                    + Add 70% Experience
                  </button>
                  <button
                    onClick={() => handleAddCustomActivity('20_EXPOSURE')}
                    className="px-2 py-1 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-medium border border-purple-200 transition-colors cursor-pointer"
                  >
                    + Add 20% Exposure
                  </button>
                  <button
                    onClick={() => handleAddCustomActivity('10_LEARNING')}
                    className="px-2 py-1 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[11px] font-medium border border-cyan-200 transition-colors cursor-pointer"
                  >
                    + Add 10% Learning
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {curatedActivities.map((act, index) => {
                  const badgeColor =
                    act.frameworkType === '70_EXPERIENCE'
                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                      : act.frameworkType === '20_EXPOSURE'
                      ? 'bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-cyan-100 text-cyan-900 border-cyan-200';

                  const badgeText =
                    act.frameworkType === '70_EXPERIENCE'
                      ? '70% Experience'
                      : act.frameworkType === '20_EXPOSURE'
                      ? '20% Exposure'
                      : '10% Learning';

                  return (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${badgeColor}`}>
                            {badgeText}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{act.programName}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRemoveActivity(index)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Remove activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p><strong>Goal:</strong> {act.goal}</p>
                        <p><strong>Success Measurement:</strong> {act.measurement}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                          <span>Provider: <strong className="text-slate-700">{act.provider}</strong></span>
                          <span>Timeline: <strong className="text-slate-700">{act.timelineStart} to {act.timelineEnd}</strong></span>
                          <span>Learning Hours: <strong className="text-slate-700">{act.learningHours} hrs</strong></span>
                          <span className="text-blue-600 font-bold">+{act.xpValue} XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Applying will populate your IDP draft for final submission to manager {currentUser.managerName}.
              </span>
              <button
                id="modal-apply-curated-idp-btn"
                onClick={handleApply}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Apply to My Development Journey Draft</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
