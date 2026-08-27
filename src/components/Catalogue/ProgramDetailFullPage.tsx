import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  MapPin,
  CreditCard,
  Building2,
  ExternalLink,
  Edit3,
  Bot,
  CheckCircle2,
  Radio,
  BookOpen,
  Award,
  MessageSquare,
  Send,
  X,
} from 'lucide-react';
import { CatalogueProgram } from '../../types';

interface ProgramDetailFullPageProps {
  program: CatalogueProgram;
  onBack: () => void;
  onAddToJourney: (program: CatalogueProgram) => void;
  onOpenAICoach?: () => void;
}

interface HelpdeskMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export const ProgramDetailFullPage: React.FC<ProgramDetailFullPageProps> = ({
  program,
  onBack,
  onAddToJourney,
  onOpenAICoach,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);
  const [helpdeskMessages, setHelpdeskMessages] = useState<HelpdeskMessage[]>([
    {
      sender: 'assistant',
      text: `Halo! Saya AI Helpdesk MDJ. Saya siap membantu kamu seputar programme **${program.title}**, rekomendasi programme yang cocok, atau proses development di platform ini. Ada yang bisa saya bantu?`,
    },
  ]);
  const [helpdeskInput, setHelpdeskInput] = useState('');
  const [isHelpdeskLoading, setIsHelpdeskLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [helpdeskMessages]);

  const curriculumModules = program.curriculumModules && program.curriculumModules.length > 0
    ? program.curriculumModules
    : [
        { moduleNumber: 'Module 01', title: 'Introduction to Corporate Governance', description: 'Overview of what corporate governance is, the main corporate governance systems, and the key institutions, roles and processes involved.' },
        { moduleNumber: 'Module 02', title: 'Board Fundamentals: Responsibility and Effectiveness', description: 'Examination of the different types of directors, board responsibilities, and the foundations of an effective board.' },
        { moduleNumber: 'Module 03', title: 'Board Dynamics and Structure', description: 'Exploration of board dynamics, efficiency, board structure, and the role of board committees.' },
        { moduleNumber: 'Module 04', title: 'Finance Literacy for Directors', description: 'Building essential financial literacy skills needed by directors to fulfill their governance responsibilities.' },
        { moduleNumber: 'Module 05', title: 'Director Career and Emerging Challenges', description: 'Understanding the job market for board directors and addressing new challenges including diversity, sustainability, and digital transformation.' },
      ];

  const learningObjectives = program.learningObjectives && program.learningObjectives.length > 0
    ? program.learningObjectives
    : [
        'Understand the broader context in which boards operate and the responsibilities that come with a director mandate',
        'Gain an overview of the knowledge and competencies expected from directors in today\'s environment',
        'Develop director-specific competencies that contribute to the creation of a high-performing board',
        'Understand the main corporate governance systems and institutions',
        'Learn how to exercise director responsibilities effectively in the boardroom',
        'Acquire finance literacy relevant to board-level decision making',
        'Understand emerging challenges for directors including diversity, sustainability, and digital transformation',
      ];

  const handleRegister = () => {
    onAddToJourney(program);
    setIsRegistered(true);
    setTimeout(() => setIsRegistered(false), 4000);
  };

  const sendHelpdeskMessage = async () => {
    const msg = helpdeskInput.trim();
    if (!msg || isHelpdeskLoading) return;

    const userMsg: HelpdeskMessage = { sender: 'user', text: msg };
    setHelpdeskMessages((prev) => [...prev, userMsg]);
    setHelpdeskInput('');
    setIsHelpdeskLoading(true);

    try {
      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'MENTOR',
          userMessage: msg,
          chatHistory: helpdeskMessages.map((m) => ({ role: m.sender, content: m.text })),
          contextData: {
            platform: 'My Development Journey (MDJ)',
            currentProgramme: program.title,
            provider: program.provider,
            frameworkType: program.frameworkType,
            skillsTaught: program.skillsTaught,
            helpdeskMode: true,
            helpdeskContext: 'Employee asking about programmes, development processes, or platform features. Answer helpfully and concisely.',
          },
          currentStage: 'G',
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const reply = data.response || 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.';
      setHelpdeskMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
    } catch {
      setHelpdeskMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Maaf, terjadi kendala teknis. Silakan coba lagi atau hubungi tim L&D secara langsung.' },
      ]);
    } finally {
      setIsHelpdeskLoading(false);
    }
  };

  const renderInstitutionLogo = () => {
    const name = (program.institution || program.provider || '').toLowerCase();

    if (name.includes('insead')) {
      return (
        <div className="flex items-center justify-center p-3 gap-2">
          <div className="w-14 h-14 rounded-full bg-[#005a36] text-white flex items-center justify-center font-serif font-black text-xs tracking-wider shadow-md shrink-0">
            INSEAD
          </div>
          <div className="text-left font-serif">
            <span className="text-[#005a36] font-bold text-xs block leading-tight tracking-wide uppercase">The Business School</span>
            <span className="text-slate-500 text-[10px] block leading-tight italic">for the World®</span>
          </div>
        </div>
      );
    }
    if (name.includes('columbia')) {
      return (
        <div className="flex items-center justify-center p-3 gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#1d4f91] text-white flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md shrink-0">CBS</div>
          <div className="text-left">
            <span className="text-[#1d4f91] font-extrabold text-xs block leading-tight">Columbia Business School</span>
            <span className="text-slate-500 text-[10px] block leading-tight font-medium">Executive Education</span>
          </div>
        </div>
      );
    }
    if (name.includes('harvard')) {
      return (
        <div className="flex items-center justify-center p-3 gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#a51c30] text-white flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md shrink-0">HBS</div>
          <div className="text-left">
            <span className="text-[#a51c30] font-extrabold text-xs block leading-tight">Harvard Business School</span>
            <span className="text-slate-500 text-[10px] block leading-tight font-medium">Executive Education</span>
          </div>
        </div>
      );
    }
    if (name.includes('stanford')) {
      return (
        <div className="flex items-center justify-center p-3 gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#8c1515] text-white flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md shrink-0">SCPD</div>
          <div className="text-left">
            <span className="text-[#8c1515] font-extrabold text-xs block leading-tight">Stanford University</span>
            <span className="text-slate-500 text-[10px] block leading-tight font-medium">Executive Education</span>
          </div>
        </div>
      );
    }
    if (name.includes('nus')) {
      return (
        <div className="flex items-center justify-center p-3 gap-2">
          <div className="w-12 h-12 rounded-xl bg-[#003d7c] text-[#ef7c00] flex items-center justify-center font-sans font-black text-base tracking-tight shadow-md shrink-0">NUS</div>
          <div className="text-left">
            <span className="text-[#003d7c] font-extrabold text-xs block leading-tight">NUS Business School</span>
            <span className="text-slate-500 text-[10px] block leading-tight font-medium">Executive Education</span>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center p-3 gap-2">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm tracking-wider shadow-md shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="text-left">
          <span className="text-slate-900 font-extrabold text-xs block leading-tight">{program.institution || program.provider}</span>
          <span className="text-slate-500 text-[10px] block leading-tight font-medium">Executive Capability Development</span>
        </div>
      </div>
    );
  };

  const eyebrowTags = program.tags && program.tags.length > 0
    ? program.tags.join(' · ')
    : program.category.toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100/60 pb-28 -mx-3 sm:-mx-6 lg:-mx-8 xl:-mx-10 2xl:-mx-12 -mt-6">

      {/* 1. Hero Header Banner */}
      <div className="relative w-full min-h-[260px] sm:min-h-[300px] bg-slate-950 overflow-hidden flex flex-col justify-between p-6 sm:p-10 text-white">
        <img
          src={program.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80'}
          alt={program.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111e] via-[#07111e]/80 to-black/60 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 hover:border-white/40 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
            {program.matchScore}% Match Score
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mt-6 sm:mt-10 space-y-2">
          <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-amber-400/90 font-mono">
            {eyebrowTags}
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {program.title}
          </h1>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-8 relative z-20">

        {/* 2. Metadata Grid Bar */}
        <div className="bg-[#0b1b36] rounded-2xl p-4 sm:p-5 text-white border border-[#183159] shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="pt-2 sm:pt-0 lg:px-3 first:px-0">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> START DATE
              </span>
              <span className="text-sm font-extrabold text-white block">
                {program.startDate || program.schedule.replace(/^(Starts|Cohort Starts)\s+/i, '')}
              </span>
            </div>
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> DURATION
              </span>
              <span className="text-sm font-extrabold text-white block">{program.duration}</span>
            </div>
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> LEVEL
              </span>
              <span className="text-sm font-extrabold text-white block">{program.levelBadge || 'Executive'}</span>
            </div>
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Radio className="w-3.5 h-3.5 text-slate-400" /> DELIVERY
              </span>
              <span className="text-sm font-extrabold text-white block">{program.deliveryMode || 'Offline'}</span>
            </div>
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> LOCATION
              </span>
              <span className="text-sm font-extrabold text-white block truncate" title={program.location || 'Singapore'}>
                {program.location || 'Singapore'}
              </span>
            </div>
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> PROGRAMME FEE
              </span>
              <span className="text-sm font-black text-amber-400 block truncate" title={program.fee || program.cost}>
                {program.fee || program.cost}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Main Content: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (8 of 12) */}
          <div className="lg:col-span-8 space-y-8">

            {/* A. SKILLS COVERED */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full" />
                  SKILLS COVERED
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  AI-MAPPED
                </span>
              </div>

              {/* Primary skill proficiency boost */}
              {program.targetSkillName && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                      <Award className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                        Proficiency Boost Setelah Completed
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">{program.targetSkillName}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                    +{program.proficiencyGain || 0.4} Level
                  </span>
                </div>
              )}

              {/* All skills taught */}
              <div className="space-y-2">
                <p className="text-[10.5px] text-slate-500 uppercase font-bold tracking-wider">Skills yang dikembangkan:</p>
                <div className="flex flex-wrap gap-1.5">
                  {program.skillsTaught.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* B. ABOUT THIS PROGRAMME */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                ABOUT THIS PROGRAMME
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{program.description}</p>
            </div>

            {/* C. LEARNING OBJECTIVES */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                LEARNING OBJECTIVES
              </h3>
              <div className="space-y-3.5">
                {learningObjectives.map((obj, oIdx) => (
                  <div key={oIdx} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {oIdx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-0.5">
                      {obj.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* D. MODULES & CURRICULUM — only for 10_LEARNING */}
            {program.frameworkType === '10_LEARNING' && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full" />
                  MODULES & CURRICULUM
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {curriculumModules.map((mod, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <span className="text-[10.5px] uppercase font-black tracking-wider text-amber-600 font-mono block">
                        {mod.moduleNumber || `Module 0${mIdx + 1}`}
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">{mod.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{mod.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar (4 of 12) */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. Institution Logo */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-center">
              {renderInstitutionLogo()}
            </div>

            {/* 2. PROGRAMME LINKS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                PROGRAMME LINKS
              </span>
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-between transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>View Full Programme</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={handleRegister}
                disabled={isRegistered}
                className={`w-full py-3.5 px-4 rounded-xl text-white text-xs font-black flex items-center justify-between transition-all cursor-pointer shadow-md ${
                  isRegistered ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#0b1b36] hover:bg-[#12284c]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isRegistered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Edit3 className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{isRegistered ? 'Telah Ditambahkan ke Journey!' : 'Registrasi / Daftar'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            {/* 3. PROGRAMME DETAILS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                PROGRAMME DETAILS
              </span>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Start Date</span>
                  <span className="font-bold text-slate-900">{program.startDate || program.schedule}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Duration</span>
                  <span className="font-bold text-slate-900">{program.duration}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Level</span>
                  <span className="font-bold text-slate-900">{program.levelBadge || 'Executive'}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Delivery</span>
                  <span className="font-bold text-slate-900">{program.deliveryMode || 'Offline'}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-bold text-slate-900">{program.location || 'Singapore'}</span>
                </div>
                <div className="flex items-start justify-between py-1.5 border-b border-slate-100 gap-3">
                  <span className="text-slate-500 font-medium shrink-0">Provider</span>
                  <span className="font-bold text-slate-900 text-right">{program.provider}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 font-medium">Programme Fee</span>
                  <span className="font-extrabold text-amber-600">{program.fee || program.cost}</span>
                </div>
              </div>
            </div>

            {/* 4. HELPDESK */}
            <div className="bg-[#0b1b36] rounded-2xl p-5 border border-[#183159] shadow-lg text-white space-y-3.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                BUTUH BANTUAN?
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tanya AI Helpdesk seputar programme ini, rekomendasi programme yang cocok, atau proses development di MDJ.
              </p>
              <button
                onClick={() => setIsHelpdeskOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat dengan AI Helpdesk</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Brochure Modal */}
      {isBrochureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 block">
                  Official Syllabus & Executive Pathway
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{program.title}</h3>
                <p className="text-xs text-slate-500">{program.provider} · {program.location}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 max-h-60 overflow-y-auto">
              <p className="font-semibold text-slate-800">Programme Overview:</p>
              <p className="leading-relaxed">{program.description}</p>
              {program.frameworkType === '10_LEARNING' && (
                <div className="pt-2">
                  <p className="font-semibold text-slate-800 mb-1">Key Modules:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {curriculumModules.map((m, idx) => (
                      <li key={idx}><strong className="text-slate-900">{m.title}:</strong> {m.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBrochureOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => { handleRegister(); setIsBrochureOpen(false); }}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helpdesk Chat Modal */}
      {isHelpdeskOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" style={{ height: '520px' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0b1b36] text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-900" />
                </div>
                <div>
                  <p className="text-xs font-black">AI Helpdesk MDJ</p>
                  <p className="text-[10px] text-slate-400">Tanya seputar programme & development</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpdeskOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {helpdeskMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0b1b36] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isHelpdeskLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs rounded-bl-none">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
              <input
                type="text"
                value={helpdeskInput}
                onChange={(e) => setHelpdeskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendHelpdeskMessage(); }}
                placeholder="Ketik pertanyaan kamu..."
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 bg-slate-50"
                disabled={isHelpdeskLoading}
              />
              <button
                onClick={sendHelpdeskMessage}
                disabled={isHelpdeskLoading || !helpdeskInput.trim()}
                className="w-9 h-9 rounded-xl bg-[#0b1b36] hover:bg-[#12284c] text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
