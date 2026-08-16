import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, GradeLevel, HomeworkSubmission, Invoice, Lesson, PdfDocument, Quiz, QuizResult, RechargeCode, StudentProgressRecord, User } from '../types';
import { COURSES, INITIAL_USER, ADMIN_USER, ADMIN_CREDENTIALS, PDF_DOCUMENTS, QUIZZES, SAMPLE_INVOICES, MOCK_STUDENT_RECORDS, MOCK_HOMEWORK_SUBMISSIONS } from '../data/mockData';

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

  // Authentication actions
  login: (phone: string, pass: string) => boolean;
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
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('second_general');
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'courses' | 'account' | 'exams' | 'pdfs' | 'course_detail' | 'admin'>('landing');

  // Courses & Enrollment
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['course-1']);
  
  // Invoices & Wallet
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);

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
      message: 'نظام متسلسلة الحصص مفعل: يرجى حل كويز وواجب كل حصة لفتح المحاضرة التالية مباشرة.',
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
    const currentStudentRecord = studentRecords.find(r => r.studentPhone === user?.phone || r.studentId === user?.id);
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
            return {
              ...rec,
              completedLessonsCount: Math.min(rec.totalLessonsCount, rec.completedLessonsCount + 1),
              lastActivityDate: 'الآن'
            };
          }
          return rec;
        })
      );
    }

    addNotification('أحسنت! تم إكمال المحاضرة بنجاح وتم تسجيل حضورك وتقدمك.', 'success');
  };

  const openQuiz = (quiz: Quiz) => setActiveQuiz(quiz);
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
          const newAvg = Math.round((rec.averageScore + resultData.percentage) / 2);
          return {
            ...rec,
            completedQuizzesCount: newCompletedQuizzes,
            averageScore: newAvg,
            commitmentStatus: newAvg >= 85 ? 'ممتاز' : newAvg >= 70 ? 'جيد جداً' : 'يحتاج متابعة',
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

  const openPdf = (pdf: PdfDocument) => setActivePdf(pdf);
  const closePdf = () => setActivePdf(null);

  const openRechargeModal = () => setRechargeModalOpen(true);
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

  const login = (phone: string, pass: string): boolean => {
    const cleanPhone = phone.trim();
    const cleanPass = pass.trim();

    // Check if logging in with Admin Phone
    if (cleanPhone === ADMIN_CREDENTIALS.phone) {
      if (cleanPass === ADMIN_CREDENTIALS.pass) {
        setUser(ADMIN_USER);
        setAuthModalOpen(false);
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

    setUser({
      ...INITIAL_USER,
      phone: cleanPhone || INITIAL_USER.phone,
      role: 'student'
    });
    setAuthModalOpen(false);
    setActiveView('dashboard');
    addNotification('تم تسجيل الدخول بنجاح! مرحباً بك.', 'success');
    return true;
  };

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      ...INITIAL_USER,
      ...userData,
      role: 'student',
      id: `std_${Date.now()}`,
      joinedDate: new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })
    };
    setUser(newUser);
    setAuthModalOpen(false);
    setActiveView('dashboard');
    addNotification('تم إنشاء الحساب بنجاح! أهلاً بك في منصة القائد.', 'success');
  };

  const logout = () => {
    setUser(null);
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

