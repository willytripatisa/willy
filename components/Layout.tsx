
import React from 'react';

export const Header: React.FC = () => (
  <header className="bg-indigo-700 text-white p-4 shadow-lg no-print">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="bg-white p-2 rounded-lg">
           <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
           </svg>
        </div>
        <div>
          <h1 className="font-bold text-xl leading-tight">Kurikulum Merdeka</h1>
          <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest">Deep Learning Tool</p>
        </div>
      </div>
      <div className="hidden md:block italic text-sm text-indigo-100">
        "Menuju Pembelajaran yang Lebih Bermakna dan Mendalam"
      </div>
    </div>
  </header>
);

export const Card: React.FC<{ children: React.ReactNode, title?: string, className?: string }> = ({ children, title, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {title && <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 font-semibold text-slate-700">{title}</div>}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export const Footer: React.FC = () => (
  <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm no-print">
    <p>© {new Date().getFullYear()} Tim Ahli Kurikulum Merdeka - Generator Perangkat Ajar Pintar</p>
  </footer>
);
