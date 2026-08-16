import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEACHER_IMAGE } from '../../data/mockData';
import { Course, GradeLevel, Lesson, StudentProgressRecord } from '../../types';
import { AdminQuizManager } from './AdminQuizManager';
import { AdminCodesManager } from './AdminCodesManager';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  Key, 
  BellRing, 
  PlusCircle, 
  CheckCircle2, 
  DollarSign, 
  BarChart3, 
  Layers, 
  ArrowLeft,
  Sparkles,
  Trash2,
  Lock,
  Unlock,
  Copy,
  Check,
  Search,
  MessageCircle,
  AlertTriangle,
  Clock,
  Video,
  Play,
  FileCheck
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { 
    user, 
    courses, 
    invoices, 
    addNewCourse,
    deleteCourse,
    addLessonToCourse,
    deleteLessonFromCourse,
    addNotification, 
    setActiveView,
    studentRecords,
    homeworkSubmissions,
    grantLessonException,
    toggleStudentCommitment,
    deleteStudentRecord,
    quizzes,
    rechargeCodes
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'homework' | 'overview' | 'courses' | 'quizzes' | 'codes' | 'broadcast'>('courses');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'success' | 'warning'>('info');

  // Student Monitoring Filter State
  const [searchStudentQuery, setSearchStudentQuery] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [selectedCommitmentFilter, setSelectedCommitmentFilter] = useState<string>('all');

  // Student exception unlock modal state
  const [selectedStudentForUnlock, setSelectedStudentForUnlock] = useState<StudentProgressRecord | null>(null);
  const [lessonToUnlockId, setLessonToUnlockId] = useState<string>('les-2');

  // New Course Modal / Form State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseGrade, setNewCourseGrade] = useState<GradeLevel>('second_general');
  const [newCoursePrice, setNewCoursePrice] = useState<number>(150);
  const [newCourseSubject, setNewCourseSubject] = useState('علم النفس والاجتماع');
  const [newCourseBadge, setNewCourseBadge] = useState('شرح جديد');

  // Add Lesson Modal / Form State (With Google Drive DRM Support)
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<Course | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDescription, setNewLessonDescription] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState<number>(45);
  const [newLessonDriveUrl, setNewLessonDriveUrl] = useState('');
  const [newLessonIsFree, setNewLessonIsFree] = useState(false);
  const [newLessonHasQuiz, setNewLessonHasQuiz] = useState(true);
  const [newLessonPdfTitle, setNewLessonPdfTitle] = useState('مذكرة الحصة بصيغة PDF');

  // Expandable course in courses tab
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    addNotification(`📢 إشعار من مستر أحمد عبدالحميد: ${broadcastMsg}`, broadcastType);
    setBroadcastMsg('');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle,
      subtitle: 'كورس تفاعلي بنظام نواتج التعلم والخرائط الذهنية',
      grade: newCourseGrade,
      subject: newCourseSubject,
      price: Number(newCoursePrice),
      originalPrice: Number(newCoursePrice) + 50,
      badgeText: newCourseBadge,
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      category: 'monthly',
      description: 'كورس مخصص مع أحدث التدريبات والأسئلة الوزارية وحصص الفيديو المحمية.',
      startDate: 'أغسطس 2026',
      gradeLabel: newCourseGrade.startsWith('second') ? 'الصف الثاني الثانوي' : 'الصف الأول الثانوي',
      lessonsCount: 4,
      totalHours: 8,
      outcomes: ['شرح تفصيلي ومبسط', 'كويز بعد كل محاضرة', 'مذكرة PDF مجانية', 'متابعة دورية'],
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: 'المحاضرة الأولى: التأسيس ونواتج التعلم',
          description: 'محاضرة تأسيسية تمهيدية ونواتج التعلم',
          durationMinutes: 45,
          videoUrl: 'https://drive.google.com/file/d/1_QaedLectureStreamSecurePreview/preview',
          driveFileId: '1_QaedLectureStreamSecurePreview',
          isFree: true,
          hasQuiz: true,
          isCompleted: false
        }
      ]
    };

    if (addNewCourse) {
      addNewCourse(newCourseObj);
    }
    setShowAddCourseModal(false);
    setNewCourseTitle('');
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLesson || !newLessonTitle.trim()) return;

    // Parse Google Drive Link / ID if entered
    let extractedDriveId = newLessonDriveUrl.trim();
    if (extractedDriveId.includes('drive.google.com')) {
      const match = extractedDriveId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        extractedDriveId = match[1];
      }
    }

    const newLessonObj: Lesson = {
      id: `les-${Date.now()}`,
      title: newLessonTitle,
      description: newLessonDescription || 'شرح تفصيلي مع تدريبات الفهم ونواتج التعلم',
      durationMinutes: Number(newLessonDuration) || 45,
      videoUrl: newLessonDriveUrl.trim() || 'https://drive.google.com/file/d/1_QaedLectureStreamSecurePreview/preview',
      driveFileId: extractedDriveId || '1_QaedLectureStreamSecurePreview',
      isFree: newLessonIsFree,
      hasQuiz: newLessonHasQuiz,
      quizId: newLessonHasQuiz ? `quiz-${Date.now()}` : undefined,
      pdfTitle: newLessonPdfTitle || 'مذكرة الحصة والواجب',
      pdfUrl: 'https://example.com/lecture.pdf',
      isCompleted: false
    };

    if (addLessonToCourse) {
      addLessonToCourse(selectedCourseForLesson.id, newLessonObj);
    }
    setSelectedCourseForLesson(null);
    setNewLessonTitle('');
    setNewLessonDescription('');
    setNewLessonDriveUrl('');
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    if (window.confirm(`هل أنت متأكد من حذف كورس "${courseTitle}" وجميع محاضراته؟`)) {
      if (deleteCourse) {
        deleteCourse(courseId);
      }
    }
  };

  const handleDeleteLesson = (courseId: string, lessonId: string, lessonTitle: string) => {
    if (window.confirm(`هل أنت متأكد من حذف محاضرة "${lessonTitle}" من الكورس؟`)) {
      if (deleteLessonFromCourse) {
        deleteLessonFromCourse(courseId, lessonId);
      }
    }
  };

  const handleGrantException = () => {
    if (selectedStudentForUnlock && lessonToUnlockId) {
      grantLessonException(selectedStudentForUnlock.id, lessonToUnlockId);
      setSelectedStudentForUnlock(null);
    }
  };

  // Filter students
  const filteredStudents = studentRecords.filter(std => {
    const matchesSearch = 
      std.studentName.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
      std.studentPhone.includes(searchStudentQuery) ||
      std.parentPhone.includes(searchStudentQuery) ||
      std.governorate.includes(searchStudentQuery);

    const matchesGrade = selectedGradeFilter === 'all' || std.grade === selectedGradeFilter;
    const matchesCommitment = selectedCommitmentFilter === 'all' || std.commitmentStatus === selectedCommitmentFilter;

    return matchesSearch && matchesGrade && matchesCommitment;
  });

  const generateWhatsAppParentUrl = (std: StudentProgressRecord) => {
    const cleanPhone = std.parentPhone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('0') ? `2${cleanPhone}` : cleanPhone;
    const message = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته،\nمعكم مستر أحمد عبدالحميد (القائد في المواد الفلسفية وعلم النفس).\n\nتقرير متابعة الطالب: ${std.studentName}\nالصف: ${std.gradeLabel}\nالكورس المشترك به: ${std.enrolledCourseTitle}\nنسبة حضور الحصص: ${std.completedLessonsCount} من ${std.totalLessonsCount} حصص\nمتوسط درجات امتحانات الحصص والواجب: ${std.averageScore}%\nحالة الالتزام: ${std.commitmentStatus}\nآخر نشاط بالمنصة: ${std.lastActivityDate}\n\nنرجو الاستمرار في المتابعة والتشجيع لتحقيق الدرجات النهائية بإذن الله.`
    );
    return `https://wa.me/${fullPhone}?text=${message}`;
  };

  const totalPlatformRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0c1712] py-8 transition-colors text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Banner */}
        <div className="bg-gradient-to-l from-[#11241c] via-[#1b4332] to-[#2d6a4f] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-[#f39c12] bg-[#0f241a] shrink-0 shadow-lg">
              <img 
                src={TEACHER_IMAGE} 
                alt="مستر أحمد عبدالحميد" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f39c12] text-black text-xs font-black px-3 py-1 rounded-full mb-2 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة تحكم المسؤول (الأدمن)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-changa">
                أهلاً بك يا مستر أحمد عبدالحميد
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1">
                رقم المسؤول: <span className="font-mono font-bold text-white ltr">01027568272</span> • إدارة المواد الفلسفية وعلم النفس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              id="admin-add-course-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة كورس جديد</span>
            </button>

            <button
              onClick={() => setActiveView('courses')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <span>عرض المنصة كطالب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top 4 Stat Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#162720] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">الطلاب تحت المتابعة</span>
              <span className="text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-300 block">{studentRecords.length} طالب</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#162720] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">تسليمات الواجبات والكويزات</span>
              <span className="text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-300 block">{homeworkSubmissions.length} تسليم</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#162720] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">إجمالي المعاملات والاشتراكات</span>
              <span className="text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-300 block">{totalPlatformRevenue} ج.م</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#162720] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">أكواد السنتر الفعالة</span>
              <span className="text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-300 block">
                {rechargeCodes.filter(c => !c.isUsed).length} كود
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-emerald-900/40 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('students')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 ${
              activeAdminTab === 'students'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>متابعة الطلاب ومتسلسلة الحصص</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('homework')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 ${
              activeAdminTab === 'homework'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>تسليمات امتحانات الحصص والواجبات</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('quizzes')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 ${
              activeAdminTab === 'quizzes'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>إدارة كويزات وواجبات الحصص ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
              activeAdminTab === 'overview'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            نظرة عامة والاشتراكات
          </button>

          <button
            onClick={() => setActiveAdminTab('courses')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
              activeAdminTab === 'courses'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            إدارة الكورسات
          </button>

          <button
            onClick={() => setActiveAdminTab('codes')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 ${
              activeAdminTab === 'codes'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>توليد كروت وأكواد السنتر</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('broadcast')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
              activeAdminTab === 'broadcast'
                ? 'bg-[#2d6a4f] text-white shadow-sm'
                : 'bg-white dark:bg-[#162720] text-gray-700 dark:text-gray-300 hover:bg-gray-50'
            }`}
          >
            إرسال إشعار عام
          </button>
        </div>

        {/* TAB: STUDENTS MONITORING */}
        {activeAdminTab === 'students' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-[#162720] p-4 sm:p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="بحث باسم الطالب أو الهاتف أو المحافظة..."
                  value={searchStudentQuery}
                  onChange={e => setSearchStudentQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#112019] text-xs font-bold focus:outline-hidden focus:border-[#2d6a4f]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                <select
                  value={selectedGradeFilter}
                  onChange={e => setSelectedGradeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#112019] text-xs font-bold"
                >
                  <option value="all">كل الصفوف الدراسية</option>
                  <option value="second_general">تانية ثانوي (عام)</option>
                  <option value="second_bac">تانية ثانوي (بكالوريا)</option>
                  <option value="first_general">أولى ثانوي (عام)</option>
                  <option value="first_bac">أولى ثانوي (بكالوريا)</option>
                </select>

                <select
                  value={selectedCommitmentFilter}
                  onChange={e => setSelectedCommitmentFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-emerald-900/50 bg-gray-50 dark:bg-[#112019] text-xs font-bold"
                >
                  <option value="all">كل حالات الالتزام</option>
                  <option value="ممتاز">ممتاز ⭐</option>
                  <option value="جيد جداً">جيد جداً</option>
                  <option value="يحتاج متابعة">يحتاج متابعة ⚠️</option>
                  <option value="مقصر بالواجبات">مقصر بالواجبات ❌</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-emerald-900/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#f39c12]" />
                    <span>سجل متابعة حضور الحصص وحل الواجبات</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    التحكم في فتح استثناء المحاضرات المقفولة وإرسال تقارير واتساب لأولياء الأمور
                  </p>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
                  {filteredStudents.length} طالب
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 dark:bg-[#112019] text-gray-600 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-emerald-900/30">
                    <tr>
                      <th className="p-4">بيانات الطالب</th>
                      <th className="p-4">الصف والكورس</th>
                      <th className="p-4">تقدم المحاضرات</th>
                      <th className="p-4">متوسط الواجبات</th>
                      <th className="p-4">حالة الالتزام</th>
                      <th className="p-4">متابعة ولي الأمر</th>
                      <th className="p-4 text-center">إجراءات الأدمن</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/20">
                    {filteredStudents.map(std => {
                      const progressPercentage = Math.round((std.completedLessonsCount / std.totalLessonsCount) * 100) || 0;
                      
                      return (
                        <tr key={std.id} className="hover:bg-gray-50/70 dark:hover:bg-[#13221b] transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{std.studentName}</p>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                              <span className="font-mono">{std.studentPhone}</span>
                              <span>•</span>
                              <span>{std.governorate}</span>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="font-bold text-gray-800 dark:text-gray-200 block">{std.gradeLabel}</span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{std.enrolledCourseTitle}</span>
                          </td>

                          <td className="p-4">
                            <div className="space-y-1.5 w-32">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                <span>{std.completedLessonsCount} من {std.totalLessonsCount} حصص</span>
                                <span className="text-emerald-600">{progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-emerald-950 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-emerald-600 h-full rounded-full transition-all"
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-black text-sm ${
                                std.averageScore >= 85 ? 'text-emerald-600' : std.averageScore >= 60 ? 'text-amber-500' : 'text-red-500'
                              }`}>
                                {std.averageScore}%
                              </span>
                              <span className="text-[11px] text-gray-400">
                                ({std.completedQuizzesCount} كويز)
                              </span>
                            </div>
                          </td>

                          <td className="p-4">
                            <select
                              value={std.commitmentStatus}
                              onChange={e => toggleStudentCommitment(std.id, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                std.commitmentStatus === 'ممتاز'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : std.commitmentStatus === 'جيد جداً'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
                                  : std.commitmentStatus === 'يحتاج متابعة'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                                  : 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
                              }`}
                            >
                              <option value="ممتاز">ممتاز ⭐</option>
                              <option value="جيد جداً">جيد جداً</option>
                              <option value="يحتاج متابعة">يحتاج متابعة ⚠️</option>
                              <option value="مقصر بالواجبات">مقصر بالواجبات ❌</option>
                            </select>
                          </td>

                          <td className="p-4">
                            <a
                              href={generateWhatsAppParentUrl(std)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>تقرير واتساب</span>
                            </a>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedStudentForUnlock(std)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-[11px] flex items-center gap-1 transition-colors"
                                title="فك قفل محاضرة يدوياً كاستثناء"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>استثناء فك قفل</span>
                              </button>

                              <button
                                onClick={() => deleteStudentRecord(std.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                title="حذف الطالب"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB: HOMEWORK & QUIZ SUBMISSIONS */}
        {activeAdminTab === 'homework' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#162720] rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-emerald-900/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#f39c12]" />
                    <span>سجل تسليمات امتحانات الحصص والواجبات الإلكترونية</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    متابعة فورية للدرجات والطلاب الذين اجتازوا الواجب لفك قفل المحاضرات المتسلسلة
                  </p>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
                  {homeworkSubmissions.length} تسليم مسجل
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 dark:bg-[#112019] text-gray-600 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-emerald-900/30">
                    <tr>
                      <th className="p-4">الطالب</th>
                      <th className="p-4">عنوان الكويز / الواجب</th>
                      <th className="p-4">الكورس</th>
                      <th className="p-4">الدرجة</th>
                      <th className="p-4">الحالة والنسبة</th>
                      <th className="p-4">توقيت التسليم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/20">
                    {homeworkSubmissions.map(hw => (
                      <tr key={hw.id} className="hover:bg-gray-50/70 dark:hover:bg-[#13221b] transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{hw.studentName}</p>
                          <span className="text-[11px] font-mono text-gray-400">{hw.studentPhone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-gray-800 dark:text-gray-200 block">{hw.quizTitle}</span>
                          <span className="text-[11px] text-gray-400">{hw.lessonTitle}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{hw.courseTitle}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-black text-sm text-gray-900 dark:text-white">{hw.score} / {hw.totalMarks}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1 ${
                            hw.status === 'passed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          }`}>
                            {hw.status === 'passed' ? '✓ تم الاجتياز والفتح' : '⚠️ راسب / لم يسلم'} ({hw.percentage}%)
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 font-mono text-[11px]">
                          {hw.submittedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Subscriptions & Invoices */}
            <div className="bg-white dark:bg-[#162720] p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#f39c12]" />
                <span>أحدث الاشتراكات وعمليات الدفع بالمنصة</span>
              </h3>

              <div className="space-y-3">
                {invoices.map(inv => (
                  <div key={inv.id} className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#101e17] border border-gray-200/60 dark:border-emerald-900/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100">{inv.courseTitle}</p>
                      <span className="text-gray-400 text-[11px]">{inv.orderNumber} • {inv.date}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm block">{inv.amount} ج.م</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        {inv.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Distribution */}
            <div className="bg-white dark:bg-[#162720] p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#f39c12]" />
                <span>توزيع المناهج الدراسية النشطة</span>
              </h3>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-[#1b4332] dark:text-emerald-200">الصف الثاني الثانوي (علم النفس والاجتماع - عام وبكالوريا)</span>
                    <span className="text-emerald-600 font-mono">68% من الطلاب</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-emerald-900/50 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#2d6a4f] h-full rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20 space-y-1.5">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-amber-900 dark:text-amber-200">الصف الأول الثانوي (عام وبكالوريا)</span>
                    <span className="text-amber-600 font-mono">32% من الطلاب</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-amber-900/50 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#f39c12] h-full rounded-full" style={{ width: '32%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>تأمين الفيديوهات وحماية المحتوى الفلسفي</span>
                  </p>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    تم تفعيل علامة مائية متحركة باسم ورقم الطالب على جميع الفيديوهات، مع منع لقطات الشاشة أو النسخ لحماية حصص مستر أحمد عبدالحميد.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COURSES & LESSONS MANAGEMENT */}
        {activeAdminTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-[#162720] p-5 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40">
              <div>
                <h3 className="font-bold text-lg text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#f39c12]" />
                  <span>إدارة الكورسات والمحاضرات والحصص ({courses.length} كورس)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  يمكنك إضافة كورس جديد، حذف الكورسات، أو إضافة وحذف حصص وفيديوهات داخل كل كورس
                </p>
              </div>
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4 text-[#f39c12]" />
                <span>إضافة كورس جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {courses.map(course => {
                const isExpanded = expandedCourseId === course.id;
                return (
                  <div 
                    key={course.id} 
                    className="bg-white dark:bg-[#162720] rounded-2xl border border-emerald-900/15 dark:border-emerald-800/40 p-5 space-y-4 shadow-xs"
                  >
                    {/* Course Header Bar */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold bg-[#f39c12]/20 text-[#d35400] dark:text-amber-300 px-2.5 py-0.5 rounded-md">
                            {course.subject}
                          </span>
                          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-md">
                            {course.badgeText}
                          </span>
                          <span className="text-[11px] font-mono text-gray-500">
                            {course.gradeLabel}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-[#1b4332] dark:text-emerald-200">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.subtitle}
                        </p>
                      </div>

                      {/* Course Meta & Actions */}
                      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-emerald-900/30">
                        <div className="text-left font-mono">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                            {course.price} ج.م
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {course.lessons.length} محاضرات
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedCourseForLesson(course);
                              setNewLessonTitle(`المحاضرة ${course.lessons.length + 1}: `);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                            title="إضافة محاضرة جديدة لهذا الكورس"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>إضافة حصة</span>
                          </button>

                          <button
                            onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 hover:bg-gray-50 dark:hover:bg-[#12211a] text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1 transition-colors"
                          >
                            <Layers className="w-3.5 h-3.5 text-[#f39c12]" />
                            <span>{isExpanded ? 'إخفاء الحصص' : `عرض الحصص (${course.lessons.length})`}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 transition-colors"
                            title="حذف الكورس نهائياً"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Lessons List */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-gray-100 dark:border-emerald-900/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            قائمة محاضرات وحصص الكورس:
                          </span>
                          <button
                            onClick={() => {
                              setSelectedCourseForLesson(course);
                              setNewLessonTitle(`المحاضرة ${course.lessons.length + 1}: `);
                            }}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ إضافة محاضرة جديدة</span>
                          </button>
                        </div>

                        {course.lessons.length === 0 ? (
                          <p className="text-xs text-gray-400 py-3 text-center bg-gray-50 dark:bg-[#111f18] rounded-xl">
                            لا توجد محاضرات مضافة بعد في هذا الكورس. اضغط على «إضافة حصة» لإضافة أول محاضرة.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {course.lessons.map((les, index) => (
                              <div
                                key={les.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#111f18] border border-gray-200/60 dark:border-emerald-900/30 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                                      {les.title}
                                    </h5>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                      <span className="flex items-center gap-1 font-mono">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        {les.durationMinutes} دقيقة
                                      </span>
                                      {les.isFree && (
                                        <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                                          مجانية تجريبية
                                        </span>
                                      )}
                                      {les.hasQuiz && (
                                        <span className="text-[#f39c12] font-bold bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                          <FileCheck className="w-3 h-3" />
                                          امتحان وواجب إلكتروني
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                  <span className="text-[11px] font-mono text-gray-400">
                                    ID: {les.youtubeId}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteLesson(course.id, les.id, les.title)}
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                                    title="حذف هذه المحاضرة"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: QUIZZES AND HOMEWORK MANAGER */}
        {activeAdminTab === 'quizzes' && (
          <AdminQuizManager />
        )}

        {/* TAB: CENTER RECHARGE CODES GENERATOR */}
        {activeAdminTab === 'codes' && (
          <AdminCodesManager />
        )}

        {/* TAB 4: BROADCAST NOTIFICATIONS */}
        {activeAdminTab === 'broadcast' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#162720] p-6 sm:p-8 rounded-2xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-lg text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-[#f39c12]" />
                <span>إرسال إشعار فوري لجميع الطلاب على المنصة</span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                سيظهر الإشعار فوراً في شريط التنبيهات مع إمكانية التخطي أو الإغلاق بمرونة.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  نوع الإشعار
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="notif_type"
                      checked={broadcastType === 'info'}
                      onChange={() => setBroadcastType('info')}
                      className="text-[#2d6a4f]"
                    />
                    <span>معلومة هامة (أزرق)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="notif_type"
                      checked={broadcastType === 'success'}
                      onChange={() => setBroadcastType('success')}
                      className="text-[#2d6a4f]"
                    />
                    <span>إعلان نزول كورس/حصة (أخضر)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="notif_type"
                      checked={broadcastType === 'warning'}
                      onChange={() => setBroadcastType('warning')}
                      className="text-[#2d6a4f]"
                    />
                    <span>تنبيه موعد كويز (برتقالي)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  نص الرسالة
                </label>
                <textarea
                  required
                  rows={4}
                  value={broadcastMsg}
                  onChange={e => setBroadcastMsg(e.target.value)}
                  placeholder="اكتب هنا الإشعار الذي تريد إرساله للطلاب..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <BellRing className="w-4 h-4 text-[#f39c12]" />
                <span>إرسال الإشعار لجميع الطلاب</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Grant Lesson Exception Modal */}
      {selectedStudentForUnlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#15231c] rounded-3xl p-6 sm:p-8 max-w-md w-full text-right shadow-2xl border border-emerald-900/30 space-y-5">
            <div className="flex items-center gap-3 text-amber-500">
              <Unlock className="w-6 h-6" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                منح استثناء فك قفل المحاضرة للطالب
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              الطالب: <strong>{selectedStudentForUnlock.studentName}</strong>
              <br />
              الكورس: {selectedStudentForUnlock.enrolledCourseTitle}
            </p>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                اختر المحاضرة المراد فتحها مباشرة بدون شرط الواجب:
              </label>
              <select
                value={lessonToUnlockId}
                onChange={e => setLessonToUnlockId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-xs font-bold bg-white dark:bg-[#111f18]"
              >
                <option value="les-2">المحاضرة 2: تعريف علم النفس وأهدافه ومجالاته</option>
                <option value="les-3">المحاضرة 3: مناهج البحث في علم النفس</option>
                <option value="les-4">المحاضرة 4: العمليات المعرفية والذاكرة</option>
                <option value="les-301">المحاضرة 1: التفكير الإنساني</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedStudentForUnlock(null)}
                className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleGrantException}
                className="w-2/3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-4 h-4" />
                <span>تأكيد فك القفل للطالب</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#15231c] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl border border-emerald-900/30 space-y-4">
            <h3 className="font-bold text-lg text-[#1b4332] dark:text-emerald-300">
              إضافة كورس جديد لمنصة القائد
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  عنوان الكورس
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={e => setNewCourseTitle(e.target.value)}
                  placeholder="مثال: كورس شهر أكتوبر - علم النفس والاجتماع"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-xs font-bold bg-white dark:bg-[#111f18]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    الصف الدراسي
                  </label>
                  <select
                    value={newCourseGrade}
                    onChange={e => setNewCourseGrade(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-xs font-bold bg-white dark:bg-[#111f18]"
                  >
                    <option value="second_general">الصف الثاني الثانوي (عام)</option>
                    <option value="second_bac">الصف الثاني الثانوي (بكالوريا)</option>
                    <option value="first_general">الصف الأول الثانوي (عام)</option>
                    <option value="first_bac">الصف الأول الثانوي (بكالوريا)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    المادة
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseSubject}
                    onChange={e => setNewCourseSubject(e.target.value)}
                    placeholder="علم النفس والاجتماع"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-xs font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    سعر الاشتراك (جنيه)
                  </label>
                  <input
                    type="number"
                    required
                    value={newCoursePrice}
                    onChange={e => setNewCoursePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-xs font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    شارة الكورس (Badge)
                  </label>
                  <input
                    type="text"
                    value={newCourseBadge}
                    onChange={e => setNewCourseBadge(e.target.value)}
                    placeholder="شهر جديد 🔥"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-xs font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#2d6a4f] text-white font-bold text-xs shadow-md"
                >
                  حفظ ونشر الكورس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {selectedCourseForLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#15231c] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl border border-emerald-900/30 space-y-4 my-8">
            <div className="flex items-center gap-2.5 text-[#1b4332] dark:text-emerald-300 border-b border-gray-100 dark:border-emerald-900/40 pb-3">
              <Video className="w-6 h-6 text-[#f39c12]" />
              <div>
                <h3 className="font-bold text-base">
                  إضافة محاضرة جديدة للكورس
                </h3>
                <p className="text-xs text-gray-500">
                  الكورس: {selectedCourseForLesson.title}
                </p>
              </div>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  عنوان المحاضرة / الحصة *
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  placeholder="مثال: المحاضرة 3: العمليات المعرفية ونواتج التعلم"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  وصف مختصر للمحاضرة
                </label>
                <textarea
                  rows={2}
                  value={newLessonDescription}
                  onChange={e => setNewLessonDescription(e.target.value)}
                  placeholder="شرح أفكار الأسئلة والخرائط الذهنية وتطبيق النظام الجديد"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-medium bg-white dark:bg-[#111f18]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    مدة الفيديو (بالدقائق)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={newLessonDuration}
                    onChange={e => setNewLessonDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    رابط أو كود فيديو جوجل درايف (Google Drive) *
                  </label>
                  <input
                    type="text"
                    value={newLessonDriveUrl}
                    onChange={e => setNewLessonDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-mono text-left bg-white dark:bg-[#111f18]"
                  />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-1">
                    🔒 مشغل آمن ومحمي من الفتح الخارجي أو النسخ
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  عنوان ملف الـ PDF المرفق
                </label>
                <input
                  type="text"
                  value={newLessonPdfTitle}
                  onChange={e => setNewLessonPdfTitle(e.target.value)}
                  placeholder="مذكرة الحصة والواجب المنزلي"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                />
              </div>

              {/* Checkboxes */}
              <div className="p-3 bg-gray-50 dark:bg-[#111f18] rounded-xl space-y-2 border border-gray-200/60 dark:border-emerald-900/40">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLessonHasQuiz}
                    onChange={e => setNewLessonHasQuiz(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    تفعيل كويز وواجب إلكتروني إلزامي لفك قفل المحاضرة التالية
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLessonIsFree}
                    onChange={e => setNewLessonIsFree(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    إتاحة المحاضرة مجاناً كمعاينة وتجربة قبل الشراء
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedCourseForLesson(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>تأكيد إضافة الحصة للكورس</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
