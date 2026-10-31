import {
  INITIAL_SITES,
  INITIAL_CATEGORIES,
  INITIAL_ITEMS,
  INITIAL_STOCK_BALANCES,
  INITIAL_TRANSFERS,
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  INITIAL_STOCK_COUNT_SESSIONS,
  INITIAL_SYNC_QUEUE,
  SEED_VERSION,
} from '@/data/seed/initialData';
import { AppState } from '@/domain/services/inventoryService';

const STORAGE_KEY = 'fpe_warehouse_demo_state_v1';
const VERSION_KEY = 'fpe_warehouse_demo_version';

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getInitialDefaultState(): AppState {
  return {
    sites: INITIAL_SITES,
    categories: INITIAL_CATEGORIES,
    items: INITIAL_ITEMS,
    stockBalances: INITIAL_STOCK_BALANCES,
    transfers: INITIAL_TRANSFERS,
    transactions: INITIAL_TRANSACTIONS,
    users: INITIAL_USERS,
    stockCountSessions: INITIAL_STOCK_COUNT_SESSIONS,
    syncQueue: INITIAL_SYNC_QUEUE,
    currentUser: INITIAL_USERS[0], // Demo Administrator default
    selectedSiteId: 'ALL',
    isOffline: false,
    lastSyncedTimestamp: '2026-10-31T10:15:00Z',
  };
}

export function loadStoredState(): AppState {
  try {
    if (!isStorageAvailable()) {
      return getInitialDefaultState();
    }

    const savedVersion = window.localStorage.getItem(VERSION_KEY);
    const savedData = window.localStorage.getItem(STORAGE_KEY);

    if (savedVersion !== SEED_VERSION || !savedData) {
      const defaultState = getInitialDefaultState();
      saveStoredState(defaultState);
      return defaultState;
    }

    const parsed = JSON.parse(savedData);
    return {
      ...getInitialDefaultState(),
      ...parsed,
    };
  } catch (err) {
    console.error('Failed to read from localStorage, using default seed:', err);
    return getInitialDefaultState();
  }
}

export function saveStoredState(state: AppState): void {
  try {
    if (!isStorageAvailable()) return;
    window.localStorage.setItem(VERSION_KEY, SEED_VERSION);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist to localStorage:', err);
  }
}

export function resetDemoState(): AppState {
  try {
    if (isStorageAvailable()) {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(VERSION_KEY);
    }
  } catch (err) {
    console.warn('Error clearing storage:', err);
  }
  const fresh = getInitialDefaultState();
  saveStoredState(fresh);
  return fresh;
}
