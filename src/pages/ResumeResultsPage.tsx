import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { AtsAnalysisResult, StoredResume } from '../types';
import { ScoreCircle } from '../components/ScoreCircle';
import { ScoreCard } from '../components/ScoreCard';
import { KeywordBadge } from '../components/KeywordBadge';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  GraduationCap,
  Layers,
  Search,
  Sliders,
  Check,
  Building,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export const ResumeResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<AtsAnalysisResult | null>(null);
  const [resume, setResume] = useState<StoredResume | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ats' | 'skills' | 'experience' | 'education' | 'keywords' | 'recommendations'>('overview');

  useEffect(() => {
    if (id) {
      const foundAnalysis = StorageService.getAnalysisById(id);
      const foundResume = StorageService.getResumeById(id) || (foundAnalysis ? StorageService.getResumeById(foundAnalysis.resumeId) : null);

      if (foundAnalysis) {
        setAnalysis(foundAnalysis);
      }
      if (foundResume) {
        setResume(foundResume);
      }
    }
  }, [id]);

  if (!analysis) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analysis Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          The requested resume analysis could not be located or may have been deleted.
        </p>
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { scoreBreakdown, atsChecks, strengths, weaknesses, missingInformation, keywordAnalysis, improvementSuggestions, parsedProfile } = analysis;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {analysis.resumeName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ATS Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Analyzed on {new Date(analysis.createdAt).toLocaleDateString()} at{' '}
                {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF / Print</span>
            </button>

            <Link
              to={`/job-match?resumeId=${analysis.resumeId}`}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Match With Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ATS Score & Category Breakdown Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Circular Score Indicator */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            <ScoreCircle score={analysis.atsScore} label="ATS COMPATIBILITY" />

            <div className="mt-4 pt-4 border-t border-slate-100 w-full text-xs text-slate-500 leading-relaxed text-center">
              <p className="font-semibold text-slate-800 mb-1">
                {analysis.atsScore >= 80
                  ? 'Strong ATS Compatibility'
                  : analysis.atsScore >= 60
                  ? 'Moderate Compatibility'
                  : 'Needs Formatting Optimization'}
              </p>
              <p className="text-[11px] text-slate-400">
                Scored using industry standard ATS filtering criteria. Avoids subjective grading.
              </p>
            </div>
          </div>

          {/* Transparent Score Breakdown Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <ScoreCard
              title="Formatting"
              score={scoreBreakdown.formatting.score}
              max={scoreBreakdown.formatting.max}
              feedback={scoreBreakdown.formatting.feedback}
            />
            <ScoreCard
              title="Keywords"
              score={scoreBreakdown.keywords.score}
              max={scoreBreakdown.keywords.max}
              feedback={scoreBreakdown.keywords.feedback}
            />
            <ScoreCard
              title="Skills Match"
              score={scoreBreakdown.skills.score}
              max={scoreBreakdown.skills.max}
              feedback={scoreBreakdown.skills.feedback}
            />
            <ScoreCard
              title="Experience"
              score={scoreBreakdown.experience.score}
              max={scoreBreakdown.experience.max}
              feedback={scoreBreakdown.experience.feedback}
            />
            <ScoreCard
              title="Structure"
              score={scoreBreakdown.structure.score}
              max={scoreBreakdown.structure.max}
              feedback={scoreBreakdown.structure.feedback}
            />
            <ScoreCard
              title="Contact Info"
              score={scoreBreakdown.contactInfo.score}
              max={scoreBreakdown.contactInfo.max}
              feedback={scoreBreakdown.contactInfo.feedback}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <div className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-1 text-sm font-semibold">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'ats', label: 'ATS Analysis' },
              { id: 'skills', label: 'Skills & Profile' },
              { id: 'experience', label: 'Work Experience' },
              { id: 'education', label: 'Education' },
              { id: 'keywords', label: 'Keywords' },
              { id: 'recommendations', label: 'Recommendations' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Executive ATS Assessment
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Key Strengths</h4>
                </div>
                <ul className="space-y-2.5">
                  {strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
                <div className="flex items-center space-x-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Main Issues & Friction Points</h4>
                </div>
                <ul className="space-y-2.5">
                  {weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {missingInformation.map((item, idx) => (
                    <li key={`missing-${idx}`} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-600">
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>Missing: {item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Next Step */}
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-indigo-950">Next: Compare with a Job Description</h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Check match percentage against a specific job vacancy and identify required keywords.
                </p>
              </div>
              <Link
                to={`/job-match?resumeId=${analysis.resumeId}`}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 flex-shrink-0"
              >
                <span>Match With Job</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: ATS Analysis Checks */}
        {activeTab === 'ats' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">ATS Compliance Audit</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation across standard sections, single-column parsing, and automated applicant screening rules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atsChecks.map((check, idx) => {
                let badge = (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                  </span>
                );
                let borderClass = 'border-slate-200';

                if (check.status === 'warning') {
                  badge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5" /> WARNING
                    </span>
                  );
                  borderClass = 'border-amber-200 bg-amber-50/20';
                } else if (check.status === 'needs_improvement') {
                  badge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" /> NEEDS IMPROVEMENT
                    </span>
                  );
                  borderClass = 'border-rose-200 bg-rose-50/20';
                }

                return (
                  <div key={idx} className={`p-4 rounded-2xl border ${borderClass} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {check.category}
                      </span>
                      {badge}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{check.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{check.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Skills & Profile */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Parsed Contact Information */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 mb-4">Extracted Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium mb-1">Candidate Name</p>
                  <p className="text-slate-800 font-bold">{parsedProfile.name || 'Not detected'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium mb-1">Email Address</p>
                  <p className="text-slate-800 font-bold truncate">{parsedProfile.email || 'Not detected'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium mb-1">Phone Number</p>
                  <p className="text-slate-800 font-bold">{parsedProfile.phone || 'Not detected'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium mb-1">Location</p>
                  <p className="text-slate-800 font-bold">{parsedProfile.location || 'Detected'}</p>
                </div>
              </div>
            </div>

            {/* Extracted Skills Catalog */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 mb-2">Detected Technical & Soft Skills</h3>
              <p className="text-xs text-slate-500 mb-4">
                These skills were recognized by the parser and are indexed for keyword searches.
              </p>
              <div className="flex flex-wrap gap-2">
                {parsedProfile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Work Experience */}
        {activeTab === 'experience' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Extracted Work Experience</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Roles and accomplishments recognized in your employment history.
              </p>
            </div>

            <div className="space-y-6">
              {parsedProfile.workExperience.map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{exp.role}</h4>
                      <p className="text-xs font-semibold text-indigo-600">{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{exp.duration}</span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {exp.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start space-x-2 text-xs text-slate-600">
                          <span className="text-indigo-500 mt-1">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Education */}
        {activeTab === 'education' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Education & Certifications</h3>
              <p className="text-xs text-slate-500 mt-0.5">Academic background and verified accreditations.</p>
            </div>

            <div className="space-y-4">
              {parsedProfile.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                      <p className="text-xs text-slate-500">{edu.institution}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">{edu.year}</span>
                </div>
              ))}
            </div>

            {parsedProfile.certifications.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {parsedProfile.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Keywords */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 mb-1">Detected Keywords</h3>
              <p className="text-xs text-slate-500 mb-6">
                Industry-relevant terminology extracted from your resume.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2.5">
                    Matched Industry Keywords ({keywordAnalysis.matched.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {keywordAnalysis.matched.map((kw, idx) => (
                      <KeywordBadge key={idx} keyword={kw} type="matched" />
                    ))}
                  </div>
                </div>

                {keywordAnalysis.missing.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2.5">
                      Recommended Industry Additions ({keywordAnalysis.missing.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordAnalysis.missing.map((kw, idx) => (
                        <KeywordBadge
                          key={idx}
                          keyword={kw}
                          type="missing"
                          explanation="Consider adding this skill only if you genuinely have experience with it."
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Density & Keyword Safety: </span>
                  {keywordAnalysis.densityNotes}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Truthful Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Truthful Bullet Point Rewrites</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Suggestions are crafted strictly from existing accomplishments. We never fabricate unearned metrics or fake titles.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 hidden sm:inline-block">
                Zero-Hallucination Policy
              </span>
            </div>

            <div className="space-y-5">
              {improvementSuggestions.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                      {item.section} Section
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Suggestion #{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Current Resume Phrasing
                      </p>
                      <p className="text-slate-600 font-mono italic">{item.currentText}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                        Recommended ATS-Optimized Phrasing
                      </p>
                      <p className="text-emerald-950 font-semibold">{item.suggestedText}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                    <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span><strong>Reasoning:</strong> {item.reasoning}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer footer */}
        <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-500 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            <strong>Disclaimer:</strong> The ATS score is an analytical benchmark to assist candidates in identifying formatting, structure, and keyword compatibility. It is not an absolute guarantee of job interviews or employer acceptance.
          </span>
        </div>
      </div>
    </div>
  );
};
