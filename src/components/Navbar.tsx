import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Bell, ChevronDown, UserCheck, Briefcase,
  ShieldCheck, Target, Compass, CheckCircle2, AlertCircle,
  Home, MapPin, BookOpen, User, Users, Shield,
  Layers, ClipboardList, History, TrendingUp, BarChart3,
} from 'lucide-react';
import { UserRole, UserProfile, NavigationTab } from '../types';
import mdjLogo from '../assets/images/mdj_logo.png';

// ── Sub-tab definitions ───────────────────────────────────────────────────────

type SubTabDef = {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  badge?: string;
};

const DEV_SUB_TABS: SubTabDef[] = [
  { id: 'journey',    label: 'My Development Plan', icon: MapPin,       desc: 'IDP & 70:20:10 activities'        },
  { id: 'skills',     label: 'My Skill',            icon: Layers,       desc: 'Skill gap & proficiency tracking'  },
  { id: 'assessment', label: 'My Assessment',       icon: ClipboardList,desc: 'Hogan & Leadership DNA'           },
  { id: 'devhistory', label: 'My Dev History',      icon: History,      desc: 'Activity & program track record'  },
  { id: 'coach',      label: 'My AI Coach',         icon: Sparkles,     desc: 'GROW coaching sessions', badge: 'AI' },
];

