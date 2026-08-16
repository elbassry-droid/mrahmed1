import React from 'react';
import { BookOpen, Map, Network, Sparkles, Brain, Lightbulb, Compass } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  return (
    <section className="py-20 bg-[#162a21] text-white relative overflow-hidden border-y border-emerald-800/40">
      
      {/* Decorative background dashed curves and dots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C300,200 600,0 1200,100" stroke="white" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          <path d="M0,300 C400,150 800,450 1200,300" stroke="#f39c12" strokeWidth="1.5" strokeDasharray="8 8" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
        
        {/* Header (Screenshot 3 Match) */}
        <div className="max-w-3xl mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-bold text-[#f39c12] uppercase tracking-wider block">
            الزمن والفكر والمنطق
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black font-changa leading-tight text-white">
            مش بنحفظ الفكرة لوحدها... <br />
            <span className="text-[#f39c12]">
              بنفهم زمانها، مكانها، والسبب اللي خلاها تظهر
            </span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium pt-2">
            طريقة الشرح بتربط الأفكار الفلسفية ونظريات علم النفس ببعضها، وتستخدم الخرائط الذهنية والأمثلة الحياتية والعلاقات بدل ما تسيب كل معلومة منفصلة عن اللي قبلها واللي بعدها.
          </p>
        </div>

        {/* 3 Sequential Connected Milestones (Screenshot 3 Exact Structure) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting Line between steps on desktop */}
          <div className="hidden md:block absolute top-7 right-12 left-12 h-0.5 bg-gradient-to-l from-[#f39c12]/30 via-[#f39c12] to-[#f39c12]/30 -z-0"></div>

          {/* Step 1 */}
          <div className="relative bg-[#1e382c]/80 backdrop-blur-xs p-6 rounded-2xl border border-emerald-700/40 space-y-3 group hover:border-[#f39c12] transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#f39c12] text-white flex items-center justify-center font-black text-base shadow-md font-changa">
                1
              </div>
              <BookOpen className="w-6 h-6 text-emerald-400 group-hover:text-[#f39c12] transition-colors" />
            </div>
            
            <h3 className="text-lg font-black font-changa text-white pt-2">
              الحكاية قبل الحفظ
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              نفهم السياق والقصة وتسلسل الفكرة وتاريخ نشأتها قبل ما نحفظ أي تعريف أو مصطلح.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-[#1e382c]/80 backdrop-blur-xs p-6 rounded-2xl border border-emerald-700/40 space-y-3 group hover:border-[#f39c12] transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#f39c12] text-white flex items-center justify-center font-black text-base shadow-md font-changa">
                2
              </div>
              <Compass className="w-6 h-6 text-emerald-400 group-hover:text-[#f39c12] transition-colors" />
            </div>
            
            <h3 className="text-lg font-black font-changa text-white pt-2">
              الخريطة قبل التوهان
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              نشوف علاقات الفلاسفة وتصنيف المدارس على خرائط ومخططات بدل الحفظ المجرد والتشتت.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-[#1e382c]/80 backdrop-blur-xs p-6 rounded-2xl border border-emerald-700/40 space-y-3 group hover:border-[#f39c12] transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-[#f39c12] text-white flex items-center justify-center font-black text-base shadow-md font-changa">
                3
              </div>
              <Brain className="w-6 h-6 text-emerald-400 group-hover:text-[#f39c12] transition-colors" />
            </div>
            
            <h3 className="text-lg font-black font-changa text-white pt-2">
              الربط قبل المراجعة
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              نربط الأبواب ببعض ونحل أسئلة المستويات العليا علشان ليلة الامتحان تبقى أسهل وأوضح.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
