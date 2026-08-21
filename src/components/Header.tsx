import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sun, 
  Moon, 
  Wallet, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  BookOpen, 
  LayoutDashboard, 
  GraduationCap,
  Sparkles,
  ShieldCheck,
  X,
  CheckCheck,
  Home,
  Award,
  FileText
} from 'lucide-react';
import { TEACHER_IMAGE } from '../data/mockData';

export const Header: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    isAdmin,
    theme, 
    toggleTheme, 
    activeView, 
    setActiveView, 
    openAuthModal, 
    logout,
    walletBalance,
    openRechargeModal,
    notifications,
    removeNotification,
    clearAllNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#13201a]/95 backdrop-blur-md border-b border-[#2d6a4f]/15 dark:border-emerald-900/40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Right Side: Brand Logo */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
          id="header-logo-button"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border border-emerald-400/20">
              <GraduationCap className="w-7 h-7 text-[#f39c12]" />
            </div>
            <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#f39c12] flex items-center justify-center text-[9px] text-white font-bold">
              ★
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-changa tracking-tight text-[#1b4332] dark:text-emerald-300">
                القــائــد
              </span>
              <span className="text-xs bg-[#f39c12]/15 text-[#d35400] dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-[#f39c12]/30">
                المواد الفلسفية
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              مستر أحمد عبدالحميد
            </span>
          </div>
        </div>

        {/* Center / Actions: Theme Toggle & Navigation Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-700 dark:text-gray-200">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'landing' 
                  ? 'text-[#2d6a4f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                  : 'hover:text-[#2d6a4f] dark:hover:text-emerald-400'
              }`}
              id="nav-home"
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveView('courses')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'courses' 
                  ? 'text-[#2d6a4f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                  : 'hover:text-[#2d6a4f] dark:hover:text-emerald-400'
              }`}
              id="nav-courses"
            >
              الكورسات
            </button>
            <button
              onClick={() => setActiveView('exams')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'exams' 
                  ? 'text-[#2d6a4f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                  : 'hover:text-[#2d6a4f] dark:hover:text-emerald-400'
              }`}
              id="nav-exams"
            >
              الامتحانات
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveView('admin')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'admin' 
                    ? 'text-white bg-[#f39c12] shadow-sm' 
                    : 'text-[#d35400] dark:text-amber-300 hover:bg-amber-100/40 dark:hover:bg-amber-950/40'
                }`}
                id="nav-admin"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>لوحة الأدمن</span>
              </button>
            )}

            {isLoggedIn && !isAdmin && (
              <>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'dashboard' 
                      ? 'text-[#2d6a4f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                      : 'hover:text-[#2d6a4f] dark:hover:text-emerald-400'
                  }`}
                  id="nav-dashboard"
                >
                  لوحة الطالب
                </button>
                <button
                  onClick={() => setActiveView('account')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeView === 'account' 
                      ? 'text-[#2d6a4f] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                      : 'hover:text-[#2d6a4f] dark:hover:text-emerald-400'
                  }`}
                  id="nav-account"
                >
                  حسابي
                </button>
              </>
            )}
          </nav>

          {/* Theme Switcher Pill */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 bg-[#f39c12] hover:bg-[#e67e22] text-white px-3 py-1.5 rounded-full shadow-sm transition-transform active:scale-95 text-xs font-bold"
            title="تبديل المظهر"
            id="theme-toggle-btn"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-4 h-4" />
                <span className="hidden sm:inline">نهاري</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">ليلي</span>
              </>
            )}
          </button>

          {/* If Logged In: Wallet Pill, Notifications, & Profile Dropdown */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Wallet Pill Button */}
              <button
                onClick={openRechargeModal}
                className="flex items-center gap-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs border border-emerald-600/40 transition-all hover:scale-102"
                id="header-wallet-btn"
                title="اضغط لشحن رصيد المحفظة"
              >
                <Wallet className="w-4 h-4 text-[#f39c12]" />
                <span>{walletBalance} جنيه</span>
                <span className="text-[10px] bg-[#f39c12] text-white px-1.5 py-0.2 rounded-full font-bold">
                  + شحن
                </span>
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 rounded-full bg-gray-100 dark:bg-emerald-950/60 hover:bg-gray-200 dark:hover:bg-emerald-900/60 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-colors relative"
                  id="notifications-btn"
                  title="الإشعارات والتنبيهات"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#f39c12] animate-pulse"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#17261f] rounded-2xl shadow-2xl border border-gray-100 dark:border-emerald-900/40 p-4 z-50 animate-fadeIn text-right">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-emerald-900/40 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#f39c12]" />
                        <span className="font-bold text-xs text-gray-800 dark:text-gray-200">التنبيهات والرسائل</span>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[11px] text-gray-500 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>مسح الكل</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 py-4">لا توجد إشعارات جديدة حالياً</p>
                      ) : (
                        notifications.map(item => (
                          <div 
                            key={item.id} 
                            className={`text-xs p-3 rounded-xl flex items-start justify-between gap-2 border transition-all ${
                              item.type === 'error'
                                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 text-red-800 dark:text-red-300'
                                : item.type === 'warning'
                                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-300'
                                : item.type === 'info'
                                ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 text-blue-800 dark:text-blue-300'
                                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                            }`}
                          >
                            <div className="flex-1 space-y-1">
                              <p className="font-medium leading-relaxed">{item.message}</p>
                              <span className="text-[10px] opacity-70 block">{item.timestamp}</span>
                            </div>
                            <button
                              onClick={() => removeNotification(item.id)}
                              className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                              title="تخطي الرسالة"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-emerald-950/50 transition-colors"
                  id="user-profile-menu-btn"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#52b788] text-white flex items-center justify-center font-bold text-sm shadow-xs border-2 border-white dark:border-[#13201a]">
                    {isAdmin ? '👑' : (user.firstName ? user.firstName[0] : 'ط')}
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute left-0 mt-2 w-60 bg-white dark:bg-[#17261f] rounded-2xl shadow-xl border border-gray-100 dark:border-emerald-900/40 p-2 z-50 animate-fadeIn text-right">
                    <div className="p-2 border-b border-gray-100 dark:border-emerald-900/40 mb-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm text-[#1b4332] dark:text-emerald-300">
                          {user.firstName} {user.lastName}
                        </p>
                        {isAdmin && (
                          <span className="text-[10px] bg-[#f39c12] text-black px-2 py-0.5 rounded-full font-black">
                            أدمن
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{user.phone}</p>
                    </div>

                    {isAdmin ? (
                      <button
                        onClick={() => {
                          setActiveView('admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-bold text-[#f39c12] hover:bg-amber-50 dark:hover:bg-emerald-950/40 text-right"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#f39c12]" />
                        <span>لوحة إدارة مستر أحمد عبدالحميد</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => {
                        setActiveView('dashboard');
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-right"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2d6a4f]" />
                      <span>لوحة الطالب والدروس</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('account');
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-right"
                    >
                      <UserIcon className="w-4 h-4 text-[#2d6a4f]" />
                      <span>الملف الشخصي والفواتير</span>
                    </button>

                    <button
                      onClick={() => {
                        openRechargeModal();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-right"
                    >
                      <Wallet className="w-4 h-4 text-[#f39c12]" />
                      <span>شحن الرصيد والمحفظة</span>
                    </button>

                    <div className="border-t border-gray-100 dark:border-emerald-900/40 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-right"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Logged Out Buttons */
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#e67e22] hover:text-[#d35400] border-2 border-[#e67e22] hover:border-[#d35400] bg-white dark:bg-transparent transition-all hover:scale-102 active:scale-98"
                id="header-login-btn"
              >
                تسجيل الدخول
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#2d6a4f] hover:bg-[#1b4332] shadow-sm transition-all hover:scale-102 active:scale-98"
                id="header-register-btn"
              >
                حساب جديد
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#13201a]/95 backdrop-blur-md border-t border-[#2d6a4f]/20 dark:border-emerald-900/40 shadow-2xl px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveView('landing')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'landing'
              ? 'text-[#2d6a4f] dark:text-emerald-400 font-black scale-105'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveView('courses')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'courses' || activeView === 'course_detail'
              ? 'text-[#2d6a4f] dark:text-emerald-400 font-black scale-105'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
          id="mobile-nav-courses"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold">الكورسات</span>
        </button>

        <button
          onClick={() => setActiveView('exams')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'exams'
              ? 'text-[#2d6a4f] dark:text-emerald-400 font-black scale-105'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
          }`}
          id="mobile-nav-exams"
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-bold">الامتحانات</span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => setActiveView('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeView === 'admin'
                ? 'text-[#f39c12] font-black scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-amber-500'
            }`}
            id="mobile-nav-admin"
          >
            <ShieldCheck className="w-5 h-5 text-[#f39c12]" />
            <span className="text-[10px] font-bold">الأدمن</span>
          </button>
        ) : isLoggedIn ? (
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              activeView === 'dashboard' || activeView === 'account'
                ? 'text-[#2d6a4f] dark:text-emerald-400 font-black scale-105'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
            }`}
            id="mobile-nav-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold">لوحتي</span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[#f39c12] font-bold"
            id="mobile-nav-login"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px]">دخول</span>
          </button>
        )}
      </nav>
    </header>
  );
};
