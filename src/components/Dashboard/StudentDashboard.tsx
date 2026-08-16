import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEACHER_IMAGE } from '../../data/mockData';
import { 
  LayoutDashboard, 
  BookOpen, 
  User as UserIcon, 
  CheckSquare, 
  Lightbulb, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  FileText,
  HelpCircle,
  Wallet,
  Play,
  Award,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    user, 
    courses, 
    enrolledCourseIds, 
    openCourseDetail, 
    setActiveView, 
    openRechargeModal,
    quizResults
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const suggestedCourses = courses.filter(c => !enrolledCourseIds.includes(c.id));

  const totalLessons = enrolledCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
  const completedLessons = enrolledCourses.reduce(
    (acc, c) => acc + (c.lessons?.filter(l => l.isCompleted)?.length || 0),
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Sidebar (right in RTL) & Dashboard Body (left in RTL) */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Dashboard Content Area */}
          <div className="flex-1 w-full space-y-6 text-right order-2 lg:order-1">
            
            {/* Top 3 Orange Stat Cards (Screenshot 8 Exact Match) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Completed Courses */}
              <div className="bg-[#f39c12] hover:bg-[#e67e22] text-white p-5 rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-changa block">0</span>
                  <span className="text-xs font-bold text-white/90">كورسات مكتملة</span>
                </div>
              </div>

              {/* Card 2: Current Courses */}
              <div className="bg-[#f39c12] hover:bg-[#e67e22] text-white p-5 rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-changa block">{enrolledCourses.length}</span>
                  <span className="text-xs font-bold text-white/90">كورساتك الحالية</span>
                </div>
              </div>

              {/* Card 3: Saved Videos */}
              <div className="bg-[#f39c12] hover:bg-[#e67e22] text-white p-5 rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-changa block">{completedLessons}</span>
                  <span className="text-xs font-bold text-white/90">الفيديوهات المشاهدة</span>
                </div>
              </div>

            </div>

            {/* Middle Row: Progress Meter & Educational Activity Chart (Screenshot 8 Match) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Progress Meter (Col 4) */}
              <div className="lg:col-span-4 bg-white dark:bg-[#162720] p-6 rounded-2xl border border-gray-200/80 dark:border-emerald-900/40 shadow-xs flex flex-col justify-between text-center">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 self-start">
                  تقدمك
                </span>

                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                      <path
                        className="text-gray-100 dark:text-emerald-950"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#2d6a4f] dark:text-emerald-400 transition-all duration-1000 ease-out"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
                        {progressPercent} %
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">معدل الإنجاز</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  مقياس لكمية الدروس السابقة والمتبقية في كورساتك الحالية!
                </p>
              </div>

              {/* Right Column: Interactive Activity Chart (Col 8) */}
              <div className="lg:col-span-8 bg-white dark:bg-[#162720] p-6 rounded-2xl border border-gray-200/80 dark:border-emerald-900/40 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-emerald-900/30">
                    <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-gray-200">
                      نشاطك التعليمي
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#1dd1a1]"></span>
                        <span className="text-gray-600 dark:text-gray-400">الأسبوع الماضي</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#ff6b6b]"></span>
                        <span className="text-gray-600 dark:text-gray-400">الأسبوع الحالي</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Chart Graph (CSS Grid Simulation) */}
                  <div className="pt-6 pb-2">
                    <div className="h-44 flex items-end justify-between gap-2 border-b border-gray-200 dark:border-emerald-900/60 pb-1 px-2">
                      {[
                        { day: 'الأحد', current: 65, past: 40 },
                        { day: 'الإثنين', current: 80, past: 55 },
                        { day: 'الثلاثاء', current: 45, past: 70 },
                        { day: 'الأربعاء', current: 90, past: 60 },
                        { day: 'الخميس', current: 75, past: 80 },
                        { day: 'الجمعة', current: 30, past: 20 },
                        { day: 'السبت', current: 85, past: 50 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                          <div className="w-full flex items-end justify-center gap-1.5 h-36">
                            {/* Past week bar */}
                            <div 
                              className="w-2.5 sm:w-3.5 bg-[#1dd1a1]/50 group-hover:bg-[#1dd1a1] rounded-t-md transition-all duration-300"
                              style={{ height: `${item.past}%` }}
                              title={`الأسبوع الماضي: ${item.past}%`}
                            ></div>
                            {/* Current week bar */}
                            <div 
                              className="w-2.5 sm:w-3.5 bg-[#ff6b6b] rounded-t-md shadow-xs transition-all duration-300"
                              style={{ height: `${item.current}%` }}
                              title={`الأسبوع الحالي: ${item.current}%`}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-2">
                  * ابدأ المحاضرات وحل الكويزات علشان نقدر نعرضلك بيانات نشاطك التعليمي بشكل دقيق ولحظي!
                </p>
              </div>

            </div>

            {/* Current Enrolled Courses & Quick Resume */}
            {enrolledCourses.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black font-changa text-[#1b4332] dark:text-emerald-300">
                    كورساتك المفعلة حالياً
                  </h3>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                    {enrolledCourses.length} كورس نشط
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolledCourses.map(course => (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-[#162720] rounded-2xl p-4 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs flex items-center gap-4 hover:border-[#2d6a4f] transition-all cursor-pointer"
                      onClick={() => openCourseDetail(course)}
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-emerald-900">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-[#f39c12]/20 text-[#d35400] dark:text-amber-300 font-bold px-2 py-0.5 rounded-sm inline-block mb-1">
                          {course.badgeText}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {course.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                          <span>{course.lessonsCount} محاضرات</span>
                          <span className="text-[#2d6a4f] dark:text-emerald-400 font-bold flex items-center gap-1">
                            <span>متابعة الشرح</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Courses Section (Screenshot 8 Bottom Match) */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black font-changa text-[#1b4332] dark:text-emerald-300">
                  الكورسات المقترحة
                </h3>
                <button
                  onClick={() => setActiveView('courses')}
                  className="text-xs font-bold text-[#f39c12] hover:underline flex items-center gap-1"
                >
                  <span>عرض جميع الكورسات</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedCourses.slice(0, 3).map(course => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-[#162720] rounded-2xl overflow-hidden border border-gray-200 dark:border-emerald-900/40 p-3 flex flex-col justify-between group hover:shadow-md transition-all"
                  >
                    <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {course.price} ج.م
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
                      {course.title}
                    </h4>

                    <button
                      onClick={() => openCourseDetail(course)}
                      className="w-full py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold transition-colors"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar (Screenshot 8 Exact Style) */}
          <div className={`w-full lg:w-64 bg-white dark:bg-[#162720] p-4 rounded-2xl border border-gray-200/80 dark:border-emerald-900/40 shadow-xs space-y-2 order-1 lg:order-2 shrink-0 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} transition-all`}>
            
            {/* Collapse button header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-emerald-900/30 mb-2">
              <span className={`text-xs font-bold text-gray-500 dark:text-gray-400 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                تصغير النافذة
              </span>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                title="طي / فتح القائمة"
              >
                {sidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="space-y-1.5">
              
              {/* Item 1: الرئيسية */}
              <button
                onClick={() => setActiveView('dashboard')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2d6a4f] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>الرئيسية</span>
              </button>

              {/* Item 2: الكورسات */}
              <button
                onClick={() => setActiveView('courses')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <BookOpen className="w-5 h-5 text-[#2d6a4f] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>الكورسات</span>
              </button>

              {/* Item 3: الامتحانات والكويزات */}
              <button
                onClick={() => setActiveView('exams')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <Award className="w-5 h-5 text-[#f39c12] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>الامتحانات والكويزات</span>
              </button>

              {/* Item 4: المذكرات والـ PDF */}
              <button
                onClick={() => setActiveView('pdfs')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>المذكرات والـ PDF</span>
              </button>

              {/* Item 5: شحن الرصيد وبوابة الدفع */}
              <button
                onClick={openRechargeModal}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <Wallet className="w-5 h-5 text-[#f39c12] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>شحن الرصيد والمحفظة</span>
              </button>

              {/* Item 6: حسابي */}
              <button
                onClick={() => setActiveView('account')}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-bold text-xs sm:text-sm transition-all"
              >
                <UserIcon className="w-5 h-5 text-[#2d6a4f] shrink-0" />
                <span className={sidebarCollapsed ? 'hidden' : 'inline'}>حسابي والاشتراكات</span>
              </button>

            </nav>

            {/* Sidebar Bottom Teacher Badge */}
            {!sidebarCollapsed && (
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-emerald-900/30 text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#f39c12] mb-2">
                  <img src={TEACHER_IMAGE} alt="مستر أحمد عبدالحميد" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-[#1b4332] dark:text-emerald-300">
                  مستر أحمد عبدالحميد
                </p>
                <p className="text-[10px] text-gray-500">القائد في المواد الفلسفية</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
