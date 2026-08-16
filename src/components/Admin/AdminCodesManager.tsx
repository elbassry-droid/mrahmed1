import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Key, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Layers, 
  CheckCircle2,
  Clock,
  User,
  Filter
} from 'lucide-react';

export const AdminCodesManager: React.FC = () => {
  const { rechargeCodes, generateRechargeCode, deleteRechargeCode, addNotification } = useApp();

  const [newCodeAmount, setNewCodeAmount] = useState<number>(150);
  const [newCodeGrade, setNewCodeGrade] = useState<string>('الصف الثاني الثانوي (علم النفس والاجتماع)');
  const [customCodePrefix, setCustomCodePrefix] = useState<string>('');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'used'>('all');

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    for (let i = 0; i < batchCount; i++) {
      let customCode: string | undefined = undefined;
      if (customCodePrefix.trim() && batchCount === 1) {
        customCode = customCodePrefix.trim().toUpperCase();
      }
      generateRechargeCode(newCodeAmount, newCodeGrade, customCode);
    }

    if (batchCount > 1) {
      addNotification(`تم توليد ${batchCount} كروت شحن سنتر جديدة بقيمة ${newCodeAmount} ج.م لكل كارت`, 'success');
    }
    setCustomCodePrefix('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
    addNotification(`تم نسخ الكود ${code} إلى الحافظة`, 'info');
  };

  const filteredCodes = rechargeCodes.filter(c => {
    if (filterStatus === 'active') return !c.isUsed;
    if (filterStatus === 'used') return c.isUsed;
    return true;
  });

  const activeCount = rechargeCodes.filter(c => !c.isUsed).length;
  const usedCount = rechargeCodes.filter(c => c.isUsed).length;
  const totalValue = rechargeCodes.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#162720] p-6 rounded-3xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>نظام الحماية والأمان المالي الحصري</span>
          </div>
          <h2 className="text-xl font-black font-changa text-[#1b4332] dark:text-emerald-300">
            توليد وإدارة كروت شحن السنتر الرسمية
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            الأكواد المصنوعة هنا هي فقط الصالحة والمقبولة على المنصة بالكامل، ولا يمكن لأي طالب شحن حسابه إلا بكود تم تصنيعه من لوحة الأدمن.
          </p>
        </div>

        {/* Mini Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-2xl border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold text-gray-500 block">الكروت الفعالة</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-300">{activeCount} كارت</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/60 p-3 rounded-2xl border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold text-gray-500 block">تم استخدامها</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-300">{usedCount} كارت</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Generator Form (Col 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#162720] p-6 rounded-3xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#f39c12]" />
            <span>توليد كارت / مجموعة كروت جديدة</span>
          </h3>
          
          <form onSubmit={handleGenerateCode} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                قيمة الكارت (جنيه مصري) *
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[50, 100, 150, 200].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNewCodeAmount(amt)}
                    className={`py-1.5 rounded-xl font-black transition-all ${
                      newCodeAmount === amt
                        ? 'bg-[#2d6a4f] text-white shadow-xs'
                        : 'bg-gray-100 dark:bg-[#112019] text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {amt} ج.م
                  </button>
                ))}
              </div>
              <input
                type="number"
                required
                min={10}
                max={2000}
                value={newCodeAmount}
                onChange={e => setNewCodeAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-sm font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                الصف والمادة المخصصة للكارت
              </label>
              <select
                value={newCodeGrade}
                onChange={e => setNewCodeGrade(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] text-xs font-bold"
              >
                <option value="الصف الثاني الثانوي (علم النفس والاجتماع)">الصف الثاني الثانوي (علم النفس والاجتماع)</option>
                <option value="الصف الثاني الثانوي بكالوريا (علم النفس والاجتماع)">الصف الثاني الثانوي بكالوريا (علم النفس والاجتماع)</option>
                <option value="الصف الأول الثانوي (عام وبكالوريا)">الصف الأول الثانوي (عام وبكالوريا)</option>
                <option value="عام (جميع الصفوف والكورسات)">عام (جميع الصفوف والكورسات)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  كود يدوي مخصص (اختياري)
                </label>
                <input
                  type="text"
                  value={customCodePrefix}
                  onChange={e => setCustomCodePrefix(e.target.value)}
                  placeholder="QAED-VIP-99"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] font-mono text-xs font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  عدد الكروت المطلوبة
                </label>
                <select
                  value={batchCount}
                  onChange={e => setBatchCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-emerald-900/60 bg-white dark:bg-[#111f18] font-bold"
                >
                  <option value={1}>كارت واحد (1)</option>
                  <option value={5}>دفعة 5 كروت</option>
                  <option value={10}>دفعة 10 كروت</option>
                  <option value={20}>دفعة 20 كارت</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 pt-3"
            >
              <Sparkles className="w-4 h-4 text-[#f39c12]" />
              <span>توليد وحفظ الكروت المعتمدة</span>
            </button>
          </form>
        </div>

        {/* Generated Codes List (Col 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#162720] p-6 rounded-3xl border border-emerald-900/15 dark:border-emerald-800/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-base text-[#1b4332] dark:text-emerald-300">
              سجل الأكواد الصالحة في قاعدة البيانات ({filteredCodes.length})
            </h3>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#112019] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === 'all' ? 'bg-white dark:bg-[#162720] text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-gray-500'
                }`}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === 'active' ? 'bg-white dark:bg-[#162720] text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-gray-500'
                }`}
              >
                المتاحة
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('used')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === 'used' ? 'bg-white dark:bg-[#162720] text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-gray-500'
                }`}
              >
                المستخدمة
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredCodes.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                لا توجد أكواد مطابقة للتصفية الحالية.
              </div>
            ) : (
              filteredCodes.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                    item.isUsed 
                      ? 'bg-gray-50/60 dark:bg-[#101e17]/50 border-gray-200 dark:border-emerald-900/20 opacity-75' 
                      : 'bg-white dark:bg-[#12221b] border-emerald-500/30 shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#1b4332] dark:text-emerald-300 tracking-wider">
                        {item.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(item.code)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-emerald-900/50 text-gray-500 transition-colors"
                        title="نسخ الكود"
                      >
                        {copiedCode === item.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.amount} ج.م</span>
                      <span>•</span>
                      <span>{item.grade}</span>
                      {item.usedBy && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            شحنه: {item.usedBy} ({item.usedAt})
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isUsed ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        تم استخدامه
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        فعال ومتاح
                      </span>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`هل تريد حذف الكود ${item.code}؟`)) {
                          deleteRechargeCode(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="حذف الكود"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
