import React from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson } from '../../types';
import { TEACHER_IMAGE, PDF_DOCUMENTS } from '../../data/mockData';
import { 
  Check, 
  Play, 
  Lock, 
  FileText, 
  Award, 
  Clock, 
  Calendar, 
  User, 
  ArrowRight, 
  Shield, 
  Zap, 
  BookOpen,
  Share2,
  Sparkles
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ course, onBack }) => {
  const { 
    enrolledCourseIds, 
    enrollInCourse, 
    openVideoPlayer, 
    openQuiz, 
    openPdf, 
    openRechargeModal,
    walletBalance,
    user,
    isLessonLocked
  } = useApp();

  const isEnrolled = enrolledCourseIds.includes(course.id);

  const handleEnrollClick = () => {
    if (walletBalance >= course.price) {
      enrollInCourse(course.id, 'المحفظة');
    } else {
      openRechargeModal();
    }
  };

  const handleStartLesson = (lesson: Lesson, index: number) => {
    if (!isEnrolled) {
      handleEnrollClick();
      return;
    }

    const lockStatus = isLessonLocked(course, index);
    if (lockStatus.isLocked) {
      if (lockStatus.blockingQuiz && !lockStatus.requiredQuizSolved) {
        openQuiz(lockStatus.blockingQuiz);
      }
      return;
    }

    openVideoPlayer(lesson, course);
  };

  const attachedPdf = PDF_DOCUMENTS.find(p => p.grade === course.grade) || PDF_DOCUMENTS[0];

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right space-y-8">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#2d6a4f] bg-white dark:bg-[#162720] px-4 py-2 rounded-xl border border-gray-200 dark:border-emerald-900/40 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى قائمة الكورسات</span>
          </button>

          <span className="text-xs font-bold bg-[#f39c12]/20 text-[#d35400] dark:text-amber-300 px-3 py-1 rounded-full">
            {course.gradeLabel}
          </span>
        </div>

        {/* Top Hero Banner of the Course */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-[#1b4332] via-[#2d6a4f] to-[#122e22] text-white p-6 sm:p-10 border border-emerald-800/40 shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Main Column: Title & Information (Col 8) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#f39c12] text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  {course.badgeText}
                </span>
                <span className="bg-white/20 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-lg">
                  {course.subject}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-changa leading-tight">
                {course.title}
              </h1>

              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                {course.description}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-emerald-200 font-semibold border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#f39c12]" />
                  <span>المحاضر: مستر أحمد عبدالحميد</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#f39c12]" />
                  <span>{course.lessonsCount} محاضرات كاملة</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#f39c12]" />
                  <span>تاريخ البدء: {course.startDate}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Teacher & Pricing Enrollment Box (Col 4) */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col justify-between text-center space-y-5">
              
              {/* Teacher Avatar & Price */}
              <div>
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-[#f39c12] shadow-lg mb-3">
                  <img
                    src={TEACHER_IMAGE}
                    alt="مستر أحمد عبدالحميد"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="font-changa font-bold text-base text-white">
                  مستر أحمد عبدالحميد
                </p>
                <p className="text-xs text-emerald-200 font-medium">القائد في المواد الفلسفية</p>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-gray-300 block">سعر الاشتراك للكورس</span>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-3xl font-black font-changa text-[#f39c12]">{course.price}</span>
                  <span className="text-xs font-bold text-white">جنيه مصري</span>
                </div>
              </div>

              {/* Action Button */}
              {isEnrolled ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStartLesson(course.lessons[0], 0)}
                    className="w-full py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 text-[#f39c12]" />
                    <span>ابدأ مشاهدة المحاضرات الآن</span>
                  </button>
                  <p className="text-[11px] text-emerald-300 font-bold">
                    ✓ أنت مشترك في هذا الكورس بالكامل
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white font-black text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                    id="enroll-course-now-btn"
                  >
                    <Zap className="w-4 h-4" />
                    <span>اشترك في الكورس الآن ({course.price} ج.م)</span>
                  </button>
                  <p className="text-[10px] text-emerald-200">
                    رصيدك الحالي: {walletBalance} ج.م (يتم الخصم أو الشحن الفوري)
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Curriculum Outline & Lessons List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Lectures List (Col 8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
                جدول محاضرات ومحتوى الكورس
              </h3>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-bold">
                متسلسلة الحصص مفعلة 🔒
              </span>
            </div>

            {/* Sequential Notice */}
            <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
              <span className="text-lg">🔒</span>
              <p className="font-semibold leading-relaxed">
                <strong>نظام التتابع الإلزامي:</strong> لضمان التفوق وأعلى الدرجات، يشترط إكمال مشاهدة الحصة السابقة وحل كويز الواجب الخاص بها لفتح المحاضرة التالية مباشرة.
              </p>
            </div>

            <div className="space-y-3">
              {course.lessons.map((les, idx) => {
                const lockInfo = isLessonLocked(course, idx);
                const isLockedForStudent = isEnrolled && lockInfo.isLocked;
                const isCompleted = !!les.isCompleted;

                return (
                  <div
                    key={les.id}
                    className={`rounded-2xl p-5 border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/30'
                        : isLockedForStudent
                        ? 'bg-gray-50/80 dark:bg-[#131f1a] border-gray-200 dark:border-emerald-950/60 opacity-90'
                        : 'bg-white dark:bg-[#162720] border-emerald-900/15 dark:border-emerald-800/40 hover:border-[#2d6a4f]'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 font-changa ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isLockedForStudent
                          ? 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                          : 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                            {les.title}
                          </h4>
                          {isCompleted && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md">
                              تم إكمالها
                            </span>
                          )}
                          {isLockedForStudent && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Lock className="w-3 h-3" /> مقفولة بانتظار الواجب
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {les.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 pt-1 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{les.durationMinutes} دقيقة</span>
                          </span>
                          {les.hasQuiz && (
                            <span className="text-[#f39c12] font-bold">• كويز الحصة والواجب مرفق</span>
                          )}
                          <span className="text-emerald-600 font-bold">• فيديو محمي ضد السحب والشاشة</span>
                        </div>

                        {/* If locked, explain exactly how to unlock */}
                        {isLockedForStudent && lockInfo.reason && (
                          <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2 flex-wrap">
                            <span>🔒 {lockInfo.reason}</span>
                            {lockInfo.blockingQuiz && (
                              <button
                                onClick={() => openQuiz(lockInfo.blockingQuiz!)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] transition-colors"
                              >
                                حل الكويز الآن للفتح ⚡
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Play / Access Button */}
                    <div className="shrink-0 w-full sm:w-auto">
                      {isEnrolled ? (
                        isLockedForStudent ? (
                          <button
                            onClick={() => handleStartLesson(les, idx)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-amber-100 dark:bg-emerald-950/40 dark:hover:bg-amber-950/40 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>حل الواجب أولاً</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartLesson(les, idx)}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                              isCompleted
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                : 'bg-[#2d6a4f] hover:bg-[#1b4332] text-white'
                            }`}
                          >
                            <Play className="w-4 h-4 text-[#f39c12]" />
                            <span>{isCompleted ? 'إعادة مشاهدة الحصة' : 'تشغيل الحصة'}</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={handleEnrollClick}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-emerald-950/40 text-gray-600 dark:text-gray-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-200"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>محتوى مقفول</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Resources & Course Attachments (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PDF Notes Box */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4">
              <h4 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#f39c12]" />
                <span>المذكرات وملفات الـ PDF المرفقة</span>
              </h4>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-900/20 space-y-3">
                <p className="font-bold text-xs text-gray-800 dark:text-gray-200">
                  {attachedPdf.title}
                </p>
                <p className="text-[11px] text-gray-500">
                  {attachedPdf.pageCount} صفحة • حجم الملف {attachedPdf.fileSize}
                </p>

                <button
                  onClick={() => openPdf(attachedPdf)}
                  className="w-full py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold transition-colors"
                >
                  معاينة وتصفح المذكرة
                </button>
              </div>
            </div>

            {/* Anti-theft Protection Pledge */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2d6a4f] dark:text-emerald-400 font-bold text-sm">
                <Shield className="w-5 h-5" />
                <span>نظام حماية الفيديوهات المتقدم</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                جميع فيديوهات الحصص مدرجة عبر مشغل خاص ومحمي، ومزودة بعلامة مائية متحركة برقم هاتف الطالب واسمه، مع حظر كامل للتسجيل والتقاط الشاشة.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
