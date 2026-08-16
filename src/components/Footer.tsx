import React from 'react';
import { TEACHER_IMAGE } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, ShieldCheck, Award, Heart, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedGrade } = useApp();

  return (
    <footer className="bg-[#12241b] text-white border-t border-emerald-900/60 pt-16 pb-12 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/40">
          
          {/* Col 1: Platform Brand & Teacher Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#f39c12] shrink-0 bg-emerald-900">
                <img
                  src={TEACHER_IMAGE}
                  alt="مستر أحمد عبدالحميد"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-lg font-black font-changa text-white leading-tight">
                  منصة القــائــد
                </h3>
                <p className="text-xs text-[#f39c12] font-semibold">
                  مستر أحمد عبدالحميد
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              المنصة التعليمية المتخصصة في تدريس المواد الفلسفية وعلم النفس والاجتماع للمرحلة الثانوية العامة والبكالوريا بأسلوب الفهم والخرائط الذهنية ونواتج التعلم الحديثة.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold bg-[#1a3327] p-2.5 rounded-xl border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 text-[#f39c12]" />
              <span>نظام حماية وبث تعليمي مشفر ومحمي 100%</span>
            </div>
          </div>

          {/* Col 2: Quick Grade Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#f39c12] uppercase tracking-wider font-changa">
              السنوات الدراسية
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li>
                <button
                  onClick={() => { setSelectedGrade('second_general'); setActiveView('courses'); }}
                  className="hover:text-white transition-colors"
                >
                  • الصف الثاني الثانوي (علم النفس والاجتماع - عام)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedGrade('second_bac'); setActiveView('courses'); }}
                  className="hover:text-white transition-colors"
                >
                  • الصف الثاني الثانوي (علم النفس والاجتماع - بكالوريا)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedGrade('first_general'); setActiveView('courses'); }}
                  className="hover:text-white transition-colors"
                >
                  • الصف الأول الثانوي (عام)
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setSelectedGrade('first_bac'); setActiveView('courses'); }}
                  className="hover:text-white transition-colors"
                >
                  • الصف الأول الثانوي (بكالوريا)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Sections & Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#f39c12] uppercase tracking-wider font-changa">
              خدمات المنصة
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li>
                <button onClick={() => setActiveView('courses')} className="hover:text-white transition-colors">
                  • الكورسات والباقات المخفضة
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('exams')} className="hover:text-white transition-colors">
                  • الامتحانات الدورية وبنك الأسئلة
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('pdfs')} className="hover:text-white transition-colors">
                  • المذكرات وملازم الخرائط الذهنية
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('account')} className="hover:text-white transition-colors">
                  • شحن الرصيد بكارت السنتر وفودافون كاش
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('account')} className="hover:text-white transition-colors">
                  • نتائج الاختبارات وتاريخ المشاهدات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Technical Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#f39c12] uppercase tracking-wider font-changa">
              الدعم الفني والتواصل
            </h4>
            <p className="text-xs text-gray-400">
              فريق الدعم الفني متواجد يومياً لمساعدتك في تفعيل الكورسات وشحن الأكواد.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href="https://wa.me/201559196263"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] p-2.5 rounded-xl border border-[#25D366]/30 transition-colors font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="ltr font-mono">01559196263 (واتساب الدعم)</span>
              </a>

              <div className="flex items-center gap-2 text-gray-300 p-2.5 rounded-xl bg-black/20 border border-white/10 font-mono ltr">
                <Phone className="w-4 h-4 text-[#f39c12]" />
                <span>01559196263</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} - منصة القائد في المواد الفلسفية وعلم النفس (مستر أحمد عبدالحميد)
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <span>نظام الحصص المحمية ضد تصوير الشاشة</span>
            <span>•</span>
            <span>بوابة دفع آمنة 100%</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
