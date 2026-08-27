import React, { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { SkillItem } from '../../types';
import { triggerMilestoneCelebration } from '../../utils/confetti';

interface SkillReassessmentModalProps {
  skill: SkillItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAssessmentCompleted: (skillId: string, newProficiency: number, xpGained: number) => void;
}

export const SkillReassessmentModal: React.FC<SkillReassessmentModalProps> = ({
  skill,
  isOpen,
  onClose,
  onAssessmentCompleted,
}) => {
  if (!isOpen || !skill) return null;

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);

  // Dynamic realistic enterprise scenario questions tailored to the skill
  const mockQuestions = [
    {
      id: 'q1',
      scenario: `In an enterprise digital transformation, how would you design the architecture for "${skill.name}" to satisfy 99.99% availability SLAs during unpredictable peak loads?`,
      options: [
        {
          text: 'Deploy an asynchronous event-driven architecture using distributed queues, auto-scaling worker nodes, and circuit-breaker patterns.',
          isCorrect: true,
          score: 1.0,
          rationale: 'Demonstrates Level 4-5 Advanced mastery in decoupling and fault isolation.',
        },
        {
          text: 'Scale up a single monolithic virtual machine to maximum memory capacity.',
          isCorrect: false,
          score: 0.2,
          rationale: 'Fails to address single point of failure and elasticity.',
        },
        {
          text: 'Schedule manual batch processing during off-peak night hours only.',
          isCorrect: false,
          score: 0.4,
          rationale: 'Does not support real-time user workloads.',
        },
      ],
    },
    {
      id: 'q2',
      scenario: `When evaluating the ROI and executive communication for this capability, what is the most persuasive metric to present to the Board of Directors?`,
      options: [
        {
          text: 'Direct business continuity risk reduction, 40% operational cost savings, and accelerated time-to-market.',
          isCorrect: true,
          score: 1.0,
          rationale: 'Directly aligns technology investments with strategic business valuation.',
        },
        {
          text: 'The total number of code commits made by developers in the sprint.',
          isCorrect: false,
          score: 0.1,
          rationale: 'Too micro-level and lacks executive relevance.',
        },
      ],
    },
  ];

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIdx,
    });
  };

  const handleSubmit = () => {
    let totalScore = 0;
    mockQuestions.forEach((q) => {
      const selectedIdx = selectedAnswers[q.id];
      if (selectedIdx !== undefined) {
        if (q.options[selectedIdx].isCorrect) {
          totalScore += 1;
        }
      }
    });

    const isAllCorrect = totalScore === mockQuestions.length;
    const boost = isAllCorrect ? 0.3 : 0.1;
    const newProf = Math.min(5.0, Number((skill.currentProficiency + boost).toFixed(1)));
    const xpGained = isAllCorrect ? 250 : 120;

    setIsSubmitted(true);
    setScoreEarned(totalScore);

    triggerMilestoneCelebration();
    onAssessmentCompleted(skill.id, newProf, xpGained);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase">
              Adaptive Skill Reassessment ({skill.assessmentMethod})
            </span>
            <h2 className="text-base font-bold text-white mt-1">{skill.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          
          {/* Skill Baseline Snapshot */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Current Level</span>
              <span className="text-sm font-bold text-slate-800">{skill.currentProficiency} / 5.0</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Required Level</span>
              <span className="text-sm font-bold text-blue-600">{skill.requiredProficiency} / 5.0</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Gap to Close</span>
              <span className="text-sm font-bold text-amber-600">{skill.gap > 0 ? skill.gap : 'Exceeded'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
              <span className="text-sm font-bold text-emerald-600">{skill.confidencePercentage}%</span>
            </div>
          </div>

          {!isSubmitted ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Answer the adaptive scenario-based challenge questions below to provide fresh evidence and update your proficiency rating:
              </p>

              {mockQuestions.map((q, qIndex) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                  <h4 className="font-bold text-slate-900 leading-snug">
                    Question {qIndex + 1}: {q.scenario}
                  </h4>

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedAnswers[q.id] === optIndex;
                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`w-full text-left p-3 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium ring-1 ring-blue-400'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                              {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Result Screen */
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">Adaptive Reassessment Complete!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  You answered {scoreEarned} of {mockQuestions.length} questions correctly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-slate-400 uppercase block">New Proficiency</span>
                  <span className="text-base font-bold text-emerald-600">
                    {Math.min(5.0, Number((skill.currentProficiency + 0.3).toFixed(1)))} / 5.0
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] text-slate-400 uppercase block">XP Awarded</span>
                  <span className="text-base font-bold text-blue-600">+250 XP</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                Evidence has been logged into your permanent skill growth trail and updated on your Grow Card.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            {isSubmitted ? 'Close' : 'Cancel'}
          </button>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length < mockQuestions.length}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Submit Reassessment</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
