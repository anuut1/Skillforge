import React from 'react';
import { GraduationCap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SkillForge</span>
          </div>
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} SkillForge. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
