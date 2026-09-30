import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Value Prop */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">
                ATS <span className="text-indigo-400">Checker</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-powered ATS resume checker and job description match analyzer. Optimize ATS compatibility, identify missing skills, and align your resume with job requirements.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Data Privacy • Never Sold to Recruiters</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#features" className="hover:text-white transition-colors">
                  Key Features
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/resume/upload" className="hover:text-white transition-colors">
                  Analyze Resume
                </Link>
              </li>
              <li>
                <Link to="/job-match" className="hover:text-white transition-colors">
                  Job Matcher
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition-colors">
                  Product Feedback
                </Link>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Notice: ATS Checker does not sell or share personal resumes. Data is processed solely for ATS scoring.'); }} className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: ATS scoring is an analytical benchmark to assist candidates and does not guarantee job placement or interviews.'); }} className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} ATS Checker. All rights reserved. ATS score is an analytical estimate.
          </p>
          <div className="flex items-center space-x-1">
            <span>Built with precision for career growth</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
