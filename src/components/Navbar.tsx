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
  Clock,
  Home,
} from 'lucide-react';
import { UserRole, UserProfile, NavigationTab } from '../types';

import { MDJLogo } from './MDJLogo';

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
  onOpenAICoach,
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Gradient Title & Home Button */}
          <div className="flex items-center gap-3 sm:gap-4 select-none">
            <div
              className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center p-0.5 rounded-2xl bg-white border border-slate-100 shadow-xs transition-transform group-hover:scale-105">
                <MDJLogo />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent leading-none">
                My Development Journey
              </h1>
            </div>

            {/* Home / Bento Dashboard button sejajar dengan judul */}
            {onNavigate && (
              <button
                type="button"
                id="nav-home-bento-btn"
                onClick={() => onNavigate('home')}
                title="Bento Dashboard / Home"
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'home'
                    ? 'bg-indigo-900 text-white shadow-xs border-indigo-800'
                    : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 hover:text-slate-950 border-slate-200/80'
                }`}
              >
                <Home className={`w-3.5 h-3.5 ${activeTab === 'home' ? 'text-indigo-200' : 'text-slate-500'}`} />
                <span className="hidden md:inline">Home / Bento Dashboard</span>
                <span className="inline md:hidden">Home</span>
              </button>
            )}
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Quick AI Advisor CTA */}
            {onOpenAIDevelopmentAdvisor && (
              <button
                id="nav-quick-ai-advisor-btn"
                onClick={onOpenAIDevelopmentAdvisor}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 text-xs font-bold border border-indigo-200 shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI 70:20:10 Advisor</span>
              </button>
            )}

            {/* Role Switcher Pill (Bento RBAC Selector) */}
            <div className="relative">
              <button
                id="nav-role-switcher-btn"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <span className="text-slate-400 font-normal uppercase tracking-wider text-[10px]">Role:</span>
                <span className="text-indigo-900 font-bold">{activeRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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

            {/* Notifications */}
            <div className="relative">
              <button
                id="nav-notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-2xl text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
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

            {/* Profile Avatar Bento Pill */}
            <div
              id="nav-profile-pill"
              onClick={() => onNavigate && onNavigate('growcard')}
              className="flex items-center gap-3 bg-white p-1.5 sm:p-2 sm:pr-5 rounded-full border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-indigo-100"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
                <span className="text-[9.5px] uppercase tracking-wider text-slate-400 font-bold">{currentUser.level}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

