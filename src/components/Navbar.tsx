import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  ChevronDown,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Layers,
  Compass,
  CheckCircle2,
  AlertCircle,
  Home,
  MapPin,
  BookOpen,
  User,
  Users,
  Shield,
} from 'lucide-react';
import { UserRole, UserProfile, NavigationTab } from '../types';
import mdjLogo from '../assets/images/mdj_logo.png';

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

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  activeTab = 'home',
  onRoleChange,
  onOpenAIDevelopmentAdvisor,
  onNavigate,
  pendingReviewsCount = 0,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string; icon: any; color: string }[] = [
    {
      role: 'EMPLOYEE',
      label: 'Employee Persona',
      desc: 'Own development journey, 70:20:10 IDP, AI Coach, assessments',
      icon: Compass,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      role: 'MANAGER',
      label: 'Manager / Atasan',
      desc: 'Validate IDPs, coach reports, rate demonstrated capabilities',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      role: 'HRBP',
      label: 'HR Business Partner',
      desc: 'Monitor population talent, analyze skill gaps, Grow Card governance',
      icon: Briefcase,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      role: 'ADMIN',
      label: 'System Admin',
      desc: 'Employee master, manager mapping, catalogue config, audit trails',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  // "My Development" group — journey, skills, coach share this top-level tab
  const isInDevGroup = activeTab === 'journey' || activeTab === 'skills' || activeTab === 'coach';

  // 4 primary nav tabs (all roles)
  const mainNavTabs: { id: NavigationTab; label: string; icon: any; badge?: string; groupActive?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journey', label: 'My Development', icon: MapPin, groupActive: isInDevGroup },
    { id: 'growcard', label: 'My Grow Card', icon: User },
    { id: 'catalogue', label: 'Development Catalogue', icon: BookOpen },
  ];

  // Role-specific tabs appended conditionally
  if (activeRole === 'MANAGER' || activeRole === 'ADMIN') {
    mainNavTabs.push({
      id: 'team',
      label: 'Team Validation',
      icon: Users,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : undefined,
    });
  }
  if (activeRole === 'HRBP' || activeRole === 'ADMIN') {
    mainNavTabs.push({ id: 'hrbp', label: 'HRBP', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Left: Logo ── */}
          <div
            className="flex items-center shrink-0 cursor-pointer"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <img
              src={mdjLogo}
              alt="My Development Journey"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* ── Center: Nav Links ── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto no-scrollbar">
            {mainNavTabs.map((tab) => {
              const Icon = tab.icon;
              // "My Development" tab stays highlighted for all sub-tabs (journey/skills/coach)
              const isActive = tab.groupActive !== undefined ? tab.groupActive : activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onNavigate && onNavigate(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30'
                          : tab.id === 'team'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200 animate-pulse'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right: Role Switcher | Bell | Profile ── */}
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
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Role-based access control preview across enterprise personas.
                    </p>
                  </div>
                  <div className="py-2 space-y-1.5">
                    {rolesList.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeRole === item.role;
                      return (
                        <button
                          key={item.role}
                          onClick={() => {
                            onRoleChange(item.role);
                            setShowRoleDropdown(false);
                          }}
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
                        onClick={() => {
                          setShowNotifications(false);
                          if (onNavigate) onNavigate('team');
                        }}
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

            {/* Profile Avatar */}
            <div
              id="nav-profile-pill"
              onClick={() => onNavigate && onNavigate('profile')}
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

      {/* Mobile Nav (md breakpoint and below) */}
      <div className="md:hidden overflow-x-auto border-t border-slate-100 no-scrollbar">
        <div className="flex items-center gap-1 px-3 py-2">
          {mainNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate && onNavigate(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
