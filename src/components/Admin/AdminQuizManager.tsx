import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quiz, QuizQuestion, Course } from '../../types';
import { 
  FileCheck, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Award,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';

export const AdminQuizManager: React.FC = () => {
  const { courses, quizzes, addNewQuiz, updateQuiz, deleteQuiz, addNotification } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  
  // Modal / Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubtitle, setQuizSubtitle] = useState('');
  const [quizDuration, setQuizDuration] = useState(15);
  const [quizPassingScore, setQuizPassingScore] = useState(60);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-1',
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: ''
    }
  ]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const currentLessons = selectedCourse?.lessons || [];

  const handleOpenCreateQuiz = (lessonId?: string) => {
    setEditingQuizId(null);
    setSelectedLessonId(lessonId || currentLessons[0]?.id || '');
    setQuizTitle(selectedCourse ? `كويز وواجب: ${selectedCourse.title}` : 'كويز تفاعلي جديد');
    setQuizSubtitle('اختبار فهم وتطبيق على نواتج التعلم');
    setQuizDuration(15);
    setQuizPassingScore(60);
    setQuestions([
      {
        id: `q-${Date.now()}-1`,
        question: 'سؤال تطبيقي في المنهج:',
        options: ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'],
        correctAnswerIndex: 0,
        explanation: 'تفسير الإجابة الصحيحة وفقاً لنواتج التعلم الوزارية.'
      }
    ]);
    setIsEditing(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuizId(quiz.id);
    setSelectedLessonId(quiz.lessonId || '');
    setQuizTitle(quiz.title);
    setQuizSubtitle(quiz.subtitle || '');
    setQuizDuration(quiz.durationMinutes);
    setQuizPassingScore(quiz.passingScorePercentage);
    setQuestions(quiz.questions);
    setIsEditing(true);
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      addNotification('يجب أن يحتوي الكويز على سؤال واحد على الأقل', 'warning');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestionText = (idx: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[idx].question = text;
      return updated;
    });
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      const newOptions = [...updated[qIdx].options];
      newOptions[optIdx] = text;
      updated[qIdx].options = newOptions;
      return updated;
    });
  };

  const handleSetCorrectAnswer = (qIdx: number, correctIdx: number) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].correctAnswerIndex = correctIdx;
      return updated;
    });
  };

  const handleUpdateExplanation = (qIdx: number, text: string) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[qIdx].explanation = text;
      return updated;
    });
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      addNotification('يرجى كتابة عنوان الكويز', 'warning');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        addNotification(`يرجى كتابة نص السؤال رقم ${i + 1}`, 'warning');
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          addNotification(`يرجى كتابة جميع الاختيارات للسؤال رقم ${i + 1}`, 'warning');
          return;
        }
      }
    }

    const quizObj: Quiz = {
      id: editingQuizId || `quiz-${Date.now()}`,
      courseId: selectedCourseId,
      lessonId: selectedLessonId,
      title: quizTitle,
      subtitle: quizSubtitle,
      grade: selectedCourse?.grade || 'second_general',
      subject: selectedCourse?.subject || 'علم النفس والاجتماع',
      durationMinutes: Number(quizDuration) || 15,
      totalMarks: questions.length * 5,
      passingScorePercentage: Number(quizPassingScore) || 60,
      questions: questions
    };

    if (editingQuizId) {
      updateQuiz(quizObj);
      addNotification('تم تحديث الكويز والواجب بنجاح', 'success');
    } else {
      addNewQuiz(quizObj);
      addNotification('تم إنشاء الكويز والواجب وربطه بالحصة بنجاح', 'success');
    }

    setIsEditing(false);
    setEditingQuizId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#162720] p-6 rounded-3xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#f39c12]/20 text-[#d35400] dark:text-amber-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <FileCheck className="w-4 h-4" />
            <span>نظام الامتحانات والكويزات والواجبات الإلزامية</span>
          </div>
          <h2 className="text-xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
            إدارة وإنشاء كويز وواجب لكل حصة
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            أنشئ أسئلة بنك المعرفة ونواتج التعلم واربطها مباشرة بالمحاضرة لفك قفل الحصة التالية للطلاب.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateQuiz()}
          className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
          id="create-new-quiz-btn"
        >
          <PlusCircle className="w-4 h-4 text-[#f39c12]" />
          <span>إنشاء كويز / واجب جديد</span>
        </button>
      </div>

      {/* Course & Lesson Selection Filter */}
      <div className="bg-white dark:bg-[#162720] p-5 rounded-2xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
            اختر الكورس التعليمي:
          </label>
          <select
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-gray-50 dark:bg-[#112019] text-xs font-bold"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.gradeLabel})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 text-left sm:text-right">
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-bold">
            عدد كويزات هذا الكورس:
          </span>
          <span className="inline-block px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-xs">
            {quizzes.filter(q => q.courseId === selectedCourseId).length} كويز مفعل
          </span>
        </div>
      </div>

      {/* Lessons List in Selected Course with their associated Quiz */}
      <div className="bg-white dark:bg-[#162720] rounded-3xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-emerald-900/40 flex items-center justify-between">
          <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#2d6a4f]" />
            <span>حصص ومحاضرات الكورس وحالة الكويز المرتبط بها</span>
          </h3>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-emerald-900/30">
          {currentLessons.map((lesson, idx) => {
            const linkedQuiz = quizzes.find(q => q.id === lesson.quizId || q.lessonId === lesson.id);

            return (
              <div key={lesson.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50/70 dark:hover:bg-[#112019]/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-800/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {lesson.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    المدة: {lesson.durationMinutes} دقيقة • {lesson.pdfTitle || 'مذكرة الحصة'}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  {linkedQuiz ? (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>كويز مفعل ({linkedQuiz.questions.length} أسئلة)</span>
                      </span>

                      <button
                        onClick={() => handleEditQuiz(linkedQuiz)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 transition-colors"
                        title="تعديل أسئلة الكويز"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('هل تريد حذف هذا الكويز؟')) {
                            deleteQuiz(linkedQuiz.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 transition-colors"
                        title="حذف الكويز"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        لا يوجد كويز للحصة
                      </span>
                      <button
                        onClick={() => handleOpenCreateQuiz(lesson.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>إضافة كويز للحصة</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUIZ CREATOR / EDITOR MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#15231c] rounded-3xl p-6 sm:p-8 max-w-4xl w-full text-right shadow-2xl border border-emerald-900/30 space-y-6 my-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900/40 pb-4">
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-lg text-[#1b4332] dark:text-emerald-300">
                    {editingQuizId ? 'تعديل أسئلة الكويز والواجب' : 'إنشاء كويز وواجب جديد للحصة'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    الكورس: {selectedCourse?.title}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-6 text-xs">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    عنوان الكويز *
                  </label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    placeholder="مثال: كويز المحاضرة الأولى - التفكير الإنساني ونواتج التعلم"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    ربط بالمحاضرة:
                  </label>
                  <select
                    value={selectedLessonId}
                    onChange={e => setSelectedLessonId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                  >
                    {currentLessons.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    مدة الاختبار (بالدقائق)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={quizDuration}
                    onChange={e => setQuizDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    درجة النجاح المشروطة لفك الحصة التالية (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={quizPassingScore}
                    onChange={e => setQuizPassingScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-bold bg-white dark:bg-[#111f18]"
                  />
                </div>
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-emerald-900/40">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-[#1b4332] dark:text-emerald-300">
                    قائمة الأسئلة ({questions.length} سؤال)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-2 rounded-xl bg-[#2d6a4f] text-white font-bold text-xs flex items-center gap-1.5 hover:bg-[#1b4332] transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-[#f39c12]" />
                    <span>إضافة سؤال جديد</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-[#112019] border border-gray-200 dark:border-emerald-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#2d6a4f] dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                          السؤال {qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40"
                          title="حذف هذا السؤال"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                          نص السؤال *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={q.question}
                          onChange={e => handleUpdateQuestionText(qIdx, e.target.value)}
                          placeholder="اكتب هنا نص السؤال بدقة..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-medium bg-white dark:bg-[#15231c]"
                        />
                      </div>

                      {/* 4 Choices */}
                      <div>
                        <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                          الاختيارات (اختر الدائرة الخضراء لتحديد الإجابة الصحيحة):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => (
                            <div 
                              key={optIdx} 
                              className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                                q.correctAnswerIndex === optIdx
                                  ? 'border-emerald-500 bg-emerald-500/10'
                                  : 'border-gray-200 dark:border-emerald-900/40 bg-white dark:bg-[#15231c]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctAnswerIndex === optIdx}
                                onChange={() => handleSetCorrectAnswer(qIdx, optIdx)}
                                className="w-4 h-4 text-emerald-600 cursor-pointer"
                                title="تعيين كإجابة صحيحة"
                              />
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={e => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                placeholder={`الخيار ${optIdx + 1}`}
                                className="w-full px-2 py-1 rounded-lg border-0 bg-transparent text-xs font-bold focus:outline-hidden"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                          تفسير الإجابة الصحيحة للطلاب بعد التسليم
                        </label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={e => handleUpdateExplanation(qIdx, e.target.value)}
                          placeholder="تفسير نواتج التعلم المرتبطة بالسؤال..."
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 font-medium bg-white dark:bg-[#15231c]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-emerald-900/40">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/3 py-3 rounded-2xl border border-gray-300 dark:border-emerald-900/60 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-2xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#f39c12]" />
                  <span>حفظ ونشر الكويز والواجب</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
