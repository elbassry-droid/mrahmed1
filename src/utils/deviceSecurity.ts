/**
 * Device Security & Single-Device Enforcement Utilities
 * منصة القائد - حماية الحسابات وقفل الجهاز الواحد
 */

export interface DeviceInfo {
  deviceId: string;
  label: string;
  os: string;
  browser: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  screenResolution: string;
  platform: string;
  userAgent: string;
}

const DEVICE_ID_KEY = 'qaed_device_unique_id';
const DEVICE_CHANNEL_NAME = 'qaed_single_device_sync';
const STORAGE_SYNC_KEY = 'qaed_device_sync_event';

/**
 * Get or create a persistent unique Device ID for this browser/device
 */
export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      const randomPart = Math.random().toString(36).substring(2, 11);
      const timestamp = Date.now().toString(36);
      id = `dev_${timestamp}_${randomPart}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (e) {
    return `dev_tmp_${Date.now()}`;
  }
}

/**
 * Detect client OS, browser, device category, and format a human-readable Arabic label
 */
export function getCurrentDeviceInfo(): DeviceInfo {
  const deviceId = getOrCreateDeviceId();
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const platform = typeof navigator !== 'undefined' ? navigator.platform : '';

  let os = 'غير محدد';
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';

  // Detect OS & Device Type
  if (/iPad|Tablet/i.test(ua)) {
    os = 'iPadOS / Tablet';
    deviceType = 'tablet';
  } else if (/iPhone|iPod/i.test(ua)) {
    os = 'iOS (iPhone)';
    deviceType = 'mobile';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
    deviceType = /Mobile/i.test(ua) ? 'mobile' : 'tablet';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
    deviceType = 'desktop';
  } else if (/Macintosh|Mac OS/i.test(ua)) {
    os = 'macOS';
    deviceType = 'desktop';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
    deviceType = 'desktop';
  }

  // Detect Browser
  let browser = 'متصفح ويب';
  if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome/i.test(ua) && !/Edg|OPR/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Mozilla Firefox';
  } else if (/OPR|Opera/i.test(ua)) {
    browser = 'Opera';
  }

  // Form a polished Arabic Device Label
  let typePrefix = '💻 كمبيوتر';
  if (deviceType === 'mobile') {
    typePrefix = '📱 هاتف';
  } else if (deviceType === 'tablet') {
    typePrefix = '📟 تابلت';
  }

  const label = `${typePrefix} ${os} (${browser})`;
  const screenResolution = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080';

  return {
    deviceId,
    label,
    os,
    browser,
    deviceType,
    screenResolution,
    platform,
    userAgent: ua
  };
}

export interface DeviceSyncPayload {
  userId: string;
  phone: string;
  activeDeviceId: string;
  activeDeviceName: string;
  sessionId: string;
  timestamp: number;
  action: 'login' | 'transfer' | 'logout';
}

/**
 * Broadcast session change to all open tabs and devices
 */
export function broadcastDeviceSession(payload: DeviceSyncPayload) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(DEVICE_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    }
  } catch (e) {}

  try {
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(payload));
  } catch (e) {}
}

/**
 * Subscribe to cross-device / cross-tab session invalidation events
 */
export function subscribeToDeviceSync(
  currentUserId: string | undefined,
  currentDeviceId: string,
  onRemoteDeviceKick: (payload: DeviceSyncPayload) => void
): () => void {
  if (!currentUserId) return () => {};

  let channel: BroadcastChannel | null = null;

  const handleMessage = (payload: DeviceSyncPayload) => {
    if (!payload || !payload.userId) return;
    if (payload.userId === currentUserId && payload.activeDeviceId !== currentDeviceId) {
      // Another device or session claimed this account!
      onRemoteDeviceKick(payload);
    }
  };

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(DEVICE_CHANNEL_NAME);
      channel.onmessage = (event) => {
        handleMessage(event.data);
      };
    }
  } catch (e) {}

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_SYNC_KEY && e.newValue) {
      try {
        const payload: DeviceSyncPayload = JSON.parse(e.newValue);
        handleMessage(payload);
      } catch (err) {}
    }
  };

  window.addEventListener('storage', storageHandler);

  return () => {
    if (channel) {
      channel.close();
    }
    window.removeEventListener('storage', storageHandler);
  };
}
