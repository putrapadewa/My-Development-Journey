import React, { useState, useRef } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Camera,
  Users2,
} from 'lucide-react';
import { UserProfile } from '../types';

interface MyProfileViewProps {
  currentUser: UserProfile;
  onUpdateAvatar?: (newAvatar: string) => void;
}

interface InfoRowProps {
  label: string;
  value?: string | number;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800 leading-snug">{value ?? '—'}</p>
  </div>
);

export const MyProfileView: React.FC<MyProfileViewProps> = ({ currentUser, onUpdateAvatar }) => {
  const [avatarSrc, setAvatarSrc] = useState(currentUser.avatar);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const age = currentUser.dateOfBirth
    ? new Date().getFullYear() - new Date(currentUser.dateOfBirth).getFullYear()
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = () => {
    if (pendingAvatar) {
      setAvatarSrc(pendingAvatar);
      if (onUpdateAvatar) onUpdateAvatar(pendingAvatar);
      setPendingAvatar(null);
    }
  };

  const handleCancelPhoto = () => {
    setPendingAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="pb-12 space-y-6">

      {/* ── Personal Information ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Personal Information</h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-6 mb-6">
            {/* Photo */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="relative group">
                <img
                  src={pendingAvatar ?? avatarSrc}
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-slate-200 shadow-sm"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {pendingAvatar ? (
                <div className="flex gap-1.5">
                  <button
                    onClick={handleSavePhoto}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelPhoto}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  Change Photo
                </button>
              )}
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
              <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Full Name</p>
                <p className="text-base font-black text-slate-900">{currentUser.name}</p>
              </div>
              <InfoRow label="Date of Birth" value={currentUser.dateOfBirth} />
              <InfoRow label="Age" value={age !== null ? `${age} years old` : undefined} />
              <InfoRow label="Gender" value={currentUser.gender} />
              <InfoRow label="Religion" value={currentUser.religion} />
              <InfoRow label="Cell Phone" value={currentUser.phone} />
              <InfoRow label="Nationality" value={currentUser.nationality} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Employment Information ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Employment Information</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
          <InfoRow label="Personnel Number" value={currentUser.personnelNumber ?? currentUser.employeeId} />
          <InfoRow label="Global ID" value={currentUser.globalId} />
          <InfoRow label="Join Date" value={currentUser.joinDate} />
          <InfoRow label="Years of Service" value={
            currentUser.yearsOfService !== undefined
              ? `${currentUser.yearsOfService} years`
              : `${currentUser.yearsOfExperience} years`
          } />
          <InfoRow label="Position" value={currentUser.position} />
          <InfoRow label="PS Level" value={currentUser.psLevel ?? currentUser.level} />
          <InfoRow label="Org. Unit" value={currentUser.department} />
          <InfoRow label="Direktorat" value={currentUser.direktorat ?? currentUser.division} />
          <InfoRow label="Business Unit" value={currentUser.businessUnit} />
          <InfoRow label="Business Pillar" value={currentUser.businessPillar} />
        </div>
      </div>

      {/* ── Reporting Structure ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Users2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Reporting Structure</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Supervisor */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Direct Supervisor / Atasan</p>
            <InfoRow label="Personnel Number" value={currentUser.managerPersonnelNumber} />
            <InfoRow label="Name" value={currentUser.managerName} />
            <InfoRow label="Office Email" value={currentUser.managerEmail} />
          </div>

          {/* HRBP */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">HR Business Partner (HRBP)</p>
            <InfoRow label="Personnel Number" value={currentUser.hrbpPersonnelNumber} />
            <InfoRow label="Name" value={currentUser.hrbpName} />
            <InfoRow label="Office Email" value={currentUser.hrbpEmail} />
          </div>

        </div>
        <div className="px-6 pb-4">
          <p className="text-[10px] text-slate-400 italic">
            Email auto-filled from HR Directory based on Personnel Number / Name lookup.
          </p>
        </div>
      </div>

      {/* ── Education ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-violet-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Education</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Degree', 'Major', 'Faculty', 'University / Institution', 'Year'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center text-[10.5px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUser.education.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400 text-xs">No education records.</td>
                </tr>
              ) : (
                currentUser.education.map((edu, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-800 whitespace-nowrap">{edu.degree}</td>
                    <td className="px-4 py-3.5 text-center text-slate-600">{edu.major ?? '—'}</td>
                    <td className="px-4 py-3.5 text-center text-slate-600">{edu.faculty ?? '—'}</td>
                    <td className="px-4 py-3.5 text-center text-slate-700 font-medium">{edu.institution}</td>
                    <td className="px-4 py-3.5 text-center text-slate-500 whitespace-nowrap">{edu.year}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Certification ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Certification</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Certification Name', 'Provider / Issuer', 'Valid Period', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-center text-[10.5px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentUser.certifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400 text-xs">No certification records.</td>
                </tr>
              ) : (
                currentUser.certifications.map((cert, i) => {
                  const isLifetime = cert.issueDate?.toLowerCase().includes('lifetime');
                  const endYear = cert.issueDate?.split(' - ')[1];
                  const isExpired = !isLifetime && endYear && parseInt(endYear) < new Date().getFullYear();
                  return (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-800">{cert.name}</td>
                      <td className="px-4 py-3.5 text-center text-slate-600 whitespace-nowrap">{cert.issuer}</td>
                      <td className="px-4 py-3.5 text-center text-slate-500 whitespace-nowrap">{cert.issueDate}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLifetime
                            ? 'bg-violet-100 text-violet-700'
                            : isExpired
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isLifetime ? 'Lifetime' : isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
