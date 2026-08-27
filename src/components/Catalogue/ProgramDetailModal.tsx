import React from 'react';
import {
  X,
  Clock,
  Calendar,
  Layers,
  Award,
  BookOpen,
  CheckCircle2,
  Plus,
  Compass,
} from 'lucide-react';
import { CatalogueProgram } from '../../types';

interface ProgramDetailModalProps {
  program: CatalogueProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToJourney: (program: CatalogueProgram) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  isOpen,
  onClose,
  onAddToJourney,
}) => {
  if (!isOpen || !program) return null;

  const frameworkLabel =
    program.frameworkType === '70_EXPERIENCE'
      ? '70% Experience (Action Project)'
      : program.frameworkType === '20_EXPOSURE'
      ? '20% Exposure (Mentoring/Shadowing)'
      : '10% Formal Learning';

  const badgeColor =
    program.frameworkType === '70_EXPERIENCE'
      ? 'bg-amber-100 text-amber-900 border-amber-200'
      : program.frameworkType === '20_EXPOSURE'
      ? 'bg-purple-100 text-purple-900 border-purple-200'
      : 'bg-cyan-100 text-cyan-900 border-cyan-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                {frameworkLabel}
              </span>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {program.matchScore}% AI Match
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-2 leading-snug">{program.title}</h2>
            <p className="text-xs text-blue-200 mt-1">Provider: <strong>{program.provider}</strong></p>
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
          
          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{program.duration}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Learning Hours</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{program.learningHours} Hours</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Schedule</span>
              <span className="font-semibold text-slate-800 text-[11px] block">{program.schedule}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Cost / Credit</span>
              <span className="font-bold text-emerald-700 text-[11px] block">{program.cost}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs">Program Overview:</h4>
            <p className="text-slate-600 leading-relaxed">{program.description}</p>
          </div>

          {/* Target Audience */}
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80">
            <h4 className="font-bold text-blue-950 mb-0.5">Target Audience & Prerequisites:</h4>
            <p className="text-blue-900">{program.targetAudience}</p>
          </div>

          {/* Syllabus Highlights */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Syllabus / Action Milestones:</h4>
            <div className="space-y-1.5">
              {program.syllabusHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-xs">{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Skills Taught & Proficiency Boost */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Target Competencies & Skill Boost:</h4>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Mapped to My Skill Dictionary
              </span>
            </div>

            {program.targetSkillName && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-2xs">
                    <Award className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                      Direct Proficiency Boost
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {program.targetSkillName}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                  +{program.proficiencyGain || 0.4} Level Up
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {program.skillsTaught.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center justify-center text-center px-2.5 py-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-[11px] leading-none">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            id="modal-add-to-journey-btn"
            onClick={() => {
              onAddToJourney(program);
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to My Development Journey Draft</span>
          </button>
        </div>

      </div>
    </div>
  );
};
