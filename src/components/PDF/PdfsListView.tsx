import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PDF_DOCUMENTS } from '../../data/mockData';
import { FileText, Download, Eye, BookOpen, Clock, Sparkles } from 'lucide-react';

export const PdfsListView: React.FC = () => {
  const { openPdf } = useApp();
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | 'second_general' | 'second_bac' | 'first_general'>('all');

  const filteredPdfs = PDF_DOCUMENTS.filter(pdf => {
    if (selectedGradeFilter === 'second_general') return pdf.grade === 'second_general';
    if (selectedGradeFilter === 'second_bac') return pdf.grade === 'second_bac';
    if (selectedGradeFilter === 'first_general') return pdf.grade.startsWith('first');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#f39c12] uppercase tracking-wider block mb-1">
              مكتبة المذكرات والملازم المعتمدة
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
              المذكرات وملفات الـ PDF والخرائط الذهنية
            </h1>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedGradeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGradeFilter === 'all'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              الكل ({PDF_DOCUMENTS.length})
            </button>
            <button
              onClick={() => setSelectedGradeFilter('second_general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGradeFilter === 'second_general'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              تانية ثانوي عام (علم نفس واجتماع)
            </button>
            <button
              onClick={() => setSelectedGradeFilter('second_bac')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGradeFilter === 'second_bac'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              تانية ثانوي بكالوريا (علم نفس واجتماع)
            </button>
            <button
              onClick={() => setSelectedGradeFilter('first_general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedGradeFilter === 'first_general'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              أولى ثانوي
            </button>
          </div>
        </div>

        {/* PDFs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPdfs.map(pdf => (
            <div
              key={pdf.id}
              className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs hover:border-[#2d6a4f] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-[#f39c12]/20 text-[#d35400] dark:text-amber-300 px-2 py-0.5 rounded-md">
                    {pdf.grade.startsWith('second') ? 'الصف الثاني الثانوي (علم النفس والاجتماع)' : 'الصف الأول الثانوي'}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-200 line-clamp-2">
                  {pdf.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {pdf.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold pt-1 border-t border-gray-100 dark:border-emerald-900/30">
                  <span>{pdf.pageCount} صفحة</span>
                  <span>•</span>
                  <span>حجم الملف: {pdf.fileSize}</span>
                </div>
              </div>

              <button
                onClick={() => openPdf(pdf)}
                className="w-full py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Eye className="w-4 h-4 text-[#f39c12]" />
                <span>تصفح المذكرة الآن</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
