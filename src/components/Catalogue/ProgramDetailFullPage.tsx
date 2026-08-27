import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Share2,
  Plus,
  Radio,
  BookOpen,
} from 'lucide-react';
import { CatalogueProgram } from '../../types';

interface ProgramDetailFullPageProps {
  program: CatalogueProgram;
  onBack: () => void;
  onAddToJourney: (program: CatalogueProgram) => void;
  onOpenAICoach?: () => void;
}

export const ProgramDetailFullPage: React.FC<ProgramDetailFullPageProps> = ({
  program,
  onBack,
  onAddToJourney,
  onOpenAICoach,
}) => {
  const [expandedSkillIdx, setExpandedSkillIdx] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  // Sub-skill details mapped to each executive skill badge
  const defaultSubSkills: Record<string, string[]> = {
    'ESG & Sustainable Leadership': [
      'Scope 1-3 Decarbonization & Carbon Accounting',
      'TCFD & ISSB Board Sustainability Disclosure',
      'Sustainable Capital Structure & Transition Bonds',
      'Circular Economy & Value Chain ESG Auditing',
      'Stakeholder Governance & Diversity Metrics',
    ],
    'Digital & Technology Acumen': [
      'Enterprise GenAI & Multi-Agent Architecture',
      'Boardroom Cybersecurity & Zero-Trust Governance',
      'Data Privacy, PDP Law & Cloud Sovereignty',
      'Digital Transformation ROI & Tech Debt Auditing',
      'Autonomous Systems & Real-Time Analytics',
    ],
    'Risk & Compliance Governance': [
      'Board Fiduciary Duty & Regulatory Mandates',
      'Enterprise Risk Management (ERM) & Crisis Scenarios',
      'Audit Committee Protocols & Financial Scrutiny',
      'Whistleblowing & Anti-Fraud Compliance',
      'Cross-Border Jurisdictional Governance',
    ],
    'Strategic Leadership & Executive Influence': [
      'C-Suite Consensus Building & Boardroom Persuasion',
      'Strategic Capital Allocation & M&A Valuation',
      'Executive Succession & Talent Committee Leadership',
      'Crisis Communication & Stakeholder Alignment',
      'Long-Term Value Creation & Shareholder Relations',
    ],
    'Financial Stewardship': [
      'Balance Sheet Resilience & Capital Budgeting',
      'Corporate Valuation & Discounted Cash Flow Analysis',
      'Unit Economics & Profitability Driver Decomposition',
      'Tax Governance & Transfer Pricing Oversight',
      'M&A Due Diligence & Synergies Auditing',
    ],
    'Execution & Operational Excellence': [
      'Cross-Functional Value Stream Orchestration',
      'SLA Governance & Critical System Resilience',
      'Lean Portfolio Management & SAFe Alignment',
      'Operational Risk Monitoring & BCP Testing',
      'Performance Management & OKR Cascading',
    ],
  };

  const executiveSkills = program.competencyBadges && program.competencyBadges.length > 0
    ? program.competencyBadges
    : [
        { name: 'ESG & Sustainable Leadership', icon: '🌿', color: 'emerald' },
        { name: 'Digital & Technology Acumen', icon: '💻', color: 'cyan' },
        { name: 'Risk & Compliance Governance', icon: '🛡️', color: 'purple' },
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

  const curriculumModules = program.curriculumModules && program.curriculumModules.length > 0
    ? program.curriculumModules
    : [
        { moduleNumber: 'Module 01', title: 'Introduction to Corporate Governance', description: 'Overview of what corporate governance is, the main corporate governance systems, and the key institutions, roles and processes involved.' },
        { moduleNumber: 'Module 02', title: 'Board Fundamentals: Responsibility and Effectiveness', description: 'Examination of the different types of directors, board responsibilities, and the foundations of an effective board.' },
        { moduleNumber: 'Module 03', title: 'Board Dynamics and Structure', description: 'Exploration of board dynamics, efficiency, board structure, and the role of board committees.' },
        { moduleNumber: 'Module 04', title: 'Finance Literacy for Directors', description: 'Building essential financial literacy skills needed by directors to fulfill their governance responsibilities.' },
        { moduleNumber: 'Module 05', title: 'Director Career and Emerging Challenges', description: 'Understanding the job market for board directors and addressing new challenges including diversity, sustainability, and digital transformation.' },
      ];

  const handleRegister = () => {
    onAddToJourney(program);
    setIsRegistered(true);
    setTimeout(() => setIsRegistered(false), 4000);
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
          <div className="w-12 h-12 rounded-xl bg-[#1d4f91] text-white flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md shrink-0">
            CBS
          </div>
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
          <div className="w-12 h-12 rounded-xl bg-[#a51c30] text-white flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md shrink-0">
            HBS
          </div>
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
          <div className="w-12 h-12 rounded-xl bg-[#8c1515] text-white flex items-center justify-center font-serif font-black text-sm tracking-wider shadow-md shrink-0">
            SCPD
          </div>
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
          <div className="w-12 h-12 rounded-xl bg-[#003d7c] text-[#ef7c00] flex items-center justify-center font-sans font-black text-base tracking-tight shadow-md shrink-0">
            NUS
          </div>
          <div className="text-left">
            <span className="text-[#003d7c] font-extrabold text-xs block leading-tight">NUS Business School</span>
            <span className="text-slate-500 text-[10px] block leading-tight font-medium">Executive Education</span>
          </div>
        </div>
      );
    }

    // Default TechConnect / Provider Badge
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
    <div className="min-h-screen bg-slate-100/60 pb-28 -mx-4 sm:-mx-6 -mt-6 sm:-mt-8">
      
      {/* 1. Hero Header Banner */}
      <div className="relative w-full min-h-[260px] sm:min-h-[300px] bg-slate-950 overflow-hidden flex flex-col justify-between p-6 sm:p-10 text-white">
        {/* Background Image with Dark Gradient & Candlestick Overlay */}
        <img
          src={program.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80'}
          alt={program.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111e] via-[#07111e]/80 to-black/60 pointer-events-none" />

        {/* Top Floating Back Button */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 hover:border-white/40 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
            title="Kembali ke Katalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
              {program.matchScore}% Match Score
            </span>
          </div>
        </div>

        {/* Title and Eyebrow in Hero */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 space-y-8 relative z-20">
        
        {/* 2. Metadata Grid Bar (Dark Navy Header Bar) */}
        <div className="bg-[#0b1b36] rounded-2xl p-4 sm:p-5 text-white border border-[#183159] shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            {/* START DATE */}
            <div className="pt-2 sm:pt-0 lg:px-3 first:px-0">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                START DATE
              </span>
              <span className="text-sm font-extrabold text-white block">
                {program.startDate || program.schedule.replace(/^(Starts|Cohort Starts)\s+/i, '')}
              </span>
            </div>

            {/* DURATION */}
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                DURATION
              </span>
              <span className="text-sm font-extrabold text-white block">
                {program.duration}
              </span>
            </div>

            {/* LEVEL */}
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                LEVEL
              </span>
              <span className="text-sm font-extrabold text-white block">
                {program.levelBadge || 'Executive'}
              </span>
            </div>

            {/* DELIVERY */}
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                DELIVERY
              </span>
              <span className="text-sm font-extrabold text-white block">
                {program.deliveryMode || 'Offline'}
              </span>
            </div>

            {/* LOCATION */}
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                LOCATION
              </span>
              <span className="text-sm font-extrabold text-white block truncate" title={program.location || 'Singapore'}>
                {program.location || 'Singapore'}
              </span>
            </div>

            {/* PROGRAMME FEE */}
            <div className="pt-2 sm:pt-0 lg:px-3">
              <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                PROGRAMME FEE
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
            
            {/* A. SKILLS & EXECUTIVE SKILL FRAMEWORK */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full" />
                  SKILLS & EXECUTIVE SKILL FRAMEWORK
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  AI-MAPPED
                </span>
              </div>

              {/* Full-width Colored Accordion Bars */}
              <div className="space-y-3 pt-1">
                {executiveSkills.map((skillBadge, sIdx) => {
                  const isExpanded = expandedSkillIdx === sIdx;
                  let bgClasses = 'bg-[#0f603c] text-white';
                  let subSkills = defaultSubSkills[skillBadge.name] || [
                    `${skillBadge.name} Strategy & Implementation`,
                    'Cross-functional Governance & Reporting',
                    'Strategic Decision Frameworks',
                    'Enterprise Risk & Performance Evaluation',
                    'Executive Stakeholder Alignment',
                  ];

                  if (skillBadge.color === 'cyan' || sIdx === 1) {
                    bgClasses = 'bg-[#0b6584] text-white';
                  } else if (skillBadge.color === 'purple' || sIdx === 2) {
                    bgClasses = 'bg-[#6a1b9a] text-white';
                  } else if (skillBadge.color === 'amber') {
                    bgClasses = 'bg-[#9a6700] text-white';
                  }

                  return (
                    <div key={sIdx} className="rounded-xl overflow-hidden shadow-xs transition-all">
                      <button
                        onClick={() => setExpandedSkillIdx(isExpanded ? null : sIdx)}
                        className={`w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer text-left transition-all ${bgClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          {skillBadge.icon ? (
                            <span className="text-lg">{skillBadge.icon}</span>
                          ) : (
                            <Sparkles className="w-4 h-4 text-white/80" />
                          )}
                          <div>
                            <span className="text-[9px] uppercase font-extrabold tracking-widest text-white/70 block">
                              EXECUTIVE SKILL
                            </span>
                            <span className="text-xs sm:text-sm font-black text-white">
                              {skillBadge.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/20 text-white backdrop-blur-xs flex items-center gap-1">
                            {subSkills.length} skills
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                      </button>

                      {/* Expanded Sub-Skills Panel */}
                      {isExpanded && (
                        <div className="bg-slate-900 text-white p-4 sm:p-5 border-t border-white/10 space-y-2.5 animate-in fade-in">
                          <div className="text-[10.5px] uppercase font-bold text-amber-400 tracking-wider">
                            Mapped Sub-Competencies & Proficiency Target:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {subSkills.map((sub, subIdx) => (
                              <div
                                key={subIdx}
                                className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* B. ABOUT THIS PROGRAMME */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1 h-4 bg-amber-500 rounded-full" />
                ABOUT THIS PROGRAMME
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {program.description}
              </p>
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
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {oIdx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-0.5">
                      {obj.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* D. MODULES & CURRICULUM */}
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
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar (4 of 12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Institution Logo Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-center">
              {renderInstitutionLogo()}
            </div>

            {/* 2. PROGRAMME LINKS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                PROGRAMME LINKS
              </span>

              {/* View Full Programme */}
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-between transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>View Full Programme</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Registrasi / Daftar Button */}
              <button
                onClick={handleRegister}
                disabled={isRegistered}
                className={`w-full py-3.5 px-4 rounded-xl text-white text-xs font-black flex items-center justify-between transition-all cursor-pointer shadow-md ${
                  isRegistered
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-[#0b1b36] hover:bg-[#12284c]'
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

            {/* 4. NEED GUIDANCE? Chat with AI Advisor */}
            <div className="bg-[#0b1b36] rounded-2xl p-5 border border-[#183159] shadow-lg text-white space-y-3.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                NEED GUIDANCE?
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Speak to a programme advisor to find the right learning pathway for your role.
              </p>

              <button
                onClick={() => {
                  if (onOpenAICoach) {
                    onOpenAICoach();
                  } else {
                    alert('Connecting with Executive AI Advisor for personalized curriculum planning...');
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span>Chat with AI Advisor</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Full Programme Brochure Simulation Modal */}
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
              
              <div className="pt-2">
                <p className="font-semibold text-slate-800 mb-1">Key Modules:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {curriculumModules.map((m, idx) => (
                    <li key={idx}><strong className="text-slate-900">{m.title}:</strong> {m.description}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBrochureOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleRegister();
                  setIsBrochureOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
