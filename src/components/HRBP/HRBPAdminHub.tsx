import React, { useState } from 'react';
import {
  Shield,
  BarChart3,
  Users,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Plus,
  Clock,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { AuditLogEntry, CatalogueProgram } from '../../types';

interface HRBPAdminHubProps {
  auditLogs: AuditLogEntry[];
  cataloguePrograms: CatalogueProgram[];
  onAddNewProgram: (newProg: CatalogueProgram) => void;
}

export const HRBPAdminHub: React.FC<HRBPAdminHubProps> = ({
  auditLogs,
  cataloguePrograms,
  onAddNewProgram,
}) => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'GAPS' | 'CATALOGUE' | 'AUDIT'>('METRICS');
  const [isAddProgramModalOpen, setIsAddProgramModalOpen] = useState(false);

  // New program state
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('Group L&D Academy');
  const [newFramework, setNewFramework] = useState<'70_EXPERIENCE' | '20_EXPOSURE' | '10_LEARNING'>('10_LEARNING');
  const [newHours, setNewHours] = useState(16);

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: CatalogueProgram = {
      id: `prog-${Date.now()}`,
      title: newTitle,
      category: 'Cloud & Architecture',
      frameworkType: newFramework,
      provider: newProvider,
      duration: '4 Weeks',
      learningHours: Number(newHours),
      schedule: 'Q2 2026 Batch',
      cost: 'Corporate Sponsored',
      description: 'Enterprise curated capability program with structured evaluation.',
      skillsTaught: ['Strategic Architecture & Systems Thinking'],
      targetAudience: 'Senior Engineers & Architects',
      syllabusHighlights: ['Foundational theory', 'Action project delivery', 'Capstone presentation'],
      matchScore: 90,
      active: true,
    };

    onAddNewProgram(created);
    setIsAddProgramModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header Banner (Bento Hero) */}
      <div className="rounded-3xl bg-indigo-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                HRBP & L&D Executive Governance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Talent & Skill Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              Track 70:20:10 organizational balance, aggregate skill supply/demand gaps, and ensure compliance across business units.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddProgramModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-indigo-950 hover:bg-slate-100 text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-900" />
              <span>Provision New L&D Program</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs (Bento Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'METRICS', label: 'Group 70:20:10 Health & IDP Adoption' },
          { id: 'GAPS', label: 'BU Skill Gap Heatmap' },
          { id: 'CATALOGUE', label: `L&D Provider Management (${cataloguePrograms.length})` },
          { id: 'AUDIT', label: `Governance & Audit Logs (${auditLogs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'METRICS' && (
        <div className="space-y-6">
          {/* Top KPIs Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise IDP Adoption</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-900">92.4%</span>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">+4.2% YoY</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">2,410 of 2,608 employees active</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">70:20:10 Ratio Health</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-900">68 : 22 : 10</span>
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Optimal</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Target: High Experience Ratio</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manager Validation Rate</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-700">88.7%</span>
                <span className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">High Governance</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Evidence verified by direct managers</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Learning Hours Logged</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-700">48,290 hrs</span>
                <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">2026 YTD</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Avg 18.5 hrs per professional</p>
            </div>
          </div>

          {/* BU Breakdown Table Bento Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Business Unit IDP Submission & Validation Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 font-bold rounded-l-xl">Business Unit</th>
                    <th className="py-3.5 px-4 font-bold">Headcount</th>
                    <th className="py-3.5 px-4 font-bold">IDP Submitted</th>
                    <th className="py-3.5 px-4 font-bold">Manager Approved</th>
                    <th className="py-3.5 px-4 font-bold">70:20:10 Balance</th>
                    <th className="py-3.5 px-4 text-right font-bold rounded-r-xl">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { bu: 'Group Technology & Digital', count: 640, sub: '98%', app: '94%', ratio: '71:19:10', score: '96/100' },
                    { bu: 'Corporate Strategy & Transformation', count: 180, sub: '95%', app: '91%', ratio: '66:24:10', score: '93/100' },
                    { bu: 'Retail & Commercial Banking Tech', count: 820, sub: '91%', app: '86%', ratio: '64:25:11', score: '89/100' },
                    { bu: 'Risk, Audit & Cybersecurity', count: 320, sub: '94%', app: '90%', ratio: '69:21:10', score: '94/100' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.bu}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{row.count}</td>
                      <td className="py-3.5 px-4 text-slate-800 font-bold">{row.sub}</td>
                      <td className="py-3.5 px-4 text-emerald-700 font-bold">{row.app}</td>
                      <td className="py-3.5 px-4 text-indigo-900 font-bold">{row.ratio}</td>
                      <td className="py-3.5 px-4 text-right font-black text-indigo-700">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BU Gaps Tab */}
      {activeTab === 'GAPS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Critical Competency Gap Heatmap</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { skill: 'Strategic Architecture & Systems Thinking', gapCount: 142, severity: 'HIGH', priorityBU: 'Group Technology' },
              { skill: 'Executive Communication & Boardroom Influence', gapCount: 198, severity: 'HIGH', priorityBU: 'All BUs (L4-L6)' },
              { skill: 'Enterprise Generative AI & Agentic Governance', gapCount: 220, severity: 'CRITICAL', priorityBU: 'Group Technology & Risk' },
              { skill: 'FinOps Cloud Economics & Unit Costing', gapCount: 88, severity: 'MEDIUM', priorityBU: 'Cloud Engineering' },
            ].map((g, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{g.skill}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                    g.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {g.severity}
                  </span>
                </div>
                <p className="text-slate-600 font-medium"><strong>Employees with Active Gap:</strong> {g.gapCount} professionals</p>
                <p className="text-indigo-900 text-[11px] font-semibold">Primary Target BU: {g.priorityBU}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catalogue Management Tab */}
      {activeTab === 'CATALOGUE' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active L&D Catalogue Master Provisioning</h3>
            <button
              onClick={() => setIsAddProgramModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-indigo-900 text-white text-xs font-bold cursor-pointer hover:bg-indigo-800 transition-colors shadow-xs"
            >
              + Add Program
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold rounded-l-xl">Program Title</th>
                  <th className="py-3.5 px-4 font-bold">Framework</th>
                  <th className="py-3.5 px-4 font-bold">Provider</th>
                  <th className="py-3.5 px-4 font-bold">Hours</th>
                  <th className="py-3.5 px-4 font-bold">Cost</th>
                  <th className="py-3.5 px-4 text-right font-bold rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cataloguePrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{p.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {p.frameworkType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{p.provider}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-bold">{p.learningHours} hrs</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold">{p.cost}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10.5px] border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Enterprise Governance & Audit Trail</h3>
          <div className="space-y-2 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10.5px] text-slate-500 font-medium">Actor: {log.actorName} ({log.role})</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 font-medium">{log.details}</p>
                </div>
                <span className="text-[10.5px] text-slate-400 font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Adding New Program */}
      {isAddProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-md w-full p-6 sm:p-7 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Provision New L&D Opportunity</h3>
            
            <form onSubmit={handleCreateProgram} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Microservices Fault Tolerance Lab"
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">70:20:10 Framework</label>
                <select
                  value={newFramework}
                  onChange={(e) => setNewFramework(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="70_EXPERIENCE">70% Experience (Action Project)</option>
                  <option value="20_EXPOSURE">20% Exposure (Mentoring/Shadowing)</option>
                  <option value="10_LEARNING">10% Formal Learning & Lab</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Provider</label>
                <input
                  type="text"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Learning Hours</label>
                <input
                  type="number"
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs focus:ring-1 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddProgramModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-2xl text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-2xl shadow-xs transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
