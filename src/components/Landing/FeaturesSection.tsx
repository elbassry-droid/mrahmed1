import React from 'react';
import { 
  ShieldCheck, 
  Video, 
  Award, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  TrendingUp, 
  Lock 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#f1f8f4] dark:bg-[#112019] border-y border-emerald-900/10 dark:border-emerald-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#f39c12] uppercase tracking-wider block">
            مميزات منصة القائد
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
            تجربة تعليمية متكاملة تضمن تفوقك
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            صممنا كل ميزة داخل المنصة لتوفير أقصى درجات التركيز وسهولة المتابعة مع مستر أحمد عبدالحميد
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white dark:bg-[#162720] p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:border-[#2d6a4f] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-200">
              مشغل فيديوهات محمي 🔒
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              فيديوهات الحصص مدرجة عبر مشغل عالي الجودة ومحمي بعلامة مائية متحركة لمنع السرقة والاسكرين شوت.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-[#162720] p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:border-[#2d6a4f] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6 text-[#2d6a4f]" />
            </div>
            <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-200">
              كويزات وتصحيح فوري ⚡
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              اختبار إلكتروني بعد كل محاضرة يقيس استيعابك مع شرح فوري للإجابات وتوضيح وجهة نظر الفيلسوف.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-[#162720] p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:border-[#2d6a4f] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-200">
              مذكرات PDF وخرائط ذهنية 📑
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              ملازم شاملة منسقة مع إمكانية التصفح التفاعلي وحفظ الملاحظات لسهولة مراجعة ليلة الامتحان.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white dark:bg-[#162720] p-6 rounded-2xl border border-emerald-900/10 dark:border-emerald-800/40 shadow-xs hover:border-[#2d6a4f] transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#e4f2ea] dark:bg-emerald-950/60 text-[#2d6a4f] dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#f39c12]" />
            </div>
            <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-200">
              بوابة شحن بكود السنتر وفودافون كاش 💳
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              شحن المحفظة وتفعيل الكورسات بمرونة تامة عبر كروت السناتر المعتمدة، فودافون كاش، وإنستاباي.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
