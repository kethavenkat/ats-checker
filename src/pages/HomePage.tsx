import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Sliders,
  Award,
  Layers,
  BarChart3
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    if (user) {
      navigate('/resume/upload');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="bg-white">
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-indigo-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200/60 text-indigo-700 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen ATS Parser & Job Match Engine</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Build a Resume That{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Gets Noticed
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Analyze your resume with AI, check your ATS score, and match your resume with job descriptions to improve your chances of getting shortlisted.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200/70 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Analyze My Resume</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors text-center"
                >
                  How It Works
                </a>

                {!user && (
                  <button
                    type="button"
                    onClick={() => {
                      loginDemo();
                      navigate('/dashboard');
                    }}
                    className="w-full sm:w-auto px-5 py-4 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/70 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Try Live Demo
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 pt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free instant ATS scoring
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF, DOCX, TXT support
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Privacy guaranteed
                </span>
              </div>
            </div>

            {/* Right Column Visual Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 backdrop-blur-md">
                {/* Mock Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Alex_Rivera_Resume.pdf</p>
                      <p className="text-xs text-slate-400">ATS Parsing Engine v2.5</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ATS Pass
                  </span>
                </div>

                {/* Score Graphic */}
                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mb-5">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      ATS Score
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">84</span>
                      <span className="text-sm font-medium text-slate-500">/ 100</span>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> High Interview Potential
                    </span>
                  </div>

                  <div className="w-16 h-16 relative flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#E2E8F0" strokeWidth="6" fill="none" />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#10B981"
                        strokeWidth="6"
                        strokeDasharray={163.3}
                        strokeDashoffset={163.3 * (1 - 0.84)}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold text-slate-800">84%</span>
                  </div>
                </div>

                {/* Breakdown Mini List */}
                <div className="space-y-2.5 mb-5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                    <span className="font-medium text-slate-700">Formatting & Structure</span>
                    <span className="font-bold text-emerald-600">18 / 20</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                    <span className="font-medium text-slate-700">Keyword Density</span>
                    <span className="font-bold text-emerald-600">17 / 20</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                    <span className="font-medium text-slate-700">Quantifiable Metrics</span>
                    <span className="font-bold text-amber-600">14 / 20</span>
                  </div>
                </div>

                {/* Keyword Pills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Extracted Core Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ React 18
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ TypeScript
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Cloud Microservices
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      ⚠ Docker Containerization
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Badge */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Job Description Match</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">92% Alignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- STATISTICS SECTION ----------------- */}
      <section className="py-12 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mb-1">
                AI-Powered
              </p>
              <p className="text-sm text-slate-300 font-medium">Resume Analysis</p>
            </div>
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">
                Precision
              </p>
              <p className="text-sm text-slate-300 font-medium">Keyword Matching</p>
            </div>
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-1">
                100-Point
              </p>
              <p className="text-sm text-slate-300 font-medium">ATS Compatibility Score</p>
            </div>
            <div className="p-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 mb-1">
                Actionable
              </p>
              <p className="text-sm text-slate-300 font-medium">Recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FEATURES SECTION ----------------- */}
      <section id="features" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Engineered For Modern Hiring
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything You Need to Pass Automated Screeners
            </p>
            <p className="text-slate-600 text-base mt-3">
              Automated Applicant Tracking Systems filter out up to 75% of qualified applicants before a human recruiter even sees them. ATS Checker closes the gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Resume Analysis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deep semantic evaluation of role titles, bullet points, responsibilities, and achievements using Google Gemini.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">ATS Score Breakdown</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                0–100 score transparently separated across formatting, structure, skills relevance, contact completeness, and readability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Job Description Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste any job vacancy to immediately detect role-specific alignment, qualifications parity, and overall match percentage.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Keyword Analysis</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant identification of matched keywords, partial terminology, and essential missing industry terms.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Missing Skills Detection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Highlights critical competencies expected by hiring teams, with honest reminders to add skills only if genuinely mastered.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Truthful Rewrites</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Actionable bullet point upgrades based strictly on existing accomplishments. Never invents fake metrics or unearned achievements.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Resume History</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Archive and track score improvements across revisions and multiple customized target versions.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Secure Storage</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your data belongs solely to you. Isolated document ownership with zero public scraping or third-party sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS SECTION ----------------- */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Simple 6-Step Workflow
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How ATS Checker Optimizes Your Job Search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Resume</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drop your existing resume in PDF, DOCX, DOC, or TXT format, or paste your raw text directly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Analyzes Resume</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our parsing model reads formatting, extracts work experience, and catalogs your technical and soft skills.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get ATS Score</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Review your 0–100 benchmark score with itemized breakdowns on layout, keyword strength, and quantifiable achievements.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Add Job Description</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste the job description of any position you want to target (LinkedIn, Indeed, company careers page).
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                5
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Get Job Match Score</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Discover matching qualifications, partial terminology overlap, and missing keywords required by the employer.
              </p>
            </div>

            {/* Step 6 */}
            <div className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-4 shadow-sm">
                6
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Improve Resume</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apply honest, suggested bullet point revisions and tailor your resume with confidence before submitting your application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CALL TO ACTION SECTION ----------------- */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-950 opacity-90" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready in under 30 seconds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Ready to improve your resume?
          </h2>

          <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Gain immediate insight into your ATS compatibility score and start applying with confidence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStartAnalysis}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-indigo-900 bg-white hover:bg-slate-100 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Analyze Your Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
