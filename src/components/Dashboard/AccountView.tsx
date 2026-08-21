import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEACHER_IMAGE } from '../../data/mockData';
import { EGYPT_GOVERNORATES, GradeLevel } from '../../types';
import { 
  User as UserIcon, 
  Wallet, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Award, 
  Clock, 
  Receipt, 
  Link as LinkIcon, 
  KeyRound, 
  ChevronLeft, 
  Zap, 
  Phone, 
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  ShieldAlert,
  RefreshCw,
  Edit3,
  Save,
  Check
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { 
    user, 
    walletBalance, 
    invoices, 
    openRechargeModal, 
    quizResults, 
    enrolledCourseIds, 
    courses,
    updateUser,
    addNotification,
    currentDeviceInfo,
    changeUserPassword
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'exams' | 'homework' | 'history' | 'center'>('history');
  const [walletTab, setWalletTab] = useState<'invoices' | 'subs' | 'courses'>('invoices');
  
  // Profile editing state
  const [editFirstName, setEditFirstName] = useState(user?.firstName || '');
  const [editLastName, setEditLastName] = useState(user?.lastName || '');
  const [editGovernorate, setEditGovernorate] = useState(user?.governorate || 'قنا');
  const [editParentPhone, setEditParentPhone] = useState(user?.parentPhone || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Center ID input state
  const [centerIdInput, setCenterIdInput] = useState(user?.centerId || '');

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const completedLessons = enrolledCourses.reduce(
    (acc, c) => acc + (c.lessons?.filter(l => l.isCompleted)?.length || 0),
    0
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFirstName.trim() || !editLastName.trim() || !editParentPhone.trim()) {
      addNotification('يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }
    updateUser({
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      governorate: editGovernorate,
      parentPhone: editParentPhone.trim()
    });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
    addNotification('تم تحديث بيانات الملف الشخصي بنجاح', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (!newPass || newPass.length < 4) {
      setPassError('كلمة المرور الجديدة يجب ألا تقل عن 4 خانات');
      return;
    }

    if (newPass !== confirmNewPass) {
      setPassError('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }

    const success = changeUserPassword(currentPass, newPass);
    if (success) {
      setPassSuccess(true);
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      addNotification('تم تغيير كلمة المرور بنجاح وحماية الحساب', 'success');
    } else {
      setPassError('كلمة المرور الحالية غير صحيحة');
    }
  };

  const handleSaveCenterId = (e: React.FormEvent) => {
    e.preventDefault();
    if (centerIdInput.trim()) {
      updateUser({ centerId: centerIdInput.trim() });
      addNotification(`تم ربط ID السنتر بنجاح: ${centerIdInput}`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Account Sidebar (Right in RTL) & Content Panels (Left in RTL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Account / Wallet / Panels Content (Col 8) */}
          <div className="lg:col-span-8 space-y-6 text-right order-2 lg:order-1">
            
            {/* VIEW 1: PROFILE EDIT PANEL */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900/30 pb-4">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[#2d6a4f] dark:text-emerald-400" />
                    <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                      تعديل بيانات الملف الشخصي
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full font-bold">
                    طالب مسجل ✓
                  </span>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تم حفظ وتحديث بيانات حسابك بنجاح!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        الاسم الأول <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editFirstName}
                        onChange={e => setEditFirstName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        اسم العائلة واللقب <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editLastName}
                        onChange={e => setEditLastName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        رقم هاتف الطالب (المسجل للدخول)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user?.phone || ''}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-950 bg-gray-100 dark:bg-black/30 text-sm font-mono text-gray-500 cursor-not-allowed text-left ltr"
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">
                        * رقم الهاتف مقفل كمعرف أساسي لحسابك ولتغييره تواصل مع الإدارة.
                      </span>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        رقم هاتف ولي الأمر (واتساب) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editParentPhone}
                        onChange={e => setEditParentPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f] text-left ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        المحافظة (27 محافظة مصرية)
                      </label>
                      <select
                        value={editGovernorate}
                        onChange={e => setEditGovernorate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      >
                        {EGYPT_GOVERNORATES.map(gov => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        الصف الدراسي
                      </label>
                      <input
                        type="text"
                        disabled
                        value={
                          user?.grade === 'second_general' ? 'الصف الثاني الثانوي (عام)' :
                          user?.grade === 'second_bac' ? 'الصف الثاني الثانوي (بكالوريا)' :
                          user?.grade === 'third_general' ? 'الصف الثالث الثانوي (عام)' :
                          'الصف الأول الثانوي (عام)'
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-emerald-950 bg-gray-100 dark:bg-black/30 text-xs font-bold text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 2: SECURITY & SINGLE-DEVICE DASHBOARD */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900/30 pb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                      الأمان وقفل الحساب على جهاز واحد
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20">
                    🔒 الحماية مفعلة
                  </span>
                </div>

                {/* Single Device Status Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-6 h-6 text-[#2d6a4f] dark:text-emerald-400 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                        حسابك مقفل بنجاح على جهازك المصرح به
                      </h4>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                        وفقاً لنظام أمان منصة القائد، لا يمكن فتح الحساب أو مشاهدة الحصص من أكثر من جهاز في نفس الوقت لحماية خصوصيتك والمحتوى التعليمي.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#111f18] p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الجهاز المسجل حالياً:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {user?.registeredDeviceName || currentDeviceInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">جهازك الحالي (المتصفح):</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {currentDeviceInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">تاريخ آخر ربط أمني:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-mono text-[11px]">
                        {user?.deviceLinkedAt || 'الآن'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Change Sub-Form */}
                <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-emerald-900/30">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-[#f39c12]" />
                    <span>تغيير كلمة المرور</span>
                  </h4>

                  {passError && (
                    <div className="p-2.5 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold">
                      {passError}
                    </div>
                  )}

                  {passSuccess && (
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>تم تحديث كلمة المرور بنجاح!</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-3 max-w-md text-xs">
                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        كلمة المرور الحالية
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPass}
                        onChange={e => setCurrentPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        تأكيد كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPass}
                        onChange={e => setConfirmNewPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-xs shadow-md transition-all"
                    >
                      تحديث كلمة المرور
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 3: HOMEWORK & ASSIGNMENTS RESULTS */}
            {activeTab === 'homework' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900/30 pb-4">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                      نتائج الواجبات والمتابعة الدورية
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 font-bold">
                    متابعة أسبوعية مع مستر أحمد عبدالحميد
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-900/20 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">واجب المحاضرة الأولى: طبيعة الموقف الفلسفي</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">تم تسليمه وحله بنجاح وتصحيح الأسئلة المقالية والاختيارية</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-base font-black font-changa text-emerald-600 dark:text-emerald-400">
                        10 / 10 (100%)
                      </span>
                      <span className="block text-[10px] text-gray-400">ممتاز ✓</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-900/20 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">واجب المحاضرة الثانية: خصائص التفكير الفلسفي ونواتج التعلم</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">تمت المراجعة مع مساعدي مستر أحمد عبدالحميد</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-base font-black font-changa text-emerald-600 dark:text-emerald-400">
                        9.5 / 10 (95%)
                      </span>
                      <span className="block text-[10px] text-gray-400">جيد جداً مرتفع ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: EXAM RESULTS */}
            {activeTab === 'exams' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-emerald-900/30 pb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#f39c12]" />
                    <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                      سجل نتائج الامتحانات والكويزات
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500">{quizResults.length} اختبار</span>
                </div>

                {quizResults.length > 0 ? (
                  <div className="space-y-3">
                    {quizResults.map(res => (
                      <div key={res.id} className="p-4 rounded-xl border border-emerald-900/20 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{res.quizTitle}</p>
                          <span className="text-xs text-gray-500">{res.date}</span>
                        </div>
                        <div className="text-left">
                          <span className={`text-lg font-black font-changa ${res.percentage >= 85 ? 'text-emerald-600' : 'text-amber-500'}`}>
                            {res.score} / {res.totalMarks} ({res.percentage}%)
                          </span>
                          <span className="block text-[10px] text-gray-400">تم التصحيح آلياً</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    لم تقم بحل أي امتحانات بعد. ادخل إلى المحاضرات لحل الكويزات!
                  </div>
                )}
              </div>
            )}

            {/* VIEW 5: CENTER ID LINKING */}
            {activeTab === 'center' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-gray-100 dark:border-emerald-900/30 pb-4">
                  <QrCode className="w-5 h-5 text-[#f39c12]" />
                  <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                    ربط كود السنتر والحضور الفعلي
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  اربط الكود المطبوع على كارت السنتر الخاص بك لتفعيل المزامنة المباشرة لدرجاتك وحضورك في السنتر مع الأكاونت على المنصة.
                </p>

                <form onSubmit={handleSaveCenterId} className="flex gap-3 max-w-md pt-2">
                  <input
                    type="text"
                    value={centerIdInput}
                    onChange={e => setCenterIdInput(e.target.value)}
                    placeholder="مثال: CTR-8842-QENA"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-sm font-mono focus:outline-hidden focus:border-[#2d6a4f]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    حفظ وتأكيد
                  </button>
                </form>
              </div>
            )}

            {/* VIEW 6: WALLET & INVOICES (DEFAULT / HISTORY) */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-emerald-900/30">
                
                {/* Balance Display */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center text-3xl">
                    👛
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">
                      الرصيد الحالي في حسابك
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
                        {walletBalance}
                      </span>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">جنيه</span>
                    </div>
                  </div>
                </div>

                {/* Instructions text */}
                <div className="max-w-xs text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-right">
                  <p className="font-bold text-gray-700 dark:text-gray-300 mb-0.5">طريقة شحن الرصيد المعتمدة</p>
                  اكتب الكود المطبوع على كارت السنتر المعتمد الخاص بك لتفعيله فوراً على حسابك وشحن المحفظة.
                </div>

              </div>

              {/* Action Recharge Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-5">
                <button
                  onClick={openRechargeModal}
                  className="bg-gradient-to-l from-[#1b4332] to-[#2d6a4f] hover:from-[#143326] hover:to-[#22533e] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
                  id="btn-recharge-center"
                >
                  <QrCode className="w-4 h-4 text-[#f39c12]" />
                  <span>شحن الرصيد بكارت السنتر المعتمد</span>
                </button>

                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  أكواد مشفرة معتمدة من الإدارة
                </span>
              </div>

              {/* Wallet Secondary Tabs (الفواتير / الاشتراكات / كورساتي) */}
              <div className="flex items-center gap-6 border-b border-gray-200 dark:border-emerald-900/40 mt-8 text-xs sm:text-sm font-bold">
                <button
                  onClick={() => setWalletTab('invoices')}
                  className={`pb-2 transition-colors relative ${
                    walletTab === 'invoices'
                      ? 'text-[#2d6a4f] dark:text-emerald-400 border-b-2 border-[#2d6a4f]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  الفواتير
                </button>

                <button
                  onClick={() => setWalletTab('subs')}
                  className={`pb-2 transition-colors relative ${
                    walletTab === 'subs'
                      ? 'text-[#2d6a4f] dark:text-emerald-400 border-b-2 border-[#2d6a4f]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  الاشتراكات
                </button>

                <button
                  onClick={() => setWalletTab('courses')}
                  className={`pb-2 transition-colors relative ${
                    walletTab === 'courses'
                      ? 'text-[#2d6a4f] dark:text-emerald-400 border-b-2 border-[#2d6a4f]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  كورساتي
                </button>
              </div>

              {/* Invoices / Subs / Courses Table Content */}
              <div className="pt-4 overflow-x-auto">
                {walletTab === 'invoices' && (
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-emerald-900/30">
                        <th className="py-2.5 px-3">التسلسل</th>
                        <th className="py-2.5 px-3">رقم الفاتورة</th>
                        <th className="py-2.5 px-3">المشتريات</th>
                        <th className="py-2.5 px-3">المبلغ</th>
                        <th className="py-2.5 px-3">طريقة الدفع</th>
                        <th className="py-2.5 px-3">الحالة</th>
                        <th className="py-2.5 px-3">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-emerald-900/20 text-gray-700 dark:text-gray-300">
                      {invoices.length > 0 ? (
                        invoices.map((inv, idx) => (
                          <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-emerald-950/30">
                            <td className="py-3 px-3 font-bold">{idx + 1}</td>
                            <td className="py-3 px-3 font-mono">{inv.orderNumber}</td>
                            <td className="py-3 px-3 font-medium max-w-xs truncate">{inv.courseTitle}</td>
                            <td className="py-3 px-3 font-black text-[#1b4332] dark:text-emerald-300">{inv.amount} ج.م</td>
                            <td className="py-3 px-3">{inv.paymentMethod}</td>
                            <td className="py-3 px-3">
                              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-400 text-[11px]">{inv.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-400">
                            لا توجد فواتير سابقة حتى الآن
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

                {walletTab === 'subs' && (
                  <div className="space-y-3 py-2">
                    {enrolledCourses.length > 0 ? (
                      enrolledCourses.map(course => (
                        <div key={course.id} className="p-3 bg-gray-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-xs text-gray-900 dark:text-white">{course.title}</p>
                            <span className="text-[11px] text-gray-500">تم تفعيل الاشتراك • صلاحية ممتدة حتى نهاية العام</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full">
                            اشتراك نشط ✓
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-xs text-gray-400">لم تشترك في أي كورسات بعد.</p>
                    )}
                  </div>
                )}

                {walletTab === 'courses' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                    {enrolledCourses.length > 0 ? (
                      enrolledCourses.map(course => (
                        <div key={course.id} className="p-3 border border-emerald-900/20 rounded-xl flex items-center gap-3">
                          <img src={course.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-xs truncate max-w-[160px]">{course.title}</p>
                            <p className="text-[11px] text-gray-400">{course.lessonsCount} حصص</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center col-span-2 py-6 text-xs text-gray-400">لا توجد كورسات في حسابك بعد.</p>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Course Stats Circles */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black font-changa text-[#1b4332] dark:text-emerald-300">
                  احصائيات كورساتك
                </h3>
                <button
                  onClick={() => setActiveTab('exams')}
                  className="text-xs font-bold text-gray-500 hover:text-[#f39c12] flex items-center gap-1"
                >
                  <span>اعرض الكل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Circle 1: Quizzes completed */}
                <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-gray-200 dark:border-emerald-900/40 shadow-xs flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-[#f39c12] mb-3">يلا أبدأ!</span>
                  
                  <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#2d6a4f]/30 dark:border-emerald-500/30 flex items-center justify-center mb-3">
                    <span className="text-3xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
                      {quizResults.length}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                    عدد الإختبارات اللي خلصتها
                  </p>
                </div>

                {/* Circle 2: Videos watched */}
                <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-gray-200 dark:border-emerald-900/40 shadow-xs flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-[#f39c12] mb-3">يلا أبدأ!</span>
                  
                  <div className="w-28 h-28 rounded-full border-4 border-dashed border-[#f39c12]/40 flex items-center justify-center mb-3">
                    <span className="text-3xl font-black font-changa text-[#f39c12]">
                      {completedLessons}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                    عدد الفيديوهات اللي شوفتها
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Profile & Sub-menu Card (Col 4) */}
          <div className="lg:col-span-4 space-y-4 order-1 lg:order-2">
            
            {/* Top User Info Card */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2d6a4f] to-[#52b788] text-white flex items-center justify-center mx-auto font-black text-2xl border-4 border-white dark:border-[#162720] shadow-md">
                {user?.firstName ? user.firstName[0] : 'ط'}
              </div>

              <div>
                <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-200">
                  {user ? `${user.firstName} ${user.secondName || ''} ${user.thirdName || ''} ${user.lastName}`.trim() : 'محمود حمدي'}
                </h3>
                <span className="text-[11px] text-gray-400 block mt-0.5">عضو منذ: {user?.joinedDate}</span>
              </div>

              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-emerald-900/30 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">رقم الهاتف:</span>
                  <span className="font-bold text-[#2d6a4f] dark:text-emerald-400 ltr">{user?.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">رقم هاتف ولي الأمر:</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300 ltr">{user?.parentPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">المحافظة والسنتر:</span>
                  <span className="font-bold">{user?.governorate} • {user?.centerId || 'غير مرتبط'}</span>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-3 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-1.5 text-right">
              <span className="text-[11px] font-bold text-gray-400 px-3 block mb-1">
                اختيارات الحساب
              </span>

              {/* Item 1: المحفظة والاشتراكات */}
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'history'
                    ? 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#2d6a4f]" />
                  <span>المحفظة والفواتير</span>
                </span>
              </button>

              {/* Item 2: الملف الشخصي */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <span className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#2d6a4f]" />
                  <span>تعديل الملف الشخصي</span>
                </span>
              </button>

              {/* Item 3: الامان و تاريخ تسجيل الدخول */}
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'security'
                    ? 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>الامان وقفل الجهاز</span>
                </span>
              </button>

              {/* Item 4: نتائج الامتحانات */}
              <button
                onClick={() => setActiveTab('exams')}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'exams'
                    ? 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#f39c12]" />
                  <span>نتائج الامتحانات</span>
                </span>
              </button>

              {/* Item 5: نتائج الواجب */}
              <button
                onClick={() => setActiveTab('homework')}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'homework'
                    ? 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-cyan-600" />
                  <span>نتائج الواجب</span>
                </span>
              </button>

              {/* Item 6: ربط id السنتر */}
              <button
                onClick={() => setActiveTab('center')}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'center'
                    ? 'bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-emerald-950/30'
                }`}
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#f39c12]" />
                  <span>ربط id السنتر</span>
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
