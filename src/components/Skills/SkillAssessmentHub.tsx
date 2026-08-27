import React, { useState } from 'react';
import {
  Award,
  Zap,
  TrendingUp,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Flame,
} from 'lucide-react';
import { SkillItem, SkillCategory } from '../../types';
import { SkillReassessmentModal } from './SkillReassessmentModal';

interface SkillAssessmentHubProps {
  skills: SkillItem[];
  onUpdateSkill: (updatedSkill: SkillItem) => void;
}

export const SkillAssessmentHub: React.FC<SkillAssessmentHubProps> = ({
  skills,
  onUpdateSkill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | SkillCategory>('ALL');
  const [selectedSkillForReassess, setSelectedSkillForReassess] = useState<SkillItem | null>(null);

  const totalXP = skills.reduce((acc, curr) => acc + curr.xpEarned, 0);

  const handleAssessmentComplete = (skillId: string, newProf: number, xpGained: number) => {
    const targetSkill = skills.find((s) => s.id === skillId);
    if (!targetSkill) return;

    const updated: SkillItem = {
      ...targetSkill,
      currentProficiency: newProf,
      confidencePercentage: Math.min(99, targetSkill.confidencePercentage + 5),
      gap: Number((targetSkill.requiredProficiency - newProf).toFixed(1)),
      xpEarned: targetSkill.xpEarned + xpGained,
      evidenceCount: targetSkill.evidenceCount + 1,
      history: [
        ...targetSkill.history,
        {
          date: new Date().toISOString().split('T')[0],
          level: newProf,
          intervention: `Adaptive Reassessment (${targetSkill.assessmentMethod})`,
        },
      ],
    };

    onUpdateSkill(updated);
  };

  const filteredSkills = selectedCategory === 'ALL'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Skill Currency & Growth Concept Banner (Bento Hero) */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                Continuous Competency Currency
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Skill Mapping & Proficiency Engine
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              <strong>Growth Telemetry:</strong> Baseline &rarr; 70:20:10 Intervention &rarr; Evidence &rarr; Adaptive Reassessment &rarr; Manager Verification.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-inner">
            <div className="text-center px-3 border-r border-white/15">
              <span className="text-[10px] text-indigo-200 uppercase tracking-widest block font-bold">Total Skill XP</span>
              <span className="text-xl font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                {totalXP}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-indigo-200 uppercase tracking-widest block font-bold">Current Target</span>
              <span className="text-xs font-bold text-white mt-1 block">Lead Architect (L5)</span>
            </div>
          </div>
        </div>

        {/* 5-Level Standard Reference Pill Guide */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
          {[
            { lvl: '1. Novice', desc: 'Basic awareness / needs support' },
            { lvl: '2. Emerging', desc: 'Developing with guidance' },
            { lvl: '3. Intermediate', desc: 'Applies independently' },
            { lvl: '4. Advanced', desc: 'Drives strong capability' },
            { lvl: '5. Expert', desc: 'Role model & coach' },
          ].map((l, i) => (
            <div key={i} className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-bold text-indigo-200 block text-[11px]">{l.lvl}</span>
              <span className="text-[10px] text-indigo-100/70 block mt-0.5">{l.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Category Tabs Bento Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: `All Skills (${skills.length})` },
            { id: 'ROLE_REQUIRED', label: `Role Required (${skills.filter((s) => s.category === 'ROLE_REQUIRED').length})` },
            { id: 'FUTURE_SKILL', label: `Future Skills (${skills.filter((s) => s.category === 'FUTURE_SKILL').length})` },
            { id: 'ASPIRATION_SKILL', label: `Aspiration Skills (${skills.filter((s) => s.category === 'ASPIRATION_SKILL').length})` },
            { id: 'OTHER_SKILL', label: `Other Skills (${skills.filter((s) => s.category === 'OTHER_SKILL').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
          Benchmarks: SKKNI, TOGAF, McKinsey Digital
        </span>
      </div>

      {/* 3. Skill Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSkills.map((skill) => {
          const categoryBadge =
            skill.category === 'ROLE_REQUIRED'
              ? 'bg-blue-100 text-blue-900 border-blue-200'
              : skill.category === 'FUTURE_SKILL'
              ? 'bg-purple-100 text-purple-900 border-purple-200'
              : skill.category === 'ASPIRATION_SKILL'
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : 'bg-slate-100 text-slate-800 border-slate-200';

          const currentPct = (skill.currentProficiency / 5.0) * 100;
          const requiredPct = (skill.requiredProficiency / 5.0) * 100;

          return (
            <div
              key={skill.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryBadge}`}>
                    {skill.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {skill.code} &bull; {skill.version}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {skill.definition}
                </p>
              </div>

              {/* Current-Role Fit Calculation Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Current Level: <strong className="text-indigo-950 font-bold">{skill.currentProficiency} / 5.0</strong></span>
                  <span className="font-semibold text-indigo-700">Target Benchmark: <strong>{skill.requiredProficiency} / 5.0</strong></span>
                </div>

                {/* Progress Bar with target marker */}
                <div className="relative w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-900 to-indigo-600 rounded-full transition-all"
                    style={{ width: `${currentPct}%` }}
                  />
                  {/* Required Target Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-red-500"
                    style={{ left: `${requiredPct}%` }}
                    title={`Required: ${skill.requiredProficiency}`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                  <span>Gap to close: <strong className={skill.gap > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {skill.gap > 0 ? `${skill.gap} Level` : 'Target Achieved'}
                  </strong></span>
                  <span>Confidence: <strong className="text-emerald-600 font-bold">{skill.confidencePercentage}%</strong></span>
                </div>
              </div>

              {/* Benchmark Source & Evidence History */}
              <div className="text-[11px] text-slate-500 space-y-1 font-medium">
                <p><strong>Benchmark Source:</strong> {skill.benchmarkSource}</p>
                <p><strong>Assessment Type:</strong> {skill.assessmentMethod} &bull; <strong>Evidence Count:</strong> {skill.evidenceCount} verified artifacts</p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  +{skill.xpEarned} XP Earned
                </span>

                <button
                  onClick={() => setSelectedSkillForReassess(skill)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Reassess Skill</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adaptive Reassessment Modal */}
      <SkillReassessmentModal
        skill={selectedSkillForReassess}
        isOpen={Boolean(selectedSkillForReassess)}
        onClose={() => setSelectedSkillForReassess(null)}
        onAssessmentCompleted={handleAssessmentComplete}
      />

    </div>
  );
};
