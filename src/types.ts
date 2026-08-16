export type GradeLevel = 
  | 'first_general'      // الصف الأول الثانوي العام
  | 'first_bac'          // الصف الأول الثانوي (بكالوريا)
  | 'second_general'     // الصف الثاني الثانوي العام (علم النفس والاجتماع)
  | 'second_bac';        // الصف الثاني الثانوي (بكالوريا - علم النفس والاجتماع)

export type Gender = 'male' | 'female';

export interface User {
  id: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  phone: string;
  parentPhone: string;
  grade: GradeLevel;
  isAzhar: boolean;
  governorate: string;
  gender: Gender;
  walletBalance: number;
  role?: 'student' | 'admin';
  centerId?: string;
  joinedDate: string;
  avatarUrl: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl?: string; // Google Drive link or ID
  driveFileId?: string;
  youtubeId?: string; // fallback
  isFree: boolean;
  pdfUrl?: string;
  pdfTitle?: string;
  hasQuiz: boolean;
  quizId?: string;
  isCompleted?: boolean;
}

export interface RechargeCode {
  code: string;
  amount: number;
  grade: string;
  isUsed: boolean;
  createdAt?: string;
  usedBy?: string;
  usedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  grade: GradeLevel;
  gradeLabel: string;
  subject: string;
  category: 'monthly' | 'package' | 'revision';
  price: number;
  originalPrice?: number;
  thumbnail: string;
  badgeText: string;
  startDate: string;
  lessonsCount: number;
  totalLessons?: number;
  totalHours: number;
  description: string;
  outcomes: string[];
  lessons: Lesson[];
  isEnrolled?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  philosopherContext?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subtitle?: string;
  courseId: string;
  lessonId?: string;
  grade?: GradeLevel;
  gradeLabel?: string;
  subject?: string;
  durationMinutes: number;
  totalMarks: number;
  passingScorePercentage?: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  date: string;
  answers: { [questionId: string]: number };
}

export interface Invoice {
  id: string;
  orderNumber: string;
  courseTitle: string;
  amount: number;
  discount: number;
  paymentMethod: 'فوري' | 'كود السنتر' | 'فودافون كاش' | 'بطاقة بنكية' | 'المحفظة';
  status: 'ناجحة' | 'قيد المراجعة' | 'ملغية';
  date: string;
  itemsCount: number;
  couponCode?: string;
}

export interface PdfDocument {
  id: string;
  title: string;
  description?: string;
  subject: string;
  grade: GradeLevel;
  gradeLabel: string;
  pagesCount: number;
  pageCount?: number;
  fileSize: string;
  downloadUrl?: string;
  previewPages: string[];
}

export interface HomeworkSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  isSubmitted: boolean;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'passed' | 'failed' | 'pending';
  submittedAt: string;
  attemptsCount: number;
}

export interface StudentProgressRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  parentPhone: string;
  governorate: string;
  grade: GradeLevel;
  gradeLabel: string;
  enrolledCourseId: string;
  enrolledCourseTitle: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  completedQuizzesCount: number;
  totalQuizzesCount: number;
  averageScore: number;
  commitmentStatus: 'ممتاز' | 'جيد جداً' | 'يحتاج متابعة' | 'مقصر بالواجبات';
  lastActivityDate: string;
  unlockedExceptionLessonIds: string[];
}
