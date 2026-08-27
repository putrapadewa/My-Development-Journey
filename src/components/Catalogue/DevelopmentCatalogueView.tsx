import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  Radio,
  Landmark,
  Grid,
  List,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  Trash2,
  SlidersHorizontal,
} from 'lucide-react';
import { CatalogueProgram } from '../../types';
import { ProgramDetailModal } from './ProgramDetailModal';
import { ProgramDetailFullPage } from './ProgramDetailFullPage';
import { ProgrammeComparisonModal } from './ProgrammeComparisonModal';

interface DevelopmentCatalogueViewProps {
  programs: CatalogueProgram[];
  onAddToJourney: (program: CatalogueProgram) => void;
  onOpenAICoach?: () => void;
}

interface SkillCategoryTab {
  id: string;
  label: string;
  icon: string;
  keywords: string[];
}

export const DevelopmentCatalogueView: React.FC<DevelopmentCatalogueViewProps> = ({
  programs,
  onAddToJourney,
  onOpenAICoach,
}) => {
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedFramework, setSelectedFramework] = useState<string>('ALL');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('NEAREST_DATE');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Full-Page Detail State (Primary detail view with back button)
  const [selectedDetailProgram, setSelectedDetailProgram] = useState<CatalogueProgram | null>(null);

  // Modal and Interactive States
  const [activeModalProgram, setActiveModalProgram] = useState<CatalogueProgram | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // Multi-Program Comparison State
  const [compareList, setCompareList] = useState<CatalogueProgram[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Role-Relevant Dynamic Skill Categories (Tailored for Lead Solutions Architect & Tech Lead)
  const skillCategories: SkillCategoryTab[] = [
    { id: 'ALL', label: 'All', icon: '', keywords: [] },
    { id: 'AI', label: 'AI & GenAI', icon: '🤖', keywords: ['ai', 'machine learning', 'genai', 'agentic', 'model', 'llm', 'deep learning'] },
    { id: 'Cloud', label: 'Cloud & Platform', icon: '☁️', keywords: ['cloud', 'platform', 'zero trust', 'hybrid cloud', 'kubernetes', 'infrastructure', 'devops'] },
    { id: 'Digital', label: 'Systems & Architecture', icon: '💻', keywords: ['systems', 'architecture', 'software', 'distributed', 'digital', 'technology'] },
    { id: 'Risk', label: 'Cyber & Governance', icon: '🛡️', keywords: ['risk', 'governance', 'compliance', 'security', 'red-teaming', 'directorship', 'audit'] },
    { id: 'Leadership', label: 'Tech Leadership', icon: '🎯', keywords: ['leadership', 'management', 'influence', 'directorship', 'c-suite', 'executive', 'people'] },
    { id: 'Finance', label: 'FinOps & Value', icon: '💰', keywords: ['finance', 'finops', 'p&l', 'capital', 'unit economics', 'cost', 'stewardship'] },
    { id: 'Innovation', label: 'Innovation & R&D', icon: '💡', keywords: ['innovation', 'disruption', 'ventures', 'incubator', 'transformation', 'product'] },
    { id: 'Strategy', label: 'Tech Strategy', icon: '♟️', keywords: ['strategy', 'strategic', 'corporate governance', 'market', 'directors', 'planning'] },
  ];

  // Helper to parse dates for chronological upcoming sorting
  const parseProgramDate = (dateStr?: string): number => {
    if (!dateStr) return 0;
    const clean = dateStr.replace(/^(Starts|Cohort Starts)\s+/i, '').trim();
    const parsed = Date.parse(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Reference timestamp: August 26, 2026
  const currentTimestamp = new Date('2026-08-26T00:00:00Z').getTime();

  // Dynamic filter for top upcoming carousel
  const upcomingPrograms = useMemo(() => {
    return [...programs]
      .filter((p) => {
        const pDate = parseProgramDate(p.startDate || p.schedule);
        return pDate >= currentTimestamp || pDate === 0;
      })
      .sort((a, b) => {
        const dateA = parseProgramDate(a.startDate || a.schedule);
        const dateB = parseProgramDate(b.startDate || b.schedule);
        return dateA - dateB;
      });
  }, [programs, currentTimestamp]);

  const runningCards = (upcomingPrograms.length >= 10 ? upcomingPrograms : programs).slice(0, 10);

  // Dynamic derivation of available filter options based strictly on existing programs
  const dynamicFilterData = useMemo(() => {
    const categoriesSet = new Set<string>();
    const skillsSet = new Set<string>();
    const deliveryModesSet = new Set<string>();

    let count70 = 0;
    let count20 = 0;
    let count10 = 0;

    programs.forEach((p) => {
      if (p.category) categoriesSet.add(p.category);
      if (p.skillsTaught && Array.isArray(p.skillsTaught)) {
        p.skillsTaught.forEach((s) => skillsSet.add(s));
      }
      if (p.deliveryMode) deliveryModesSet.add(p.deliveryMode);

      if (p.frameworkType === '70_EXPERIENCE') count70++;
      else if (p.frameworkType === '20_EXPOSURE') count20++;
      else if (p.frameworkType === '10_LEARNING') count10++;
    });

    return {
      categories: Array.from(categoriesSet).sort(),
      skills: Array.from(skillsSet).sort(),
      deliveryModes: Array.from(deliveryModesSet).sort(),
      count70,
      count20,
      count10,
    };
  }, [programs]);

  // Derive active skill categories pills where at least 1 program is available
  const availableSkillCategoryTabs = useMemo(() => {
    return skillCategories
      .map((tab) => {
        if (tab.id === 'ALL') {
          return { ...tab, count: programs.length };
        }
        const matchingCount = programs.filter((p) => {
          const combinedText = `${p.title} ${p.category} ${p.skillsTaught.join(' ')} ${(p.tags || []).join(' ')} ${p.description}`.toLowerCase();
          return tab.keywords.some((kw) => combinedText.includes(kw));
        }).length;
        return { ...tab, count: matchingCount };
      })
      .filter((tab) => tab.count > 0);
  }, [programs, skillCategories]);

  // Main filter engine for All Programs
  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        // Search term matching
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          p.title.toLowerCase().includes(searchLower) ||
          p.provider.toLowerCase().includes(searchLower) ||
          (p.institution && p.institution.toLowerCase().includes(searchLower)) ||
          p.skillsTaught.some((s) => s.toLowerCase().includes(searchLower)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchLower))) ||
          (p.category && p.category.toLowerCase().includes(searchLower));

        // Dynamic Topic / Skill matching
        let matchesTopic = true;
        if (selectedTopic.startsWith('CAT:')) {
          const targetCat = selectedTopic.replace('CAT:', '');
          matchesTopic = p.category === targetCat;
        } else if (selectedTopic.startsWith('SKL:')) {
          const targetSkill = selectedTopic.replace('SKL:', '');
          matchesTopic = p.skillsTaught.includes(targetSkill) || (p.tags && p.tags.includes(targetSkill));
        } else if (selectedTopic !== 'ALL') {
          matchesTopic = p.category === selectedTopic || p.skillsTaught.includes(selectedTopic);
        }

        // 70:20:10 Framework filter
        let matchesFramework = true;
        if (selectedFramework !== 'ALL') {
          matchesFramework = p.frameworkType === selectedFramework;
        }

        // Delivery filter
        const matchesDelivery =
          selectedDelivery === 'ALL' ||
          (p.deliveryMode || '').toLowerCase().includes(selectedDelivery.toLowerCase());

        // Category by Skill pill filter
        let matchesSkillCategory = true;
        if (selectedSkillCategory !== 'ALL') {
          const tab = skillCategories.find((c) => c.id === selectedSkillCategory);
          if (tab && tab.keywords.length > 0) {
            const combinedText = `${p.title} ${p.category} ${p.skillsTaught.join(' ')} ${(p.tags || []).join(' ')} ${p.description}`.toLowerCase();
            matchesSkillCategory = tab.keywords.some((kw) => combinedText.includes(kw));
          }
        }

        return matchesSearch && matchesTopic && matchesFramework && matchesDelivery && matchesSkillCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'NEAREST_DATE') {
          const dateA = parseProgramDate(a.startDate || a.schedule) || 9999999999999;
          const dateB = parseProgramDate(b.startDate || b.schedule) || 9999999999999;
          return dateA - dateB;
        }
        if (sortBy === 'MATCH_SCORE') {
          return b.matchScore - a.matchScore;
        }
        if (sortBy === 'DURATION') {
          return b.learningHours - a.learningHours;
        }
        if (sortBy === 'TITLE_ASC') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [programs, searchTerm, selectedTopic, selectedFramework, selectedDelivery, selectedSkillCategory, sortBy]);

  // Check if any filter is actively applied
  const isFiltered =
    searchTerm !== '' ||
    selectedTopic !== 'ALL' ||
    selectedFramework !== 'ALL' ||
    selectedDelivery !== 'ALL' ||
    selectedSkillCategory !== 'ALL' ||
    sortBy !== 'NEAREST_DATE';

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedTopic('ALL');
    setSelectedFramework('ALL');
    setSelectedDelivery('ALL');
    setSelectedSkillCategory('ALL');
    setSortBy('NEAREST_DATE');
  };

  const toggleDescription = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle Program in Comparison Queue (up to 4)
  const toggleCompare = (program: CatalogueProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    const isAlreadyIn = compareList.some((p) => p.id === program.id);
    if (isAlreadyIn) {
      setCompareList((prev) => prev.filter((p) => p.id !== program.id));
    } else {
      if (compareList.length >= 4) {
        // Replace oldest or alert limit
        setCompareList((prev) => [...prev.slice(1), program]);
      } else {
        setCompareList((prev) => [...prev, program]);
      }
    }
  };

  const removeFromCompare = (programId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== programId));
  };

  const addProgramToCompare = (program: CatalogueProgram) => {
    if (!compareList.some((p) => p.id === program.id)) {
      if (compareList.length >= 4) {
        setCompareList((prev) => [...prev.slice(1), program]);
      } else {
        setCompareList((prev) => [...prev, program]);
      }
    }
  };

  const handleQuickAdd = (program: CatalogueProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToJourney(program);
    setAddedIds((prev) => ({ ...prev, [program.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [program.id]: false }));
    }, 2000);
  };

  // IF FULL-PAGE DETAIL IS ACTIVE, RENDER FULL PAGE VIEW WITH BACK BUTTON
  if (selectedDetailProgram) {
    return (
      <ProgramDetailFullPage
        program={selectedDetailProgram}
        onBack={() => setSelectedDetailProgram(null)}
        onAddToJourney={onAddToJourney}
        onOpenAICoach={onOpenAICoach}
      />
    );
  }

  return (
    <div className="space-y-8 pb-24">
      
      {/* 1. Header Banner (Bento Hero) */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                70:20:10 Development Opportunities
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Development Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              Explore premier executive education, high-impact experiential stretch assignments, and senior mentorship circles tailored to your career trajectory.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-indigo-100 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="font-medium">AI Match Score dynamically calibrated to your target competencies and IDP readiness goals.</span>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Development Opportunities Carousel (10 upcoming programs) */}
      <div className="bg-[#071322] rounded-3xl p-5 sm:p-7 text-white border border-[#142844] shadow-2xl space-y-4 relative overflow-hidden">
        
        {/* Carousel Header */}
        <div className="relative z-10 flex items-center gap-3 select-none">
          <div className="w-1.5 h-5 sm:h-6 bg-amber-400 rounded-full shrink-0" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-[10.5px] font-extrabold tracking-wider uppercase shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>LIVE</span>
          </div>
          <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-white truncate">
            UPCOMING DEVELOPMENT OPPORTUNITIES
          </h2>
        </div>

        {/* Carousel Stream with automatic pause on hover & click-to-open */}
        <div className="relative overflow-hidden pt-1">
          <div
            className="flex gap-4.5 sm:gap-5 animate-marquee"
            style={{ width: 'max-content' }}
          >
            {[...runningCards, ...runningCards].map((program, index) => {
              const is70 = program.frameworkType === '70_EXPERIENCE';
              const is20 = program.frameworkType === '20_EXPOSURE';
              const isInCompare = compareList.some((p) => p.id === program.id);
              
              const frameworkBadgeOnImage = is70 ? (
                <span className="text-[9px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase border shadow-md bg-amber-500 text-slate-950 border-amber-300 backdrop-blur-md inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                  70% Experience
                </span>
              ) : is20 ? (
                <span className="text-[9px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase border shadow-md bg-purple-600 text-white border-purple-300 backdrop-blur-md inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-200"></span>
                  20% Exposure
                </span>
              ) : (
                <span className="text-[9px] sm:text-[9.5px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase border shadow-md bg-sky-600 text-white border-sky-300 backdrop-blur-md inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-200"></span>
                  10% Learning
                </span>
              );

              const displayTags = program.tags && program.tags.length > 0
                ? program.tags
                : program.skillsTaught.slice(0, 3);

              return (
                <div
                  key={`${program.id}-${index}`}
                  className="group/card w-[265px] sm:w-[285px] shrink-0 rounded-2xl bg-[#0d1e33] hover:bg-[#112640] border border-[#1b3558] hover:border-blue-500/80 p-3.5 sm:p-4 text-white transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer flex flex-col justify-between select-none"
                  onClick={() => setSelectedDetailProgram(program)}
                >
                  <div>
                    {/* Program Thumbnail Image with 70:20:10 Badge & Match Score Inside Image */}
                    <div className="w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-2.5 relative bg-slate-800 border border-white/10">
                      <img
                        src={program.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e33]/90 via-transparent to-black/30 pointer-events-none" />

                      {/* Top Right: Compare Button */}
                      <button
                        type="button"
                        onClick={(e) => toggleCompare(program, e)}
                        title={isInCompare ? 'Remove from compare' : 'Add to compare'}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all cursor-pointer z-10 ${
                          isInCompare
                            ? 'bg-amber-400 text-slate-950 font-black shadow-xs ring-2 ring-amber-400/50'
                            : 'bg-black/60 hover:bg-black/80 text-white border border-white/20'
                        }`}
                      >
                        {isInCompare ? '✓' : '+'}
                      </button>

                      {/* Bottom Row inside Image: 70:20:10 Framework Badge (Left) & Match Score (Right) */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <div className="pointer-events-auto">
                          {frameworkBadgeOnImage}
                        </div>
                        <span className="pointer-events-auto text-[9.5px] font-black px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-300 border border-white/20">
                          {program.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Topic / Skill Tags Above Title */}
                    <div className="flex flex-wrap gap-1.5 min-h-[26px] items-center mb-1.5">
                      {displayTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center justify-center text-center px-2 py-0.5 rounded bg-[#132845] border border-blue-400/30 text-blue-200 text-[9.5px] font-bold tracking-normal leading-none uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Program Title */}
                    <h3 className="font-bold text-xs sm:text-[13px] text-white leading-snug line-clamp-2 min-h-[36px] mb-2 group-hover/card:text-blue-200 transition-colors">
                      {program.title}
                    </h3>
                  </div>

                  <div>
                    {/* Metadata 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 py-2.5 border-t border-blue-900/50 text-[10px] text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{program.startDate || program.schedule}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{program.duration}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{program.deliveryMode || 'Offline'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                        <span className="truncate">{program.learningHours} Hrs</span>
                      </div>
                    </div>

                    {/* Card Footer: Institution + "More Detail" button */}
                    <div className="pt-2.5 border-t border-blue-900/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                          <Landmark className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-200 leading-tight break-words">
                          {program.institution || program.provider}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalProgram(program);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 text-[10px] font-bold transition-all shrink-0 flex items-center gap-1 shadow-md hover:shadow-indigo-500/25 cursor-pointer"
                      >
                        <span>More Detail</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Section Title & Subtitle: "All Training Programmes" (Harmonious brand palette) */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-1">
          <h2 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight">
            All Training <span className="text-indigo-600 font-black">Programmes</span>
          </h2>
          {compareList.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Compare ({compareList.length}) Selected</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Showing {filteredPrograms.length} {filteredPrograms.length === 1 ? 'programme' : 'programmes'} across the 70:20:10 framework
        </p>
      </div>

      {/* 4. Filter Control Center (Replaced Executive/Advanced with 70:20:10 pure levels) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Row 1: Search Input + 4 Dropdown Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, skill, provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            {/* 1. All Topics & Skills (Dynamically Mapped from Dataset) */}
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                aria-label="Filter by Topic or Skill"
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-2xs truncate"
              >
                <option value="ALL">All Topics & Skills ({programs.length})</option>
                {dynamicFilterData.categories.length > 0 && (
                  <optgroup label="Categories (Kategori Tersedia)">
                    {dynamicFilterData.categories.map((cat) => {
                      const count = programs.filter((p) => p.category === cat).length;
                      return (
                        <option key={`cat-${cat}`} value={`CAT:${cat}`}>
                          {cat} ({count})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
                {dynamicFilterData.skills.length > 0 && (
                  <optgroup label="Skills (Skill Tersedia)">
                    {dynamicFilterData.skills.map((skill) => {
                      const count = programs.filter((p) => p.skillsTaught.includes(skill)).length;
                      return (
                        <option key={`skl-${skill}`} value={`SKL:${skill}`}>
                          {skill} ({count})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 2. 70:20:10 Framework Filter (Dynamically Mapped from Dataset) */}
            <div className="relative">
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                aria-label="Filter by 70:20:10 Framework"
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-2xs truncate"
              >
                <option value="ALL">All Frameworks (70:20:10)</option>
                {dynamicFilterData.count70 > 0 && (
                  <option value="70_EXPERIENCE">70% Experience ({dynamicFilterData.count70})</option>
                )}
                {dynamicFilterData.count20 > 0 && (
                  <option value="20_EXPOSURE">20% Exposure ({dynamicFilterData.count20})</option>
                )}
                {dynamicFilterData.count10 > 0 && (
                  <option value="10_LEARNING">10% Formal Learning ({dynamicFilterData.count10})</option>
                )}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 3. All Delivery (Dynamically Extracted from Dataset) */}
            <div className="relative">
              <select
                value={selectedDelivery}
                onChange={(e) => setSelectedDelivery(e.target.value)}
                aria-label="Filter by Delivery Mode"
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-2xs truncate"
              >
                <option value="ALL">All Delivery Modes ({dynamicFilterData.deliveryModes.length})</option>
                {dynamicFilterData.deliveryModes.map((mode) => {
                  const count = programs.filter((p) => p.deliveryMode === mode).length;
                  return (
                    <option key={mode} value={mode}>
                      {mode} ({count})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 4. Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort programmes by"
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-2xs truncate"
              >
                <option value="NEAREST_DATE">Sort: Nearest Date</option>
                <option value="MATCH_SCORE">Sort: Highest Match</option>
                <option value="DURATION">Sort: Longest Duration</option>
                <option value="TITLE_ASC">Sort: Title A-Z</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Row 2: Role-Tailored Skill Category Filter Pills (Dynamically computed from dataset) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {availableSkillCategoryTabs.map((tab) => {
              const isSelected = selectedSkillCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedSkillCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0d1e33] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/70'
                  }`}
                >
                  {tab.icon && <span className="text-xs">{tab.icon}</span>}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Clear All CTA on right */}
          {isFiltered && (
            <button
              onClick={handleClearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors self-end sm:self-auto cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}

        </div>

      </div>

      {/* 5. Subheader Bar: Showing Count + Grid/List View Toggles */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-xs sm:text-sm font-semibold text-slate-600">
          Showing <span className="font-bold text-slate-900">{filteredPrograms.length}</span> {filteredPrograms.length === 1 ? 'programme' : 'programmes'}
        </div>

        {/* Grid vs List View Toggle Switch */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg text-slate-700 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'hover:bg-slate-300/60'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-1.5 rounded-lg text-slate-700 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'hover:bg-slate-300/60'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6. Programs Presentation (Grid View or List View) */}
      {filteredPrograms.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No training programmes found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any programmes matching your selected search terms or filters. Try resetting the filters.
            </p>
          </div>
          <button
            onClick={handleClearAllFilters}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredPrograms.map((program) => {
            const isExpanded = Boolean(expandedDescriptions[program.id]);
            const is70 = program.frameworkType === '70_EXPERIENCE';
            const is20 = program.frameworkType === '20_EXPOSURE';
            const isInCompare = compareList.some((p) => p.id === program.id);

            // 70:20:10 Framework Badge for inside the image
            const frameworkBadgeOnImage = is70 ? (
              <span className="text-[9.5px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase border shadow-md bg-amber-500 text-slate-950 border-amber-300 backdrop-blur-md inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                70% Experience
              </span>
            ) : is20 ? (
              <span className="text-[9.5px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase border shadow-md bg-purple-600 text-white border-purple-300 backdrop-blur-md inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-200"></span>
                20% Exposure
              </span>
            ) : (
              <span className="text-[9.5px] font-black px-2.5 py-0.5 rounded-md tracking-wider uppercase border shadow-md bg-sky-600 text-white border-sky-300 backdrop-blur-md inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-200"></span>
                10% Learning
              </span>
            );

            const displayTags = program.tags && program.tags.length > 0
              ? program.tags
              : program.skillsTaught.slice(0, 3);

            return (
              <div
                key={program.id}
                onClick={() => setSelectedDetailProgram(program)}
                className={`group rounded-2xl bg-white border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
                  isInCompare ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-200'
                }`}
              >
                <div>
                  
                  {/* Card Banner Image with Top-Right Compare (+) Button & Bottom 70:20:10 Badge + Match Score */}
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-900 select-none">
                    <img
                      src={program.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                    
                    {/* Multi-Program Comparison (+) Button */}
                    <button
                      onClick={(e) => toggleCompare(program, e)}
                      title={isInCompare ? 'Remove from compare' : 'Add to compare (+)'}
                      className={`absolute top-2.5 right-2.5 px-2 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 transition-all cursor-pointer z-10 text-xs font-black shadow-md ${
                        isInCompare
                          ? 'bg-amber-400 text-slate-950 border border-amber-300 scale-105'
                          : 'bg-black/60 hover:bg-black/80 text-white border border-white/25 hover:scale-105'
                      }`}
                    >
                      {isInCompare ? (
                        <>
                          <span>✓</span>
                          <span className="text-[10px]">Comparing</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Compare</span>
                        </>
                      )}
                    </button>

                    {/* Bottom Row Inside Image: 70:20:10 Framework Badge on Left & Match Score on Right */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <div className="pointer-events-auto">
                        {frameworkBadgeOnImage}
                      </div>
                      <div className="pointer-events-auto px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-emerald-300 text-[10px] font-black">
                        {program.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    
                    {/* Upper Skill / Topic Tags Above Title */}
                    <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
                      {displayTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Program Title */}
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 min-h-[44px] group-hover:text-indigo-900 transition-colors">
                      {program.title}
                    </h3>

                    {/* Description with Read more toggle */}
                    <div>
                      <p className={`text-xs text-slate-600 leading-relaxed font-normal ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {program.description}
                      </p>
                      <button
                        onClick={(e) => toggleDescription(program.id, e)}
                        className="text-[11px] font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-0.5 mt-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Read less' : 'Read more'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                  </div>
                </div>

                <div>
                  {/* 4-Column Metadata Metric Row */}
                  <div className="grid grid-cols-4 border-t border-b border-slate-100 py-2.5 px-2 bg-slate-50/70 divide-x divide-slate-200/80 text-center">
                    
                    {/* Column 1: Start Date */}
                    <div className="px-1 truncate">
                      <div className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-600">
                        START DATE
                      </div>
                      <div className="text-[10.5px] font-extrabold text-slate-900 truncate mt-0.5">
                        {program.startDate || program.schedule.replace(/^(Starts|Cohort Starts)\s+/i, '')}
                      </div>
                    </div>

                    {/* Column 2: Duration */}
                    <div className="px-1 truncate">
                      <div className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-600">
                        DURATION
                      </div>
                      <div className="text-[10.5px] font-extrabold text-slate-900 truncate mt-0.5">
                        {program.duration.split('(')[0].trim()}
                      </div>
                    </div>

                    {/* Column 3: Delivery */}
                    <div className="px-1 truncate">
                      <div className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-600">
                        DELIVERY
                      </div>
                      <div className="text-[10.5px] font-extrabold text-slate-900 truncate mt-0.5" title={program.deliveryMode}>
                        {program.deliveryMode || 'Offline'}
                      </div>
                    </div>

                    {/* Column 4: Fee */}
                    <div className="px-1 truncate">
                      <div className="text-[8.5px] font-extrabold uppercase tracking-wider text-slate-600">
                        FEE
                      </div>
                      <div className="text-[10.5px] font-extrabold text-slate-900 truncate mt-0.5" title={program.fee || program.cost}>
                        {program.fee || program.cost}
                      </div>
                    </div>

                  </div>

                  {/* Card Footer: Institution Logo + Full Name on left, "More Detail" button on right */}
                  <div className="p-3.5 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-900 shrink-0">
                        <Landmark className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className="text-[11px] font-bold text-slate-800 leading-tight truncate"
                        title={program.institution || program.provider}
                      >
                        {program.institution || program.provider}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailProgram(program);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0d1e33] hover:bg-[#162e4c] text-white text-[11px] font-extrabold transition-all flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                    >
                      <span>More Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3.5">
          {filteredPrograms.map((program) => {
            const is70 = program.frameworkType === '70_EXPERIENCE';
            const is20 = program.frameworkType === '20_EXPOSURE';
            const isInCompare = compareList.some((p) => p.id === program.id);

            const frameworkBadgeOnImage = is70 ? (
              <span className="text-[8.5px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase bg-amber-500 text-slate-950">
                70% Exp
              </span>
            ) : is20 ? (
              <span className="text-[8.5px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase bg-purple-600 text-white">
                20% Exp
              </span>
            ) : (
              <span className="text-[8.5px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase bg-sky-600 text-white">
                10% Learn
              </span>
            );

            const displayTags = program.tags && program.tags.length > 0
              ? program.tags
              : program.skillsTaught.slice(0, 3);

            return (
              <div
                key={program.id}
                onClick={() => setSelectedDetailProgram(program)}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer ${
                  isInCompare ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative hidden sm:block">
                    <img
                      src={program.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}
                      alt={program.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-1.5 left-1.5">
                      {frameworkBadgeOnImage}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Skills/Topics above title + Match score + Provider */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {displayTags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {program.matchScore}% Match
                      </span>
                      <span className="text-xs text-slate-500 font-semibold truncate">
                        • {program.institution || program.provider}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      {program.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {program.description}
                    </p>
                  </div>
                </div>

                {/* List Metadata + Action */}
                <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 text-xs font-semibold text-slate-600 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-600">Start Date</div>
                    <div className="text-xs font-extrabold text-slate-900">
                      {program.startDate || program.schedule.replace(/^(Starts|Cohort Starts)\s+/i, '')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-600">Fee</div>
                    <div className="text-xs font-extrabold text-slate-900">
                      {program.fee || program.cost}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleCompare(program, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                        isInCompare
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{isInCompare ? '✓ In Compare' : '+ Compare'}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDetailProgram(program);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0d1e33] hover:bg-[#162e4c] text-white text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>More Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Comparison Dock (When at least 1 program is selected for comparison) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-3xl bg-[#071322]/95 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl p-3 sm:p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Compare Programmes</span>
                <span className="px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  {compareList.length} of 4
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {compareList.map((p) => (
                  <div
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#132845] border border-blue-400/20 text-[10px] text-slate-200 shrink-0"
                  >
                    <span className="max-w-[120px] truncate">{p.title}</span>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="text-slate-400 hover:text-rose-400 ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setCompareList([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Compare Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Program Detail Modal */}
      <ProgramDetailModal
        program={activeModalProgram}
        isOpen={Boolean(activeModalProgram)}
        onClose={() => setActiveModalProgram(null)}
        onAddToJourney={onAddToJourney}
      />

      {/* Side-by-Side Programme Comparison Modal */}
      <ProgrammeComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedPrograms={compareList}
        onRemoveProgram={removeFromCompare}
        onAddProgramToCompare={addProgramToCompare}
        onAddToJourney={onAddToJourney}
        availablePrograms={programs}
      />

    </div>
  );
};
