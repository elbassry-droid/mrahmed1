import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QUIZZES } from '../../data/mockData';
import { GradeLevel, Quiz } from '../../types';
import { Award, Clock, HelpCircle, CheckCircle2, ArrowLeft, BookOpen } from 'lucide-react';

export const ExamsListView: React.FC = () => {
  const { openQuiz, quizResults, quizzes } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'second_general' | 'second_bac' | 'first_general'>('all');

  const allQuizzes = quizzes && quizzes.length > 0 ? quizzes : QUIZZES;

  const filteredQuizzes = allQuizzes.filter(q => {
    if (activeFilter === 'second_general') return q.grade === 'second_general';
    if (activeFilter === 'second_bac') return q.grade === 'second_bac';
    if (activeFilter === 'first_general') return q.grade.startsWith('first');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#f39c12] uppercase tracking-wider block mb-1">
              بنك الأسئلة والامتحانات الشاملة
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
              امتحانات علم النفس والاجتماع والمواد الفلسفية
            </h1>
          </div>

          {/* Grade Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              الكل ({allQuizzes.length})
            </button>
            <button
              onClick={() => setActiveFilter('second_general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'second_general'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              تانية ثانوي عام (علم نفس واجتماع)
            </button>
            <button
              onClick={() => setActiveFilter('second_bac')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'second_bac'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              تانية ثانوي بكالوريا (علم نفس واجتماع)
            </button>
            <button
              onClick={() => setActiveFilter('first_general')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'first_general'
                  ? 'bg-[#2d6a4f] text-white shadow-sm'
                  : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-emerald-900/20'
              }`}
            >
              أولى ثانوي
            </button>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map(quiz => {
            const previousResult = quizResults.find(r => r.quizId === quiz.id);

            return (
              <div
                key={quiz.id}
                className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs hover:border-[#2d6a4f] transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold bg-[#f39c12]/20 text-[#d35400] dark:text-amber-300 px-2.5 py-1 rounded-md">
                      {quiz.grade.startsWith('second') ? 'الصف الثاني الثانوي (علم النفس والاجتماع)' : 'الصف الأول الثانوي'}
                    </span>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#f39c12]" />
                      <span>{quiz.durationMinutes} دقيقة</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-200">
                    {quiz.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>{quiz.questions.length} أسئلة اختيار من متعدد</span>
                    <span>•</span>
                    <span>{quiz.totalMarks} درجة كلية</span>
                  </div>

                  {/* Previous Result Banner if already taken */}
                  {previousResult && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <span>أعلى نتيجة حققتها:</span>
                      <span>{previousResult.score} / {previousResult.totalMarks} ({previousResult.percentage}%)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => openQuiz(quiz)}
                  className="w-full py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Award className="w-4 h-4 text-[#f39c12]" />
                  <span>{previousResult ? 'إعادة الاختبار وتدريب نفسك' : 'بدء الاختبار الآن'}</span>
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
