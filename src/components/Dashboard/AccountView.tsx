import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEACHER_IMAGE } from '../../data/mockData';
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
  CheckCircle2
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
    addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'exams' | 'homework' | 'history' | 'center'>('profile');
  const [walletTab, setWalletTab] = useState<'invoices' | 'subs' | 'courses'>('invoices');
  
  // Center ID input state
  const [centerIdInput, setCenterIdInput] = useState(user?.centerId || '');
  const [isEditingCenterId, setIsEditingCenterId] = useState(false);

  const enrolledCourses = courses.filter(c => enrolledCourseIds.includes(c.id));
  const completedLessons = enrolledCourses.reduce(
    (acc, c) => acc + (c.lessons?.filter(l => l.isCompleted)?.length || 0),
    0
  );

  const handleSaveCenterId = (e: React.FormEvent) => {
    e.preventDefault();
    if (centerIdInput.trim()) {
      updateUser({ centerId: centerIdInput.trim() });
      setIsEditingCenterId(false);
      addNotification(`تم ربط ID السنتر بنجاح: ${centerIdInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] dark:bg-[#0e1b15] py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Account Sidebar (Right in RTL) & Content Panels (Left in RTL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Account / Wallet / Invoices Content (Col 8) */}
          <div className="lg:col-span-8 space-y-6 text-right order-2 lg:order-1">
            
            {/* Wallet Balance Card (Screenshot 10 Match) */}
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
                {/* Center Code Button */}
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

              {/* Wallet Secondary Tabs (Screenshot 10 Match: الفواتير / الاشتراكات / كورساتي) */}
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

              {/* Invoices Table View */}
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
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="p-3 bg-gray-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-white">{course.title}</p>
                          <span className="text-[11px] text-gray-500">تم تفعيل الاشتراك • صلاحية ممتدة حتى نهاية العام</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full">
                          اشتراك نشط ✓
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {walletTab === 'courses' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="p-3 border border-emerald-900/20 rounded-xl flex items-center gap-3">
                        <img src={course.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-xs truncate max-w-[160px]">{course.title}</p>
                          <p className="text-[11px] text-gray-400">{course.lessonsCount} حصص</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Exam Results Tab Panel if Selected */}
            {activeTab === 'exams' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                    سجل نتائج الامتحانات والكويزات
                  </h3>
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

            {/* Center ID Linking Modal / Box */}
            {activeTab === 'center' && (
              <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4">
                <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-300">
                  ربط كود السنتر والحضور الفعلي
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  اربط الكود المطبوع على كارت السنتر الخاص بك لتفعيل المزامنة المباشرة لدرجاتك وحضورك في السنتر مع الأكاونت على المنصة.
                </p>

                <form onSubmit={handleSaveCenterId} className="flex gap-3 max-w-md">
                  <input
                    type="text"
                    value={centerIdInput}
                    onChange={e => setCenterIdInput(e.target.value)}
                    placeholder="مثال: CTR-8842-QENA"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 text-sm font-mono focus:outline-hidden focus:border-[#2d6a4f]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                  >
                    حفظ وتأكيد
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Course Stats Circles (Screenshot 10 Exact Match) */}
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

          {/* Right Profile & Sub-menu Card (Col 4) (Screenshot 10 Exact Match) */}
          <div className="lg:col-span-4 space-y-4 order-1 lg:order-2">
            
            {/* Top User Info Card */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-6 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#2d6a4f] to-[#52b788] text-white flex items-center justify-center mx-auto font-black text-2xl border-4 border-white dark:border-[#162720] shadow-md">
                {user?.firstName ? user.firstName[0] : 'ط'}
              </div>

              <div>
                <h3 className="font-black font-changa text-lg text-[#1b4332] dark:text-emerald-200">
                  {user ? `${user.firstName} ${user.secondName} ${user.thirdName} ${user.lastName}` : 'محمود حمدي احمد محمد'}
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

            {/* Menu Options (Screenshot 10 Exact Menu Items) */}
            <div className="bg-white dark:bg-[#162720] rounded-2xl p-3 border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-1.5 text-right">
              <span className="text-[11px] font-bold text-gray-400 px-3 block mb-1">
                اختيارات اخرى
              </span>

              {/* Item 1: الملف الشخصي */}
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
                  <span>الملف الشخصي</span>
                </span>
              </button>

              {/* Item 2: الامان و تاريخ تسجيل الدخول */}
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
                  <span>الامان و تاريخ تسجيل الدخول</span>
                </span>
              </button>

              {/* Item 3: نتائج الامتحانات */}
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

              {/* Item 4: نتائج الواجب */}
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

              {/* Item 5: ربط id السنتر */}
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
