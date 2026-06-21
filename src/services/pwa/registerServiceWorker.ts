import { registerSW } from 'virtual:pwa-register';
import { store } from '@/app/store';
import { toastInfo } from '@/features/ui/toastSlice';

/**
 * Registers the Workbox-generated service worker (offline caching, background
 * sync, push) and notifies the user when an update has been pre-cached and is
 * ready to take over on the next reload.
 */
export const initServiceWorker = (): void => {
  if (!('serviceWorker' in navigator)) return;

  registerSW({
    immediate: true,
    onNeedRefresh() {
      store.dispatch(toastInfo('A new version of BillingMaster is available. Refresh to update.'));
    },
    onOfflineReady() {
      store.dispatch(toastInfo('BillingMaster is ready to work offline.'));
    },
  });
};
