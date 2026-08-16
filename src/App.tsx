import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/Landing/HeroSection';
import { FeaturesSection } from './components/Landing/FeaturesSection';
import { CoursesSection } from './components/Landing/CoursesSection';
import { MethodologySection } from './components/Landing/MethodologySection';
import { GradeSelectorSection } from './components/Landing/GradeSelectorSection';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { CourseCatalogView } from './components/Dashboard/CourseCatalogView';
import { CourseDetailView } from './components/Courses/CourseDetailView';
import { AccountView } from './components/Dashboard/AccountView';
import { ExamsListView } from './components/Exams/ExamsListView';
import { PdfsListView } from './components/PDF/PdfsListView';
import { AdminDashboardView } from './components/Admin/AdminDashboardView';
import { AuthModal } from './components/Auth/AuthModal';
import { RechargeModal } from './components/Payment/RechargeModal';
import { ProtectedVideoPlayer } from './components/Player/ProtectedVideoPlayer';
import { InteractiveQuizModal } from './components/Quiz/InteractiveQuizModal';
import { PdfViewerModal } from './components/PDF/PdfViewerModal';
import { Footer } from './components/Footer';
import { CheckCircle, AlertCircle, X, Info, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeView, 
    selectedCourse, 
    setActiveView, 
    activeLesson, 
    activeLessonCourse, 
    closeVideoPlayer,
    activeQuiz,
    closeQuiz,
    activePdf,
    closePdf,
    notifications,
    removeNotification
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e1b15] text-gray-900 dark:text-gray-100 transition-colors">
      
      {/* Toast Notifications with flexible dismiss/skip */}
      {notifications.length > 0 && (
        <div className="fixed top-24 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none text-right">
          {notifications.slice(0, 3).map(notif => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl shadow-2xl flex items-start justify-between gap-3 text-xs font-bold pointer-events-auto transition-all animate-fadeIn border ${
                notif.type === 'error'
                  ? 'bg-red-700 text-white border-red-500'
                  : notif.type === 'warning'
                  ? 'bg-amber-600 text-white border-amber-400'
                  : notif.type === 'info'
                  ? 'bg-blue-700 text-white border-blue-400'
                  : 'bg-[#1b4332] text-white border-[#f39c12]'
              }`}
            >
              <div className="flex items-start gap-2 flex-1">
                {notif.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />
                ) : notif.type === 'info' ? (
                  <Info className="w-4 h-4 text-blue-200 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-[#f39c12] shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{notif.message}</span>
              </div>

              <button
                onClick={() => removeNotification(notif.id)}
                className="p-1 hover:bg-white/20 rounded-lg text-white/90 hover:text-white transition-colors shrink-0"
                title="تخطي الرسالة"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Responsive Header */}
      <Header />

      {/* Main Dynamic View Layout */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <div>
            <HeroSection 
              onScrollToGrades={() => {
                const el = document.getElementById('grades-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onScrollToCourses={() => {
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <FeaturesSection />
            <CoursesSection />
            <MethodologySection />
            <GradeSelectorSection />
          </div>
        )}

        {activeView === 'dashboard' && <StudentDashboard />}

        {activeView === 'courses' && <CourseCatalogView />}

        {activeView === 'course_detail' && selectedCourse && (
          <CourseDetailView
            course={selectedCourse}
            onBack={() => setActiveView('courses')}
          />
        )}

        {activeView === 'exams' && <ExamsListView />}

        {activeView === 'pdfs' && <PdfsListView />}

        {activeView === 'account' && <AccountView />}

        {activeView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Global Interactive Modals */}
      <AuthModal />
      <RechargeModal />

      {/* Protected Video Player Modal with Anti-Screen-Recording */}
      {activeLesson && activeLessonCourse && (
        <ProtectedVideoPlayer
          lesson={activeLesson}
          course={activeLessonCourse}
          onClose={closeVideoPlayer}
        />
      )}

      {/* Quiz Modal */}
      {activeQuiz && (
        <InteractiveQuizModal
          quiz={activeQuiz}
          onClose={closeQuiz}
        />
      )}

      {/* PDF Viewer Modal */}
      {activePdf && (
        <PdfViewerModal
          pdf={activePdf}
          onClose={closePdf}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
