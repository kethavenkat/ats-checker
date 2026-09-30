import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { StoredResume, JobMatchResult } from '../types';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_RESUMES, SampleResume } from '../utils/sampleResumes';
import { KeywordBadge } from '../components/KeywordBadge';
import { LoadingState } from '../components/LoadingState';
import {
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  UploadCloud,
  Check,
  Building,
  GraduationCap,
  Clock,
  Info,
  Copy,
  Sliders,
  FileCode,
  X,
  Layers,
  ArrowDown
} from 'lucide-react';

export const JobMatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId');
  const { user } = useAuth();

  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [resumeInputMode, setResumeInputMode] = useState<'upload' | 'paste' | 'saved'>('upload');
  const [selectedResumeId, setSelectedResumeId] = useState<string>(initialResumeId || '');
  const [pastedResumeText, setPastedResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('My_Resume.pdf');
  const [uploadedResumeFile, setUploadedResumeFile] = useState<File | null>(null);

  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const userResumes = StorageService.getResumes(user.uid);
      setResumes(userResumes);
      if (userResumes.length > 0) {
        if (!selectedResumeId) {
          setSelectedResumeId(userResumes[0].id);
        }
        if (initialResumeId) {
          setResumeInputMode('saved');
        }
      }
    }
  }, [user, initialResumeId]);

  const handleSelectSampleJob = (sample: typeof SAMPLE_JOB_DESCRIPTIONS[0]) => {
    setJobTitle(sample.title);
    setCompany(sample.company);
    setJobDescription(sample.text);
    setError(null);
  };

  const handleSelectSampleResume = (sample: SampleResume) => {
    setResumeInputMode('paste');
    setResumeFileName(sample.fileName);
    setPastedResumeText(sample.text);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedResumeFile(file);
      setResumeFileName(file.name);
      setError(null);

      // If text file, read text
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPastedResumeText((ev.target?.result as string) || '');
        };
        reader.readAsText(file);
      }
    }
  };

  const handleAnalyzeMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Resolve Resume Text / File
    let effectiveResumeText = '';
    let effectiveResumeName = resumeFileName;

    if (resumeInputMode === 'saved') {
      const targetResume = resumes.find(r => r.id === selectedResumeId);
      if (!targetResume) {
        setError('Please select an existing resume from your account.');
        return;
      }
      effectiveResumeText = targetResume.rawText;
      effectiveResumeName = targetResume.fileName;
    } else if (resumeInputMode === 'paste') {
      if (!pastedResumeText.trim() || pastedResumeText.trim().length < 60) {
        setError('Please paste your resume text (at least 60 characters).');
        return;
      }
      effectiveResumeText = pastedResumeText.trim();
    } else {
      // Upload mode
      if (!uploadedResumeFile && !pastedResumeText) {
        setError('Please upload your resume file (PDF, DOCX, or TXT) or paste resume text.');
        return;
      }
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 60) {
      setError('Please provide the target job description (at least 60 characters).');
      return;
    }

    setIsAnalyzing(true);

    try {
      let matchData: any = null;

      if (resumeInputMode === 'upload' && uploadedResumeFile) {
        const formData = new FormData();
        formData.append('file', uploadedResumeFile);
        formData.append('resumeName', uploadedResumeFile.name);
        formData.append('jobDescription', jobDescription);
        formData.append('jobTitle', jobTitle);
        formData.append('company', company);
        if (effectiveResumeText) {
          formData.append('resumeText', effectiveResumeText);
        }

        const response = await fetch('/api/job-match/analyze', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: Failed to match resume with job description.`);
        }
        const json = await response.json();
        matchData = json.data;
      } else {
        const response = await fetch('/api/job-match/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: effectiveResumeText,
            resumeName: effectiveResumeName,
            jobDescription,
            jobTitle,
            company
          })
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: Failed to match resume with job description.`);
        }
        const json = await response.json();
        matchData = json.data;
      }

      const matchId = 'match_' + Math.random().toString(36).substring(2, 11);
      const fullRecord: JobMatchResult = {
        id: matchId,
        userId: user?.uid || 'user',
        resumeId: selectedResumeId || matchId,
        resumeName: effectiveResumeName,
        resumeText: effectiveResumeText || matchData.resumeText,
        jobTitle: jobTitle || 'Target Role',
        company: company || 'Target Employer',
        jobDescription,
        matchScore: matchData.matchScore || 80,
        categoryMatches: matchData.categoryMatches || {
          skillsMatch: 82,
          keywordMatch: 78,
          experienceMatch: 85,
          educationMatch: 95,
          toolsMatch: 80,
          responsibilitiesMatch: 82
        },
        matchedSkills: matchData.matchedSkills || [],
        missingSkills: matchData.missingSkills || [],
        partialMatches: matchData.partialMatches || [],
        matchedKeywords: matchData.matchedKeywords || [],
        missingKeywords: matchData.missingKeywords || [],
        jobRequirements: matchData.jobRequirements || {
          requiredSkills: [],
          preferredSkills: [],
          experienceLevel: '3+ years',
          educationRequirements: 'Bachelor Degree',
          toolsAndTechnologies: [],
          softSkills: [],
          keyResponsibilities: []
        },
        tailoringRecommendations: matchData.tailoringRecommendations || [],
        resumeImprovementSuggestions: matchData.resumeImprovementSuggestions || [],
        createdAt: new Date().toISOString()
      };

      StorageService.saveJobMatch(fullRecord);
      setMatchResult(fullRecord);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Something went wrong while matching the job description.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySuggestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Target className="w-3.5 h-3.5" />
            <span>Resume vs Job Description Comparison</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Compare Resume & Job Description
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Provide your resume and a target job description. ATS Checker compares both documents, calculates your compatibility score, and generates actionable suggestions to improve your resume for the job.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAnalyzeMatch} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN: RESUME INPUT */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Resume</h2>
                  </div>

                  {/* Mode switch */}
                  <div className="flex items-center space-x-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setResumeInputMode('upload')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        resumeInputMode === 'upload' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeInputMode('paste')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        resumeInputMode === 'paste' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Paste Text
                    </button>
                    {resumes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setResumeInputMode('saved')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                          resumeInputMode === 'saved' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Saved ({resumes.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Resume Mode 1: Upload File */}
                {resumeInputMode === 'upload' && (
                  <div>
                    {!uploadedResumeFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70 rounded-2xl p-6 text-center cursor-pointer transition-all"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          Click to browse or drop resume
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          PDF, DOCX, DOC, or TXT (Max 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">{uploadedResumeFile.name}</p>
                            <p className="text-[11px] text-slate-500">{(uploadedResumeFile.size / 1024).toFixed(1)} KB • Ready for matching</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedResumeFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                      <span>Or try sample:</span>
                      <div className="flex gap-2">
                        {SAMPLE_RESUMES.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelectSampleResume(s)}
                            className="text-indigo-600 hover:underline font-semibold"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Resume Mode 2: Paste Text */}
                {resumeInputMode === 'paste' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Paste your resume content:</span>
                      <div className="flex gap-1.5">
                        <span className="text-slate-400">Sample:</span>
                        {SAMPLE_RESUMES.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelectSampleResume(s)}
                            className="text-indigo-600 hover:underline font-semibold"
                          >
                            {s.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={8}
                      value={pastedResumeText}
                      onChange={(e) => setPastedResumeText(e.target.value)}
                      placeholder="Paste your resume text here (summary, work experience, skills, education)..."
                      className="w-full p-3.5 text-xs font-mono border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <p className="text-[11px] text-slate-400">
                      {pastedResumeText.trim().split(/\s+/).filter(Boolean).length} words entered
                    </p>
                  </div>
                )}

                {/* Resume Mode 3: Saved Resumes */}
                {resumeInputMode === 'saved' && (
                  <div>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.fileName} (ATS Score: {r.latestAtsScore ? `${r.latestAtsScore}/100` : 'Not tested'})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Selected from your previous uploads
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: JOB DESCRIPTION INPUT */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Job Description</h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sample:</span>
                    {SAMPLE_JOB_DESCRIPTIONS.map((job) => (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => handleSelectSampleJob(job)}
                        className="text-indigo-600 hover:underline font-semibold"
                      >
                        {job.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Job Title (e.g. Senior Software Engineer)"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company Name (optional)"
                    className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <textarea
                  rows={8}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here (requirements, qualifications, responsibilities, tech stack)..."
                  className="w-full p-3.5 text-xs font-mono border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <p className="text-[11px] text-slate-400">
                  {jobDescription.trim().split(/\s+/).filter(Boolean).length} words entered
                </p>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                ⚡ ATS Checker analyzes keyword frequency, requirements parity, and generates truthful resume revisions.
              </p>

              <button
                type="submit"
                disabled={isAnalyzing}
                className={`w-full sm:w-auto py-3.5 px-8 rounded-2xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAnalyzing
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-indigo-200'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>{isAnalyzing ? 'Comparing Documents...' : 'Compare Resume & Job Description'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 max-w-2xl mx-auto">
            <LoadingState
              message="Comparing your resume with the job description..."
              subMessage="Evaluating skill matches, missing keywords, experience alignment, and tailoring suggestions."
            />
          </div>
        )}

        {/* Match Results Display */}
        {matchResult && !isAnalyzing && (
          <div ref={resultsRef} className="space-y-8 animate-in fade-in duration-300 pt-4">
            {/* Header Score Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                {/* Circular indicator */}
                <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="46" stroke="#E2E8F0" strokeWidth="10" fill="none" />
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      stroke={matchResult.matchScore >= 80 ? '#10B981' : matchResult.matchScore >= 60 ? '#F59E0B' : '#EF4444'}
                      strokeWidth="10"
                      strokeDasharray={289}
                      strokeDashoffset={289 * (1 - matchResult.matchScore / 100)}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-black text-slate-900">{matchResult.matchScore}%</span>
                    <span className="text-[10px] block uppercase font-bold text-slate-400">Match</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Job Match Evaluation
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {matchResult.jobTitle} {matchResult.company ? `at ${matchResult.company}` : ''}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Compared against <span className="font-semibold text-slate-800">{matchResult.resumeName}</span>
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="text-center md:text-right">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                  matchResult.matchScore >= 80
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : matchResult.matchScore >= 60
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {matchResult.matchScore >= 80 ? 'High Competency Match' : matchResult.matchScore >= 60 ? 'Moderate Match' : 'Gap Detected'}
                </span>
                <p className="text-xs text-slate-400 mt-2">
                  Follow the suggestions below to increase your interview chances
                </p>
              </div>
            </div>

            {/* 6 Category Breakdown Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-medium">Skills Match</p>
                <p className="text-xl font-black text-slate-900 mt-1">{matchResult.categoryMatches.skillsMatch}%</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-medium">Keywords</p>
                <p className="text-xl font-black text-slate-900 mt-1">{matchResult.categoryMatches.keywordMatch}%</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-medium">Experience</p>
                <p className="text-xl font-black text-slate-900 mt-1">{matchResult.categoryMatches.experienceMatch}%</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-medium">Education</p>
                <p className="text-xl font-black text-slate-900 mt-1">{matchResult.categoryMatches.educationMatch}%</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-medium">Tools & Tech</p>
                <p className="text-xl font-black text-slate-900 mt-1">{matchResult.categoryMatches.toolsMatch}%</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 text-center">
                <p className="text-xs text-slate-400 font-medium">Responsibilities</p>
                <p className="text-xl font-black text-slate-900 mt-1">{matchResult.categoryMatches.responsibilitiesMatch}%</p>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RESUME IMPROVEMENT SUGGESTIONS SECTION (BEFORE vs AFTER) */}
            {/* ============================================================== */}
            <div className="bg-white rounded-3xl border border-indigo-200 shadow-md p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">
                      Suggestions to Improve Your Resume for this Job
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Tailored recommendations that align your genuine accomplishments directly with the employer&apos;s requirements.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
                  Actionable Rewrites
                </span>
              </div>

              {/* Suggestions List */}
              <div className="space-y-6">
                {matchResult.resumeImprovementSuggestions && matchResult.resumeImprovementSuggestions.length > 0 ? (
                  matchResult.resumeImprovementSuggestions.map((sug, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-100 text-indigo-800">
                          {sug.section} Section
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopySuggestion(sug.recommendedRevision, idx)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white px-3 py-1 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Suggested Rewrite</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Before and After Boxes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-white border border-slate-200">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-300" /> Current Phrasing
                          </p>
                          <p className="text-slate-600 italic font-mono leading-relaxed">
                            &quot;{sug.currentResumeSnippet}&quot;
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Recommended Job-Tailored Rewrite
                          </p>
                          <p className="text-emerald-950 font-semibold leading-relaxed">
                            {sug.recommendedRevision}
                          </p>
                        </div>
                      </div>

                      {/* Reason & Keywords Integrated */}
                      <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                        <p className="flex items-start gap-1.5">
                          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Why this works:</strong> {sug.reason}</span>
                        </p>
                        {sug.keywordsIntegrated && sug.keywordsIntegrated.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-slate-500">Keywords added:</span>
                            {sug.keywordsIntegrated.map((kw, kIdx) => (
                              <span key={kIdx} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                                +{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback tailoring suggestions if specific before/after array is empty
                  <div className="space-y-3">
                    {matchResult.tailoringRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 space-y-1">
                        <p className="font-bold text-indigo-900">{rec.aspect}</p>
                        <p className="leading-relaxed">{rec.advice}</p>
                        {rec.cautionNote && (
                          <p className="text-[11px] font-semibold text-rose-600 pt-0.5">
                            {rec.cautionNote}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Keywords Breakdown (Matched, Partial, Missing) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Matched Keywords */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Matched Keywords</h3>
                    <p className="text-[11px] text-slate-400">Present in both resume and job</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {matchResult.matchedKeywords.length === 0 ? (
                    <p className="text-xs text-slate-400">None detected.</p>
                  ) : (
                    matchResult.matchedKeywords.map((kw, idx) => (
                      <KeywordBadge key={idx} keyword={kw} type="matched" />
                    ))
                  )}
                </div>
              </div>

              {/* Partial Matches */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Partially Matched</h3>
                    <p className="text-[11px] text-slate-400">Related skills or variant phrasing</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1">
                  {matchResult.partialMatches.length === 0 ? (
                    <p className="text-xs text-slate-400">No partial matches found.</p>
                  ) : (
                    matchResult.partialMatches.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs">
                        <p className="font-bold text-amber-900">{item.jobSkill}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.explanation}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Missing Keywords</h3>
                    <p className="text-[11px] text-slate-400">Important terms in job posting</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {matchResult.missingKeywords.length === 0 ? (
                    <p className="text-xs text-emerald-600 font-semibold">Zero critical skills missing!</p>
                  ) : (
                    matchResult.missingKeywords.map((kw, idx) => (
                      <KeywordBadge key={idx} keyword={kw} type="missing" />
                    ))
                  )}
                </div>
                <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-[11px] text-rose-800 leading-snug">
                  <strong>Important:</strong> Consider adding these skills only if you genuinely possess real experience with them.
                </div>
              </div>
            </div>

            {/* Extracted Job Requirements Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Extracted Job Requirements</h3>
                <p className="text-xs text-slate-500">Key qualifications parsed from the job description</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Experience Level</p>
                  <p className="text-slate-800 font-semibold">{matchResult.jobRequirements.experienceLevel || 'Not specified'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Education Expectation</p>
                  <p className="text-slate-800 font-semibold">{matchResult.jobRequirements.educationRequirements || 'Practical experience accepted'}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Required Skills Count</p>
                  <p className="text-slate-800 font-semibold">{matchResult.jobRequirements.requiredSkills.length} Core Competencies</p>
                </div>
              </div>

              {/* Responsibilities list */}
              {matchResult.jobRequirements.keyResponsibilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Key Employer Responsibilities
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {matchResult.jobRequirements.keyResponsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
