import React from 'react';
import { ShieldAlert, LogOut, Smartphone, AlertTriangle, Key } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeviceKickedModal: React.FC = () => {
  const { deviceKickedAlert, closeDeviceKickedAlert, openAuthModal } = useApp();

  if (!deviceKickedAlert || !deviceKickedAlert.isOpen) {
    return null;
  }

  const handleAcknowledge = () => {
    closeDeviceKickedAlert();
    openAuthModal('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#162720] text-gray-900 dark:text-white rounded-3xl overflow-hidden border border-red-500/30 shadow-2xl text-right">
        
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-100 block">حماية الحساب والجهاز</span>
              <h3 className="text-base font-black font-changa">تم تسجيل الخروج أمنياً</h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 space-y-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>تم تشغيل الحساب من جهاز آخر الآن</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              تم فتح حسابك وتنشيطه من جهاز آخر ({deviceKickedAlert.newDeviceName || 'جهاز جديد'}).
            </p>
            {deviceKickedAlert.timestamp && (
              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                وقت النشاط: {deviceKickedAlert.timestamp}
              </div>
            )}
          </div>

          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
              <span>
                <strong>سياسة الجهاز الواحد:</strong> تمنع منصة القائد تشغيل نفس الحساب على أكثر من جهاز في نفس الوقت لحماية الحصص والمحتوى الدراسي.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-[#f39c12] shrink-0 mt-0.5" />
              <span>إذا لم تكن أنت من قام بالدخول، يرجى تغيير كلمة السر فوراً والتواصل مع الإدارة.</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAcknowledge}
              className="w-full py-3 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>حسناً، تسجيل الدخول من هنا مجدداً</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
