import React from 'react';
import {
  MapPin,
  Sparkles,
  BookOpen,
  Users,
  Shield,
  Layers,
  User,
} from 'lucide-react';
import { UserRole, NavigationTab } from '../types';

interface NavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  activeRole: UserRole;
  pendingReviewCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  activeRole,
  pendingReviewCount,
}) => {
  const getNavTabs = (): { id: NavigationTab; label: string; icon: any; badge?: string | null }[] => {
    const tabs: { id: NavigationTab; label: string; icon: any; badge?: string | null }[] = [
      { id: 'journey', label: 'My Development', icon: MapPin },
      { id: 'growcard', label: 'My Grow Card', icon: User },
      { id: 'skills', label: 'My Skill', icon: Layers },
      { id: 'coach', label: 'AI Coach', icon: Sparkles, badge: 'AI' },
      { id: 'catalogue', label: 'Development Catalogue', icon: BookOpen, badge: '10' },
    ];

    if (activeRole === 'MANAGER' || activeRole === 'ADMIN') {
      tabs.push({
        id: 'team',
        label: 'Manager Validation Hub',
        icon: Users,
        badge: pendingReviewCount > 0 ? `${pendingReviewCount} Action` : null,
      });
    }

    if (activeRole === 'HRBP' || activeRole === 'HRBU' || activeRole === 'ADMIN') {
      tabs.push({
        id: 'hrbp',
        label: 'HRBP Governance & Gaps',
        icon: Shield,
        badge: null,
      });
    }

    return tabs;
  };

  const tabs = getNavTabs();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-2xs overflow-x-auto">
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex items-center space-x-1.5 sm:space-x-2 py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-900 text-white shadow-sm shadow-indigo-950/20 border border-indigo-800'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/30'
                        : tab.badge === 'AI'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : tab.id === 'team'
                        ? 'bg-orange-100 text-orange-800 font-bold border border-orange-200 animate-pulse'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

