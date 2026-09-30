export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
  resumesCount: number;
}

export interface WorkExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface ProjectItem {
  title: string;
  tech: string[];
  description: string;
}

export interface ParsedResumeProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  summary: string;
  skills: string[];
  workExperience: WorkExperienceItem[];
  education: EducationItem[];
  certifications: string[];
  projects: ProjectItem[];
  internships: string[];
  achievements: string[];
  detectedSections: string[];
  missingSections: string[];
}

export interface AtsCheck {
  title: string;
  category: 'Formatting' | 'Keywords' | 'Structure' | 'Experience' | 'Contact' | 'Content';
  status: 'pass' | 'warning' | 'needs_improvement';
  detail: string;
}

export interface ImprovementSuggestion {
  section: 'Summary' | 'Skills' | 'Experience' | 'Projects' | 'Education' | 'Formatting' | 'Keywords';
  currentText: string;
  suggestedText: string;
  reasoning: string;
}

export interface AtsAnalysisResult {
  id: string;
  userId: string;
  resumeId: string;
  resumeName: string;
  createdAt: string;
  atsScore: number;
  scoreBreakdown: {
    formatting: { score: number; max: number; feedback: string };
    keywords: { score: number; max: number; feedback: string };
    skills: { score: number; max: number; feedback: string };
    experience: { score: number; max: number; feedback: string };
    structure: { score: number; max: number; feedback: string };
    contactInfo: { score: number; max: number; feedback: string };
    readability: { score: number; max: number; feedback: string };
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingInformation: string[];
  atsChecks: AtsCheck[];
  keywordAnalysis: {
    matched: string[];
    missing: string[];
    partial: string[];
    densityNotes: string;
  };
  improvementSuggestions: ImprovementSuggestion[];
  parsedProfile: ParsedResumeProfile;
  rawText?: string;
}

export interface JobResumeSuggestion {
  section: string;
  currentResumeSnippet: string;
  recommendedRevision: string;
  reason: string;
  keywordsIntegrated?: string[];
}

export interface JobMatchResult {
  id: string;
  userId: string;
  resumeId: string;
  resumeName: string;
  resumeText?: string;
  jobTitle?: string;
  company?: string;
  jobDescription: string;
  matchScore: number;
  categoryMatches: {
    skillsMatch: number;
    keywordMatch: number;
    experienceMatch: number;
    educationMatch: number;
    toolsMatch: number;
    responsibilitiesMatch: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  partialMatches: Array<{
    jobSkill: string;
    resumeSkill: string;
    explanation: string;
  }>;
  matchedKeywords: string[];
  missingKeywords: string[];
  jobRequirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: string;
    educationRequirements: string;
    toolsAndTechnologies: string[];
    softSkills: string[];
    keyResponsibilities: string[];
  };
  tailoringRecommendations: Array<{
    aspect: string;
    advice: string;
    cautionNote?: string;
  }>;
  resumeImprovementSuggestions?: JobResumeSuggestion[];
  createdAt: string;
}

export interface StoredResume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
  rawText: string;
  uploadedAt: string;
  status: 'uploaded' | 'analyzed' | 'failed';
  latestAtsScore?: number;
  latestJobMatchScore?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface FeedbackSubmission {
  id: string;
  rating: number;
  category: 'Resume Analysis' | 'ATS Score' | 'Job Matching' | 'Website' | 'Other';
  message: string;
  userEmail?: string;
  userId?: string;
  createdAt: string;
}
