import React from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Radio,
  MapPin,
  Landmark,
  Layers,
  Sparkles,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { CatalogueProgram } from '../../types';

interface ProgrammeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPrograms: CatalogueProgram[];
  onRemoveProgram: (programId: string) => void;
  onAddProgramToCompare: (program: CatalogueProgram) => void;
  onAddToJourney: (program: CatalogueProgram) => void;
  availablePrograms: CatalogueProgram[];
}

export const ProgrammeComparisonModal: React.FC<ProgrammeComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedPrograms,
  onRemoveProgram,
  onAddProgramToCompare,
  onAddToJourney,
  availablePrograms,
}) => {
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});
  const [searchPickerOpen, setSearchPickerOpen] = React.useState(false);
  const [pickerSearch, setPickerSearch] = React.useState('');

  if (!isOpen) return null;

  const handleAddToJourneyClick = (program: CatalogueProgram) => {
    onAddToJourney(program);
    setAddedIds((prev) => ({ ...prev, [program.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [program.id]: false }));
    }, 2500);
  };

  // Filter programs not already selected
  const selectablePrograms = availablePrograms.filter(
    (p) =>
      !selectedPrograms.some((sp) => sp.id === p.id) &&
      (!pickerSearch ||
        p.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        p.provider.toLowerCase().includes(pickerSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-[96vw] xl:max-w-[1440px] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden my-auto">
        
        {/* Top Header Bar */}
        <div className="bg-[#071322] text-white px-6 py-4.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Programme Comparison
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold">
                  {selectedPrograms.length} of 4 Selected
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Side-by-side multi-parameter evaluation to accelerate development pathway decisions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedPrograms.length < 4 && (
              <div className="relative">
                <button
                  onClick={() => setSearchPickerOpen(!searchPickerOpen)}
                  className="px-3 py-1.5 rounded-xl bg-[#132845] hover:bg-[#1b3860] border border-blue-400/30 text-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Add Programme</span>
                </button>

                {searchPickerOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 text-slate-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700">Select programme to compare</span>
                      <button onClick={() => setSearchPickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Search catalogue..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg mb-2 focus:outline-none focus:border-indigo-600"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {selectablePrograms.length === 0 ? (
                        <p className="text-xs text-slate-400 py-2 text-center">No more programmes found</p>
                      ) : (
                        selectablePrograms.map((prog) => (
                          <button
                            key={prog.id}
                            onClick={() => {
                              onAddProgramToCompare(prog);
                              setSearchPickerOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-100 transition-colors text-xs flex flex-col cursor-pointer border border-transparent hover:border-slate-200"
                          >
                            <span className="font-bold text-slate-900 truncate">{prog.title}</span>
                            <span className="text-[10px] text-slate-500 truncate">{prog.provider}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: True Synchronized Table with Clear Grid Lines */}
        <div className="overflow-x-auto overflow-y-auto flex-1 bg-slate-100/70 p-4 sm:p-6">
          {selectedPrograms.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 mx-auto flex items-center justify-center text-indigo-600">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No programmes selected for comparison</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the <span className="font-bold text-indigo-600">+</span> button on any programme card in the catalogue to select up to 4 items and compare their details side-by-side.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Back to Catalogue
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-lg bg-white min-w-[780px]">
              <table className="w-full border-collapse text-left">
                <tbody>
                  
                  {/* ROW 1: HEADER & PROGRAMME PREVIEW CARDS */}
                  <tr className="border-b border-slate-300 bg-slate-50">
                    <td className="w-52 sm:w-60 p-4 sm:p-5 bg-[#071322] text-white border-r border-slate-800 align-top shrink-0">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                          COMPARING {selectedPrograms.length} {selectedPrograms.length === 1 ? 'PROGRAMME' : 'PROGRAMMES'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                          Multi-Attribute Comparison
                        </h4>
                      </div>
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-4 sm:p-5 border-r border-slate-200 last:border-r-0 align-top bg-white"
                        style={{ width: `${100 / selectedPrograms.length}%` }}
                      >
                        <div className="flex flex-col justify-between h-full space-y-3">
                          {/* Banner Image */}
                          <div className="w-full h-36 sm:h-40 rounded-xl overflow-hidden relative bg-slate-900 border border-slate-200 shadow-xs">
                            <img
                              src={program.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}
                              alt={program.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {/* Remove button */}
                            <button
                              onClick={() => onRemoveProgram(program.id)}
                              title="Remove from comparison"
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            {/* Match score */}
                            <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] font-black">
                              {program.matchScore}% Match
                            </div>
                          </div>

                          {/* Title & Institution */}
                          <div>
                            <h3 className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                              {program.title}
                            </h3>
                            <div className="text-xs font-bold text-indigo-700 mt-1 flex items-center gap-1.5">
                              <Landmark className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                              <span className="truncate">{program.institution || program.provider}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 2: TOPIC / TAGS */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      TOPIC
                    </td>
                    {selectedPrograms.map((program) => {
                      const displayTags = program.tags && program.tags.length > 0
                        ? program.tags
                        : program.skillsTaught.slice(0, 3);
                      return (
                        <td
                          key={program.id}
                          className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {displayTags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-1 rounded text-[10.5px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300/80 shadow-2xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* ROW 3: FRAMEWORK (70:20:10) */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      FRAMEWORK (70:20:10)
                    </td>
                    {selectedPrograms.map((program) => {
                      const is70 = program.frameworkType === '70_EXPERIENCE';
                      const is20 = program.frameworkType === '20_EXPOSURE';
                      return (
                        <td
                          key={program.id}
                          className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle"
                        >
                          {is70 ? (
                            <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-md tracking-wider uppercase border shadow-2xs bg-amber-500/15 text-amber-800 border-amber-500/40 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              70% Experience
                            </span>
                          ) : is20 ? (
                            <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-md tracking-wider uppercase border shadow-2xs bg-purple-500/15 text-purple-800 border-purple-500/40 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                              20% Exposure
                            </span>
                          ) : (
                            <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-md tracking-wider uppercase border shadow-2xs bg-sky-500/15 text-sky-800 border-sky-500/40 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                              10% Learning
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* ROW 4: DELIVERY MODE */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      DELIVERY MODE
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle font-bold text-xs text-slate-900"
                      >
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{program.deliveryMode || 'Offline'}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 5: LOCATION */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      LOCATION
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle text-xs font-semibold text-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{program.location || 'Singapore & Virtual Hybrid'}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 6: START DATE */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      START DATE
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle text-xs font-extrabold text-slate-900"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>
                            {program.startDate ||
                              program.schedule.replace(/^(Starts|Cohort Starts)\s+/i, '')}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 7: DURATION & HOURS */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      DURATION & HOURS
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle text-xs font-semibold text-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>
                            {program.duration} ({program.learningHours} Learning Hours)
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 8: FEE / INVESTMENT */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      FEE / INVESTMENT
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle font-black text-sm text-slate-900"
                      >
                        {program.fee || program.cost}
                      </td>
                    ))}
                  </tr>

                  {/* ROW 9: PROVIDER / INSTITUTION */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 sm:p-4 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      PROVIDER / INSTITUTION
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-3.5 sm:p-4 border-r border-slate-200 last:border-r-0 align-middle text-xs font-bold text-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>{program.provider}</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 10: OVERVIEW */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-5 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-top">
                      OVERVIEW
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-4 sm:p-5 border-r border-slate-200 last:border-r-0 align-top text-xs text-slate-700 leading-relaxed"
                      >
                        {program.description}
                      </td>
                    ))}
                  </tr>

                  {/* ROW 11: KEY SKILLS TAUGHT */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-5 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-top">
                      KEY SKILLS TAUGHT
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-4 sm:p-5 border-r border-slate-200 last:border-r-0 align-top"
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {program.skillsTaught.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10.5px] font-bold shadow-2xs"
                            >
                              🎯 {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* ROW 12: LEARNING OBJECTIVES */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-5 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-top">
                      LEARNING OBJECTIVES
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-4 sm:p-5 border-r border-slate-200 last:border-r-0 align-top space-y-2 text-xs text-slate-700 leading-relaxed"
                      >
                        {program.learningObjectives && program.learningObjectives.length > 0 ? (
                          program.learningObjectives.map((obj, oIdx) => (
                            <p key={oIdx} className="leading-relaxed">
                              {obj}
                            </p>
                          ))
                        ) : (
                          <div className="space-y-1.5">
                            <p>1. Master advanced strategic frameworks in {program.category}.</p>
                            <p>2. Execute high-impact operational decisions with measurable ROI.</p>
                            <p>3. Enhance executive communication and cross-functional leadership.</p>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* ROW 13: CURRICULUM MODULES */}
                  <tr className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-5 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-top">
                      CURRICULUM MODULES
                    </td>
                    {selectedPrograms.map((program) => (
                      <td
                        key={program.id}
                        className="p-4 sm:p-5 border-r border-slate-200 last:border-r-0 align-top space-y-3"
                      >
                        {program.curriculumModules && program.curriculumModules.length > 0 ? (
                          program.curriculumModules.map((mod, mIdx) => (
                            <div
                              key={mIdx}
                              className="border-l-3 border-amber-400 pl-3 py-1.5 bg-slate-50 rounded-r-lg border border-slate-200/60 shadow-2xs"
                            >
                              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                                {mod.moduleNumber}
                              </div>
                              <div className="text-xs font-bold text-slate-900 leading-tight">
                                {mod.title}
                              </div>
                              <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                                {mod.description}
                              </p>
                            </div>
                          ))
                        ) : (
                          program.syllabusHighlights.map((syl, sIdx) => (
                            <div
                              key={sIdx}
                              className="border-l-3 border-amber-400 pl-3 py-1.5 bg-slate-50 rounded-r-lg border border-slate-200/60 shadow-2xs"
                            >
                              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                                Module 0{sIdx + 1}
                              </div>
                              <div className="text-xs font-bold text-slate-900 leading-tight">
                                {syl}
                              </div>
                            </div>
                          ))
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* ROW 14: ACTIONS */}
                  <tr className="bg-slate-50">
                    <td className="p-4 sm:p-5 bg-[#071322] text-slate-300 text-[11px] font-black uppercase tracking-wider border-r border-slate-800 align-middle">
                      ACTIONS
                    </td>
                    {selectedPrograms.map((program) => {
                      const isAdded = Boolean(addedIds[program.id]);
                      return (
                        <td
                          key={program.id}
                          className="p-4 sm:p-5 border-r border-slate-200 last:border-r-0 align-middle"
                        >
                          <button
                            onClick={() => handleAddToJourneyClick(program)}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Added to IDP</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>Add to My IDP</span>
                              </>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
