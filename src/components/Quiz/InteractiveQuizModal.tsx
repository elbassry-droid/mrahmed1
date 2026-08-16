import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Quiz } from '../../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface InteractiveQuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({ quiz, onClose }) => {
  const { saveQuizResult } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(quiz.durationMinutes * 60);

  // Timer countdown
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    const marksPerQuestion = quiz.totalMarks / quiz.questions.length;
    const finalScore = Math.round(correctCount * marksPerQuestion);
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    return { correctCount, finalScore, percentage };
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    const { finalScore, percentage } = calculateScore();

    // Trigger confetti on good score
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }

    saveQuizResult({
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: finalScore,
      totalMarks: quiz.totalMarks,
      percentage: percentage,
      answers: selectedAnswers
    });
  };

  const currentQ = quiz.questions[currentQuestionIndex];
  const { correctCount, finalScore, percentage } = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#15231c] text-gray-900 dark:text-white rounded-3xl overflow-hidden border border-emerald-900/30 shadow-2xl flex flex-col my-6 text-right">
        
        {/* Top Quiz Header */}
        <div className="p-5 bg-gradient-to-l from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 truncate">
            <h3 className="font-black font-changa text-base sm:text-lg truncate">
              {quiz.title}
            </h3>
            <span className="text-xs text-emerald-200">
              الدرجة الكلية: {quiz.totalMarks} درجة • {quiz.questions.length} أسئلة
            </span>
          </div>

          {/* Countdown Clock */}
          {!submitted && (
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono font-bold text-[#ffbe76]">
              <Clock className="w-4 h-4 text-[#f39c12]" />
              <span>{formatTime(secondsLeft)}</span>
            </div>
          )}
        </div>

        {/* Quiz Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Result Banner after submit */}
          {submitted ? (
            <div className="space-y-6">
              
              {/* Score Announcement Card */}
              <div className={`p-6 rounded-2xl border text-center space-y-3 ${
                percentage >= 85 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                  : percentage >= 50
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-200'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-200'
              }`}>
                <div className="w-16 h-16 rounded-full bg-[#f39c12] text-white flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-black font-changa">
                  {percentage >= 85 ? 'ممتاز يا قائد! إجاباتك نموذجية' : percentage >= 50 ? 'أحسنت! أداء جيد وبإمكانك المراجعة' : 'راجع المحاضرة وحاول مجدداً'}
                </h3>

                <div className="flex items-center justify-center gap-4 text-sm font-bold pt-2">
                  <span className="text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
                    {finalScore} / {quiz.totalMarks}
                  </span>
                  <span className="text-lg">({percentage}%)</span>
                  <span>({correctCount} من {quiz.questions.length} صحيحة)</span>
                </div>
              </div>

              {/* Detailed Questions Review */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-sm text-[#1b4332] dark:text-emerald-300 border-b border-gray-100 dark:border-emerald-900/30 pb-2">
                  مراجعة الإجابات وشرح الفيلسوف:
                </h4>

                {quiz.questions.map((q, idx) => {
                  const studentAns = selectedAnswers[q.id];
                  const isCorrect = studentAns === q.correctAnswerIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border space-y-2.5 ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400/40'
                          : 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-900/40'
                      }`}
                    >
                      <div className="flex items-start gap-2 justify-between">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100 flex-1">
                          {q.question}
                        </p>
                      </div>

                      <div className="pr-8 space-y-1 text-xs">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-bold">إجابتك: </span>
                          <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                            {studentAns !== undefined ? q.options[studentAns] : 'لم تجب'}
                          </span>
                        </p>

                        {!isCorrect && (
                          <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>الإجابة الصحيحة: </span>
                            <span>{q.options[q.correctAnswerIndex]}</span>
                          </p>
                        )}

                        {/* Explanation */}
                        <div className="p-2.5 rounded-lg bg-white/70 dark:bg-black/40 border border-emerald-900/20 text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed mt-2">
                          <p className="font-bold text-[#2d6a4f] dark:text-emerald-300 mb-0.5">
                            💡 توضيح القائد: {q.philosopherContext}
                          </p>
                          <p>{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-emerald-900/30">
                <button
                  onClick={onClose}
                  className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-8 py-2.5 rounded-xl font-bold text-xs shadow-md"
                >
                  العودة للمحاضرات
                </button>
              </div>

            </div>
          ) : (
            /* Active Question Form */
            <div className="space-y-6">
              
              {/* Question Progress & Indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                <span className="text-[#2d6a4f] dark:text-emerald-400">
                  السؤال {currentQuestionIndex + 1} من {quiz.questions.length}
                </span>
                <div className="flex items-center gap-1">
                  {quiz.questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${
                        i === currentQuestionIndex
                          ? 'bg-[#f39c12] scale-125'
                          : selectedAnswers[quiz.questions[i].id] !== undefined
                          ? 'bg-[#2d6a4f]'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Current Question Text */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-900/20">
                <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options Grid */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm font-semibold ${
                        isSelected
                          ? 'bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-md'
                          : 'bg-white dark:bg-[#1a2c23] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-emerald-900/40 hover:border-[#2d6a4f]/50'
                      }`}
                    >
                      <span className="flex-1">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ml-3 ${
                        isSelected ? 'border-white bg-white text-[#2d6a4f] font-bold' : 'border-gray-400'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Question Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-emerald-900/30">
                
                {/* Previous Button */}
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 dark:border-emerald-900/60 disabled:opacity-30 flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                {/* Next or Finish Button */}
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-[#2d6a4f] hover:bg-[#1b4332] text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <span>التالي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="px-8 py-2.5 rounded-xl text-xs font-black bg-[#f39c12] hover:bg-[#e67e22] text-white shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                    id="submit-quiz-answers-btn"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>إنهاء وتسليم الاختبار</span>
                  </button>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
