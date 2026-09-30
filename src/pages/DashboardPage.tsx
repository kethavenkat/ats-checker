import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { StoredResume, AtsAnalysisResult, JobMatchResult } from '../types';
import { SAMPLE_RESUMES } from '../utils/sampleResumes';
import {
  UploadCloud,
  FileText,
  Briefcase,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  BarChart3
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [analyses, setAnalyses] = useState<AtsAnalysisResult[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData(user.uid);
    }
  }, [user]);

  const loadUserData = (uid: string) => {
    const userResumes = StorageService.getResumes(uid);
    const userAnalyses = StorageService.getAnalyses(uid);
    const userMatches = StorageService.getJobMatches(uid);

    // If demo candidate or brand new user, check if we should auto-seed a sample resume so dashboard looks rich
    if (userResumes.length === 0 && uid.includes('demo')) {
      const sample = SAMPLE_RESUMES[0];
      const initialResume: StoredResume = {
        id: 'res_sample_demo_1',
        userId: uid,
        fileName: sample.fileName,
        fileSize: 45200,
        fileType: 'application/pdf',
        rawText: sample.text,
        uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'analyzed',
        latestAtsScore: 84,
        latestJobMatchScore: 88
      };
      StorageService.saveResume(initialResume);

      // Seed sample analysis
      const initialAnalysis: AtsAnalysisResult = {
        id: 'anl_sample_demo_1',
        userId: uid,
        resumeId: initialResume.id,
        resumeName: initialResume.fileName,
        createdAt: initialResume.uploadedAt,
        atsScore: 84,
        scoreBreakdown: {
          formatting: { score: 18, max: 20, feedback: 'Clean standard layout with ATS readable headers and single-column scan flow.' },
          keywords: { score: 17, max: 20, feedback: 'Strong concentration of modern full-stack development keywords.' },
          skills: { score: 18, max: 20, feedback: 'Extensive front-end, back-end, and cloud capabilities explicitly cataloged.' },
          experience: { score: 16, max: 20, feedback: 'Strong quantified results including latency cuts and scale metrics.' },
          structure: { score: 9, max: 10, feedback: 'Clear section hierarchy (Summary, Skills, Experience, Education).' },
          contactInfo: { score: 5, max: 5, feedback: 'Email, phone number, location, and GitHub/LinkedIn detected.' },
          readability: { score: 8, max: 10, feedback: 'Concise bullet points with active action verbs.' }
        },
        summary: 'A highly competitive senior engineering resume with strong technical breadth and verified impact metrics.',
        strengths: [
          'Excellent quantifiable achievements (42% latency reduction, 1.5M DAU, 28% AWS savings)',
          'Clear technical skills taxonomy categorized by domain',
          'Standard ATS-compliant section nomenclature'
        ],
        weaknesses: [
          'Could highlight cross-functional product collaboration in senior roles more prominently'
        ],
        missingInformation: [],
        atsChecks: [
          { title: 'Standard Section Headings', category: 'Structure', status: 'pass', detail: 'Headers match industry standard ATS naming conventions.' },
          { title: 'Contact Information Detected', category: 'Contact', status: 'pass', detail: 'Email, phone, location, and profiles successfully parsed.' },
          { title: 'Quantifiable Metrics Present', category: 'Experience', status: 'pass', detail: 'Found 6 measurable achievements with percentages and scale figures.' },
          { title: 'Single Column Formatting', category: 'Formatting', status: 'pass', detail: 'Avoids complex multi-column tables that confuse legacy ATS parsers.' }
        ],
        keywordAnalysis: {
          matched: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'CI/CD', 'GraphQL'],
          missing: ['Kubernetes Deployment Strategies', 'System Architecture Blueprints'],
          partial: ['Microservices vs Monolith Architecture'],
          densityNotes: 'Keyword density is natural (3.4% frequency) with zero keyword stuffing.'
        },
        improvementSuggestions: [
          {
            section: 'Experience',
            currentText: 'Mentored a cohort of 5 mid-level engineers and increased test coverage.',
            suggestedText: 'Mentored 5 mid-level software engineers on architecture patterns and elevated team unit test coverage from 64% to 91%.',
            reasoning: 'Highlights mentorship leadership impact while staying strictly truthful to documented achievements.'
          }
        ],
        parsedProfile: {
          name: 'Alex Rivera',
          email: 'alex.rivera.dev@gmail.com',
          phone: '(555) 234-5678',
          location: 'San Francisco, CA',
          linkedIn: 'linkedin.com/in/alexrivera-dev',
          gitHub: 'github.com/arivera-code',
          summary: 'Senior Full Stack Engineer with 6+ years of experience designing and shipping scalable cloud microservices.',
          skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker', 'Redis'],
          workExperience: [
            {
              role: 'Senior Software Engineer',
              company: 'CloudScale Systems',
              duration: 'March 2022 – Present',
              description: 'Architected and deployed analytics dashboard using React, TypeScript, and Node.js microservices.',
              highlights: ['Reduced query response times from 850ms to 120ms', 'Cut AWS infrastructure spend by 28%']
            }
          ],
          education: [
            { degree: 'B.S. in Computer Science', institution: 'University of Texas at Austin', year: '2018' }
          ],
          certifications: ['AWS Certified Solutions Architect – Associate'],
          projects: [{ title: 'DevPulse', tech: ['React', 'Go', 'TimescaleDB'], description: 'Open-source developer monitor' }],
          internships: [],
          achievements: ['Decreased p99 query latency by 42%'],
          detectedSections: ['Summary', 'Skills', 'Experience', 'Education', 'Projects', 'Certifications'],
          missingSections: []
        }
      };
      StorageService.saveAnalysis(initialAnalysis);

      setResumes([initialResume]);
      setAnalyses([initialAnalysis]);
      setJobMatches(userMatches);
    } else {
      setResumes(userResumes);
      setAnalyses(userAnalyses);
      setJobMatches(userMatches);
    }

    setIsLoading(false);
  };

  const handleDeleteResume = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this resume and its analysis history?')) {
      StorageService.deleteResume(id, user.uid);
      loadUserData(user.uid);
    }
  };

  // Compute metrics
  const totalAnalyzed = resumes.length;
  const atsScores = resumes
    .map(r => r.latestAtsScore)
    .filter((s): s is number => typeof s === 'number');

  const avgAtsScore = atsScores.length > 0
    ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
    : 0;

  const bestAtsScore = atsScores.length > 0
    ? Math.max(...atsScores)
    : 0;

  const totalJobMatches = jobMatches.length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Applicant Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.displayName || 'Job Seeker'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track ATS compatibility scores, optimize keywords, and match with open roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/resume/upload"
              className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume</span>
            </Link>
            <Link
              to="/job-match"
              className="px-5 py-3 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Match Job</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Resumes Analyzed
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalAnalyzed}</p>
              <p className="text-xs text-slate-500 mt-0.5">Active documents</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Average ATS Score
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">{avgAtsScore}</span>
                <span className="text-xs font-medium text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                {avgAtsScore >= 75 ? 'Above ATS baseline' : 'Optimization suggested'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Best ATS Score
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-900">{bestAtsScore}</span>
                <span className="text-xs font-medium text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Highest screening score</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Job Matches
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalJobMatches}</p>
              <p className="text-xs text-slate-500 mt-0.5">Job postings compared</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-indigo-950/10">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/20">
              Targeted Application
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Applying for a specific vacancy?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Paste the job description against any uploaded resume to discover missing keywords and match percentage before submitting.
            </p>
          </div>
          <Link
            to="/job-match"
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-indigo-900 bg-white hover:bg-slate-100 shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Match Job Description</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Analyses Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Analyses</h3>
              <p className="text-xs text-slate-500">Your uploaded resumes and calculated scores</p>
            </div>
            {resumes.length > 0 && (
              <Link
                to="/resume/upload"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>+ Upload Another</span>
              </Link>
            )}
          </div>

          {resumes.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                You haven&apos;t analyzed a resume yet.
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Upload your resume in PDF, DOCX, or text format to get an instant 0–100 ATS compatibility score and keywords check.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/resume/upload"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Your First Resume</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Table with horizontal scroll */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Resume Name</th>
                    <th className="py-3 px-4">ATS Score</th>
                    <th className="py-3 px-4">Job Match Score</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {resumes.map((resume) => {
                    const score = resume.latestAtsScore ?? 0;
                    let scoreBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (score < 60) scoreBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                    else if (score < 80) scoreBadge = 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <tr
                        key={resume.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/resume/${resume.id}`)}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="truncate max-w-xs">{resume.fileName}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {resume.latestAtsScore ? (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${scoreBadge}`}>
                              {resume.latestAtsScore} / 100
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Processing</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {resume.latestJobMatchScore ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
                              {resume.latestJobMatchScore}% Match
                            </span>
                          ) : (
                            <Link
                              to={`/job-match?resumeId=${resume.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                            >
                              + Match a Job
                            </Link>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/resume/${resume.id}`);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="View Analysis"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteResume(resume.id, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Resume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
