export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HRBP' | 'HRBU' | 'ADMIN';

export type SkillCategory = 'ROLE_REQUIRED' | 'FUTURE_SKILL' | 'OTHER_SKILL' | 'ASPIRATION_SKILL';

export type ActivityFramework = '70_EXPERIENCE' | '20_EXPOSURE' | '10_LEARNING';

export type IDPStatus =
  | 'DRAFT'
  | 'WAITING_FOR_APPROVAL'
  | 'APPROVED'
  | 'REQUEST_REVISION'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VALIDATED'
  | 'CANCELLED';

export type CapabilityRating =
  | 'NOT_YET_DEMONSTRATED'
  | 'DEVELOPING'
  | 'DEMONSTRATED'
  | 'EXCEEDED';

export interface EducationRecord {
  degree: string;
  major?: string;
  faculty?: string;
  institution: string;
  year: string;
}

export interface CertificationRecord {
  name: string;
  issuer: string;
  issueDate: string;
}

export interface CareerRecord {
  position: string;
  businessUnit: string;
  company?: string;
  period: string;
  keyAchievement: string;
}

export interface CareerPathEntry {
  position: string;
  businessUnit: string;
  readinessScore: number; // 0–100
  targetYear?: string;
}

export interface SuccessorEntry {
  position: string;
  businessUnit: string;
  readinessScore: number; // 0–100
}

export interface TalentCommitteeRecord {
  cycle: string;
  calibratedAssessment: string;
  readinessRating: string;
  notes: string;
}

export interface KPIRecord {
  year: string;
  kpiScore: number;    // 0–100
  patScore?: number;   // Performance Appraisal Target, 0–100
  rating: string;      // e.g. "Sangat Baik", "Outstanding"
  notes?: string;
}

export interface SuccessorRecord {
  positionName: string;
  businessUnit: string;
  category?: string;        // "Within" | "Across" | "External"
  incumbentName: string;
  incumbentPS?: string;
  successorName: string;
  successorPS?: string;
  readinessScore: number;   // 0–100
  readinessLabel?: string;
  status?: string;
  hasGrowCard?: boolean;
  notes?: string;
}

export interface CareerChatSection {
  title: string;
  content: string;
}

export interface CareerChatInsight {
  source?: string;
  generatedDate: string;
  chatDate: string;
  chatCount?: number;
  aiSummary: {
    strengths: string[];
    opportunities: string[];
    aspirations: string[];
    recommendedInterventions: string[];
  };
  sections: CareerChatSection[];
  developmentPlanIndividual?: string[];
  developmentPlanTeam?: string[];
  willingnessToMentor?: string;
  additionalNotes?: string;
}

export interface UserProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar: string;
  position: string;
  level: string; // e.g. "Principal / Lead (L5)"
  businessUnit: string;
  division: string;
  department: string;
  roles: UserRole[];
  activeRole: UserRole;
  managerId: string;
  managerName: string;
  managerEmail?: string;
  hrbpId: string;
  hrbpName: string;
  joinDate: string;
  phone: string;
  location: string;
  education: EducationRecord[];
  certifications: CertificationRecord[];
  careerHistory: CareerRecord[];
  talentCommitteeResults: TalentCommitteeRecord[];
  yearsOfExperience: number;
  // Career journey fields
  careerPaths?: CareerPathEntry[];
  isSuccessor?: boolean;
  successorFor?: SuccessorEntry[];
  performanceRating?: 1 | 2 | 3 | 4;
  potentialRating?: 1 | 2 | 3;
  kpiHistory?: KPIRecord[];
  successorRecords?: SuccessorRecord[];
  careerChatInsight?: CareerChatInsight;
  // Extended profile fields
  personnelNumber?: string;
  globalId?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  religion?: string;
  direktorat?: string;
  businessPillar?: string;
  psLevel?: string;
  yearsOfService?: number;
  managerPersonnelNumber?: string;
  hrbpPersonnelNumber?: string;
  hrbpEmail?: string;
}

