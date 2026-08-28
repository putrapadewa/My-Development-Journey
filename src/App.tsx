import React, { useState } from 'react';
import {
  INITIAL_USER_PROFILE,
  INITIAL_IDP,
  INITIAL_SKILLS,
  INITIAL_CATALOGUE,
  INITIAL_AUDIT_LOGS,
  INITIAL_IDP_HISTORY,
} from './data/mockDatabase';
import {
  UserProfile,
  UserRole,
  NavigationTab,
  IndividualDevelopmentPlan,
  SkillItem,
  CatalogueProgram,
  AuditLogEntry,
  DevelopmentActivity,
} from './types';
import { Navbar } from './components/Navbar';
import { ProfileHeaderCard } from './components/ProfileHeaderCard';
import { EmployeeHome } from './components/Home/EmployeeHome';
import { MyDevelopmentJourney } from './components/IDP/MyDevelopmentJourney';
import { AICoachView } from './components/AICoach/AICoachView';
import { SkillAssessmentHub } from './components/Skills/SkillAssessmentHub';
import { DevelopmentCatalogueView } from './components/Catalogue/DevelopmentCatalogueView';
import { ProgramDetailModal } from './components/Catalogue/ProgramDetailModal';
import { GrowCardProfileHub } from './components/GrowCard/GrowCardProfileHub';
import { ManagerTeamHub } from './components/Manager/ManagerTeamHub';
import { HRBPAdminHub } from './components/HRBP/HRBPAdminHub';
import { AIRecommendationModal } from './components/IDP/AIRecommendationModal';
import { triggerMilestoneCelebration } from './utils/confetti';
import { ProfileSubMenu } from './components/GrowCard/GrowCardProfileHub';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<NavigationTab>('journey');
  const [activeIdp, setActiveIdp] = useState<IndividualDevelopmentPlan>(INITIAL_IDP);
  const [skills, setSkills] = useState<SkillItem[]>(INITIAL_SKILLS);
  const [cataloguePrograms, setCataloguePrograms] = useState<CatalogueProgram[]>(INITIAL_CATALOGUE);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [idpHistory] = useState<IndividualDevelopmentPlan[]>(INITIAL_IDP_HISTORY);
  const [profileSubTab, setProfileSubTab] = useState<ProfileSubMenu>('MY_PROFILE');

  // Global Modal States
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [selectedCatalogueDetail, setSelectedCatalogueDetail] = useState<CatalogueProgram | null>(null);

  // Navigate directly to GrowCard profile sub-tab
  const handleNavigateToProfile = (subTab: ProfileSubMenu = 'MY_PROFILE') => {
    setProfileSubTab(subTab);
    setActiveTab('growcard');
  };

  // Handle Role Switch
  const handleRoleChange = (role: UserRole) => {
    let updatedUser: UserProfile = { ...currentUser, activeRole: role };

    if (role === 'MANAGER') {
      updatedUser = {
        ...updatedUser,
        name: 'Rian Pratama',
        position: 'VP of Technology & Architecture',
        level: 'L6 / Executive',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
      setActiveTab('team');
    } else if (role === 'HRBP' || role === 'ADMIN') {
      updatedUser = {
        ...updatedUser,
        name: 'Diana Putri',
        position: 'Group Head of Talent Management & HRBP',
        level: 'L7 / Director',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      };
      setActiveTab('hrbp');
    } else {
      updatedUser = {
        ...INITIAL_USER_PROFILE,
        activeRole: 'EMPLOYEE',
      };
      setActiveTab('home');
    }

    setCurrentUser(updatedUser);
  };

  // Add audit log helper
  const addAuditLog = (action: any, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      actorName: currentUser.name,
      role: currentUser.activeRole,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add program directly to IDP Journey
  const handleAddProgramToJourney = (program: CatalogueProgram) => {
    const newAct: DevelopmentActivity = {
      id: `act-${Date.now()}`,
      idpId: activeIdp.id,
      goal: `Advance competency in ${program.skillsTaught.join(', ')}`,
      programName: program.title,
      provider: program.provider,
      frameworkType: program.frameworkType,
      timelineStart: '2026-03-01',
      timelineEnd: '2026-06-30',
      status: 'DRAFT',
      measurement: 'Measured via project delivery milestone and capability evaluation',
      skillIds: ['skl-001'],
      skillNames: program.skillsTaught,
      expectedImpact: 'Directly bridges critical skill gap for target role.',
      learningHours: program.learningHours,
      xpValue: program.frameworkType === '70_EXPERIENCE' ? 300 : program.frameworkType === '20_EXPOSURE' ? 180 : 120,
    };

    setActiveIdp((prev) => ({
      ...prev,
      activities: [...prev.activities, newAct],
      updatedAt: new Date().toISOString(),
    }));

    addAuditLog('ACTIVITY_CREATED', `Added program "${program.title}" to IDP.`);
    triggerMilestoneCelebration();
    alert(`"${program.title}" has been added to your 2026 H1 Development Journey!`);
  };

  // Add activity from AI Coach
  const handleAddActivityFromCoach = (activityData: Partial<DevelopmentActivity>) => {
    const newAct: DevelopmentActivity = {
      id: `act-coach-${Date.now()}`,
      idpId: activeIdp.id,
      goal: activityData.goal || 'Executive Leadership & Influence',
      programName: activityData.programName || 'Executive Presentation & Strategic Steering Simulation',
      provider: activityData.provider || 'Internal Executive Mentor',
      frameworkType: activityData.frameworkType || '20_EXPOSURE',
      timelineStart: '2026-03-15',
      timelineEnd: '2026-06-30',
      status: 'DRAFT',
      measurement: activityData.measurement || 'Measured via executive presentation feedback',
      skillIds: ['skl-002'],
      skillNames: ['Executive Boardroom Persuasion & C-Suite Alignment'],
      expectedImpact: 'Strengthens strategic communication for target executive role.',
      learningHours: activityData.learningHours || 10,
      xpValue: activityData.xpValue || 180,
    };

    setActiveIdp((prev) => ({
      ...prev,
      activities: [...prev.activities, newAct],
      updatedAt: new Date().toISOString(),
    }));

    addAuditLog('ACTIVITY_CREATED', `Added AI Coach commitment "${newAct.programName}" to IDP.`);
  };

  // Update IDP
  const handleUpdateIdp = (updated: IndividualDevelopmentPlan) => {
    setActiveIdp(updated);
    addAuditLog('IDP_UPDATED', `IDP status is now "${updated.status}".`);
  };

  // Update Skill
  const handleUpdateSkill = (updatedSkill: SkillItem) => {
    setSkills((prev) => prev.map((s) => (s.id === updatedSkill.id ? updatedSkill : s)));
    addAuditLog('SKILL_ASSESSED', `Skill "${updatedSkill.name}" reassessed to proficiency ${updatedSkill.currentProficiency}.`);
  };

  // HRBP adds new program
  const handleAddNewCatalogueProgram = (newProg: CatalogueProgram) => {
    setCataloguePrograms((prev) => [newProg, ...prev]);
    addAuditLog('ACTIVITY_CREATED', `L&D provisioned new program "${newProg.title}".`);
  };

  // Apply AI Plan from modal
  const handleApplyAIPlan = (newActivities: DevelopmentActivity[], objective: string, businessGoal: string) => {
    setActiveIdp((prev) => ({
      ...prev,
      primaryObjective: objective,
      businessGoalAlignment: businessGoal,
      activities: newActivities,
      status: 'DRAFT',
      updatedAt: new Date().toISOString(),
    }));
    addAuditLog('IDP_UPDATED', `Applied AI 70:20:10 Curation to IDP.`);
    triggerMilestoneCelebration();
    setActiveTab('journey');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased">
      
      {/* 1. Global Navigation Bar (with Title and Home/Bento Dashboard) */}
      <Navbar
        currentUser={currentUser}
        activeRole={currentUser.activeRole}
        activeTab={activeTab}
        onRoleChange={handleRoleChange}
        onNavigate={setActiveTab}
        onOpenAIDevelopmentAdvisor={() => setIsAIAdvisorOpen(true)}
      />

      {/* 2. Top Profile Box (Directly below Navbar) */}
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-5">
        <ProfileHeaderCard
          currentUser={currentUser}
          onNavigateToProfile={handleNavigateToProfile}
        />
      </div>

      {/* 3. Main Body Container */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-6">
        
        {/* EMPLOYEE HOME */}
        {activeTab === 'home' && (
          <EmployeeHome
            currentUser={currentUser}
            activeIdp={activeIdp}
            cataloguePrograms={cataloguePrograms}
            skills={skills}
            onOpenAIDevelopmentAdvisor={() => setIsAIAdvisorOpen(true)}
            onNavigateToJourney={() => setActiveTab('journey')}
            onOpenAICoach={() => setActiveTab('coach')}
            onSelectProgramDetail={(prog) => setSelectedCatalogueDetail(prog)}
            onAddToJourneyFromHome={handleAddProgramToJourney}
            onNavigateToAssessment={() => setActiveTab('skills')}
            onNavigateToProfile={handleNavigateToProfile}
          />
        )}

        {/* MY DEVELOPMENT JOURNEY (IDP) */}
        {activeTab === 'journey' && (
          <MyDevelopmentJourney
            currentUser={currentUser}
            idp={activeIdp}
            onUpdateIdp={handleUpdateIdp}
            onOpenAICoach={() => setActiveTab('coach')}
          />
        )}

        {/* AI COACH & MENTOR */}
        {activeTab === 'coach' && (
          <AICoachView
            currentUser={currentUser}
            activeIdp={activeIdp}
            onAddActivityToIdp={handleAddActivityFromCoach}
          />
        )}

        {/* SKILL ASSESSMENT & MAPPING */}
        {activeTab === 'skills' && (
          <SkillAssessmentHub
            skills={skills}
            onUpdateSkill={handleUpdateSkill}
          />
        )}

        {/* DEVELOPMENT CATALOGUE */}
        {activeTab === 'catalogue' && (
          <DevelopmentCatalogueView
            programs={cataloguePrograms}
            onAddToJourney={handleAddProgramToJourney}
            onOpenAICoach={() => setActiveTab('coach')}
          />
        )}

        {/* GROW CARD & TALENT PROFILE */}
        {activeTab === 'growcard' && (
          <GrowCardProfileHub
            user={currentUser}
            skills={skills}
            idpHistory={idpHistory}
            activeIdp={activeIdp}
            initialSubTab={profileSubTab}
          />
        )}

        {/* MANAGER TEAM VIEW */}
        {activeTab === 'team' && (
          <ManagerTeamHub
            idp={activeIdp}
            onUpdateIdp={handleUpdateIdp}
            currentUser={currentUser}
          />
        )}

        {/* HRBP & ADMIN GOVERNANCE */}
        {activeTab === 'hrbp' && (
          <HRBPAdminHub
            auditLogs={auditLogs}
            cataloguePrograms={cataloguePrograms}
            onAddNewProgram={handleAddNewCatalogueProgram}
          />
        )}

      </main>

      {/* Global AI Advisor Modal */}
      <AIRecommendationModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        currentUser={currentUser}
        onApplyPlan={handleApplyAIPlan}
      />

      {/* Global Catalogue Program Detail Modal */}
      <ProgramDetailModal
        program={selectedCatalogueDetail}
        isOpen={Boolean(selectedCatalogueDetail)}
        onClose={() => setSelectedCatalogueDetail(null)}
        onAddToJourney={handleAddProgramToJourney}
      />

    </div>
  );
}

export default App;
