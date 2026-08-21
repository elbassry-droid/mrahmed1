/**
 * Data Protection, Anti-Scraping, Anti-Inspection and Secure Storage Utility
 * منصة القائد - نظام الحماية المشددة ومنع استخراج البيانات
 */

// Simple XOR / Base64 cipher for client-side storage obfuscation
const APP_SIGNATURE_KEY = 'QaedDRM_SecKey_2026_!#9';

export const scrambleData = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data);
    let output = '';
    for (let i = 0; i < jsonStr.length; i++) {
      const charCode = jsonStr.charCodeAt(i) ^ APP_SIGNATURE_KEY.charCodeAt(i % APP_SIGNATURE_KEY.length);
      output += String.fromCharCode(charCode);
    }
    return 'SEC:' + btoa(unescape(encodeURIComponent(output)));
  } catch (e) {
    return JSON.stringify(data);
  }
};

export const unscrambleData = <T = any>(cipherText: string | null, fallback: T): T => {
  if (!cipherText) return fallback;
  if (!cipherText.startsWith('SEC:')) {
    try {
      return JSON.parse(cipherText) as T;
    } catch (e) {
      return fallback;
    }
  }

  try {
    const raw = decodeURIComponent(escape(atob(cipherText.replace('SEC:', ''))));
    let decrypted = '';
    for (let i = 0; i < raw.length; i++) {
      const charCode = raw.charCodeAt(i) ^ APP_SIGNATURE_KEY.charCodeAt(i % APP_SIGNATURE_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    return JSON.parse(decrypted) as T;
  } catch (e) {
    return fallback;
  }
};

export const secureStorage = {
  setItem: (key: string, value: any) => {
    try {
      const scrambled = scrambleData(value);
      localStorage.setItem(key, scrambled);
    } catch (e) {
      console.warn('Storage write failed');
    }
  },
  getItem: <T = any>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return unscrambleData<T>(stored, fallback);
    } catch (e) {
      return fallback;
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }
};

/**
 * Mask sensitive phone number (e.g. 01012345678 -> 010****5678)
 */
export const maskPhoneNumber = (phone?: string): string => {
  if (!phone || phone.length < 7) return phone || '';
  const first = phone.slice(0, 3);
  const last = phone.slice(-3);
  return `${first}****${last}`;
};

/**
 * Initialize Anti-DevTools & Anti-Extraction listeners
 */
export const initAntiDataExtraction = (onSecurityViolation?: (msg: string) => void) => {
  if (typeof window === 'undefined') return () => {};

  // 1. Console security trap & warning
  try {
    console.clear();
    console.log(
      '%c🛑 تنبيه أمني مشدد - منصة القائد التعليمية',
      'color: #e74c3c; font-size: 20px; font-weight: bold; background: #2c3e50; padding: 10px; border-radius: 8px;'
    );
    console.log(
      '%c⚠️ محاولة فحص الأكواد أو استخراج وتفريغ بيانات الطلاب أو الروابط مشفرة ومحمية بالكامل. أي محاولة لاستخراج البيانات تعرض الحساب للحظر النهائي الفوري.',
      'color: #f39c12; font-size: 13px; font-weight: bold;'
    );
  } catch (e) {}

  // 2. Prevent right-click context menu (inspect / save image / copy)
  const handleContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Allow right-click only if user is actively in a standard editable input/textarea
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    if (onSecurityViolation) {
      onSecurityViolation('🔒 النسخ وفحص الصفحة محظور لحماية البيانات والحقوق الملكية.');
    }
  };

  // 3. Block keyboard shortcuts used for data extraction and code inspection
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    // F12 (DevTools)
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      onSecurityViolation?.('🚫 فتح أدوات المطورين محظور أمنياً.');
      return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Inspect / Console)
    if (modifier && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      onSecurityViolation?.('🚫 فحص عناصر الصفحة أو الأكواد محظور.');
      return false;
    }

    // Ctrl+U / Cmd+U (View Page Source)
    if (modifier && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      onSecurityViolation?.('🚫 عرض السورس كود محظور لحماية حقوق المنصة.');
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page / Webpage complete)
    if (modifier && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      onSecurityViolation?.('🚫 حفظ وتنزيل صفحات المنصة محظور.');
      return false;
    }

    // Ctrl+P / Cmd+P (Print to PDF / Dump page)
    if (modifier && (e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
      onSecurityViolation?.('🚫 طباعة محتوى المنصة محظور لحماية الملكية الفكرية.');
      return false;
    }
  };

  // 4. Block Drag-and-drop of assets
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      e.preventDefault();
    }
  };

  window.addEventListener('contextmenu', handleContextMenu, { capture: true });
  window.addEventListener('keydown', handleKeyDown, { capture: true });
  window.addEventListener('dragstart', handleDragStart, { capture: true });

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    window.removeEventListener('dragstart', handleDragStart, { capture: true });
  };
};