export interface SkillItem {
  id: string;
  code: string;
  name: string;
  category: SkillCategory;
  definition: string;
  proficiencyScaleDescription: {
    1: string; // Novice
    2: string; // Emerging
    3: string; // Intermediate
    4: string; // Advanced
    5: string; // Expert
  };
  benchmarkSource: string; // e.g. "SKKNI / TOGAF / McKinsey Digital Taxonomy"
  version: string;
  effectiveDate: string;
  currentProficiency: number; // 1.0 - 5.0
  requiredProficiency: number; // 1.0 - 5.0
  confidencePercentage: number; // e.g. 82%
  gap: number; // calculated: required - current
  assessmentMethod: string;
  evidenceCount: number;
  xpEarned: number;
  history: {
    date: string;
    level: number;
    intervention: string;
    verifiedBy?: string;
  }[];
}

export interface DevelopmentActivity {
  id: string;
  idpId: string;
  goal: string; // Capability or outcome to develop
  programName: string; // Specific learning, project, exposure
  provider: string; // Internal / External provider / BU
  frameworkType: ActivityFramework; // 70:20:10
  timelineStart: string;
  timelineEnd: string;
  status: IDPStatus;
  measurement: string; // How success will be measured
  evidenceText?: string;
  evidenceLink?: string;
  evidenceAttachment?: string;
  reflectionText?: string;
  skillIds: string[];
  skillNames: string[];
  expectedImpact: string;
  actualImpact?: string;
  learningHours: number;
  xpValue: number;
  managerValidationRating?: CapabilityRating;
  managerFeedback?: string;
  completedDate?: string;
}

export interface IndividualDevelopmentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // e.g. "2026 H1 - Strategic Capability Journey"
  status: IDPStatus;
  primaryObjective: string;
  businessGoalAlignment: string;
  activities: DevelopmentActivity[];
  submittedAt?: string;
  approvedAt?: string;
  approverId?: string;
  approverName?: string;
  managerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueProgram {
  id: string;
  title: string;
  category: string;
  frameworkType: ActivityFramework;
  provider: string;
  duration: string;
  learningHours: number;
  schedule: string;
  capacity?: string;
  cost: string;
  fee?: string;
  targetAudience: string;
  matchScore: number; // 0 - 100%
  skillsTaught: string[];
  description: string;
  syllabusHighlights: string[];
  isFeaturedRunningCard?: boolean;
  active?: boolean;
  image?: string;
  levelBadge?: string;
  startDate?: string;
  deliveryMode?: string;
  institution?: string;
  institutionLogo?: string;
  tags?: string[];
  targetSkillName?: string;
  proficiencyGain?: number;
  competencyBadges?: { name: string; icon?: string; color?: string }[];
  location?: string;
  learningObjectives?: string[];
  curriculumModules?: { moduleNumber: string; title: string; description: string }[];
  highlightsAndOutcomes?: string[];
}

export interface CareerProfile {
  currentRole: string;
  aspiration: string;
  nextPosition: string;
  targetBusinessUnit: string;
  careerReadinessScore: number;
  criticalSkillGaps: string[];
  talentCommitteeRating: string;
}

export interface GrowCardData {
  employeeId: string;
  employeeName: string;
  position: string;
  businessUnit: string;
  aspiration: string;
  readinessPercentage: number;
  strengths: string[];
  developmentGaps: string[];
  prioritySkills: { name: string; current: number; target: number }[];
  activeDevelopmentCount: number;
  verifiedImpactScore: number;
  lastUpdated: string;
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  growStage?: 'G' | 'R' | 'O' | 'W';
}

export interface AICoachSession {
  id: string;
  employeeId: string;
  mode: 'COACH' | 'MENTOR';
  topic: string;
  goal: string;
  messages: AICoachMessage[];
  keyReflections?: string[];
  actionCommitments?: string[];
  suggestedActivity?: Partial<DevelopmentActivity>;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  role: string;
  action: string;
  details: string;
}

export type NavigationTab =
  | 'home'
  | 'journey'
  | 'coach'
  | 'skills'
  | 'assessment'
  | 'devhistory'
  | 'catalogue'
  | 'growcard'
  | 'career'
  | 'kpi'
  | 'team'
  | 'hrbp'
  | 'profile';
