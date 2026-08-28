import React from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Globe,
  Hash,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';

interface MyProfileViewProps {
  currentUser: UserProfile;
}

interface InfoRowProps {
  label: string;
  value?: string | number;
  colSpan?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, colSpan }) => (
  <div className={colSpan ? 'col-span-2' : ''}>
    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">{label}</p>
    <p className="text-sm font-semibold text-slate-800 leading-snug">{value ?? '—'}</p>
  </div>
);

export const MyProfileView: React.FC<MyProfileViewProps> = ({ currentUser }) => {
  return (
    <div className="pb-12 max-w-5xl mx-auto space-y-6">

      {/* ── Profile Header Card ── */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-800 text-white p-6 flex items-center gap-6 shadow-lg">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black tracking-tight leading-tight">{currentUser.name}</h1>
          <p className="text-indigo-200 text-sm font-medium mt-0.5">{currentUser.position}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold">
              <Hash className="w-3 h-3" />
              {currentUser.personnelNumber ?? currentUser.employeeId}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold">
              <Globe className="w-3 h-3" />
              {currentUser.globalId ?? '—'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-bold">
              <MapPin className="w-3 h-3" />
              {currentUser.location}
            </span>
          </div>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs text-indigo-300 font-medium">PS Level</span>
          <span className="text-lg font-black">{currentUser.psLevel ?? currentUser.level}</span>
          <span className="text-xs text-indigo-300 mt-1">{currentUser.yearsOfService ?? currentUser.yearsOfExperience} yrs of service</span>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Personal Information</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-5">
          <InfoRow label="Personnel Number" value={currentUser.personnelNumber ?? currentUser.employeeId} />
          <InfoRow label="Global ID" value={currentUser.globalId} />
          <InfoRow label="Nationality" value={currentUser.nationality} />
          <InfoRow label="Date of Birth" value={currentUser.dateOfBirth} />
          <InfoRow label="Age" value={
            currentUser.dateOfBirth
              ? `${new Date().getFullYear() - new Date(currentUser.dateOfBirth).getFullYear()} yrs`
              : '—'
          } />
          <InfoRow label="Gender" value={currentUser.gender} />
          <InfoRow label="Religion" value={currentUser.religion} />
          <InfoRow label="Cell Phone" value={currentUser.phone} />
          <InfoRow label="Office Email" value={currentUser.email} colSpan />
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
          <InfoRow label="Join Date" value={currentUser.joinDate} />
          <InfoRow label="Yrs of Service" value={
            currentUser.yearsOfService !== undefined
              ? `${currentUser.yearsOfService} years`
              : `${currentUser.yearsOfExperience} years`
          } />
          <InfoRow label="PS Level" value={currentUser.psLevel ?? currentUser.level} />
          <InfoRow label="Org. Unit" value={currentUser.department} />
          <InfoRow label="Position" value={currentUser.position} colSpan />
          <InfoRow label="Direktorat" value={currentUser.direktorat ?? currentUser.division} />
          <InfoRow label="Business Unit" value={currentUser.businessUnit} colSpan />
          <InfoRow label="Business Pillar" value={currentUser.businessPillar} />
          <InfoRow label="Supervisor Name" value={currentUser.managerName} colSpan />
          <InfoRow label="Supervisor Email" value={currentUser.managerEmail} />
          <InfoRow label="HRBP Name" value={currentUser.hrbpName} colSpan />
        </div>
      </div>

      {/* ── Contact & Location ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">Contact & Location</h2>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Cell Phone</p>
              <p className="text-sm font-semibold text-slate-800">{currentUser.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Office Email</p>
              <p className="text-sm font-semibold text-slate-800">{currentUser.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Office Location</p>
              <p className="text-sm font-semibold text-slate-800">{currentUser.location}</p>
            </div>
          </div>
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
                  <th key={h} className="px-4 py-3 text-left text-[10.5px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
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
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{edu.degree}</td>
                    <td className="px-4 py-3.5 text-slate-600">{edu.major ?? '—'}</td>
                    <td className="px-4 py-3.5 text-slate-600">{edu.faculty ?? '—'}</td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{edu.institution}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{edu.year}</td>
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
                  <th key={h} className="px-4 py-3 text-left text-[10.5px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
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
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{cert.name}</td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{cert.issuer}</td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{cert.issueDate}</td>
                      <td className="px-4 py-3.5">
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
