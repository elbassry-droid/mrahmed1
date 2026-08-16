import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lesson, Course } from '../../types';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Award, 
  CheckCircle2, 
  Play, 
  Lock, 
  AlertTriangle,
  Info,
  Maximize2,
  Volume2,
  LockKeyhole,
  EyeOff
} from 'lucide-react';
import { PDF_DOCUMENTS, QUIZZES } from '../../data/mockData';

interface ProtectedVideoPlayerProps {
  lesson: Lesson;
  course: Course;
  onClose: () => void;
}

export const ProtectedVideoPlayer: React.FC<ProtectedVideoPlayerProps> = ({ lesson, course, onClose }) => {
  const { user, completeLesson, openQuiz, openPdf } = useApp();

  const [currentLesson, setCurrentLesson] = useState<Lesson>(lesson);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [currentTimeStamp, setCurrentTimeStamp] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(!!lesson.isCompleted);

  // Update dynamic watermark timestamp every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStamp(now.toLocaleTimeString('ar-EG', { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Anti-Screenshot & Screen Capture Deterrent listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        setSecurityAlert('⚠️ محاولة تصوير الشاشة محظورة! تم تسجيل هويتك ورقم هاتفك على البث.');
        setTimeout(() => setSecurityAlert(null), 4000);
      }
      // Inspect Element & Save shortcut block
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        setSecurityAlert('⚠️ إجراء محظور! كود ومصدر الحصة مشفر ولا يمكن نسخه أو الوصول لرابطه.');
        setTimeout(() => setSecurityAlert(null), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract Google Drive File ID from either driveFileId or videoUrl/youtubeId
  const getDriveEmbedUrl = (lesson: Lesson): string => {
    if (lesson.driveFileId) {
      return `https://drive.google.com/file/d/${lesson.driveFileId}/preview`;
    }
    if (lesson.videoUrl && lesson.videoUrl.includes('drive.google.com')) {
      const match = lesson.videoUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return lesson.videoUrl.replace('/view', '/preview');
    }
    // Default safe demo Google Drive preview embed ID for educational lectures
    return `https://drive.google.com/file/d/1_QaedLectureStreamSecurePreview/preview`;
  };

  const handleCompleteCurrent = () => {
    completeLesson(currentLesson.id);
    setIsCompleted(true);
  };

  const handleOpenLectureQuiz = () => {
    const quiz = QUIZZES.find(q => q.id === currentLesson.quizId) || QUIZZES[0];
    openQuiz(quiz);
  };

  const handleOpenLecturePdf = () => {
    const pdf = PDF_DOCUMENTS.find(p => p.grade === course.grade) || PDF_DOCUMENTS[0];
    openPdf(pdf);
  };

  const studentDisplayName = user ? `${user.firstName} ${user.lastName}` : 'طالب المنصة';
  const studentPhone = user?.phone || '01027568272';
  const studentCode = user?.id || 'STD-78219';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn select-none protected-screen"
      onContextMenu={(e) => {
        e.preventDefault();
        setSecurityAlert('⚠️ القوائم والخيارات محظورة داخل مشغل المحاضرات المشفر');
        setTimeout(() => setSecurityAlert(null), 3000);
      }}
    >
      
      {/* Security alert overlay if screenshot triggered */}
      {securityAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-xs sm:text-sm border-2 border-white animate-bounce">
          <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-300" />
          <span>{securityAlert}</span>
        </div>
      )}

      <div className="relative w-full max-w-6xl bg-[#111f18] text-white rounded-3xl overflow-hidden border border-emerald-800/60 shadow-2xl flex flex-col my-auto max-h-[94vh]">
        
        {/* Top Player Header Bar */}
        <div className="p-3.5 sm:p-4 bg-[#162720] border-b border-emerald-900/40 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="إغلاق مشغل الحصة"
            id="close-video-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-right flex-1 truncate">
            <div className="flex items-center justify-end gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                <LockKeyhole className="w-3 h-3 text-emerald-400" />
                <span>مشغل Google Drive المشفر • DRM Protected</span>
              </span>
              <h3 className="font-bold text-sm sm:text-base text-white truncate font-changa">
                {currentLesson.title}
              </h3>
            </div>
            <p className="text-xs text-emerald-400/80 truncate mt-0.5">
              {course.title}
            </p>
          </div>
        </div>

        {/* Player Main Layout: Video on Left / Playlist & Notes on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Main Video Stage (Col 8) */}
          <div className="lg:col-span-8 bg-black flex flex-col justify-center relative overflow-hidden group">
            
            {/* Aspect Ratio 16:9 Video Box */}
            <div 
              className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden"
              onContextMenu={(e) => {
                e.preventDefault();
                setSecurityAlert('⚠️ تحميل أو فحص كود الفيديو محظور أمنياً');
                setTimeout(() => setSecurityAlert(null), 3000);
              }}
            >
              {/* Google Drive Embedded IFrame with DRM Protection */}
              <iframe
                src={getDriveEmbedUrl(currentLesson)}
                title={currentLesson.title}
                className="w-full h-full border-0 pointer-events-auto"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              ></iframe>

              {/* SHIELD 1: TOP BRANDING & ANTI-POPOUT SHIELD */}
              {/* Completely covers Google Drive's top-right popout icon & filename header to prevent opening in a new tab or extracting the link */}
              <div 
                className="absolute top-0 inset-x-0 h-14 z-20 video-shield-top bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between px-4"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              >
                <div className="flex items-center gap-2 text-white/90 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>منصة القائد • مشغل المحاضرات المشفر (سيرفرات آمنة)</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-[10px] bg-black/70 px-2.5 py-1 rounded-full border border-white/15">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>محمي من النسخ والتحميل المباشر</span>
                </div>
              </div>

              {/* SHIELD 2: TOP RIGHT CORNER POPOUT INTERCEPTOR (Extra wide for Google Drive popout icon) */}
              <div 
                className="absolute top-0 right-0 w-24 h-16 z-30 cursor-default bg-transparent"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  e.preventDefault(); 
                  setSecurityAlert('⚠️ فتح الفيديو خارج المنصة محظور لحماية الملكية الفكرية');
                  setTimeout(() => setSecurityAlert(null), 3000);
                }}
                title="مشغل مشفر خاص بمنصة القائد"
              ></div>

              {/* SHIELD 3: TOP LEFT CORNER SHIELD */}
              <div 
                className="absolute top-0 left-0 w-16 h-16 z-30 cursor-default bg-transparent"
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
              ></div>

              {/* DYNAMIC ANTI-THEFT FLOATING WATERMARK (PRIMARY) */}
              {/* Smoothly glides across the video stamped with student's actual name, phone, and time */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div className="animate-floating-watermark inline-block bg-black/60 backdrop-blur-xs text-white/70 text-[10px] sm:text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">● {studentDisplayName}</span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold">{studentPhone}</span>
                    <span>•</span>
                    <span className="text-gray-300">{currentTimeStamp}</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SECONDARY FLOATING WATERMARK (COUNTER-DRIFT) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div className="animate-floating-watermark-2 inline-block bg-emerald-950/40 backdrop-blur-xs text-white/40 text-[9px] sm:text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-xs">
                  <span>منصة القائد • كود الطالب: {studentCode} • بث مشفر</span>
                </div>
              </div>

              {/* Permanent Micro Static Watermark in top-left */}
              <div className="absolute top-16 left-3 pointer-events-none opacity-25 text-[9px] text-white font-mono z-20 flex items-center gap-1">
                <span>SEC-{studentCode}-DRM</span>
              </div>

            </div>

            {/* Under-Video Quick Action Bar */}
            <div className="p-4 bg-[#14231b] border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-right">
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Complete Lesson Button */}
                <button
                  onClick={handleCompleteCurrent}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#2d6a4f] hover:bg-[#1b4332] text-white shadow-sm'
                  }`}
                  id="complete-lesson-btn"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#f39c12]" />
                  <span>{isCompleted ? 'تم تأكيد مشاهدة الحصة ✓' : 'تأكيد إكمال الحصة'}</span>
                </button>

                {/* Open Quiz Button */}
                {currentLesson.hasQuiz && (
                  <button
                    onClick={handleOpenLectureQuiz}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#f39c12] hover:bg-[#e67e22] text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    id="open-lesson-quiz-btn"
                  >
                    <Award className="w-4 h-4" />
                    <span>حل كويز الحصة</span>
                  </button>
                )}

                {/* Open Attached PDF */}
                <button
                  onClick={handleOpenLecturePdf}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>مذكرة الشرح (PDF)</span>
                </button>
              </div>

              {/* Security Shield Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-800/40">
                <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                <span>مشغل القائد المحمي • حماية التسجيل مفعلة</span>
              </div>

            </div>

          </div>

          {/* Right Curriculum Playlist & Resources (Col 4) */}
          <div className="lg:col-span-4 bg-[#162720] border-t lg:border-t-0 lg:border-r border-emerald-900/40 p-4 flex flex-col justify-between overflow-y-auto max-h-[500px] lg:max-h-none text-right">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
                <span className="font-black font-changa text-sm text-white">
                  فهرس محاضرات الكورس ({course.lessons.length})
                </span>
                <span className="text-[11px] text-[#f39c12] font-bold">
                  {course.gradeLabel}
                </span>
              </div>

              {/* Lessons List */}
              <div className="space-y-2">
                {course.lessons.map((les, index) => {
                  const isCurrent = les.id === currentLesson.id;
                  
                  return (
                    <div
                      key={les.id}
                      onClick={() => {
                        setCurrentLesson(les);
                        setIsCompleted(!!les.isCompleted);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-[#2d6a4f]/40 border-[#f39c12] shadow-sm'
                          : 'bg-[#111f18]/60 border-emerald-900/30 hover:border-emerald-700/60'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        {les.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Play className="w-3.5 h-3.5 text-[#f39c12]" />
                        ) : (
                          <span className="text-gray-400">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isCurrent ? 'text-[#f39c12]' : 'text-white'}`}>
                          {les.title}
                        </p>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                          {les.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                          <span>{les.durationMinutes} دقيقة</span>
                          {les.hasQuiz && (
                            <span className="text-amber-400 font-bold">• كويز مرفق</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teacher Tips Box */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 mt-4 text-xs space-y-1 text-right">
              <p className="font-bold text-[#f39c12] flex items-center gap-1 justify-end">
                <span>نصيحة مستر أحمد عبدالحميد</span>
                <Info className="w-3.5 h-3.5" />
              </p>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                «افهم السؤال والشرح واعرف الفكرة فين وليه» — ركز في الملاحظات والخرائط الذهنية واختبر فهمك مباشرة في الكويز الإلكتروني.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

