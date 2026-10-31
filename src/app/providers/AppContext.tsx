import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppState,
  handleGoodsReceipt,
  handleGoodsIssue,
  handleCreateTransfer,
  handleApproveTransfer,
  handleRejectTransfer,
  handleDispatchTransfer,
  handleReceiveTransfer,
  handleCreateStockCountSession,
  handleSubmitStockCount,
  handleApplyStockAdjustment,
  handleSyncQueue,
} from '@/domain/services/inventoryService';
import {
  loadStoredState,
  saveStoredState,
  resetDemoState,
} from '@/data/repositories/storageRepository';
import { DemoRole, DemoUser, Transfer, StockCountSession } from '@/domain/types';

interface DerivedMetrics {
  totalSkus: number;
  totalRecordedUnits: number;
  lowStockCount: number;
  pendingApprovalsCount: number;
  transfersInTransitCount: number;
  completedTransfersCount: number;
  pendingSyncCount: number;
}

interface AppContextValue extends AppState {
  metrics: DerivedMetrics;
  setCurrentRole: (role: DemoRole) => void;
  setCurrentUser: (userId: string) => void;
  setSelectedSiteId: (siteId: string) => void;
  setIsOffline: (isOffline: boolean) => void;
  recordReceipt: (params: {
    siteId: string;
    itemId: string;
    quantity: number;
    referenceNumber: string;
    note?: string;
  }) => { success: boolean; error?: string };
  recordIssue: (params: {
    siteId: string;
    itemId: string;
    quantity: number;
    referenceNumber: string;
    note?: string;
  }) => { success: boolean; error?: string };
  requestTransfer: (params: {
    sourceSiteId: string;
    destinationSiteId: string;
    lines: Array<{ itemId: string; requestedQty: number }>;
    reason: string;
  }) => { success: boolean; error?: string; transfer?: Transfer };
  approveTransfer: (transferId: string, note?: string) => { success: boolean; error?: string };
  rejectTransfer: (transferId: string, reason: string) => { success: boolean; error?: string };
  dispatchTransfer: (transferId: string, note?: string) => { success: boolean; error?: string };
  receiveTransfer: (params: {
    transferId: string;
    receivedQuantities: Record<string, number>;
    receiptNote?: string;
  }) => { success: boolean; error?: string };
  createStockCount: (params: {
    siteId: string;
    itemIds: string[];
  }) => { success: boolean; error?: string; session?: StockCountSession };
  submitStockCount: (
    sessionId: string,
    counts: Record<string, number>
  ) => { success: boolean; error?: string };
  applyStockAdjustment: (sessionId: string) => { success: boolean; error?: string };
  syncOfflineQueue: () => { syncedCount: number };
  resetAllDemoData: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export { useApp } from './useApp';
export type { AppContextValue };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadStoredState());

  // Automatically persist to LocalStorage whenever state changes
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const setCurrentRole = (role: DemoRole) => {
    const userForRole = state.users.find((u) => u.role === role) || state.users[0];
    setState((prev) => ({
      ...prev,
      currentUser: userForRole,
    }));
  };

  const setCurrentUser = (userId: string) => {
    const user = state.users.find((u) => u.id === userId);
    if (user) {
      setState((prev) => ({
        ...prev,
        currentUser: user,
      }));
    }
  };

  const setSelectedSiteId = (siteId: string) => {
    setState((prev) => ({
      ...prev,
      selectedSiteId: siteId,
    }));
  };

  const setIsOffline = (isOffline: boolean) => {
    setState((prev) => ({
      ...prev,
      isOffline,
    }));
  };

  const recordReceipt = (params: {
    siteId: string;
    itemId: string;
    quantity: number;
    referenceNumber: string;
    note?: string;
  }) => {
    const res = handleGoodsReceipt(state, params);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const recordIssue = (params: {
    siteId: string;
    itemId: string;
    quantity: number;
    referenceNumber: string;
    note?: string;
  }) => {
    const res = handleGoodsIssue(state, params);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const requestTransfer = (params: {
    sourceSiteId: string;
    destinationSiteId: string;
    lines: Array<{ itemId: string; requestedQty: number }>;
    reason: string;
  }) => {
    const res = handleCreateTransfer(state, params);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true, transfer: res.createdTransfer };
  };

  const approveTransfer = (transferId: string, note?: string) => {
    const res = handleApproveTransfer(state, transferId, note);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const rejectTransfer = (transferId: string, reason: string) => {
    const res = handleRejectTransfer(state, transferId, reason);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const dispatchTransfer = (transferId: string, note?: string) => {
    const res = handleDispatchTransfer(state, transferId, note);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const receiveTransfer = (params: {
    transferId: string;
    receivedQuantities: Record<string, number>;
    receiptNote?: string;
  }) => {
    const res = handleReceiveTransfer(state, params);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const createStockCount = (params: { siteId: string; itemIds: string[] }) => {
    const res = handleCreateStockCountSession(state, params);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true, session: res.session };
  };

  const submitStockCount = (sessionId: string, counts: Record<string, number>) => {
    const res = handleSubmitStockCount(state, sessionId, counts);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const applyStockAdjustment = (sessionId: string) => {
    const res = handleApplyStockAdjustment(state, sessionId);
    if (res.error) return { success: false, error: res.error };
    setState(res.state);
    return { success: true };
  };

  const syncOfflineQueue = () => {
    const res = handleSyncQueue(state);
    setState(res.state);
    return { syncedCount: res.syncedCount };
  };

  const resetAllDemoData = () => {
    const fresh = resetDemoState();
    setState(fresh);
  };

  // Derive metrics dynamically from canonical state
  const metrics = useMemo<DerivedMetrics>(() => {
    const isFiltered = state.selectedSiteId !== 'ALL';
    const siteId = state.selectedSiteId;

    const relevantBalances = isFiltered
      ? state.stockBalances.filter((b) => b.siteId === siteId)
      : state.stockBalances;

    const totalSkus = state.items.filter((i) => i.active).length;
    const totalRecordedUnits = relevantBalances.reduce((acc, b) => acc + b.onHand, 0);
    const lowStockCount = relevantBalances.filter((b) => b.onHand <= b.minimumStock).length;

    const relevantTransfers = isFiltered
      ? state.transfers.filter((t) => t.sourceSiteId === siteId || t.destinationSiteId === siteId)
      : state.transfers;

    const pendingApprovalsCount = relevantTransfers.filter(
      (t) => t.status === 'PENDING_APPROVAL'
    ).length;

    const transfersInTransitCount = relevantTransfers.filter(
      (t) => t.status === 'IN_TRANSIT' || t.status === 'PARTIALLY_RECEIVED'
    ).length;

    const completedTransfersCount = relevantTransfers.filter(
      (t) => t.status === 'COMPLETED'
    ).length;

    const pendingSyncCount = state.syncQueue.filter((i) => i.status === 'PENDING_SYNC').length;

    return {
      totalSkus,
      totalRecordedUnits,
      lowStockCount,
      pendingApprovalsCount,
      transfersInTransitCount,
      completedTransfersCount,
      pendingSyncCount,
    };
  }, [state.selectedSiteId, state.stockBalances, state.items, state.transfers, state.syncQueue]);

  const value: AppContextValue = {
    ...state,
    metrics,
    setCurrentRole,
    setCurrentUser,
    setSelectedSiteId,
    setIsOffline,
    recordReceipt,
    recordIssue,
    requestTransfer,
    approveTransfer,
    rejectTransfer,
    dispatchTransfer,
    receiveTransfer,
    createStockCount,
    submitStockCount,
    applyStockAdjustment,
    syncOfflineQueue,
    resetAllDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
