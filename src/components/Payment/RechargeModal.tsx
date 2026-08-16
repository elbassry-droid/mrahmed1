import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  CreditCard,
  Sparkles,
  KeyRound,
  Info
} from 'lucide-react';

export const RechargeModal: React.FC = () => {
  const { rechargeModalOpen, closeRechargeModal, redeemRechargeCode, user, walletBalance } = useApp();

  // Center card input
  const [centerCode, setCenterCode] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!rechargeModalOpen) return null;

  const handleRechargeCenterCard = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!centerCode.trim()) {
      setErrorMsg('يرجى كتابة كود كارت السنتر المطبوع على الكارت');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = redeemRechargeCode(centerCode.trim());
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMsg(result.message);
        setErrorMsg('');
        setCenterCode('');
      } else {
        setErrorMsg(result.message);
        setSuccessMsg('');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#15231c] text-gray-900 dark:text-white rounded-3xl overflow-hidden border border-emerald-900/40 shadow-2xl flex flex-col my-6 text-right">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-l from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-between">
          <button
            onClick={closeRechargeModal}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="bg-[#f39c12] text-black text-[10px] font-black px-2 py-0.5 rounded-md">
                كروت السنتر المعتمدة
              </span>
              <h3 className="font-black font-changa text-lg text-white">
                شحن رصيد المحفظة
              </h3>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              رصيدك الحالي بالمحفظة: <span className="font-bold text-yellow-300 font-mono">{walletBalance} ج.م</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          
          {/* Notifications */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-sm font-black">{successMsg}</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-normal">
                  تم تحديث رصيدك بنجاح، يمكنك الآن الاشتراك في أي كورس أو باقة مباشرة من المحفظة.
                </span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/70 border border-red-500 text-red-800 dark:text-red-200 text-xs font-bold flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block text-sm font-black">{errorMsg}</span>
                <span className="text-[11px] text-red-700 dark:text-red-300 font-normal">
                  تأكد من شراء الكارت من أحد السناتر المعتمدة لمستر أحمد عبدالحميد أو الحصول عليه من الإدارة.
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRechargeCenterCard} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5 flex items-center justify-between">
                <span>اكتب كود كارت السنتر (المطبوع على الكارت):</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">يتم التحقق فورياً</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={centerCode}
                  onChange={e => {
                    setCenterCode(e.target.value.toUpperCase());
                    setErrorMsg('');
                  }}
                  placeholder="مثال: QAED-120-C303"
                  className="w-full px-4 py-3.5 pr-11 rounded-2xl border-2 border-emerald-600/30 dark:border-emerald-700/60 bg-gray-50 dark:bg-[#1b2c23] text-base font-mono font-bold text-emerald-950 dark:text-emerald-200 tracking-wider focus:outline-hidden focus:border-[#2d6a4f] uppercase placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-sans placeholder:text-xs"
                />
                <KeyRound className="w-5 h-5 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-900/20 text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#f39c12]" />
                <span>طريقة الشحن المعتمدة والوحيدة على المنصة:</span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                • كروت السنتر متوفرة بجميع فئاتها (50، 100، 120، 150، 200 ج.م) في السناتر المعتمدة لمستر أحمد عبدالحميد.
                <br />
                • كل كود يتم توليده واعتماده مباشرة من لوحة تحكم المسؤول (الأدمن) ولا يُقبل أي كود خارج قاعدة بيانات المنصة.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !centerCode.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-[#1b4332] to-[#2d6a4f] hover:from-[#143326] hover:to-[#22533e] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <QrCode className="w-5 h-5 text-[#f39c12]" />
              <span>{isSubmitting ? 'جاري التحقق من الكود...' : 'شحن الكارت وإيداع الرصيد فورا'}</span>
            </button>
          </form>

          {/* Security guarantee footer */}
          <div className="pt-2 border-t border-gray-100 dark:border-emerald-900/30 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>نظام شحن مشفر ومحمي 100%</span>
            </div>
            <button
              onClick={closeRechargeModal}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              إلغاء
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
