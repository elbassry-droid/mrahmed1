import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeLevel, Gender, EGYPT_GOVERNORATES } from '../../types';
import { TEACHER_IMAGE } from '../../data/mockData';
import { 
  X, 
  User as UserIcon, 
  Phone, 
  Lock, 
  GraduationCap, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    authModalMode, 
    closeAuthModal, 
    openAuthModal, 
    login, 
    register,
    deviceConflictInfo,
    clearDeviceConflict,
    forceTransferDevice,
    currentDeviceInfo,
    addNotification 
  } = useApp();

  // Registration step state (1, 2, 3)
  const [step, setStep] = useState<number>(1);

  // Step 1: Grade & Basic Personal Info
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('second_general');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');

  // Step 2: Parent Phone, Governorate, Gender
  const [parentPhone, setParentPhone] = useState('');
  const [governorate, setGovernorate] = useState('قنا');
  const [gender, setGender] = useState<Gender>('male');

  // Step 3: Password & Confirmation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !studentPhone.trim()) {
      setErrorMsg('يرجى ملء كافة الحقول الإلزامية');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentPhone.trim()) {
      setErrorMsg('يرجى إدخال رقم هاتف ولي الأمر للمتابعة');
      return;
    }
    setErrorMsg('');
    setStep(3);
  };

  const handleFinalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 4) {
      setErrorMsg('كلمة السر يجب ألا تقل عن 4 خانات');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('يرجى التأكد من كتابة تأكيد كلمة السر بنجاح');
      return;
    }

    register({
      firstName,
      lastName,
      phone: studentPhone,
      parentPhone,
      grade: selectedGrade,
      governorate,
      gender,
      role: 'student'
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(loginPhone, loginPass);
    if (!success && !deviceConflictInfo) {
      setErrorMsg('بيانات الدخول غير صحيحة، يرجى التحقق من الرقم وكلمة المرور');
    }
  };

  const handleTransferCurrentDevice = () => {
    if (!loginPass) {
      setErrorMsg('يرجى كتابة كلمة المرور لتأكيد قفل الحساب على جهازك الحالي');
      return;
    }
    const success = forceTransferDevice(loginPhone, loginPass);
    if (!success) {
      setErrorMsg('تعذر نقل الحساب، يرجى التحقق من كلمة المرور');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#162720] text-gray-900 dark:text-white rounded-3xl overflow-hidden border border-emerald-900/20 shadow-2xl flex flex-col my-6 text-right">
        
        {/* Top Decorative Green Bar */}
        <div className="bg-gradient-to-l from-[#1b4332] via-[#24533e] to-[#2d6a4f] p-4 text-white flex items-center justify-between">
          <button
            onClick={() => {
              clearDeviceConflict();
              closeAuthModal();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="إغلاق النافذة"
            id="close-auth-modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[#ffbe76]">منصة القائد</span>
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#f39c12]">
              <img src={TEACHER_IMAGE} alt="مستر أحمد عبدالحميد" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {deviceConflictInfo ? (
            /* Single Device Conflict View */
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>تنبيه أمان قفل الجهاز</span>
                </div>
                <h3 className="text-xl font-black font-changa text-gray-900 dark:text-white">
                  الحساب مرتبط ومقفل على جهاز آخر
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  حساب الطالب <span className="font-bold text-[#2d6a4f] dark:text-emerald-300">({deviceConflictInfo.studentName})</span> مسجل على جهاز سابق.
                </p>
              </div>

              {/* Conflict details card */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 block">الجهاز المسجل حالياً:</span>
                    <span className="font-mono text-gray-900 dark:text-white font-bold">{deviceConflictInfo.registeredDeviceName}</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 block">تاريخ الربط: {deviceConflictInfo.deviceLinkedAt}</span>
                  </div>
                </div>

                <div className="h-px bg-amber-200 dark:bg-amber-900/40 my-1" />

                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#2d6a4f] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 block">جهازك الحالي (هذا المتصفح):</span>
                    <span className="font-mono text-[#2d6a4f] dark:text-emerald-300 font-bold">{deviceConflictInfo.currentDeviceName}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 text-xs leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  لماذا تمنع المنصة فتح الحساب على جهازين؟
                </p>
                <p className="text-[11px] text-blue-800 dark:text-blue-300">
                  وفقاً لقواعد منصة القائد، يُسمح لكل طالب بجهاز واحد فقط لحماية الحصص والواجبات ومنع تبادل الحسابات. إذا قمت بنقل الحساب الآن، سيتم تسجيل الخروج فوراً وبشكل تلقائي من الجهاز السابق.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleTransferCurrentDevice}
                  className="w-full py-3 px-4 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <RefreshCw className="w-4 h-4 text-[#ffbe76]" />
                  <span>نقل الحساب وربطه بجهازي الحالي (وإنهاء الجهاز القديم)</span>
                </button>

                <button
                  type="button"
                  onClick={clearDeviceConflict}
                  className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1f3529] dark:hover:bg-[#254233] text-gray-700 dark:text-gray-300 font-bold text-xs transition-all"
                >
                  إلغاء والعودة
                </button>
              </div>
            </div>
          ) : authModalMode === 'register' ? (
            /* Register Mode Form with 3 Steps */
            <div className="space-y-5">
              
              {/* Header Title */}
              <div className="text-center">
                <div className="inline-block bg-[#1b4332] text-[#f39c12] px-3.5 py-1 rounded-xl text-xs font-black font-changa shadow-sm mb-1.5">
                  انضم لأبطال القائد
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-200">
                  إنشاء حساب طالب جديد
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  خطوة {step} من 3 • استمتع بالحفظ والفهم ومتابعة الدروس
                </p>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>سيتم قفل الحساب تلقائياً على هذا الجهاز لضمان أمان دراستك</span>
                </div>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'w-10 bg-[#f39c12]'
                        : i < step
                        ? 'w-6 bg-[#2d6a4f]'
                        : 'w-4 bg-gray-200 dark:bg-emerald-950'
                    }`}
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: Grade + Name + Student Phone */}
              {step === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      الصف الدراسي <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedGrade}
                        onChange={e => setSelectedGrade(e.target.value as GradeLevel)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      >
                        <option value="first_general">الصف الأول الثانوي (عام)</option>
                        <option value="second_general">الصف الثاني الثانوي (عام)</option>
                        <option value="second_bac">الصف الثاني الثانوي (بكالوريا / أزهر)</option>
                        <option value="third_general">الصف الثالث الثانوي (عام)</option>
                      </select>
                      <GraduationCap className="w-4 h-4 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        الاسم الأول <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="محمود"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        اسم العائلة <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="حمدي"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      رقم هاتف الطالب (واتساب) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={e => setStudentPhone(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f] text-left ltr"
                      />
                      <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>التالي: بيانات ولي الأمر والمحافظة</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Parent Phone + Complete 27 Governorates + Gender */}
              {step === 2 && (
                <form onSubmit={handleStep2Next} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      رقم هاتف ولي الأمر <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={parentPhone}
                        onChange={e => setParentPhone(e.target.value)}
                        placeholder="01xxxxxxxxx"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f] text-left ltr"
                      />
                      <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>المحافظة</span>
                      </label>
                      <select
                        value={governorate}
                        onChange={e => setGovernorate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      >
                        {EGYPT_GOVERNORATES.map(gov => (
                          <option key={gov} value={gov}>{gov}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                        النوع
                      </label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value as Gender)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-2.5 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold text-sm shadow-md transition-all"
                    >
                      السابق
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>التالي: كلمة السر</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Password & Confirm */}
              {step === 3 && (
                <form onSubmit={handleFinalRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      كلمة السر <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                      />
                      <Lock className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                      تأكيد كلمة السر <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-red-500'
                            : 'border-gray-300 dark:border-emerald-900/60 focus:border-[#2d6a4f]'
                        }`}
                      />
                      <Lock className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                    </div>
                  </div>

                  {confirmPassword && password !== confirmPassword && (
                    <div className="p-2 rounded-xl bg-red-100 text-red-700 text-xs font-bold text-center">
                      - يرجى التأكد من تطابق كلمة السر
                    </div>
                  )}

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>عند إتمام التسجيل، سيتم ربط هذا الحساب بجهازك الحالي ({currentDeviceInfo.label}) لضمان أمان حسابك ومنع مشاركته.</span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold text-sm shadow-md transition-all"
                    >
                      السابق
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>انشئ الحساب الآن !</span>
                      <CheckCircle2 className="w-4 h-4 text-[#ffbe76]" />
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom Switch Link */}
              <div className="text-center pt-4 border-t border-gray-100 dark:border-emerald-900/30 mt-4">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-bold text-[#f39c12] hover:underline"
                >
                  يوجد لديك حساب بالفعل؟ ادخل إلى حسابك الآن !
                </button>
              </div>

            </div>
          ) : (
            /* Login Mode Form */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block bg-[#1b4332] text-[#f39c12] px-4 py-1 rounded-xl text-lg font-black font-changa shadow-sm mb-2">
                  القــائــد
                </div>
                <h3 className="text-2xl font-black font-changa text-[#1b4332] dark:text-emerald-200">
                  تسجيل الدخول إلى حسابك
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  أهلاً بك مجدداً في منصة مستر أحمد عبدالحميد
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-[#1d3026] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-emerald-900/40">
                  <Smartphone className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>الجهاز الحالي: {currentDeviceInfo.label}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    رقم الهاتف المسجل
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={loginPhone}
                      onChange={e => setLoginPhone(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f] text-left ltr"
                    />
                    <Phone className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    كلمة السر
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPass}
                      onChange={e => setLoginPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#1b2c23] text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-[#2d6a4f]"
                    />
                    <Lock className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md transition-all active:scale-98"
                  id="auth-submit-login"
                >
                  تسجيل الدخول
                </button>
              </form>

              <div className="text-center pt-4 border-t border-gray-100 dark:border-emerald-900/30">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ليس لديك حساب بعد؟{' '}
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className="font-bold text-[#f39c12] hover:underline"
                  >
                    أنشئ حساباً جديداً الآن
                  </button>
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
