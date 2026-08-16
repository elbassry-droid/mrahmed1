import React from 'react';
import { useApp } from '../../context/AppContext';
import { TEACHER_IMAGE } from '../../data/mockData';
import { Sparkles, ArrowLeft, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onScrollToGrades: () => void;
  onScrollToCourses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToGrades, onScrollToCourses }) => {
  const { setActiveView } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-l from-[#11241c] via-[#1b4332] to-[#24533e] text-white min-h-[580px] lg:min-h-[640px] flex items-center shadow-lg border-b border-emerald-800/50">
      {/* Background Decorative Graphic Elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#52b788_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#f39c12]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Text Content (Col 7 in RTL layout) */}
          <div className="lg:col-span-7 space-y-6 text-right order-2 lg:order-1">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f39c12]/20 border border-[#f39c12]/40 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold text-[#ffbe76] backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-[#f39c12]" />
              <span>المواد الفلسفية وعلم النفس والاجتماع مع مستر أحمد عبدالحميد</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-changa leading-tight tracking-tight text-white drop-shadow-md">
              افهم السؤال والشرح... <br className="hidden sm:inline" />
              <span className="text-[#f39c12] inline-block mt-1">
                واعرَف الفكرة فين وليه!
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-medium">
              شرح منظم يربط الأحداث والأفكار ببعضها، ويحوّل النظريات من مجرد حفظ وتلقين لفهم حقيقي وخرائط ذهنية تقدر ترجع لها وقت الحل والامتحانات بنظام التابلت والبكالوريا.
            </p>

            {/* Grade Pills (Only Grade 1 and Grade 2 with Sociology / Psychology) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-black/30 backdrop-blur-xs border border-emerald-500/30 text-emerald-100 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full">
                الصف الأول الثانوي • عام وبكالوريا
              </span>
              <span className="bg-black/30 backdrop-blur-xs border border-emerald-500/30 text-[#ffbe76] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full">
                الصف الثاني الثانوي • علم النفس والاجتماع (عام وبكالوريا)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Orange Primary Button */}
              <button
                onClick={onScrollToGrades}
                className="bg-[#f39c12] hover:bg-[#e67e22] text-white px-8 py-3.5 rounded-xl font-black text-base sm:text-lg shadow-lg hover:shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                id="hero-choose-grade-btn"
              >
                <span>اختار سنتك الدراسية</span>
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Green Secondary Outline Button */}
              <button
                onClick={onScrollToCourses}
                className="bg-[#0f241a]/60 hover:bg-[#0f241a] border-2 border-[#f39c12]/60 hover:border-[#f39c12] text-[#ffbe76] hover:text-white px-7 py-3.5 rounded-xl font-bold text-base sm:text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-xs"
                id="hero-browse-courses-btn"
              >
                <BookOpen className="w-5 h-5 text-[#f39c12]" />
                <span>شوف الكورسات المتاحة</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-3 text-xs text-emerald-200/80 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#f39c12]" />
                <span>شرح مبسط بنظام نواتج التعلم</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                <span>حصص محمية وبنك أسئلة وزاري</span>
              </div>
            </div>

          </div>

          {/* Left Teacher Photo & Visual Showcase (Col 5) */}
          <div className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2">
            <div className="relative group">
              
              {/* Background Circular Aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#f39c12]/40 via-emerald-500/30 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-80"></div>
              
              {/* Border Framed Image Container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-600/40 bg-gradient-to-b from-[#1b4332] to-[#0f241a] p-3 shadow-2xl">
                <img
                  src={TEACHER_IMAGE}
                  alt="مستر أحمد عبدالحميد - القائد في المواد الفلسفية وعلم النفس"
                  className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-cover rounded-2xl drop-shadow-xl hover:scale-102 transition-transform duration-500"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Tag over Image */}
                <div className="absolute bottom-6 right-6 left-6 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center shadow-lg">
                  <p className="font-bold text-white text-sm font-changa">
                    مستر أحمد عبدالحميد
                  </p>
                  <p className="text-xs text-[#f39c12] font-semibold">
                    القائد في المواد الفلسفية وعلم النفس والاجتماع
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
