import { AtsAnalysisResult, JobMatchResult, StoredResume, UserProfile, ContactMessage, FeedbackSubmission } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'resumeai_current_user',
  ALL_USERS: 'resumeai_users',
  RESUMES: 'resumeai_resumes',
  ANALYSES: 'resumeai_analyses',
  JOB_MATCHES: 'resumeai_job_matches',
  CONTACT_MESSAGES: 'resumeai_contact_messages',
  FEEDBACK: 'resumeai_feedback'
};

export class StorageService {
  // --- USER AUTH & PROFILE ---
  static getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // update in users list too
      const users = this.getAllUsers();
      const idx = users.findIndex(u => u.uid === user.uid);
      if (idx >= 0) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  static getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // --- RESUMES ---
  static getResumes(userId: string): StoredResume[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      const all: StoredResume[] = data ? JSON.parse(data) : [];
      return all.filter(r => r.userId === userId);
    } catch {
      return [];
    }
  }

  static getResumeById(id: string): StoredResume | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      const all: StoredResume[] = data ? JSON.parse(data) : [];
      return all.find(r => r.id === id) || null;
    } catch {
      return null;
    }
  }

  static saveResume(resume: StoredResume): StoredResume {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      const all: StoredResume[] = data ? JSON.parse(data) : [];
      const existingIdx = all.findIndex(r => r.id === resume.id);
      if (existingIdx >= 0) {
        all[existingIdx] = resume;
      } else {
        all.unshift(resume);
      }
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(all));

      // update user count
      const user = this.getCurrentUser();
      if (user && user.uid === resume.userId) {
        user.resumesCount = all.filter(r => r.userId === user.uid).length;
        this.setCurrentUser(user);
      }

      return resume;
    } catch (e) {
      console.error('Error saving resume:', e);
      return resume;
    }
  }

  static deleteResume(id: string, userId: string): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      let all: StoredResume[] = data ? JSON.parse(data) : [];
      all = all.filter(r => !(r.id === id && r.userId === userId));
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(all));

      // delete associated analyses and job matches
      const analysesData = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      if (analysesData) {
        let analyses: AtsAnalysisResult[] = JSON.parse(analysesData);
        analyses = analyses.filter(a => a.resumeId !== id);
        localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
      }

      const matchData = localStorage.getItem(STORAGE_KEYS.JOB_MATCHES);
      if (matchData) {
        let matches: JobMatchResult[] = JSON.parse(matchData);
        matches = matches.filter(m => m.resumeId !== id);
        localStorage.setItem(STORAGE_KEYS.JOB_MATCHES, JSON.stringify(matches));
      }

      return true;
    } catch {
      return false;
    }
  }

  // --- ANALYSES ---
  static getAnalyses(userId: string): AtsAnalysisResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      const all: AtsAnalysisResult[] = data ? JSON.parse(data) : [];
      return all.filter(a => a.userId === userId);
    } catch {
      return [];
    }
  }

  static getAnalysisById(id: string): AtsAnalysisResult | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      const all: AtsAnalysisResult[] = data ? JSON.parse(data) : [];
      return all.find(a => a.id === id || a.resumeId === id) || null;
    } catch {
      return null;
    }
  }

  static saveAnalysis(analysis: AtsAnalysisResult): AtsAnalysisResult {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      const all: AtsAnalysisResult[] = data ? JSON.parse(data) : [];
      const idx = all.findIndex(a => a.id === analysis.id);
      if (idx >= 0) {
        all[idx] = analysis;
      } else {
        all.unshift(analysis);
      }
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(all));

      // update resume latestAtsScore
      const resume = this.getResumeById(analysis.resumeId);
      if (resume) {
        resume.latestAtsScore = analysis.atsScore;
        resume.status = 'analyzed';
        this.saveResume(resume);
      }

      return analysis;
    } catch (e) {
      console.error('Error saving analysis:', e);
      return analysis;
    }
  }

  static deleteAnalysis(id: string, userId: string): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      let all: AtsAnalysisResult[] = data ? JSON.parse(data) : [];
      all = all.filter(a => !(a.id === id && a.userId === userId));
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(all));
      return true;
    } catch {
      return false;
    }
  }

  // --- JOB MATCHES ---
  static getJobMatches(userId: string): JobMatchResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOB_MATCHES);
      const all: JobMatchResult[] = data ? JSON.parse(data) : [];
      return all.filter(m => m.userId === userId);
    } catch {
      return [];
    }
  }

  static getJobMatchById(id: string): JobMatchResult | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOB_MATCHES);
      const all: JobMatchResult[] = data ? JSON.parse(data) : [];
      return all.find(m => m.id === id) || null;
    } catch {
      return null;
    }
  }

  static saveJobMatch(match: JobMatchResult): JobMatchResult {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOB_MATCHES);
      const all: JobMatchResult[] = data ? JSON.parse(data) : [];
      const idx = all.findIndex(m => m.id === match.id);
      if (idx >= 0) {
        all[idx] = match;
      } else {
        all.unshift(match);
      }
      localStorage.setItem(STORAGE_KEYS.JOB_MATCHES, JSON.stringify(all));

      // update resume latestJobMatchScore
      const resume = this.getResumeById(match.resumeId);
      if (resume) {
        resume.latestJobMatchScore = match.matchScore;
        this.saveResume(resume);
      }

      return match;
    } catch (e) {
      console.error('Error saving job match:', e);
      return match;
    }
  }

  static deleteJobMatch(id: string, userId: string): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOB_MATCHES);
      let all: JobMatchResult[] = data ? JSON.parse(data) : [];
      all = all.filter(m => !(m.id === id && m.userId === userId));
      localStorage.setItem(STORAGE_KEYS.JOB_MATCHES, JSON.stringify(all));
      return true;
    } catch {
      return false;
    }
  }

  // --- CONTACT & FEEDBACK ---
  static saveContactMessage(msg: ContactMessage): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES);
      const all: ContactMessage[] = data ? JSON.parse(data) : [];
      all.unshift(msg);
      localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }

  static saveFeedback(feedback: FeedbackSubmission): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      const all: FeedbackSubmission[] = data ? JSON.parse(data) : [];
      all.unshift(feedback);
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }
}
