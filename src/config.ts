// USB/emulator: npm run android configures adb reverse tcp:3000 tcp:3000.
// Without reverse, emulator: http://10.0.2.2:3000; Wi-Fi: the PC's LAN IP.
export const BASE_URL = 'http://127.0.0.1:3000';
export const TIMEOUT = 10_000;
export const CACHE_TTL = 5 * 60_000;
export const SYNC_RETRY_INTERVAL = 30_000;
