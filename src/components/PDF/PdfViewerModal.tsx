import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PdfDocument } from '../../types';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck,
  Lock,
  User,
  Phone
} from 'lucide-react';

interface PdfViewerModalProps {
  pdf: PdfDocument;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ pdf, onClose }) => {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [secWarning, setSecWarning] = useState<string | null>(null);

  const studentDisplayName = user?.name || 'طالب منصة القائد';
  const studentPhone = user?.phone || '010XXXXXXXX';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        setSecWarning('⚠️ تصوير الشاشة محظور! تم طباعة بيانات حسابك على المستند.');
        setTimeout(() => setSecWarning(null), 4000);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="relative w-full max-w-5xl bg-[#1a2c23] text-white rounded-3xl overflow-hidden border border-emerald-800/60 shadow-2xl flex flex-col my-auto max-h-[94vh]">
        
        {secWarning && (
          <div className="bg-red-600 text-white text-xs font-bold py-2 px-4 text-center animate-bounce">
            {secWarning}
          </div>
        )}

        {/* Top Controls Toolbar */}
        <div className="p-3.5 bg-[#14231b] border-b border-emerald-900/40 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 text-xs">
            {/* Protection Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-700/50 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>مستند محمي ومشفر ضد الاستخراج والطباعة</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 15, 160))}
                className="p-1 hover:text-[#f39c12]"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="font-mono">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 15, 70))}
                className="p-1 hover:text-[#f39c12]"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Page Navigator */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg border border-white/10 font-bold">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-0.5 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span>{currentPage} / {pdf.pageCount}</span>
              <button
                disabled={currentPage >= pdf.pageCount}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-0.5 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-right flex-1 truncate pr-2">
            <h3 className="font-bold text-sm text-white truncate font-changa">
              {pdf.title}
            </h3>
            <p className="text-[10px] text-emerald-400">
              مذكرة معتمدة • {pdf.fileSize}
            </p>
          </div>
        </div>

        {/* PDF Stage Container */}
        <div className="flex-1 bg-[#23382d] overflow-auto p-4 sm:p-8 flex items-center justify-center relative select-none">
          
          {/* Simulated PDF Paper Page */}
          <div 
            className="bg-white text-gray-900 shadow-2xl rounded-xl p-8 sm:p-12 w-full max-w-2xl min-h-[580px] flex flex-col justify-between relative transition-all duration-300 select-none"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Multiple Watermarks across paper to prevent extraction / cropping */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-around opacity-15 rotate-[-25deg] select-none text-center">
              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-red-900">
                  {studentDisplayName} • {studentPhone}
                </p>
                <p className="text-sm font-bold text-emerald-950">
                  منصة القائد - مستر أحمد عبدالحميد (نسخة مرخصة للاستخدام الفردي)
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-black text-[#1b4332]">
                  {studentDisplayName} • {studentPhone}
                </p>
                <p className="text-xs font-mono font-bold text-gray-700">
                  DRM-PROTECTED • {new Date().toLocaleDateString('ar-EG')}
                </p>
              </div>
            </div>

            {/* Header of Note Page */}
            <div className="border-b-2 border-[#1b4332] pb-4 flex items-center justify-between relative z-10">
              <div className="text-left">
                <span className="text-[10px] font-bold text-gray-400 block">الصفحة {currentPage}</span>
                <span className="text-xs font-bold text-[#f39c12]">المحاضرة الشاملة</span>
              </div>
              <div className="text-right">
                <h4 className="font-black font-changa text-base text-[#1b4332]">
                  {pdf.title}
                </h4>
                <p className="text-[10px] text-gray-500">إعداد الأستاذ: أحمد عبدالحميد (القائد)</p>
              </div>
            </div>

            {/* Note Content Simulation */}
            <div className="py-6 space-y-4 text-right text-xs sm:text-sm leading-relaxed text-gray-800 relative z-10">
              <div className="p-3 bg-emerald-50 rounded-lg border-r-4 border-[#2d6a4f]">
                <h5 className="font-bold text-[#1b4332] mb-1">📌 مفتاح الفهم الأساسي (الخريطة الذهنية):</h5>
                <p className="text-xs text-gray-700">
                  الفلسفة لا تبدأ من الفراغ، بل تنبع من الدهشة وإثارة التساؤل المنهجي حول الوجود والإنسان وغايات الأخلاق.
                </p>
              </div>

              <p>
                <strong>أولاً: نشأة الفلسفة والتفكير العقلي:</strong><br />
                ظهرت بواكير الفكر الأخلاقي والحكمة الدينية في حضارات الشرق القديم (مصر وبابل والهند والصين)، ولكن الفلسفة بمعناها العقلي النظري الخالص نشأت في بلاد اليونان القديمة ما بين القرنين السادس والرابع قبل الميلاد على يد طاليس وسقراط وأفلاطون وأرسطو.
              </p>

              <p>
                <strong>ثانياً: خصائص التفكير الفلسفي:</strong><br />
                1. <strong>الدهشة وإثارة العقل:</strong> انفعال عقلي وهزة وجدانية أمام أمر غير مألوف.<br />
                2. <strong>الاستقلال:</strong> التفكير الفلسفي لا يقوم على التبعية أو مسايرة الآخرين عميانياً.<br />
                3. <strong>التأمل:</strong> الفيلسوف يغرق في التفكير في الموضوع دون الانشغال بغيره.<br />
                4. <strong>الدقة المنطقية:</strong> الأفكار الفلسفية تتسم بالاتساق ومقدمات تقود لنتائج حتمية.
              </p>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-0.5">💡 سؤال تطبيقي من نواتج التعلم:</span>
                "الفيلسوف يبحث عن العلل البعيدة والمبادئ الأولى للموجودات" — استنتج كيف يختلف ذلك عن نظرة رجل الشارع العادي.
              </div>
            </div>

            {/* Footer of Note Page */}
            <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-[10px] text-gray-500 relative z-10">
              <span className="flex items-center gap-1 font-mono text-[9px]">
                <Lock className="w-3 h-3 text-emerald-600" />
                حساب: {studentDisplayName} ({studentPhone})
              </span>
              <span className="font-bold text-[#2d6a4f]">مستر أحمد عبدالحميد - أستاذ المواد الفلسفية وعلم النفس</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
