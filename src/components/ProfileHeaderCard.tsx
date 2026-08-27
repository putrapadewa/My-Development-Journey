import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileHeaderCardProps {
  currentUser: UserProfile;
  onNavigateToProfile?: (subTab?: 'MY_PROFILE' | 'MY_ASSESSMENT' | 'MY_CAREER' | 'MY_DEV_HISTORY') => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  currentUser,
  onNavigateToProfile,
}) => {
  return (
    <div
      id="employee-profile-header-card"
      onClick={() => onNavigateToProfile && onNavigateToProfile('MY_PROFILE')}
      className="group relative rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-700 select-none"
    >
      {/* Background Ambient Glow & Watermark */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <User className="w-56 h-56 text-indigo-300" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Avatar & Employee Identity (Foto, Nama, Posisi, Business Unit) */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-indigo-900 rounded-full shadow-xs"
              title="Active Status"
            />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight group-hover:text-indigo-100 transition-colors">
              {currentUser.name}
            </h2>

            {/* Posisi */}
            <p className="text-sm sm:text-base font-semibold text-indigo-200 leading-snug">
              {currentUser.position}
            </p>

            {/* Business Unit */}
            <p className="text-sm sm:text-base font-medium text-indigo-300/90 leading-snug">
              {currentUser.businessUnit}
            </p>
          </div>
        </div>

        {/* Right: Direct Navigation CTA Button to Detail Profile */}
        <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-inner transition-all group-hover:bg-white/20 shrink-0 self-end md:self-auto">
          <span className="text-xs font-bold text-white tracking-wide">
            Buka Detail Profil
          </span>
          <ChevronRight className="w-4 h-4 text-indigo-200 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
