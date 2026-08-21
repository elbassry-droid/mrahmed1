import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEACHER_IMAGE } from '../../data/mockData';
import { Course } from '../../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Calendar,
  Sparkles,
  Check,
  Award,
  FileText,
  Wallet
} from 'lucide-react';

export const CourseCatalogView: React.FC = () => {
  const { 
    courses, 
    enrolledCourseIds, 
    openCourseDetail, 
    setActiveView, 
    openRechargeModal,
    selectedGrade,
    setSelectedGrade
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'packages' | 'monthly'>('packages');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredCourses = courses.filter(c => {
    const matchGrade = selectedGrade === 'all' || c.grade === selectedGrade;
    if (activeTab === 'packages') return matchGrade && c.category === 'package';
    if (activeTab === 'monthly') return matchGrade && c.category === 'monthly';
    return matchGrade;
  });

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Course Catalog Area */}
          <div className="flex-1 w-full space-y-6 text-right order-2 lg:order-1">
            
            {/* Top Category Filter Tabs (Screenshot 9 Match) */}
            <div className="flex items-center gap-3">
              
              {/* Packages Tab (Green with Fire Icon) */}
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  activeTab === 'packages'
                    ? 'bg-[#2d6a4f] text-white shadow-md'
                    : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
                }`}
                id="tab-packages"
              >
                <span>باقات مخفضة</span>
                <span className="text-sm">🔥</span>
              </button>

              {/* Monthly Subscription Tab (White / Outline) */}
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'monthly'
                    ? 'bg-[#2d6a4f] text-white shadow-md'
                    : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
                }`}
                id="tab-monthly"
              >
                اشتراك شهري
              </button>

              {/* All Tab */}
              <button
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#2d6a4f] text-white shadow-md'
                    : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-emerald-900/40 hover:bg-gray-50'
                }`}
                id="tab-all"
              >
                جميع الكورسات
              </button>

            </div>

            {/* Courses List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const isEnrolled = enrolledCourseIds.includes(course.id);

                return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-[#162720] rounded-2xl overflow-hidden border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Course Card Poster */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#1b4332] to-[#2d6a4f]">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
                      />
                      
                      {/* Teacher Image Overlay */}
                      <div className="absolute -bottom-2 -left-2 w-24 h-32 z-10">
                        <img
                          src={TEACHER_IMAGE}
                          alt="مستر أحمد عبدالحميد"
                          className="w-full h-full object-contain drop-shadow-md"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-3 left-3 bg-[#1b4332] text-white rounded-full w-12 h-12 flex flex-col items-center justify-center font-black shadow-md border-2 border-[#f39c12]">
                        <span className="text-sm leading-none text-[#ffbe76]">{course.price}</span>
                        <span className="text-[9px] leading-tight text-white">جنيه</span>
                      </div>

                      {/* Subject Tag */}
                      <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {course.subject}
                      </div>

                      <div className="absolute bottom-2 right-3 left-20">
                        <span className="bg-[#f39c12] text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs">
                          {course.badgeText}
                        </span>
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 
                          onClick={() => openCourseDetail(course)}
                          className="font-bold text-sm text-[#1b4332] dark:text-emerald-200 hover:text-[#f39c12] cursor-pointer line-clamp-2"
                        >
                          {course.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {course.subtitle}
                        </p>
                      </div>

                      <div className="text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-emerald-900/30 pt-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">بداية الكورس:</span>
                          <span className="font-bold">{course.startDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">عدد المحاضرات:</span>
                          <span className="font-bold">{course.lessonsCount} محاضرة</span>
                        </div>
                      </div>

                      {/* Actions (Screenshot 9 Match) */}
                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => openCourseDetail(course)}
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold text-[#2d6a4f] dark:text-emerald-300 border-2 border-[#2d6a4f] dark:border-emerald-500/60 hover:bg-[#2d6a4f] hover:text-white transition-colors"
                        >
                          الدخول للكورس
                        </button>

                        {isEnrolled ? (
                          <button
                            onClick={() => openCourseDetail(course)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#2d6a4f] flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4 text-[#f39c12]" />
                            <span>مشترك بالفعل</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openCourseDetail(course)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-black text-white bg-[#f39c12] hover:bg-[#e67e22] shadow-sm transition-all"
                          >
                            الإشتراك في الكورس !
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Sidebar (Screenshot 9 Exact Match) */}
          <div className={`w-full lg:w-64 bg-white dark:bg-[#162720] p-4 rounded-2xl border border-gray-200/80 dark:border-emerald-900/40 shadow-xs space-y-2 order-1 lg:order-2 shrink-0 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} transition-all`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-emerald-900/30 mb-2">
              <span className={`text-xs font-bold text-gray-500 dark:text-gray-400 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                تصغير النافذة
              </span>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition-colors"
              >
                {sidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            <nav className="space-y-1.5">
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <LayoutDashboard className="w-5 h-5 text-[#2d6a4f] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>الرئيسية</span>
              </button>

              <div className="space-y-1">
                <button
                  onClick={() => setActiveView('courses')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2d6a4f] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <BookOpen className="w-5 h-5 shrink-0" />
                  <span className={sidebarCollapsed ? 'hidden' : 'inline'}>الكورسات</span>
                </button>

                {!sidebarCollapsed && (
                  <div className="pr-8 space-y-1 text-xs">
                    <button
                      onClick={() => setActiveTab('all')}
                      className="w-full text-right py-1.5 px-2 rounded-lg text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/40"
                    >
                      • جميع الكورسات
                    </button>
                    <button
                      onClick={() => setActiveTab('packages')}
                      className="w-full text-right py-1.5 px-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-emerald-700"
                    >
                      • كورساتنا المقترحة
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveView('exams')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <Award className="w-5 h-5 text-[#f39c12] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>الامتحانات والكويزات</span>
              </button>

              <button
                onClick={() => setActiveView('pdfs')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>المذكرات والـ PDF</span>
              </button>

              <button
                onClick={() => setActiveView('account')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <UserIcon className="w-5 h-5 text-[#2d6a4f] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>حسابي</span>
              </button>
            </nav>

          </div>

        </div>

      </div>
    </div>
  );
};
