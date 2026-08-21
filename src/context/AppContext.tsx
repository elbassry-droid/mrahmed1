import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Course, GradeLevel, HomeworkSubmission, Invoice, Lesson, PdfDocument, Quiz, QuizResult, RechargeCode, StudentProgressRecord, User, DeviceConflictInfo } from '../types';
import { COURSES, ADMIN_USER, ADMIN_CREDENTIALS, PDF_DOCUMENTS, QUIZZES, SAMPLE_INVOICES, MOCK_STUDENT_RECORDS, MOCK_HOMEWORK_SUBMISSIONS } from '../data/mockData';
import { getOrCreateDeviceId, getCurrentDeviceInfo, broadcastDeviceSession, subscribeToDeviceSync, DeviceInfo } from '../utils/deviceSecurity';

export interface AppNotification {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  timestamp: string;
}

export interface LessonLockStatus {
  isLocked: boolean;
  reason?: string;
  blockingLesson?: Lesson;
  blockingQuiz?: Quiz;
  requiredQuizSolved: boolean;
  prevLessonCompleted: boolean;
}

const INITIAL_RECHARGE_CODES: RechargeCode[] = [
  { code: 'QAED-50-A101', amount: 50, grade: 'جميع الصفوف', isUsed: false, createdAt: '2026-08-01' },
  { code: 'QAED-100-B202', amount: 100, grade: 'جميع الصفوف', isUsed: false, createdAt: '2026-08-01' },
  { code: 'QAED-120-C303', amount: 120, grade: 'الصف الثاني الثانوي', isUsed: false, createdAt: '2026-08-01' },
  { code: 'QAED-150-D404', amount: 150, grade: 'الصف الثالث الثانوي', isUsed: false, createdAt: '2026-08-01' },
  { code: 'QAED-200-E505', amount: 200, grade: 'الصف الثالث الثانوي', isUsed: false, createdAt: '2026-08-01' },
  { code: 'CENTER-SENIOR-99', amount: 150, grade: 'الصف الأول الثانوي', isUsed: false, createdAt: '2026-08-01' }
];

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedGrade: GradeLevel | 'all';
  setSelectedGrade: (grade: GradeLevel | 'all') => void;
  activeView: 'landing' | 'dashboard' | 'courses' | 'account' | 'exams' | 'pdfs' | 'course_detail' | 'admin';
  setActiveView: (view: 'landing' | 'dashboard' | 'courses' | 'account' | 'exams' | 'pdfs' | 'course_detail' | 'admin') => void;
  
  // Courses & Sequential Progression
  courses: Course[];
  selectedCourse: Course | null;
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string, paymentMethod: Invoice['paymentMethod']) => boolean;
  addNewCourse?: (newCourse: Course) => void;
  deleteCourse?: (courseId: string) => void;
  addLessonToCourse?: (courseId: string, lesson: Lesson) => void;
  deleteLessonFromCourse?: (courseId: string, lessonId: string) => void;
  isLessonLocked: (course: Course, lessonIndex: number) => LessonLockStatus;
  
  // Active Modals & Views
  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  
  activeCourseDetail: Course | null;
  openCourseDetail: (course: Course) => void;
  closeCourseDetail: () => void;

  activeLesson: Lesson | null;
  activeLessonCourse: Course | null;
  openVideoPlayer: (lesson: Lesson, course: Course) => void;
  closeVideoPlayer: () => void;
  completeLesson: (lessonId: string) => void;

  // Quizzes & Homework Management
  quizzes: Quiz[];
  activeQuiz: Quiz | null;
  openQuiz: (quiz: Quiz) => void;
  closeQuiz: () => void;
  saveQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => void;
  quizResults: QuizResult[];
  addNewQuiz: (quiz: Quiz) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (quizId: string) => void;

  activePdf: PdfDocument | null;
  openPdf: (pdf: PdfDocument) => void;
  closePdf: () => void;

  rechargeModalOpen: boolean;
  openRechargeModal: () => void;
  closeRechargeModal: () => void;
  rechargeWallet: (amount: number, method: string, code?: string) => void;

  // Recharge Codes / Center Cards (Strict Validation)
  rechargeCodes: RechargeCode[];
  generateRechargeCode: (amount: number, grade: string, customCode?: string) => RechargeCode;
  deleteRechargeCode: (code: string) => void;
  redeemRechargeCode: (code: string) => { success: boolean; message: string; amount?: number };

  // Invoices & Balance
  invoices: Invoice[];
  walletBalance: number;

  // Student Monitoring (Admin)
  studentRecords: StudentProgressRecord[];
  homeworkSubmissions: HomeworkSubmission[];
  grantLessonException: (recordId: string, lessonId: string) => void;
  toggleStudentCommitment: (recordId: string, status: StudentProgressRecord['commitmentStatus']) => void;
  deleteStudentRecord: (recordId: string) => void;
  toggleStudentBlock: (studentIdOrRecordId: string, reason?: string) => void;

  // Single Device Protection & Security Management
  currentDeviceId: string;
  currentDeviceInfo: DeviceInfo;
  deviceConflictInfo: DeviceConflictInfo | null;
  clearDeviceConflict: () => void;
  forceTransferDevice: (phone: string, pass: string) => boolean;
  deviceKickedAlert: { isOpen: boolean; newDeviceName: string; timestamp: string } | null;
  closeDeviceKickedAlert: () => void;
  adminResetStudentDevice: (studentId: string) => void;

  // Authentication actions
  login: (phone: string, pass: string, forceTransfer?: boolean) => boolean;
  register: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  
  // Notifications & Flexibility
  notifications: AppNotification[];
  addNotification: (msg: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('qaed_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('second_general');
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'courses' | 'account' | 'exams' | 'pdfs' | 'course_detail' | 'admin'>('landing');

  // Courses & Enrollment
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('qaed_enrolled_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });
  
  // Invoices & Wallet
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('qaed_invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Recharge Codes / Center Cards (strictly admin-created)
  const [rechargeCodes, setRechargeCodes] = useState<RechargeCode[]>(() => {
    const saved = localStorage.getItem('qaed_recharge_codes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_RECHARGE_CODES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('qaed_recharge_codes', JSON.stringify(rechargeCodes));
    } catch (e) {}
  }, [rechargeCodes]);

  // Quizzes & Homework state
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('qaed_quizzes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return QUIZZES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('qaed_quizzes', JSON.stringify(quizzes));
    } catch (e) {}
  }, [quizzes]);

  // Student Monitoring Data (Admin)
  const [studentRecords, setStudentRecords] = useState<StudentProgressRecord[]>(MOCK_STUDENT_RECORDS);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(MOCK_HOMEWORK_SUBMISSIONS);

  // Exam Results
  const [quizResults, setQuizResults] = useState<QuizResult[]>([
    {
      id: 'res-1',
      quizId: 'quiz-1',
      quizTitle: 'كويز المحاضرة الأولى: نشأة علم النفس وتطوره ومدارسه الكبرى - 2 ثانوي',
      score: 18,
      totalMarks: 20,
      percentage: 90,
      date: 'الأحد 2 أغسطس 2026',
      answers: { q1: 0, q2: 0, q3: 0, q4: 0 }
    }
  ]);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [activeCourseDetail, setActiveCourseDetail] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeLessonCourse, setActiveLessonCourse] = useState<Course | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activePdf, setActivePdf] = useState<PdfDocument | null>(null);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);

  // Single Device & Device Security State
  const currentDeviceId = useMemo(() => getOrCreateDeviceId(), []);
  const currentDeviceInfo = useMemo(() => getCurrentDeviceInfo(), []);
  const [deviceConflictInfo, setDeviceConflictInfo] = useState<DeviceConflictInfo | null>(null);
  const [deviceKickedAlert, setDeviceKickedAlert] = useState<{ isOpen: boolean; newDeviceName: string; timestamp: string } | null>(null);

  // Stored Registered Students with their Device Bindings
  const [registeredStudents, setRegisteredStudents] = useState<User[]>(() => {
    const saved = localStorage.getItem('qaed_registered_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('qaed_registered_students', JSON.stringify(registeredStudents));
    } catch (e) {}
  }, [registeredStudents]);

  // Real-time Single Device Listener: Kicks this session if the user logs in from another device
  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const unsubscribe = subscribeToDeviceSync(user.id, currentDeviceId, (payload) => {
      // Force logout on this device
      setUser(null);
      setDeviceKickedAlert({
        isOpen: true,
        newDeviceName: payload.activeDeviceName || 'جهاز آخر',
        timestamp: new Date(payload.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      });
      addNotification('⚠️ تم إنهاء جلستك: تم تشغيل هذا الحساب من جهاز آخر.', 'error');
    });

    return () => unsubscribe();
  }, [user, currentDeviceId]);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      message: 'مرحباً بك في منصة القائد في المواد الفلسفية وعلم النفس مع مستر أحمد عبدالحميد!',
      type: 'success',
      timestamp: 'الآن'
    },
    {
      id: 'notif-2',
      message: '🔒 نظام حماية الحسابات مفعل: كل حساب مقفل ومرتبط بجهاز واحد فقط لمنع مشاركة الحسابات.',
      type: 'info',
      timestamp: 'منذ قليل'
    }
  ]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('qaed_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qaed_user');
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addNotification = (msg: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      message: msg,
      type,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 5)]);

    setTimeout(() => {
      removeNotification(newNotif.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  const openCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setActiveCourseDetail(course);
    setActiveView('course_detail');
  };

  const closeCourseDetail = () => {
    setSelectedCourse(null);
    setActiveCourseDetail(null);
    setActiveView('courses');
  };

  // Check if a specific lesson is locked in the sequential progression
  const isLessonLocked = (course: Course, lessonIndex: number): LessonLockStatus => {
    // Check if user is manually blocked by admin for lagging/accumulation
    const currentStudentRecord = studentRecords.find(r => r.studentPhone === user?.phone || r.studentId === user?.id);
    if (user?.isBlocked || currentStudentRecord?.isBlocked) {
      const reasonText = user?.blockedReason || currentStudentRecord?.blockedReason || 'تراكم المحاضرات وعدم متابعة الحصص أولاً بأول';
      return {
        isLocked: true,
        reason: `🚫 حسابك محظور من قبل الإدارة بسبب: (${reasonText}). يرجى التواصل مع مستر أحمد عبدالحميد لفك الحظر.`,
        requiredQuizSolved: false,
        prevLessonCompleted: false
      };
    }

    // First lesson in course is always accessible if enrolled
    if (lessonIndex <= 0) {
      return {
        isLocked: false,
        requiredQuizSolved: true,
        prevLessonCompleted: true
      };
    }

    const prevLesson = course.lessons[lessonIndex - 1];
    if (!prevLesson) {
      return { isLocked: false, requiredQuizSolved: true, prevLessonCompleted: true };
    }

    const currentLesson = course.lessons[lessonIndex];

    // Check if admin has granted an exception for current student on this lesson
    if (currentStudentRecord?.unlockedExceptionLessonIds?.includes(currentLesson.id)) {
      return {
        isLocked: false,
        requiredQuizSolved: true,
        prevLessonCompleted: true
      };
    }

    // 1. Check if previous lesson was watched & completed
    const prevCompleted = !!prevLesson.isCompleted;
    if (!prevCompleted) {
      return {
        isLocked: true,
        reason: `يجب مشاهدة وإكمال المحاضرة السابقة (${prevLesson.title}) أولاً`,
        blockingLesson: prevLesson,
        prevLessonCompleted: false,
        requiredQuizSolved: false
      };
    }

    // 2. Check if previous lesson had a quiz/homework and if it was submitted
    if (prevLesson.hasQuiz) {
      const quizIdToSolve = prevLesson.quizId || `quiz-${prevLesson.id}`;
      const isQuizPassed = quizResults.some(r => r.quizId === prevLesson.quizId || r.quizTitle.includes(prevLesson.title));
      const blockingQuizObj = QUIZZES.find(q => q.id === prevLesson.quizId || q.lessonId === prevLesson.id) || QUIZZES[0];

      if (!isQuizPassed) {
        return {
          isLocked: true,
          reason: `يجب حل امتحان الحصة والواجب الإلكتروني الخاص بالمحاضرة السابقة أولاً لفك قفل هذه المحاضرة`,
          blockingLesson: prevLesson,
          blockingQuiz: blockingQuizObj,
          prevLessonCompleted: true,
          requiredQuizSolved: false
        };
      }
    }

    return {
      isLocked: false,
      requiredQuizSolved: true,
      prevLessonCompleted: true
    };
  };

  const openVideoPlayer = (lesson: Lesson, course: Course) => {
    if (!user) {
      addNotification('⚠️ يجب تسجيل الدخول بحسابك أولاً لمشاهدة المحاضرة.', 'warning');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    // Sequential Gate Check
    const lessonIndex = course.lessons.findIndex(l => l.id === lesson.id);
    const lockStatus = isLessonLocked(course, lessonIndex);

    if (lockStatus.isLocked) {
      addNotification(`🔒 المحاضرة مقفولة: ${lockStatus.reason}`, 'warning');
      if (lockStatus.blockingQuiz && !lockStatus.requiredQuizSolved) {
        openQuiz(lockStatus.blockingQuiz);
      }
      return;
    }

    setActiveLesson(lesson);
    setActiveLessonCourse(course);
  };

  const closeVideoPlayer = () => {
    setActiveLesson(null);
    setActiveLessonCourse(null);
  };

  const completeLesson = (lessonId: string) => {
    setCourses(prev =>
      prev.map(c => ({
        ...c,
        lessons: c.lessons.map(l => (l.id === lessonId ? { ...l, isCompleted: true } : l))
      }))
    );

    // Update current active lesson if playing
    if (activeLesson && activeLesson.id === lessonId) {
      setActiveLesson(prev => prev ? { ...prev, isCompleted: true } : null);
    }

    // Update student monitoring records
    if (user) {
      setStudentRecords(prev =>
        prev.map(rec => {
          if (rec.studentPhone === user.phone || rec.studentId === user.id) {
            const newCompletedCount = Math.min(rec.totalLessonsCount, rec.completedLessonsCount + 1);
            const newWatchedMinutes = Math.min(rec.totalCourseMinutes || 360, (rec.watchedMinutes || 0) + 45);
            const newAccumulated = Math.max(0, rec.totalLessonsCount - newCompletedCount);
            const newLaggingStatus: StudentProgressRecord['laggingStatus'] = 
              newAccumulated === 0 
                ? (rec.averageScore >= 90 ? 'distinguished' : 'up_to_date') 
                : (newAccumulated >= 3 ? 'severely_lagging' : 'lagging');
            return {
              ...rec,
              completedLessonsCount: newCompletedCount,
              watchedMinutes: newWatchedMinutes,
              accumulatedLessonsCount: newAccumulated,
              laggingStatus: newLaggingStatus,
              lastActivityDate: 'الآن'
            };
          }
          return rec;
        })
      );
    }

    addNotification('أحسنت! تم إكمال المحاضرة بنجاح وتم تسجيل حضورك وتقدمك.', 'success');
  };

  const openQuiz = (quiz: Quiz) => {
    if (!user) {
      addNotification('⚠️ يجب تسجيل الدخول أو إنشاء حساب طالب أولاً لبدء حل الاختبارات والواجبات.', 'warning');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setActiveQuiz(quiz);
  };
  const closeQuiz = () => setActiveQuiz(null);

  const saveQuizResult = (resultData: Omit<QuizResult, 'id' | 'date'>) => {
    const newResult: QuizResult = {
      ...resultData,
      id: `res-${Date.now()}`,
      date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })
    };
    setQuizResults(prev => [newResult, ...prev]);

    // Create / Update Homework submission in student records
    const newSubmission: HomeworkSubmission = {
      id: `hw-${Date.now()}`,
      quizId: resultData.quizId,
      quizTitle: resultData.quizTitle,
      lessonId: 'les-current',
      lessonTitle: resultData.quizTitle,
      courseId: 'course-1',
      courseTitle: 'كورس علم النفس والاجتماع 2 ثانوي',
      studentId: user?.id || 'std_9021',
      studentName: user ? `${user.firstName} ${user.lastName}` : 'طالب المنصة',
      studentPhone: user?.phone || '01559196263',
      parentPhone: user?.parentPhone || '01144310307',
      isSubmitted: true,
      score: resultData.score,
      totalMarks: resultData.totalMarks,
      percentage: resultData.percentage,
      status: resultData.percentage >= 50 ? 'passed' : 'failed',
      submittedAt: `${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`,
      attemptsCount: 1
    };

    setHomeworkSubmissions(prev => [newSubmission, ...prev]);

    // Update student monitoring records
    setStudentRecords(prev =>
      prev.map(rec => {
        if (rec.studentPhone === user?.phone || rec.studentId === user?.id) {
          const newCompletedQuizzes = rec.completedQuizzesCount + 1;
          const newMissedQuizzes = Math.max(0, rec.totalQuizzesCount - newCompletedQuizzes);
          const newAvg = rec.averageScore === 0 ? resultData.percentage : Math.round((rec.averageScore + resultData.percentage) / 2);
          const newAccumulated = Math.max(0, rec.totalLessonsCount - rec.completedLessonsCount);
          const newLaggingStatus: StudentProgressRecord['laggingStatus'] = 
            newAccumulated === 0 && newMissedQuizzes === 0
              ? (newAvg >= 90 ? 'distinguished' : 'up_to_date')
              : (newAccumulated >= 3 || newMissedQuizzes >= 3 ? 'severely_lagging' : 'lagging');
          return {
            ...rec,
            completedQuizzesCount: newCompletedQuizzes,
            missedQuizzesCount: newMissedQuizzes,
            averageScore: newAvg,
            laggingStatus: newLaggingStatus,
            commitmentStatus: newAvg >= 85 ? 'ممتاز' : newAvg >= 70 ? 'جيد جداً' : newMissedQuizzes >= 2 ? 'مقصر بالواجبات' : 'يحتاج متابعة',
            lastActivityDate: 'الآن'
          };
        }
        return rec;
      })
    );

    addNotification(`تم تسجيل نتيجة امتحانك: ${newResult.percentage}% بنجاح! تم فك قفل المحاضرة التالية.`, 'success');
  };

  const grantLessonException = (recordId: string, lessonId: string) => {
    setStudentRecords(prev =>
      prev.map(rec => {
        if (rec.id === recordId) {
          const currentExceptions = rec.unlockedExceptionLessonIds || [];
          const updated = currentExceptions.includes(lessonId)
            ? currentExceptions
            : [...currentExceptions, lessonId];
          return { ...rec, unlockedExceptionLessonIds: updated };
        }
        return rec;
      })
    );
    addNotification('تم منح الطالب استثناء فتح المحاضرة بنجاح.', 'success');
  };

  const toggleStudentCommitment = (recordId: string, status: StudentProgressRecord['commitmentStatus']) => {
    setStudentRecords(prev =>
      prev.map(rec => (rec.id === recordId ? { ...rec, commitmentStatus: status } : rec))
    );
    addNotification('تم تحديث حالة التزام الطالب بنجاح.', 'info');
  };

  const deleteStudentRecord = (recordId: string) => {
    setStudentRecords(prev => prev.filter(rec => rec.id !== recordId));
    addNotification('تم حذف سجل الطالب من المتابعة.', 'info');
  };

  const toggleStudentBlock = (studentIdOrRecordId: string, reason?: string) => {
    let studentName = '';
    let willBeBlocked = false;
    let targetPhone = '';

    setStudentRecords(prev =>
      prev.map(rec => {
        if (rec.id === studentIdOrRecordId || rec.studentId === studentIdOrRecordId) {
          studentName = rec.studentName;
          targetPhone = rec.studentPhone;
          willBeBlocked = !rec.isBlocked;
          return {
            ...rec,
            isBlocked: willBeBlocked,
            blockedReason: willBeBlocked ? (reason || 'تراكم المحاضرات وعدم الالتزام بجدول المتابعة والواجبات') : undefined,
            blockedAt: willBeBlocked ? new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }) : undefined
          };
        }
        return rec;
      })
    );

    setRegisteredStudents(prev =>
      prev.map(u => {
        if (u.id === studentIdOrRecordId || u.phone === targetPhone) {
          return {
            ...u,
            isBlocked: willBeBlocked,
            blockedReason: willBeBlocked ? (reason || 'تراكم المحاضرات وعدم الالتزام بجدول المتابعة والواجبات') : undefined,
            blockedAt: willBeBlocked ? new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }) : undefined
          };
        }
        return u;
      })
    );

    // If currently logged-in user is the one being blocked/unblocked, update active user state
    if (user && (user.id === studentIdOrRecordId || user.phone === targetPhone)) {
      setUser(prev => prev ? {
        ...prev,
        isBlocked: willBeBlocked,
        blockedReason: willBeBlocked ? (reason || 'تراكم المحاضرات وعدم الالتزام بجدول المتابعة والواجبات') : undefined,
        blockedAt: willBeBlocked ? new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }) : undefined
      } : null);
    }

    if (willBeBlocked) {
      addNotification(`🚫 تم حظر الطالب (${studentName || 'المحدد'}) يدوياً بسبب التراكم. لن يتمكن من فتح الحصص أو دخول حسابه حتى فك الحظر.`, 'warning');
    } else {
      addNotification(`✅ تم فك الحظر عن الطالب (${studentName || 'المحدد'}) بنجاح وإعادة تفعيل حسابه.`, 'success');
    }
  };

  const openPdf = (pdf: PdfDocument) => {
    if (!user) {
      addNotification('⚠️ يجب تسجيل الدخول أو إنشاء حساب طالب على المنصة أولاً لفتح واستعراض المذكرات والملازم.', 'warning');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setActivePdf(pdf);
  };
  const closePdf = () => setActivePdf(null);

  const openRechargeModal = () => {
    if (!user) {
      addNotification('⚠️ يرجى تسجيل الدخول بحسابك أولاً لشحن المحفظة أو تفعيل كارت السنتر.', 'warning');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setRechargeModalOpen(true);
  };
  const closeRechargeModal = () => setRechargeModalOpen(false);

  const rechargeWallet = (amount: number, method: string, code?: string) => {
    setWalletBalance(prev => prev + amount);
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      courseTitle: `شحن رصيد محفظة (${method}) ${code ? `- كود: ${code}` : ''}`,
      amount: amount,
      discount: 0,
      paymentMethod: method as any,
      status: 'ناجحة',
      date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }),
      itemsCount: 1
    };
    setInvoices(prev => [newInvoice, ...prev]);
    addNotification(`تم شحن ${amount} جنيه في محفظتك بنجاح.`, 'success');
  };

  const generateRechargeCode = (amount: number, grade: string, customCode?: string): RechargeCode => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randPart = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const finalCode = customCode?.trim().toUpperCase() || `QAED-${amount}-${randPart}`;
    
    const newCodeItem: RechargeCode = {
      code: finalCode,
      amount,
      grade,
      isUsed: false,
      createdAt: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })
    };

    setRechargeCodes(prev => [newCodeItem, ...prev]);
    addNotification(`تم توليد كارت سنتر جديد بقيمة ${amount} ج.م (الكود: ${finalCode})`, 'success');
    return newCodeItem;
  };

  const deleteRechargeCode = (codeToDelete: string) => {
    setRechargeCodes(prev => prev.filter(c => c.code !== codeToDelete));
    addNotification('تم حذف كود الكارت من النظام.', 'info');
  };

  const redeemRechargeCode = (inputCode: string): { success: boolean; message: string; amount?: number } => {
    const clean = inputCode.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: 'يرجى إدخال كود كارت السنتر.' };
    }

    const foundIndex = rechargeCodes.findIndex(c => c.code.trim().toUpperCase() === clean);
    if (foundIndex === -1) {
      return { 
        success: false, 
        message: '❌ كود غير صحيح أو غير مسجل بواسطة الأدمن! تأكد من إدخال الكود المطبوع على كارت السنتر الخاص بك.' 
      };
    }

    const card = rechargeCodes[foundIndex];
    if (card.isUsed) {
      return { 
        success: false, 
        message: `⚠️ هذا الكود تم استخدامه وشحنه مسبقاً ${card.usedBy ? `بواسطة (${card.usedBy})` : ''} ولا يمكن شحنه مرة أخرى.` 
      };
    }

    // Mark as used
    const updatedCards = [...rechargeCodes];
    updatedCards[foundIndex] = {
      ...card,
      isUsed: true,
      usedBy: user ? `${user.firstName} ${user.lastName} (${user.phone})` : 'طالب المنصة',
      usedAt: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })
    };
    setRechargeCodes(updatedCards);

    // Credit student wallet
    setWalletBalance(prev => prev + card.amount);
    
    // Add invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      orderNumber: `CARD-${Math.floor(10000 + Math.random() * 90000)}`,
      courseTitle: `شحن كارت سنتر معتمد (${card.amount} ج.م) - كود: ${card.code}`,
      amount: card.amount,
      discount: 0,
      paymentMethod: 'كود السنتر',
      status: 'ناجحة',
      date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }),
      itemsCount: 1
    };
    setInvoices(prev => [newInvoice, ...prev]);

    addNotification(`🎉 تم شحن ${card.amount} جنيه بنجاح في محفظتك عبر كارت السنتر!`, 'success');
    return {
      success: true,
      message: `تم شحن كارت السنتر بنجاح بقيمة ${card.amount} ج.م وإضافتها لرصيد محفظتك!`,
      amount: card.amount
    };
  };

  const addNewQuiz = (newQuiz: Quiz) => {
    setQuizzes(prev => [newQuiz, ...prev.filter(q => q.id !== newQuiz.id)]);
    // Link to lesson if lessonId and courseId provided
    if (newQuiz.courseId && newQuiz.lessonId) {
      setCourses(prev =>
        prev.map(c => {
          if (c.id === newQuiz.courseId) {
            return {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === newQuiz.lessonId ? { ...l, hasQuiz: true, quizId: newQuiz.id } : l
              )
            };
          }
          return c;
        })
      );
    }
    addNotification(`تم إنشاء الامتحان والواجب: "${newQuiz.title}" وتعيينه للحصة بنجاح!`, 'success');
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes(prev => prev.map(q => q.id === updatedQuiz.id ? updatedQuiz : q));
    addNotification(`تم حفظ تعديلات الامتحان: "${updatedQuiz.title}" بنجاح.`, 'success');
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setCourses(prev =>
      prev.map(c => ({
        ...c,
        lessons: c.lessons.map(l => (l.quizId === quizId ? { ...l, hasQuiz: false, quizId: undefined } : l))
      }))
    );
    addNotification('تم حذف الامتحان والواجب بنجاح.', 'info');
  };

  const enrollInCourse = (courseId: string, paymentMethod: Invoice['paymentMethod']): boolean => {
    if (!user) {
      addNotification('⚠️ يجب تسجيل الدخول أو إنشاء حساب طالب أولاً للاشتراك في الكورس.', 'warning');
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return false;
    }

    const targetCourse = courses.find(c => c.id === courseId);
    if (!targetCourse) return false;

    if (paymentMethod === 'المحفظة' && walletBalance < targetCourse.price) {
      addNotification('رصيد محفظتك غير كافٍ. يرجى شحن الرصيد أولاً.', 'error');
      return false;
    }

    if (paymentMethod === 'المحفظة') {
      setWalletBalance(prev => prev - targetCourse.price);
    }

    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      courseTitle: targetCourse.title,
      amount: targetCourse.price,
      discount: (targetCourse.originalPrice || targetCourse.price) - targetCourse.price,
      paymentMethod: paymentMethod,
      status: 'ناجحة',
      date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }),
      itemsCount: 1
    };

    setInvoices(prev => [newInvoice, ...prev]);
    addNotification(`مبروك! تم تفعيل الاشتراك في "${targetCourse.title}" بنجاح.`, 'success');
    return true;
  };

  const login = (phone: string, pass: string, forceTransfer: boolean = false): boolean => {
    const cleanPhone = phone.trim();
    const cleanPass = pass.trim();

    // Check if logging in with Admin Phone
    if (cleanPhone === ADMIN_CREDENTIALS.phone) {
      if (cleanPass === ADMIN_CREDENTIALS.pass) {
        setUser(ADMIN_USER);
        setAuthModalOpen(false);
        setDeviceConflictInfo(null);
        setActiveView('admin');
        addNotification('مرحباً بك يا مستر أحمد عبدالحميد! تم تسجيل الدخول بحساب المسؤول (الأدمن).', 'success');
        return true;
      } else {
        addNotification('كلمة المرور الخاصة بحساب الأدمن غير صحيحة!', 'error');
        return false;
      }
    }

    // Regular student login - must provide a valid password (at least 4 chars)
    if (!cleanPass || cleanPass.length < 4) {
      addNotification('يرجى كتابة كلمة المرور الصحيحة للدخول (4 خانات على الأقل).', 'error');
      return false;
    }

    // 1. Locate student in registered students or student records
    let targetStudent = registeredStudents.find(s => s.phone === cleanPhone);
    if (!targetStudent) {
      // Look in student progress records
      const record = studentRecords.find(r => r.studentPhone === cleanPhone);
      if (record) {
        targetStudent = {
          id: record.studentId,
          firstName: record.studentName.split(' ')[0] || 'طالب',
          secondName: '',
          thirdName: '',
          lastName: record.studentName.split(' ').slice(1).join(' ') || 'جديد',
          phone: record.studentPhone,
          parentPhone: record.parentPhone,
          grade: record.grade,
          isAzhar: false,
          governorate: record.governorate,
          gender: 'male',
          walletBalance: 0,
          role: 'student',
          joinedDate: '2026',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          registeredDeviceId: record.registeredDeviceId,
          registeredDeviceName: record.registeredDeviceName,
          deviceLinkedAt: record.deviceLinkedAt,
          isDeviceLocked: record.isDeviceLocked ?? true,
        };
      } else {
        addNotification('لم يتم العثور على حساب مسجل بهذا الرقم. يرجى إنشاء حساب جديد أولاً.', 'error');
        return false;
      }
    }

    // 2. CHECK IF STUDENT IS MANUALLY BLOCKED BY ADMIN (e.g. For Accumulation/Lagging)
    const currentStudentRecord = studentRecords.find(r => r.studentPhone === cleanPhone || r.studentId === targetStudent.id);
    if (targetStudent.isBlocked || currentStudentRecord?.isBlocked) {
      const reasonText = targetStudent.blockedReason || currentStudentRecord?.blockedReason || 'تراكم المحاضرات وعدم متابعة الحصص في موعدها';
      addNotification(`🚫 تم حظر حسابك من قبل إدارة المنصة بسبب: (${reasonText}). يرجى التواصل مع مستر أحمد عبدالحميد أو الدعم الفني.`, 'error');
      return false;
    }

    // 3. SINGLE DEVICE SECURITY CHECK
    const isBoundToOtherDevice = 
      targetStudent.isDeviceLocked &&
      targetStudent.registeredDeviceId && 
      targetStudent.registeredDeviceId !== currentDeviceId;

    if (isBoundToOtherDevice && !forceTransfer) {
      // ⚠️ DEVICE MISMATCH DETECTED!
      setDeviceConflictInfo({
        phone: cleanPhone,
        studentName: `${targetStudent.firstName} ${targetStudent.lastName}`,
        currentDeviceName: currentDeviceInfo.label,
        registeredDeviceName: targetStudent.registeredDeviceName || 'جهاز مسجل سابقاً',
        deviceLinkedAt: targetStudent.deviceLinkedAt || 'تاريخ التسجيل'
      });
      addNotification('⚠️ تنبيه أمان: هذا الحساب مقترن بجهاز آخر. لا يمكن تشغيله على جهازين معاً.', 'warning');
      return false;
    }

    // 3. Device Matches OR Student chose to force-transfer account to current device
    const updatedUser: User = {
      ...targetStudent,
      phone: cleanPhone,
      role: 'student',
      registeredDeviceId: currentDeviceId,
      registeredDeviceName: currentDeviceInfo.label,
      deviceLinkedAt: targetStudent.deviceLinkedAt || new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }),
      isDeviceLocked: true,
      lastActiveSessionId: Date.now().toString()
    };

    // Save to registered list
    setRegisteredStudents(prev => {
      const filtered = prev.filter(u => u.phone !== cleanPhone);
      return [updatedUser, ...filtered];
    });

    // Update in student records table as well
    setStudentRecords(prev =>
      prev.map(r => {
        if (r.studentPhone === cleanPhone) {
          return {
            ...r,
            registeredDeviceId: currentDeviceId,
            registeredDeviceName: currentDeviceInfo.label,
            deviceLinkedAt: updatedUser.deviceLinkedAt,
            isDeviceLocked: true
          };
        }
        return r;
      })
    );

    // Broadcast session change to immediately kick any old sessions/devices
    broadcastDeviceSession({
      userId: updatedUser.id,
      phone: cleanPhone,
      activeDeviceId: currentDeviceId,
      activeDeviceName: currentDeviceInfo.label,
      sessionId: updatedUser.lastActiveSessionId!,
      timestamp: Date.now(),
      action: forceTransfer ? 'transfer' : 'login'
    });

    setUser(updatedUser);
    setAuthModalOpen(false);
    setDeviceConflictInfo(null);
    setActiveView('dashboard');
    
    if (forceTransfer) {
      addNotification('تم نقل الحساب وقفل الأمان على جهازك الحالي بنجاح، وتم إنهاء الجلسة على الجهاز القديم.', 'success');
    } else {
      addNotification('تم تسجيل الدخول بنجاح! حسابك مؤمن ومقترن بجهازك الحالي.', 'success');
    }
    return true;
  };

  const forceTransferDevice = (phone: string, pass: string): boolean => {
    return login(phone, pass, true);
  };

  const clearDeviceConflict = () => {
    setDeviceConflictInfo(null);
  };

  const closeDeviceKickedAlert = () => {
    setDeviceKickedAlert(null);
  };

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: `std_${Date.now()}`,
      firstName: userData.firstName || '',
      secondName: userData.secondName || '',
      thirdName: userData.thirdName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      parentPhone: userData.parentPhone || '',
      grade: userData.grade || 'second_general',
      isAzhar: userData.isAzhar || false,
      governorate: userData.governorate || 'قنا',
      gender: userData.gender || 'male',
      walletBalance: 0,
      role: 'student',
      joinedDate: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }),
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      password: userData.password,
      registeredDeviceId: currentDeviceId,
      registeredDeviceName: currentDeviceInfo.label,
      deviceLinkedAt: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' }),
      isDeviceLocked: true,
      lastActiveSessionId: Date.now().toString()
    };

    // Save in registered list
    setRegisteredStudents(prev => [newUser, ...prev.filter(u => u.phone !== newUser.phone)]);

    // Add to student progress records table for admin view
    const newRecord: StudentProgressRecord = {
      id: `rec-${Date.now()}`,
      studentId: newUser.id,
      studentName: `${newUser.firstName} ${newUser.secondName || ''} ${newUser.thirdName || ''} ${newUser.lastName}`.trim(),
      studentPhone: newUser.phone,
      parentPhone: newUser.parentPhone,
      governorate: newUser.governorate,
      grade: newUser.grade,
      gradeLabel: newUser.grade.includes('second') ? 'الصف الثاني الثانوي' : 'الصف الأول الثانوي',
      enrolledCourseId: 'course-1',
      enrolledCourseTitle: 'كورس الشهر الأول - علم النفس والاجتماع',
      completedLessonsCount: 0,
      totalLessonsCount: 4,
      completedQuizzesCount: 0,
      totalQuizzesCount: 4,
      averageScore: 0,
      commitmentStatus: 'ممتاز',
      lastActivityDate: 'الآن',
      unlockedExceptionLessonIds: [],
      registeredDeviceId: currentDeviceId,
      registeredDeviceName: currentDeviceInfo.label,
      deviceLinkedAt: newUser.deviceLinkedAt,
      isDeviceLocked: true,
      watchedMinutes: 0,
      totalCourseMinutes: 360,
      accumulatedLessonsCount: 4,
      missedQuizzesCount: 4,
      laggingStatus: 'lagging'
    };
    setStudentRecords(prev => [newRecord, ...prev]);

    // Broadcast session
    broadcastDeviceSession({
      userId: newUser.id,
      phone: newUser.phone,
      activeDeviceId: currentDeviceId,
      activeDeviceName: currentDeviceInfo.label,
      sessionId: newUser.lastActiveSessionId!,
      timestamp: Date.now(),
      action: 'login'
    });

    setUser(newUser);
    setAuthModalOpen(false);
    setDeviceConflictInfo(null);
    setActiveView('dashboard');
    addNotification('تم إنشاء الحساب وقفل الأمان على جهازك بنجاح! أهلاً بك في منصة القائد.', 'success');
  };

  const adminResetStudentDevice = (studentId: string) => {
    // Unlink device from student progress records
    setStudentRecords(prev =>
      prev.map(r => {
        if (r.studentId === studentId || r.id === studentId) {
          return {
            ...r,
            registeredDeviceId: undefined,
            registeredDeviceName: 'غير مقترن (تمت إعادة التعيين)',
            isDeviceLocked: false,
            deviceLinkedAt: undefined
          };
        }
        return r;
      })
    );

    // Unlink in registered students
    setRegisteredStudents(prev =>
      prev.map(u => {
        if (u.id === studentId) {
          return {
            ...u,
            registeredDeviceId: undefined,
            registeredDeviceName: undefined,
            isDeviceLocked: false,
            deviceLinkedAt: undefined
          };
        }
        return u;
      })
    );

    // If current logged-in user is this student
    if (user && user.id === studentId) {
      setUser({
        ...user,
        registeredDeviceId: undefined,
        registeredDeviceName: undefined,
        isDeviceLocked: false
      });
    }

    addNotification('تم فك قفل الجهاز للطالب بنجاح! يستطيع الطالب الآن الدخول من جهازه الجديد وسيتم ربطه تلقائياً.', 'success');
  };

  const logout = () => {
    setUser(null);
    setDeviceConflictInfo(null);
    setActiveView('landing');
    addNotification('تم تسجيل الخروج بنجاح.', 'info');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
      addNotification('تم حفظ وتحديث بياناتك بنجاح.', 'success');
    }
  };

  const addNewCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    addNotification(`تم إضافة كورس جديد: ${newCourse.title}`, 'success');
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setEnrolledCourseIds(prev => prev.filter(id => id !== courseId));
    addNotification('تم حذف الكورس بنجاح من المنصة.', 'info');
  };

  const addLessonToCourse = (courseId: string, lesson: Lesson) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updatedLessons = [...c.lessons, lesson];
          return {
            ...c,
            lessons: updatedLessons,
            lessonsCount: updatedLessons.length,
            totalHours: Math.round((updatedLessons.reduce((acc, l) => acc + (l.durationMinutes || 45), 0) / 60) * 10) / 10
          };
        }
        return c;
      })
    );
    addNotification(`تم إضافة المحاضرة "${lesson.title}" إلى الكورس بنجاح.`, 'success');
  };

  const deleteLessonFromCourse = (courseId: string, lessonId: string) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === courseId) {
          const updatedLessons = c.lessons.filter(l => l.id !== lessonId);
          return {
            ...c,
            lessons: updatedLessons,
            lessonsCount: updatedLessons.length
          };
        }
        return c;
      })
    );
    addNotification('تم حذف المحاضرة من الكورس بنجاح.', 'info');
  };

  const isAdmin = user?.role === 'admin' || user?.phone === ADMIN_CREDENTIALS.phone;

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        theme,
        toggleTheme,
        selectedGrade,
        setSelectedGrade,
        activeView,
        setActiveView,
        courses,
        selectedCourse,
        enrolledCourseIds,
        enrollInCourse,
        addNewCourse,
        deleteCourse,
        addLessonToCourse,
        deleteLessonFromCourse,
        isLessonLocked,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        activeCourseDetail,
        openCourseDetail,
        closeCourseDetail,
        activeLesson,
        activeLessonCourse,
        openVideoPlayer,
        closeVideoPlayer,
        completeLesson,
        activeQuiz,
        openQuiz,
        closeQuiz,
        saveQuizResult,
        quizResults,
        quizzes,
        addNewQuiz,
        updateQuiz,
        deleteQuiz,
        activePdf,
        openPdf,
        closePdf,
        rechargeModalOpen,
        openRechargeModal,
        closeRechargeModal,
        rechargeWallet,
        rechargeCodes,
        generateRechargeCode,
        deleteRechargeCode,
        redeemRechargeCode,
        invoices,
        walletBalance,
        studentRecords,
        homeworkSubmissions,
        grantLessonException,
        toggleStudentCommitment,
        deleteStudentRecord,
        toggleStudentBlock,
        currentDeviceId,
        currentDeviceInfo,
        deviceConflictInfo,
        clearDeviceConflict,
        forceTransferDevice,
        deviceKickedAlert,
        closeDeviceKickedAlert,
        adminResetStudentDevice,
        login,
        register,
        logout,
        updateUser,
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

