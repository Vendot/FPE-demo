export type DemoRole = 'ADMIN' | 'WAREHOUSE_STAFF' | 'SITE_APPROVER' | 'MANAGEMENT';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  siteIds: string[];
  active: boolean;
}

export interface Site {
  id: string;
  code: string;
  name: string;
  locationLabel: string;
  status: 'active' | 'inactive';
  lastSyncedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  partNumber: string;
  categoryId: string;
  unit: string;
  description?: string;
  qrValue: string;
  active: boolean;
}

export interface StockBalance {
  id: string;
  itemId: string;
  siteId: string;
  onHand: number;
  minimumStock: number;
  inTransitIn: number;
  inTransitOut: number;
  updatedAt: string;
}

export type TransactionType =
  | 'GOODS_RECEIPT'
  | 'GOODS_ISSUE'
  | 'TRANSFER_DISPATCH'
  | 'TRANSFER_RECEIPT'
  | 'STOCK_ADJUSTMENT';

export type TransactionDirection = 'IN' | 'OUT' | 'ADJUSTMENT';

export type SyncStatus = 'SYNCED' | 'PENDING_SYNC' | 'CONFLICT';

export interface InventoryTransaction {
  id: string;
  transactionNumber: string;
  type: TransactionType;
  itemId: string;
  siteId: string;
  quantity: number;
  direction: TransactionDirection;
  referenceId?: string;
  referenceNumber?: string;
  note?: string;
  actorId: string;
  createdAt: string;
  syncStatus: SyncStatus;
}

export type TransferStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_TRANSIT'
  | 'PARTIALLY_RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TransferLine {
  itemId: string;
  requestedQty: number;
  dispatchedQty?: number;
  receivedQty?: number;
}

export interface TransferEvent {
  id: string;
  type: string;
  actorId: string;
  timestamp: string;
  note?: string;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  sourceSiteId: string;
  destinationSiteId: string;
  requestedBy: string;
  status: TransferStatus;
  reason: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  lines: TransferLine[];
  events: TransferEvent[];
}

export type StockCountStatus = 'DRAFT' | 'COUNTING' | 'SUBMITTED' | 'APPROVED' | 'APPLIED';

export interface StockCountLine {
  itemId: string;
  systemQty: number;
  physicalQty?: number;
  variance?: number;
}

export interface StockCountSession {
  id: string;
  sessionNumber: string;
  siteId: string;
  status: StockCountStatus;
  createdBy: string;
  createdAt: string;
  appliedAt?: string;
  appliedBy?: string;
  lines: StockCountLine[];
}

export interface SyncQueueItem {
  id: string;
  type: 'RECEIPT' | 'ISSUE' | 'COUNT' | 'TRANSFER';
  description: string;
  siteId: string;
  actorId: string;
  createdAt: string;
  status: SyncStatus;
  payload: any;
  conflictReason?: string;
}
