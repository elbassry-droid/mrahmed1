import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, GradeLevel } from '../../types';
import { TEACHER_IMAGE } from '../../data/mockData';
import { Calendar, Clock, BookOpen, Check, ArrowLeft, Sparkles, Tag, ShieldCheck } from 'lucide-react';

export const CoursesSection: React.FC = () => {
  const { 
    courses, 
    openCourseDetail, 
    enrollInCourse, 
    enrolledCourseIds, 
    openAuthModal, 
    isLoggedIn,
    selectedGrade,
    setSelectedGrade
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | 'monthly' | 'package'>('all');

  const filteredCourses = courses.filter(c => {
    const matchGrade = selectedGrade === 'all' || c.grade === selectedGrade;
    const matchCategory = activeCategory === 'all' || c.category === activeCategory;
    return matchGrade && matchCategory;
  });

  return (
    <section id="courses-section" className="py-16 sm:py-20 bg-[#f8faf8] dark:bg-[#0f1c16] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-right max-w-3xl mb-10">
          <span className="text-xs sm:text-sm font-bold text-[#f39c12] uppercase tracking-wider block mb-1">
            المحاضرات والكورسات المختارة
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
            ابدأ من الكورس المناسب لسنتك
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2 font-medium">
            اختار كورسات علم النفس والاجتماع والمواد الفلسفية حسب صفك (عام أو بكالوريا)، واشترك في المحاضرات الشهرية أو باقات الترم المخفضة.
          </p>
        </div>

        {/* Grade Filters Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2 overflow-x-auto">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedGrade === 'all'
                ? 'bg-[#2d6a4f] text-white shadow-md'
                : 'bg-white dark:bg-[#1a2c23] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
            }`}
          >
            جميع الصفوف الدراسية
          </button>

          <button
            onClick={() => setSelectedGrade('second_general')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedGrade === 'second_general'
                ? 'bg-[#2d6a4f] text-white shadow-md'
                : 'bg-white dark:bg-[#1a2c23] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
            }`}
          >
            الصف الثاني الثانوي (علم النفس والاجتماع - عام)
          </button>

          <button
            onClick={() => setSelectedGrade('second_bac')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedGrade === 'second_bac'
                ? 'bg-[#2d6a4f] text-white shadow-md'
                : 'bg-white dark:bg-[#1a2c23] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
            }`}
          >
            الصف الثاني الثانوي (علم النفس والاجتماع - بكالوريا)
          </button>

          <button
            onClick={() => setSelectedGrade('first_general')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              selectedGrade === 'first_general'
                ? 'bg-[#2d6a4f] text-white shadow-md'
                : 'bg-white dark:bg-[#1a2c23] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
            }`}
          >
            الصف الأول الثانوي (عام وبكالوريا)
          </button>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-[#162720] rounded-2xl overflow-hidden border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                id={`course-card-${course.id}`}
              >
                {/* Course Card Top Poster */}
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1b4332] to-[#2d6a4f]">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Teacher Miniature Overlay */}
                  <div className="absolute -bottom-2 -left-2 w-28 h-36 z-10">
                    <img
                      src={TEACHER_IMAGE}
                      alt="مستر أحمد عبدالحميد"
                      className="w-full h-full object-contain drop-shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Top Right Tag */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {course.subject}
                  </div>

                  {/* Top Left Price Badge Circle */}
                  <div className="absolute top-3 left-3 bg-[#1b4332] text-white rounded-full w-14 h-14 flex flex-col items-center justify-center font-black shadow-lg border-2 border-[#f39c12]">
                    <span className="text-base leading-none text-[#ffbe76]">{course.price}</span>
                    <span className="text-[10px] leading-tight text-white font-normal">جنيه</span>
                  </div>

                  {/* Poster Main Banner Text */}
                  <div className="absolute bottom-3 right-4 left-24 text-right">
                    <span className="bg-[#f39c12] text-white text-[10px] font-black px-2 py-0.5 rounded-xs inline-block mb-1">
                      {course.badgeText}
                    </span>
                    <p className="text-white font-changa font-bold text-sm leading-snug drop-shadow-md line-clamp-2">
                      {course.title}
                    </p>
                  </div>
                </div>

                {/* Course Body Info */}
                <div className="p-5 flex-1 flex flex-col justify-between text-right space-y-4">
                  <div>
                    <h3 
                      onClick={() => openCourseDetail(course)}
                      className="font-bold text-sm text-[#1b4332] dark:text-emerald-300 hover:text-[#f39c12] cursor-pointer line-clamp-2 transition-colors"
                    >
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Course Metadata Meta */}
                  <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-emerald-900/30 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>بداية الكورس:</span>
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{course.startDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>عدد المحاضرات:</span>
                      </div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{course.totalLessons} حصص</span>
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <div className="pt-2">
                    {isEnrolled ? (
                      <button
                        onClick={() => openCourseDetail(course)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>أنت مشترك بالفعل • ادخل الحصة</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openCourseDetail(course)}
                        className="w-full py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-98"
                      >
                        <span>تفاصيل واشترك في الكورس</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
