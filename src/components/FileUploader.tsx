import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, Sparkles, FileCode } from 'lucide-react';
import { SAMPLE_RESUMES, SampleResume } from '../utils/sampleResumes';

interface FileUploaderProps {
  onAnalyze: (fileData: {
    fileName: string;
    fileType: string;
    fileSize: number;
    rawText: string;
    fileBase64?: string;
    file?: File;
  }) => void;
  isLoading?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onAnalyze, isLoading = false }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState<string>('');
  const [pastedTitle, setPastedTitle] = useState<string>('My_Resume.txt');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type. Please upload a PDF, DOCX, DOC, or TXT file.`);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File size exceeds 5 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller file.`);
      return;
    }

    setSelectedFile(file);
    // Simulate swift file processing progress
    setUploadProgress(20);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 40;
      });
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectSample = (sample: SampleResume) => {
    setError(null);
    setMode('paste');
    setPastedTitle(sample.fileName);
    setPastedText(sample.text);
  };

  const handleSubmit = async () => {
    setError(null);

    if (mode === 'upload') {
      if (!selectedFile) {
        setError('Please select or drop a resume file to analyze.');
        return;
      }

      // Read file
      const reader = new FileReader();
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();

      if (ext === 'txt') {
        reader.onload = (e) => {
          const text = (e.target?.result as string) || '';
          onAnalyze({
            fileName: selectedFile.name,
            fileType: selectedFile.type || 'text/plain',
            fileSize: selectedFile.size,
            rawText: text,
            file: selectedFile
          });
        };
        reader.readAsText(selectedFile);
      } else {
        // Read as DataURL (base64)
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const base64 = result.split(',')[1];
          onAnalyze({
            fileName: selectedFile.name,
            fileType: selectedFile.type || 'application/pdf',
            fileSize: selectedFile.size,
            rawText: '',
            fileBase64: base64,
            file: selectedFile
          });
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      // Paste mode
      if (!pastedText.trim()) {
        setError('Please paste your resume text before clicking analyze.');
        return;
      }
      if (pastedText.trim().length < 100) {
        setError('Resume content appears too short. Please provide a more complete resume for accurate ATS scoring.');
        return;
      }

      onAnalyze({
        fileName: pastedTitle || 'Pasted_Resume.txt',
        fileType: 'text/plain',
        fileSize: new Blob([pastedText]).size,
        rawText: pastedText
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              mode === 'upload'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              mode === 'paste'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Paste Text
          </button>
        </div>

        {/* Sample selector */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Try:</span>
          {SAMPLE_RESUMES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectSample(s)}
              className="text-indigo-600 hover:text-indigo-800 font-medium underline px-1"
            >
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {mode === 'upload' ? (
        <div>
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Drag & drop your resume here
              </h4>
              <p className="text-sm text-slate-500 mb-4">
                or <span className="text-indigo-600 font-semibold underline">Browse Files</span> from your computer
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">PDF</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">DOCX</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">DOC</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">TXT</span>
                <span>• Maximum file size: 5 MB</span>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-800 truncate max-w-xs sm:max-w-sm">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split('.').pop()?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>File Ready</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 100%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-full transition-all duration-300" />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Resume Document Name
            </label>
            <input
              type="text"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              placeholder="e.g. My_Software_Resume.txt"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Resume Text Content
            </label>
            <textarea
              rows={9}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your full resume text here including your contact details, summary, experience, skills, and education..."
              className="w-full p-3.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              {pastedText.trim().split(/\s+/).filter(Boolean).length} words detected
            </p>
          </div>
        </div>
      )}

      {/* Action CTA */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          <span>🔒 Resumes are analyzed securely and never shared publicly</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || (mode === 'upload' && !selectedFile)}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
            isLoading || (mode === 'upload' && !selectedFile)
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 hover:shadow-indigo-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? 'Analyzing with AI...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Mobile quick sample helper */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 sm:hidden text-xs text-slate-500">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Try Sample:</span>
        {SAMPLE_RESUMES.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelectSample(s)}
            className="text-indigo-600 font-semibold underline"
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
};
