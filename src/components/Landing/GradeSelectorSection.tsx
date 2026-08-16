import React from 'react';
import { useApp } from '../../context/AppContext';
import { GradeLevel } from '../../types';
import { ArrowLeft, BookCheck, Sparkles, GraduationCap } from 'lucide-react';

export const GradeSelectorSection: React.FC = () => {
  const { setSelectedGrade } = useApp();

  const handleSelect = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    const element = document.getElementById('courses-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="grades-section" className="py-16 sm:py-24 bg-white dark:bg-[#13221b] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs sm:text-sm font-bold text-[#f39c12] uppercase tracking-wider block mb-1">
            اختار سنتك الدراسية
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
            كل سنة ليها طريقة الشرح المناسبة ليها
          </h2>
        </div>

        {/* 2 Stage Cards */}
        <div className="space-y-5">
          
          {/* Card 01 - Grade 1 */}
          <div
            onClick={() => handleSelect('first_general')}
            className="group relative bg-[#f1f8f4] dark:bg-[#192c23] hover:bg-[#e4f2ea] dark:hover:bg-[#1f372c] p-6 sm:p-7 rounded-2xl border-2 border-[#2d6a4f]/20 hover:border-[#2d6a4f] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between"
            id="grade-card-1"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f39c12] group-hover:bg-[#e67e22] text-white flex items-center justify-center transition-transform group-hover:-translate-x-1 shadow-sm">
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-3">
                <h3 className="text-xl sm:text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-200">
                  الصف الأول الثانوي
                </h3>
                <span className="text-xs font-black text-[#2d6a4f] dark:text-emerald-400 bg-white dark:bg-[#111f18] px-2.5 py-1 rounded-md border border-emerald-600/30">
                  01
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                (عام وبكالوريا) • شرح شامل ونواتج تعلم وتدريب على الأسئلة المقالية والاختيار من متعدد
              </p>
            </div>
          </div>

          {/* Card 02 - Grade 2 (Psychology & Sociology) */}
          <div
            onClick={() => handleSelect('second_general')}
            className="group relative bg-[#f1f8f4] dark:bg-[#192c23] hover:bg-[#e4f2ea] dark:hover:bg-[#1f372c] p-6 sm:p-7 rounded-2xl border-2 border-[#2d6a4f]/20 hover:border-[#2d6a4f] transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between"
            id="grade-card-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-[#111f18] border border-[#2d6a4f]/40 group-hover:bg-[#f39c12] group-hover:border-[#f39c12] text-[#2d6a4f] group-hover:text-white flex items-center justify-center transition-all group-hover:-translate-x-1 shadow-sm">
                <ArrowLeft className="w-6 h-6" />
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-3">
                <h3 className="text-xl sm:text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-200">
                  الصف الثاني الثانوي
                </h3>
                <span className="text-xs font-black text-[#2d6a4f] dark:text-emerald-400 bg-white dark:bg-[#111f18] px-2.5 py-1 rounded-md border border-emerald-600/30">
                  02
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                علم النفس والاجتماع (عام وبكالوريا)
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
