import {
  StockBalance,
  InventoryTransaction,
  Transfer,
  StockCountSession,
  SyncQueueItem,
  TransactionType,
} from '@/domain/types';

export interface AppState {
  sites: import('@/domain/types').Site[];
  categories: import('@/domain/types').Category[];
  items: import('@/domain/types').Item[];
  stockBalances: StockBalance[];
  transfers: Transfer[];
  transactions: InventoryTransaction[];
  users: import('@/domain/types').DemoUser[];
  stockCountSessions: StockCountSession[];
  syncQueue: SyncQueueItem[];
  currentUser: import('@/domain/types').DemoUser;
  selectedSiteId: string; // 'ALL' or specific siteId like 'site-01'
  isOffline: boolean;
  lastSyncedTimestamp: string;
}

export function findStockBalance(
  balances: StockBalance[],
  itemId: string,
  siteId: string
): StockBalance | undefined {
  return balances.find((b) => b.itemId === itemId && b.siteId === siteId);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function generateDocNumber(prefix: string): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${rand}`;
}

/**
 * Mutates stock on goods receipt
 */
export function handleGoodsReceipt(
  state: AppState,
  params: {
    siteId: string;
    itemId: string;
    quantity: number;
    referenceNumber: string;
    note?: string;
  }
): { state: AppState; error?: string } {
  if (params.quantity <= 0) {
    return { state, error: 'Kuantitas penerimaan harus lebih dari 0' };
  }

  const now = new Date().toISOString();

  if (state.isOffline) {
    const queueItem: SyncQueueItem = {
      id: generateId('sync'),
      type: 'RECEIPT',
      description: `Penerimaan ${params.quantity} unit item ke ${params.siteId}`,
      siteId: params.siteId,
      actorId: state.currentUser.id,
      createdAt: now,
      status: 'PENDING_SYNC',
      payload: params,
    };
    return {
      state: {
        ...state,
        syncQueue: [queueItem, ...state.syncQueue],
      },
    };
  }

  // Update or create StockBalance
  let updatedBalances = [...state.stockBalances];
  const balanceIndex = updatedBalances.findIndex(
    (b) => b.itemId === params.itemId && b.siteId === params.siteId
  );

  if (balanceIndex >= 0) {
    const existing = updatedBalances[balanceIndex];
    updatedBalances[balanceIndex] = {
      ...existing,
      onHand: existing.onHand + params.quantity,
      updatedAt: now,
    };
  } else {
    updatedBalances.push({
      id: generateId('sb'),
      itemId: params.itemId,
      siteId: params.siteId,
      onHand: params.quantity,
      minimumStock: 0,
      inTransitIn: 0,
      inTransitOut: 0,
      updatedAt: now,
    });
  }

  const newTx: InventoryTransaction = {
    id: generateId('tx'),
    transactionNumber: generateDocNumber('TX-REC'),
    type: 'GOODS_RECEIPT',
    itemId: params.itemId,
    siteId: params.siteId,
    quantity: params.quantity,
    direction: 'IN',
    referenceNumber: params.referenceNumber,
    note: params.note,
    actorId: state.currentUser.id,
    createdAt: now,
    syncStatus: 'SYNCED',
  };

  return {
    state: {
      ...state,
      stockBalances: updatedBalances,
      transactions: [newTx, ...state.transactions],
    },
  };
}

/**
 * Mutates stock on goods issuing with negative stock prevention
 */
export function handleGoodsIssue(
  state: AppState,
  params: {
    siteId: string;
    itemId: string;
    quantity: number;
    referenceNumber: string;
    note?: string;
  }
): { state: AppState; error?: string } {
  if (params.quantity <= 0) {
    return { state, error: 'Kuantitas pengeluaran harus lebih besar dari 0' };
  }

  const currentBalance = findStockBalance(state.stockBalances, params.itemId, params.siteId);
  const availableQty = currentBalance ? currentBalance.onHand : 0;

  if (availableQty < params.quantity) {
    return {
      state,
      error: `Stok on-hand tidak mencukupi (Tersedia: ${availableQty}, Diminta: ${params.quantity}). Pengeluaran stok negatif dicegah.`,
    };
  }

  const now = new Date().toISOString();

  if (state.isOffline) {
    const queueItem: SyncQueueItem = {
      id: generateId('sync'),
      type: 'ISSUE',
      description: `Pengeluaran ${params.quantity} unit item dari ${params.siteId}`,
      siteId: params.siteId,
      actorId: state.currentUser.id,
      createdAt: now,
      status: 'PENDING_SYNC',
      payload: params,
    };
    return {
      state: {
        ...state,
        syncQueue: [queueItem, ...state.syncQueue],
      },
    };
  }

  const updatedBalances = state.stockBalances.map((b) => {
    if (b.itemId === params.itemId && b.siteId === params.siteId) {
      return {
        ...b,
        onHand: b.onHand - params.quantity,
        updatedAt: now,
      };
    }
    return b;
  });

  const newTx: InventoryTransaction = {
    id: generateId('tx'),
    transactionNumber: generateDocNumber('TX-ISS'),
    type: 'GOODS_ISSUE',
    itemId: params.itemId,
    siteId: params.siteId,
    quantity: params.quantity,
    direction: 'OUT',
    referenceNumber: params.referenceNumber,
    note: params.note,
    actorId: state.currentUser.id,
    createdAt: now,
    syncStatus: 'SYNCED',
  };

  return {
    state: {
      ...state,
      stockBalances: updatedBalances,
      transactions: [newTx, ...state.transactions],
    },
  };
}

/**
 * Creates transfer request
 */
export function handleCreateTransfer(
  state: AppState,
  params: {
    sourceSiteId: string;
    destinationSiteId: string;
    lines: Array<{ itemId: string; requestedQty: number }>;
    reason: string;
  }
): { state: AppState; error?: string; createdTransfer?: Transfer } {
  if (params.sourceSiteId === params.destinationSiteId) {
    return { state, error: 'Site asal dan site tujuan tidak boleh sama' };
  }

  if (!params.lines || params.lines.length === 0) {
    return { state, error: 'Transfer harus memiliki minimal satu item' };
  }

  for (const line of params.lines) {
    if (line.requestedQty <= 0) {
      return { state, error: 'Jumlah transfer item harus lebih dari 0' };
    }
    const balance = findStockBalance(state.stockBalances, line.itemId, params.sourceSiteId);
    const onHand = balance ? balance.onHand : 0;
    if (onHand < line.requestedQty) {
      return {
        state,
        error: `Stok on-hand di site asal tidak mencukupi (Tersedia: ${onHand}, Diminta: ${line.requestedQty})`,
      };
    }
  }

  const now = new Date().toISOString();
  const transfer: Transfer = {
    id: generateId('trf'),
    transferNumber: generateDocNumber('TRF'),
    sourceSiteId: params.sourceSiteId,
    destinationSiteId: params.destinationSiteId,
    requestedBy: state.currentUser.id,
    status: 'PENDING_APPROVAL',
    reason: params.reason,
    requestedAt: now,
    lines: params.lines.map((l) => ({ itemId: l.itemId, requestedQty: l.requestedQty })),
    events: [
      {
        id: generateId('evt'),
        type: 'CREATED',
        actorId: state.currentUser.id,
        timestamp: now,
        note: `Permintaan transfer diajukan (${params.lines.length} item)`,
      },
    ],
  };

  return {
    state: {
      ...state,
      transfers: [transfer, ...state.transfers],
    },
    createdTransfer: transfer,
  };
}

/**
 * Approves a transfer (Only Site Approver or Admin, blocked offline)
 */
export function handleApproveTransfer(
  state: AppState,
  transferId: string,
  approvalNote?: string
): { state: AppState; error?: string } {
  if (state.isOffline) {
    return {
      state,
      error: 'Fitur persetujuan transaksi (Approval) dinonaktifkan dalam mode offline untuk mencegah inkonsistensi multi-site.',
    };
  }

  if (state.currentUser.role !== 'SITE_APPROVER' && state.currentUser.role !== 'ADMIN') {
    return {
      state,
      error: 'Hanya Site Approver atau Admin yang memiliki otorisasi untuk menyetujui transfer',
    };
  }

  const transfer = state.transfers.find((t) => t.id === transferId);
  if (!transfer) {
    return { state, error: 'Data transfer tidak ditemukan' };
  }

  if (transfer.status !== 'PENDING_APPROVAL') {
    return { state, error: `Transfer tidak dapat disetujui dalam status saat ini: ${transfer.status}` };
  }

  const now = new Date().toISOString();
  const updatedTransfers = state.transfers.map((t) => {
    if (t.id === transferId) {
      return {
        ...t,
        status: 'APPROVED' as const,
        approvedBy: state.currentUser.id,
        approvedAt: now,
        events: [
          ...t.events,
          {
            id: generateId('evt'),
            type: 'APPROVED',
            actorId: state.currentUser.id,
            timestamp: now,
            note: approvalNote || 'Transfer disetujui oleh Site Approver',
          },
        ],
      };
    }
    return t;
  });

  return {
    state: {
      ...state,
      transfers: updatedTransfers,
    },
  };
}

/**
 * Rejects a transfer (Mandatory rejection reason)
 */
export function handleRejectTransfer(
  state: AppState,
  transferId: string,
  rejectionReason: string
): { state: AppState; error?: string } {
  if (state.isOffline) {
    return {
      state,
      error: 'Persetujuan atau penolakan transaksi dinonaktifkan dalam mode offline.',
    };
  }

  if (state.currentUser.role !== 'SITE_APPROVER' && state.currentUser.role !== 'ADMIN') {
    return {
      state,
      error: 'Hanya Site Approver atau Admin yang memiliki otorisasi untuk menolak transfer',
    };
  }

  if (!rejectionReason || rejectionReason.trim().length === 0) {
    return { state, error: 'Alasan penolakan wajib diisi' };
  }

  const transfer = state.transfers.find((t) => t.id === transferId);
  if (!transfer || transfer.status !== 'PENDING_APPROVAL') {
    return { state, error: 'Transfer tidak valid untuk ditolak' };
  }

  const now = new Date().toISOString();
  const updatedTransfers = state.transfers.map((t) => {
    if (t.id === transferId) {
      return {
        ...t,
        status: 'REJECTED' as const,
        rejectionReason,
        approvedBy: state.currentUser.id,
        approvedAt: now,
        events: [
          ...t.events,
          {
            id: generateId('evt'),
            type: 'REJECTED',
            actorId: state.currentUser.id,
            timestamp: now,
            note: `Ditolak: ${rejectionReason}`,
          },
        ],
      };
    }
    return t;
  });

  return {
    state: {
      ...state,
      transfers: updatedTransfers,
    },
  };
}

/**
 * Dispatches a transfer (Decrements source on-hand, increments in-transit out & in)
 */
export function handleDispatchTransfer(
  state: AppState,
  transferId: string,
  dispatchNote?: string
): { state: AppState; error?: string } {
  const transfer = state.transfers.find((t) => t.id === transferId);
  if (!transfer) {
    return { state, error: 'Data transfer tidak ditemukan' };
  }

  if (transfer.status !== 'APPROVED') {
    return {
      state,
      error: 'Transfer harus berstatus Disetujui (Approved) sebelum dapat dikirim (Dispatched)',
    };
  }

  // Validate that source on-hand is still sufficient
  for (const line of transfer.lines) {
    const balance = findStockBalance(state.stockBalances, line.itemId, transfer.sourceSiteId);
    const onHand = balance ? balance.onHand : 0;
    if (onHand < line.requestedQty) {
      return {
        state,
        error: `Stok on-hand saat ini tidak mencukupi untuk pengiriman (Tersedia: ${onHand}, Diminta: ${line.requestedQty})`,
      };
    }
  }

  const now = new Date().toISOString();
  let updatedBalances = [...state.stockBalances];
  const newTransactions: InventoryTransaction[] = [];

  for (const line of transfer.lines) {
    const qty = line.requestedQty;
    // 1. Decrement source onHand & increment inTransitOut
    updatedBalances = updatedBalances.map((b) => {
      if (b.itemId === line.itemId && b.siteId === transfer.sourceSiteId) {
        return {
          ...b,
          onHand: b.onHand - qty,
          inTransitOut: b.inTransitOut + qty,
          updatedAt: now,
        };
      }
      if (b.itemId === line.itemId && b.siteId === transfer.destinationSiteId) {
        return {
          ...b,
          inTransitIn: b.inTransitIn + qty,
          updatedAt: now,
        };
      }
      return b;
    });

    // Record ledger entry for dispatch
    newTransactions.push({
      id: generateId('tx'),
      transactionNumber: generateDocNumber('TX-DSP'),
      type: 'TRANSFER_DISPATCH',
      itemId: line.itemId,
      siteId: transfer.sourceSiteId,
      quantity: qty,
      direction: 'OUT',
      referenceId: transfer.id,
      referenceNumber: transfer.transferNumber,
      note: dispatchNote || `Pengiriman transfer ke ${transfer.destinationSiteId}`,
      actorId: state.currentUser.id,
      createdAt: now,
      syncStatus: 'SYNCED',
    });
  }

  const updatedTransfers = state.transfers.map((t) => {
    if (t.id === transferId) {
      return {
        ...t,
        status: 'IN_TRANSIT' as const,
        dispatchedAt: now,
        lines: t.lines.map((l) => ({ ...l, dispatchedQty: l.requestedQty })),
        events: [
          ...t.events,
          {
            id: generateId('evt'),
            type: 'DISPATCHED',
            actorId: state.currentUser.id,
            timestamp: now,
            note: dispatchNote || 'Barang telah dikirim dan dalam status In Transit',
          },
        ],
      };
    }
    return t;
  });

  return {
    state: {
      ...state,
      transfers: updatedTransfers,
      stockBalances: updatedBalances,
      transactions: [...newTransactions, ...state.transactions],
    },
  };
}

/**
 * Receives a transfer (Full or partial receipt)
 * Decreases in-transit, increases destination on-hand
 */
export function handleReceiveTransfer(
  state: AppState,
  params: {
    transferId: string;
    receivedQuantities: Record<string, number>; // itemId -> qty
    receiptNote?: string;
  }
): { state: AppState; error?: string } {
  const transfer = state.transfers.find((t) => t.id === params.transferId);
  if (!transfer) {
    return { state, error: 'Data transfer tidak ditemukan' };
  }

  if (transfer.status !== 'IN_TRANSIT' && transfer.status !== 'PARTIALLY_RECEIVED') {
    return {
      state,
      error: 'Hanya transfer dengan status In Transit atau Partially Received yang dapat diterima',
    };
  }

  // Validate received quantities
  let isAllComplete = true;
  for (const line of transfer.lines) {
    const received = params.receivedQuantities[line.itemId] ?? 0;
    const dispatched = line.dispatchedQty ?? line.requestedQty;
    if (received < 0) {
      return { state, error: 'Kuantitas penerimaan tidak boleh kurang dari 0' };
    }
    if (received > dispatched) {
      return {
        state,
        error: `Kuantitas diterima (${received}) melebihi kuantitas yang dikirim (${dispatched})`,
      };
    }
    if (received < dispatched) {
      isAllComplete = false;
    }
  }

  const now = new Date().toISOString();
  let updatedBalances = [...state.stockBalances];
  const newTransactions: InventoryTransaction[] = [];

  for (const line of transfer.lines) {
    const receivedQty = params.receivedQuantities[line.itemId] ?? 0;
    const dispatchedQty = line.dispatchedQty ?? line.requestedQty;

    // Mutate source inTransitOut & destination onHand and inTransitIn
    updatedBalances = updatedBalances.map((b) => {
      if (b.itemId === line.itemId && b.siteId === transfer.sourceSiteId) {
        return {
          ...b,
          inTransitOut: Math.max(0, b.inTransitOut - dispatchedQty),
          updatedAt: now,
        };
      }
      if (b.itemId === line.itemId && b.siteId === transfer.destinationSiteId) {
        return {
          ...b,
          onHand: b.onHand + receivedQty,
          inTransitIn: Math.max(0, b.inTransitIn - dispatchedQty),
          updatedAt: now,
        };
      }
      return b;
    });

    if (receivedQty > 0) {
      newTransactions.push({
        id: generateId('tx'),
        transactionNumber: generateDocNumber('TX-RCP'),
        type: 'TRANSFER_RECEIPT',
        itemId: line.itemId,
        siteId: transfer.destinationSiteId,
        quantity: receivedQty,
        direction: 'IN',
        referenceId: transfer.id,
        referenceNumber: transfer.transferNumber,
        note: params.receiptNote || `Penerimaan transfer dari ${transfer.sourceSiteId}`,
        actorId: state.currentUser.id,
        createdAt: now,
        syncStatus: 'SYNCED',
      });
    }
  }

  const finalStatus = isAllComplete ? 'COMPLETED' : 'PARTIALLY_RECEIVED';

  const updatedTransfers = state.transfers.map((t) => {
    if (t.id === params.transferId) {
      return {
        ...t,
        status: finalStatus as any,
        receivedAt: now,
        lines: t.lines.map((l) => ({
          ...l,
          receivedQty: params.receivedQuantities[l.itemId] ?? 0,
        })),
        events: [
          ...t.events,
          {
            id: generateId('evt'),
            type: finalStatus,
            actorId: state.currentUser.id,
            timestamp: now,
            note:
              params.receiptNote ||
              (isAllComplete
                ? 'Semua barang diterima lengkap di site tujuan'
                : 'Sebagian barang diterima; selisih dicatat untuk tindak lanjut'),
          },
        ],
      };
    }
    return t;
  });

  return {
    state: {
      ...state,
      transfers: updatedTransfers,
      stockBalances: updatedBalances,
      transactions: [...newTransactions, ...state.transactions],
    },
  };
}

/**
 * Creates a Stock Opname session
 */
export function handleCreateStockCountSession(
  state: AppState,
  params: {
    siteId: string;
    itemIds: string[];
  }
): { state: AppState; error?: string; session?: StockCountSession } {
  if (!params.itemIds || params.itemIds.length === 0) {
    return { state, error: 'Pilih minimal satu item untuk dihitung' };
  }

  const now = new Date().toISOString();
  const lines = params.itemIds.map((itemId) => {
    const balance = findStockBalance(state.stockBalances, itemId, params.siteId);
    return {
      itemId,
      systemQty: balance ? balance.onHand : 0,
      physicalQty: undefined,
      variance: undefined,
    };
  });

  const session: StockCountSession = {
    id: generateId('sc'),
    sessionNumber: generateDocNumber('SO'),
    siteId: params.siteId,
    status: 'DRAFT',
    createdBy: state.currentUser.id,
    createdAt: now,
    lines,
  };

  return {
    state: {
      ...state,
      stockCountSessions: [session, ...state.stockCountSessions],
    },
    session,
  };
}

/**
 * Updates count in session and submits for review
 */
export function handleSubmitStockCount(
  state: AppState,
  sessionId: string,
  counts: Record<string, number>
): { state: AppState; error?: string } {
  const session = state.stockCountSessions.find((s) => s.id === sessionId);
  if (!session) {
    return { state, error: 'Sesi Stock Opname tidak ditemukan' };
  }

  const updatedLines = session.lines.map((line) => {
    const physical = counts[line.itemId] ?? line.systemQty;
    const variance = physical - line.systemQty;
    return {
      ...line,
      physicalQty: physical,
      variance,
    };
  });

  const updatedSessions = state.stockCountSessions.map((s) => {
    if (s.id === sessionId) {
      return {
        ...s,
        status: 'SUBMITTED' as const,
        lines: updatedLines,
      };
    }
    return s;
  });

  return {
    state: {
      ...state,
      stockCountSessions: updatedSessions,
    },
  };
}

/**
 * Approves and applies stock adjustment to ledger
 */
export function handleApplyStockAdjustment(
  state: AppState,
  sessionId: string
): { state: AppState; error?: string } {
  if (state.currentUser.role !== 'SITE_APPROVER' && state.currentUser.role !== 'ADMIN') {
    return {
      state,
      error: 'Hanya Site Approver atau Admin yang berhak menyetujui penyesuaian stock opname',
    };
  }

  const session = state.stockCountSessions.find((s) => s.id === sessionId);
  if (!session || session.status !== 'SUBMITTED') {
    return { state, error: 'Sesi belum diajukan atau sudah diproses' };
  }

  const now = new Date().toISOString();
  let updatedBalances = [...state.stockBalances];
  const newTransactions: InventoryTransaction[] = [];

  for (const line of session.lines) {
    if (line.physicalQty !== undefined && line.variance !== undefined && line.variance !== 0) {
      // Update balance to match physical
      updatedBalances = updatedBalances.map((b) => {
        if (b.itemId === line.itemId && b.siteId === session.siteId) {
          return {
            ...b,
            onHand: line.physicalQty!,
            updatedAt: now,
          };
        }
        return b;
      });

      newTransactions.push({
        id: generateId('tx'),
        transactionNumber: generateDocNumber('TX-ADJ'),
        type: 'STOCK_ADJUSTMENT',
        itemId: line.itemId,
        siteId: session.siteId,
        quantity: Math.abs(line.variance),
        direction: 'ADJUSTMENT',
        referenceId: session.id,
        referenceNumber: session.sessionNumber,
        note: `Penyesuaian Stock Opname: fisik ${line.physicalQty} vs sistem ${line.systemQty} (selisih ${line.variance > 0 ? '+' : ''}${line.variance})`,
        actorId: state.currentUser.id,
        createdAt: now,
        syncStatus: 'SYNCED',
      });
    }
  }

  const updatedSessions = state.stockCountSessions.map((s) => {
    if (s.id === sessionId) {
      return {
        ...s,
        status: 'APPLIED' as const,
        appliedAt: now,
        appliedBy: state.currentUser.id,
      };
    }
    return s;
  });

  return {
    state: {
      ...state,
      stockCountSessions: updatedSessions,
      stockBalances: updatedBalances,
      transactions: [...newTransactions, ...state.transactions],
    },
  };
}

/**
 * Simulates syncing the offline pending queue
 */
export function handleSyncQueue(state: AppState): { state: AppState; syncedCount: number } {
  const pendingItems = state.syncQueue.filter((item) => item.status === 'PENDING_SYNC');
  if (pendingItems.length === 0) {
    return { state, syncedCount: 0 };
  }

  let currentState = { ...state };
  const now = new Date().toISOString();

  for (const item of pendingItems) {
    if (item.type === 'RECEIPT') {
      const res = handleGoodsReceipt(
        { ...currentState, isOffline: false },
        item.payload
      );
      if (!res.error) currentState = res.state;
    } else if (item.type === 'ISSUE') {
      const res = handleGoodsIssue(
        { ...currentState, isOffline: false },
        item.payload
      );
      if (!res.error) currentState = res.state;
    }
  }

  const updatedQueue = currentState.syncQueue.map((item) => {
    if (item.status === 'PENDING_SYNC') {
      return { ...item, status: 'SYNCED' as const };
    }
    return item;
  });

  return {
    state: {
      ...currentState,
      syncQueue: updatedQueue,
      lastSyncedTimestamp: now,
      sites: currentState.sites.map((s) => ({ ...s, lastSyncedAt: now })),
    },
    syncedCount: pendingItems.length,
  };
}
