import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { StoredResume, AtsAnalysisResult, JobMatchResult } from '../types';
import {
  FileText,
  Search,
  Trash2,
  Eye,
  Briefcase,
  UploadCloud,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    if (user) {
      loadData(user.uid);
    }
  }, [user]);

  const loadData = (uid: string) => {
    const list = StorageService.getResumes(uid);
    setResumes(list);
  };

  const handleDelete = (id: string, name: string) => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      StorageService.deleteResume(id, user.uid);
      loadData(user.uid);
    }
  };

  const filteredResumes = resumes.filter((r) => {
    const matchesSearch = r.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const score = r.latestAtsScore || 0;
    if (filterScore === 'high') return matchesSearch && score >= 80;
    if (filterScore === 'medium') return matchesSearch && score >= 60 && score < 80;
    if (filterScore === 'low') return matchesSearch && score < 60;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Resume & Analysis History
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review past ATS compatibility audits, job matching scores, and document revisions.
            </p>
          </div>
          <Link
            to="/resume/upload"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resumes by title..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Score:</span>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="all">All Scores</option>
              <option value="high">High Match (80+)</option>
              <option value="medium">Moderate (60–79)</option>
              <option value="low">Needs Optimization (&lt;60)</option>
            </select>
          </div>
        </div>

        {/* Table of History */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {filteredResumes.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No resumes found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'No resumes matched your query. Try clearing the filter.'
                  : 'You have not uploaded any resumes yet. Start by uploading one.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Resume Document</th>
                    <th className="py-3.5 px-6">ATS Score</th>
                    <th className="py-3.5 px-6">Job Match Score</th>
                    <th className="py-3.5 px-6">Upload Date</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredResumes.map((resume) => {
                    const ats = resume.latestAtsScore ?? 0;
                    let atsBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    if (ats < 60) atsBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                    else if (ats < 80) atsBadge = 'bg-amber-50 text-amber-700 border-amber-200';

                    return (
                      <tr key={resume.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                                {resume.fileName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {(resume.fileSize / 1024).toFixed(1)} KB • {resume.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {resume.latestAtsScore ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${atsBadge}`}>
                              {resume.latestAtsScore} / 100
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Not analyzed</span>
                          )}
                        </td>

                        <td className="py-4 px-6">
                          {resume.latestJobMatchScore ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">
                              {resume.latestJobMatchScore}% Match
                            </span>
                          ) : (
                            <Link
                              to={`/job-match?resumeId=${resume.id}`}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              + Run Match
                            </Link>
                          )}
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/resume/${resume.id}`)}
                              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="View ATS Analysis"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/job-match?resumeId=${resume.id}`)}
                              className="p-2 rounded-xl text-slate-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                              title="Compare with Job Description"
                            >
                              <Briefcase className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(resume.id, resume.fileName)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