const GROWTH_SUB_TABS: SubTabDef[] = [
  { id: 'growcard', label: 'My Grow Card',       icon: TrendingUp, desc: 'Talent profile & readiness card'   },
  { id: 'career',   label: 'My Career Journey',  icon: BarChart3,  desc: 'Career path & aspiration mapping'  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface NavbarProps {
  currentUser: UserProfile;
  activeRole: UserRole;
  activeTab?: NavigationTab;
  onRoleChange: (role: UserRole) => void;
  onOpenAIDevelopmentAdvisor?: () => void;
  onOpenAICoach?: () => void;
  onNavigate?: (tab: NavigationTab) => void;
  pendingReviewsCount?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  activeTab = 'home',
  onRoleChange,
  onNavigate,
  pendingReviewsCount = 0,
}) => {
  const [showRoleDropdown, setShowRoleDropdown]   = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openDropdown, setOpenDropdown]           = useState<'dev' | 'growth' | null>(null);
  const [mobileExpanded, setMobileExpanded]       = useState<'dev' | 'growth' | null>(null);

  const devRef    = useRef<HTMLDivElement>(null);
  const growthRef = useRef<HTMLDivElement>(null);

  // Close nav dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        (!devRef.current    || !devRef.current.contains(t)) &&
        (!growthRef.current || !growthRef.current.contains(t))
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Navigate and close everything
  const navigate = (tab: NavigationTab) => {
    onNavigate?.(tab);
    setOpenDropdown(null);
    setMobileExpanded(null);
  };

  const isInDevGroup    = ['journey','skills','coach','assessment','devhistory'].includes(activeTab);
  const isInGrowthGroup = ['growcard','career'].includes(activeTab);

  const rolesList: { role: UserRole; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { role: 'EMPLOYEE', label: 'Employee Persona',   desc: 'Own development journey, 70:20:10 IDP, AI Coach, assessments', icon: Compass,    color: 'text-indigo-600 bg-indigo-50'  },
    { role: 'MANAGER',  label: 'Manager / Atasan',   desc: 'Validate IDPs, coach reports, rate demonstrated capabilities',  icon: UserCheck,  color: 'text-blue-600 bg-blue-50'      },
    { role: 'HRBP',     label: 'HR Business Partner',desc: 'Monitor population talent, analyze skill gaps, Grow Card governance', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50' },
    { role: 'ADMIN',    label: 'System Admin',        desc: 'Employee master, manager mapping, catalogue config, audit trails',   icon: ShieldCheck,color: 'text-purple-600 bg-purple-50'  },
  ];

  // Shared class helpers
  const navBtn = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
      active
        ? 'bg-indigo-900 text-white shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;
  const navIcon = (active: boolean) =>
    `w-3.5 h-3.5 shrink-0 ${active ? 'text-indigo-200' : 'text-slate-400'}`;
  const chevron = (active: boolean, open: boolean) =>
    `w-3 h-3 ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${active ? 'text-indigo-300' : 'text-slate-400'}`;

  // Dropdown panel renderer (shared by dev & growth)
  const DropdownPanel = ({ items, label }: { items: SubTabDef[]; label: string }) => (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-1.5">
      <div className="px-3 pb-2 mb-0.5 border-b border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      {items.map(sub => {
        const SubIcon = sub.icon;
        const isActive = activeTab === sub.id;
        return (
          <button
            key={sub.id}
            onClick={() => navigate(sub.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer mt-0.5 ${
              isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-100' : 'bg-slate-100'}`}>
              <SubIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold leading-tight ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{sub.label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{sub.desc}</p>
            </div>
            {sub.badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex-shrink-0">
                {sub.badge}
              </span>
            )}
            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <div
            className="flex items-center shrink-0 cursor-pointer"
            onClick={() => navigate('home')}
          >
            <img src={mdjLogo} alt="My Development Journey" className="h-12 w-auto object-contain" />
          </div>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">

            {/* Home */}
            <button id="nav-tab-home" onClick={() => navigate('home')} className={navBtn(activeTab === 'home')}>
              <Home className={navIcon(activeTab === 'home')} />
              <span>Home</span>
            </button>

            {/* My Development — dropdown */}
            <div className="relative" ref={devRef}>
              <button
                id="nav-tab-journey"
                onClick={() => setOpenDropdown(openDropdown === 'dev' ? null : 'dev')}
                className={navBtn(isInDevGroup || openDropdown === 'dev')}
              >
                <MapPin className={navIcon(isInDevGroup || openDropdown === 'dev')} />
                <span>My Development</span>
                <ChevronDown className={chevron(isInDevGroup || openDropdown === 'dev', openDropdown === 'dev')} />
              </button>
              {openDropdown === 'dev' && <DropdownPanel items={DEV_SUB_TABS} label="My Development" />}
            </div>

            {/* My Growth & Career — dropdown */}
            <div className="relative" ref={growthRef}>
              <button
                id="nav-tab-growcard"
                onClick={() => setOpenDropdown(openDropdown === 'growth' ? null : 'growth')}
                className={navBtn(isInGrowthGroup || openDropdown === 'growth')}
              >
                <User className={navIcon(isInGrowthGroup || openDropdown === 'growth')} />
                <span>My Growth & Career</span>
                <ChevronDown className={chevron(isInGrowthGroup || openDropdown === 'growth', openDropdown === 'growth')} />
              </button>
              {openDropdown === 'growth' && <DropdownPanel items={GROWTH_SUB_TABS} label="My Growth & Career" />}
            </div>

            {/* My Goal */}
            <button id="nav-tab-kpi" onClick={() => navigate('kpi')} className={navBtn(activeTab === 'kpi')}>
              <Target className={navIcon(activeTab === 'kpi')} />
              <span>My Goal</span>
            </button>

            {/* Development Catalogue */}
            <button id="nav-tab-catalogue" onClick={() => navigate('catalogue')} className={navBtn(activeTab === 'catalogue')}>
              <BookOpen className={navIcon(activeTab === 'catalogue')} />
              <span>Development Catalogue</span>
            </button>

            {/* Team Validation (Manager / Admin) */}
            {(activeRole === 'MANAGER' || activeRole === 'ADMIN') && (
              <button id="nav-tab-team" onClick={() => navigate('team')} className={navBtn(activeTab === 'team')}>
                <Users className={navIcon(activeTab === 'team')} />
                <span>Team Validation</span>
                {pendingReviewsCount > 0 && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'team'
                      ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30'
                      : 'bg-orange-100 text-orange-800 border border-orange-200 animate-pulse'
                  }`}>
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            )}

            {/* HRBP */}
            {(activeRole === 'HRBP' || activeRole === 'ADMIN') && (
              <button id="nav-tab-hrbp" onClick={() => navigate('hrbp')} className={navBtn(activeTab === 'hrbp')}>
                <Shield className={navIcon(activeTab === 'hrbp')} />
                <span>HRBP</span>
              </button>
            )}

          </nav>

          {/* ── Right: Role Switcher · Bell · Profile ── */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Role Switcher */}
            <div className="relative">
              <button
                id="nav-role-switcher-btn"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 shadow-sm transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                <span className="hidden sm:inline text-slate-400 font-normal uppercase tracking-wider text-[10px]">Role:</span>
                <span className="text-indigo-800 font-bold">{activeRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Switch Persona</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Role-based access control preview across enterprise personas.</p>
                  </div>
                  <div className="py-2 space-y-1.5">
                    {rolesList.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeRole === item.role;
                      return (
                        <button
                          key={item.role}
                          onClick={() => { onRoleChange(item.role); setShowRoleDropdown(false); }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                            isSelected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${item.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{item.label}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                            </div>
                            <p className="text-[10.5px] text-slate-500 line-clamp-2 mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="nav-notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {pendingReviewsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Notifications</span>
                    <span className="text-[10px] text-indigo-600 font-bold cursor-pointer">Mark read</span>
                  </div>
                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {activeRole === 'MANAGER' && pendingReviewsCount > 0 && (
                      <div
                        onClick={() => { setShowNotifications(false); navigate('team'); }}
                        className="p-3 rounded-2xl bg-orange-50 border border-orange-200 cursor-pointer hover:bg-orange-100/70 transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">Pending IDP Review</p>
                            <p className="text-[11px] text-slate-600">
                              Anindya Kirana submitted 2026 H1 IDP for your review and approval.
                            </p>
                            <span className="text-[10px] text-orange-700 font-bold mt-1 inline-block">
                              Action Required &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Capability Validated</p>
                          <p className="text-[11px] text-slate-600">
                            Manager marked "Agentic AI Architecture" as EXCEEDED (+250 XP).
                          </p>
                          <span className="text-[10px] text-slate-400">2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile pill */}
            <div
              id="nav-profile-pill"
              onClick={() => navigate('profile')}
              className="flex items-center gap-2 bg-white p-1.5 pr-3 rounded-full border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                <span className="text-[9.5px] uppercase tracking-wider text-slate-400 font-bold">{currentUser.level}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <div className="md:hidden border-t border-slate-100">
        {/* Primary mobile tabs */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 px-3 py-2">

            {/* Home */}
            <button
              onClick={() => navigate('home')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'home' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className={`w-3 h-3 ${activeTab === 'home' ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>Home</span>
            </button>

            {/* My Development toggle */}
            <button
              onClick={() => setMobileExpanded(mobileExpanded === 'dev' ? null : 'dev')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isInDevGroup || mobileExpanded === 'dev' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin className={`w-3 h-3 ${isInDevGroup || mobileExpanded === 'dev' ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>My Development</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobileExpanded === 'dev' ? 'rotate-180' : ''} ${isInDevGroup || mobileExpanded === 'dev' ? 'text-indigo-300' : 'text-slate-300'}`} />
            </button>

            {/* My Growth & Career toggle */}
            <button
              onClick={() => setMobileExpanded(mobileExpanded === 'growth' ? null : 'growth')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isInGrowthGroup || mobileExpanded === 'growth' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className={`w-3 h-3 ${isInGrowthGroup || mobileExpanded === 'growth' ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>Growth & Career</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${mobileExpanded === 'growth' ? 'rotate-180' : ''} ${isInGrowthGroup || mobileExpanded === 'growth' ? 'text-indigo-300' : 'text-slate-300'}`} />
            </button>

            {/* My Goal */}
            <button
              onClick={() => navigate('kpi')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'kpi' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Target className={`w-3 h-3 ${activeTab === 'kpi' ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>My Goal</span>
            </button>

            {/* Catalogue */}
            <button
              onClick={() => navigate('catalogue')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'catalogue' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className={`w-3 h-3 ${activeTab === 'catalogue' ? 'text-indigo-200' : 'text-slate-400'}`} />
              <span>Catalogue</span>
            </button>

            {/* Team (Manager/Admin) */}
            {(activeRole === 'MANAGER' || activeRole === 'ADMIN') && (
              <button
                onClick={() => navigate('team')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'team' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className={`w-3 h-3 ${activeTab === 'team' ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span>Team</span>
                {pendingReviewsCount > 0 && (
                  <span className="text-[9px] font-bold px-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 animate-pulse">
                    {pendingReviewsCount}
                  </span>
                )}
              </button>
            )}

            {/* HRBP */}
            {(activeRole === 'HRBP' || activeRole === 'ADMIN') && (
              <button
                onClick={() => navigate('hrbp')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'hrbp' ? 'bg-indigo-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Shield className={`w-3 h-3 ${activeTab === 'hrbp' ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span>HRBP</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile expanded sub-items row */}
        {mobileExpanded && (
          <div className="overflow-x-auto no-scrollbar border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-1 px-3 py-2">
              {(mobileExpanded === 'dev' ? DEV_SUB_TABS : GROWTH_SUB_TABS).map(sub => {
                const SubIcon = sub.icon;
                const isActive = activeTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'text-slate-600 hover:bg-white border border-transparent'
                    }`}
                  >
                    <SubIcon className={`w-3 h-3 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <span>{sub.label}</span>
                    {sub.badge && (
                      <span className="text-[9px] font-bold px-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {sub.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </header>
  );
};
