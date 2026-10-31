import {
  Site,
  Category,
  Item,
  StockBalance,
  Transfer,
  InventoryTransaction,
  DemoUser,
  StockCountSession,
  SyncQueueItem,
} from '@/domain/types';

export const SEED_VERSION = 'v1.0.0-fpe';

export const INITIAL_SITES: Site[] = [
  { id: 'site-01', code: 'ST-01', name: 'Site 01 (Ketapang)', locationLabel: 'Kalimantan Barat', status: 'active', lastSyncedAt: '2026-10-31T09:30:00Z' },
  { id: 'site-02', code: 'ST-02', name: 'Site 02 (Sanggau)', locationLabel: 'Kalimantan Barat', status: 'active', lastSyncedAt: '2026-10-31T09:45:00Z' },
  { id: 'site-03', code: 'ST-03', name: 'Site 03 (Sintang)', locationLabel: 'Kalimantan Barat', status: 'active', lastSyncedAt: '2026-10-31T10:00:00Z' },
  { id: 'site-04', code: 'ST-04', name: 'Site 04 (Pontianak Hub)', locationLabel: 'Kalimantan Barat', status: 'active', lastSyncedAt: '2026-10-31T10:15:00Z' },
  { id: 'site-05', code: 'ST-05', name: 'Site 05 (Kendawangan)', locationLabel: 'Kalimantan Barat', status: 'active', lastSyncedAt: '2026-10-31T09:15:00Z' },
  { id: 'site-06', code: 'ST-06', name: 'Site 06 (Sandai)', locationLabel: 'Kalimantan Barat', status: 'active', lastSyncedAt: '2026-10-31T08:50:00Z' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-01', name: 'Spare Part' },
  { id: 'cat-02', name: 'Tire' },
  { id: 'cat-03', name: 'Safety Equipment' },
  { id: 'cat-04', name: 'Consumable' },
  { id: 'cat-05', name: 'Tools' },
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-001',
    code: 'SP-0001',
    name: 'Hydraulic Filter',
    partNumber: 'HF-2048',
    categoryId: 'cat-01',
    unit: 'pcs',
    description: 'High-pressure hydraulic return line filter for heavy excavator series',
    qrValue: 'FPE:ITEM:SP-0001:HF-2048',
    active: true,
  },
  {
    id: 'item-002',
    code: 'SP-0002',
    name: 'Engine Oil Filter',
    partNumber: 'EOF-1102',
    categoryId: 'cat-01',
    unit: 'pcs',
    description: 'Spin-on lube filter for heavy duty diesel generator and haul truck engines',
    qrValue: 'FPE:ITEM:SP-0002:EOF-1102',
    active: true,
  },
  {
    id: 'item-003',
    code: 'SP-0003',
    name: 'V-Belt',
    partNumber: 'VB-880',
    categoryId: 'cat-01',
    unit: 'pcs',
    description: 'Heavy duty molded notch industrial V-belt 880mm',
    qrValue: 'FPE:ITEM:SP-0003:VB-880',
    active: true,
  },
  {
    id: 'item-004',
    code: 'TY-0001',
    name: 'Heavy Equipment Tire',
    partNumber: 'HT-29.5',
    categoryId: 'cat-02',
    unit: 'pcs',
    description: 'Radial earthmover tire 29.5R25 for articulated dump truck and wheel loader',
    qrValue: 'FPE:ITEM:TY-0001:HT-29.5',
    active: true,
  },
  {
    id: 'item-005',
    code: 'TL-0001',
    name: 'Safety Helmet',
    partNumber: 'PPE-H01',
    categoryId: 'cat-03',
    unit: 'pcs',
    description: 'Standard ANSI/ISEA Z89.1 Class E industrial hard hat with ratchet suspension',
    qrValue: 'FPE:ITEM:TL-0001:PPE-H01',
    active: true,
  },
  {
    id: 'item-006',
    code: 'CS-0001',
    name: 'Welding Electrode',
    partNumber: 'WE-6013',
    categoryId: 'cat-04',
    unit: 'box',
    description: 'AWS A5.1 E6013 3.2mm mild steel welding rod (5kg per box)',
    qrValue: 'FPE:ITEM:CS-0001:WE-6013',
    active: true,
  },
  {
    id: 'item-007',
    code: 'CS-0002',
    name: 'Grease Cartridge',
    partNumber: 'GR-400',
    categoryId: 'cat-04',
    unit: 'pcs',
    description: 'NLGI Grade 2 lithium complex extreme pressure grease 400g cartridge',
    qrValue: 'FPE:ITEM:CS-0002:GR-400',
    active: true,
  },
  {
    id: 'item-008',
    code: 'TL-0002',
    name: 'Portable Work Light',
    partNumber: 'PWL-20',
    categoryId: 'cat-05',
    unit: 'unit',
    description: 'Rechargeable 20W LED explosion-proof portable site inspection light',
    qrValue: 'FPE:ITEM:TL-0002:PWL-20',
    active: true,
  },
  {
    id: 'item-009',
    code: 'SP-0004',
    name: 'Fuel Filter',
    partNumber: 'FF-390',
    categoryId: 'cat-01',
    unit: 'pcs',
    description: 'Secondary fuel water separator filter element',
    qrValue: 'FPE:ITEM:SP-0004:FF-390',
    active: true,
  },
  {
    id: 'item-010',
    code: 'CS-0003',
    name: 'Industrial Hose',
    partNumber: 'IH-32',
    categoryId: 'cat-04',
    unit: 'meter',
    description: 'Four-spiral wire reinforced hydraulic rubber hose 1-1/4 inch ID',
    qrValue: 'FPE:ITEM:CS-0003:IH-32',
    active: true,
  },
];

// Seed stock matrix from Section 5 of 06-DATA-MODEL-AND-MOCK-DATA.md
// Minimum stock thresholds tuned so that:
// - item-001 (Hydraulic Filter) at site-01: onHand=2, min=5 (Alert!)
// - item-003 (V-Belt) at site-01: onHand=1, min=3 (Alert!)
// - item-004 (Tire) at site-01: onHand=0, min=1 (Alert!)
// - item-007 (Grease Cartridge) at site-06: onHand=1, min=3 (Alert!)
export const INITIAL_STOCK_BALANCES: StockBalance[] = [
  // item-001 Hydraulic Filter: [2, 12, 4, 0, 3, 1]
  { id: 'sb-01', itemId: 'item-001', siteId: 'site-01', onHand: 2, minimumStock: 5, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-02', itemId: 'item-001', siteId: 'site-02', onHand: 12, minimumStock: 4, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-03', itemId: 'item-001', siteId: 'site-03', onHand: 4, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-04', itemId: 'item-001', siteId: 'site-04', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-05', itemId: 'item-001', siteId: 'site-05', onHand: 3, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-06', itemId: 'item-001', siteId: 'site-06', onHand: 1, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-002 Engine Oil Filter: [8, 5, 2, 6, 0, 4]
  { id: 'sb-07', itemId: 'item-002', siteId: 'site-01', onHand: 8, minimumStock: 4, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-08', itemId: 'item-002', siteId: 'site-02', onHand: 5, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-09', itemId: 'item-002', siteId: 'site-03', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-10', itemId: 'item-002', siteId: 'site-04', onHand: 6, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-11', itemId: 'item-002', siteId: 'site-05', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-12', itemId: 'item-002', siteId: 'site-06', onHand: 4, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-003 V-Belt: [1, 0, 5, 3, 2, 0] (TRF-2026-0011 has 3 units in transit from site-03 to site-04)
  { id: 'sb-13', itemId: 'item-003', siteId: 'site-01', onHand: 1, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-14', itemId: 'item-003', siteId: 'site-02', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-15', itemId: 'item-003', siteId: 'site-03', onHand: 5, minimumStock: 2, inTransitIn: 0, inTransitOut: 3, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-16', itemId: 'item-003', siteId: 'site-04', onHand: 3, minimumStock: 2, inTransitIn: 3, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-17', itemId: 'item-003', siteId: 'site-05', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-18', itemId: 'item-003', siteId: 'site-06', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-004 Heavy Equipment Tire: [0, 2, 1, 0, 1, 0]
  { id: 'sb-19', itemId: 'item-004', siteId: 'site-01', onHand: 0, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-20', itemId: 'item-004', siteId: 'site-02', onHand: 2, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-21', itemId: 'item-004', siteId: 'site-03', onHand: 1, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-22', itemId: 'item-004', siteId: 'site-04', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-23', itemId: 'item-004', siteId: 'site-05', onHand: 1, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-24', itemId: 'item-004', siteId: 'site-06', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-005 Safety Helmet: [18, 10, 7, 12, 9, 6]
  { id: 'sb-25', itemId: 'item-005', siteId: 'site-01', onHand: 18, minimumStock: 10, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-26', itemId: 'item-005', siteId: 'site-02', onHand: 10, minimumStock: 8, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-27', itemId: 'item-005', siteId: 'site-03', onHand: 7, minimumStock: 5, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-28', itemId: 'item-005', siteId: 'site-04', onHand: 12, minimumStock: 6, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-29', itemId: 'item-005', siteId: 'site-05', onHand: 9, minimumStock: 5, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-30', itemId: 'item-005', siteId: 'site-06', onHand: 6, minimumStock: 5, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-006 Welding Electrode: [4, 6, 3, 8, 2, 5]
  { id: 'sb-31', itemId: 'item-006', siteId: 'site-01', onHand: 4, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-32', itemId: 'item-006', siteId: 'site-02', onHand: 6, minimumStock: 4, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-33', itemId: 'item-006', siteId: 'site-03', onHand: 3, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-34', itemId: 'item-006', siteId: 'site-04', onHand: 8, minimumStock: 4, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-35', itemId: 'item-006', siteId: 'site-05', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-36', itemId: 'item-006', siteId: 'site-06', onHand: 5, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-007 Grease Cartridge: [3, 11, 4, 2, 7, 1]
  { id: 'sb-37', itemId: 'item-007', siteId: 'site-01', onHand: 3, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-38', itemId: 'item-007', siteId: 'site-02', onHand: 11, minimumStock: 5, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-39', itemId: 'item-007', siteId: 'site-03', onHand: 4, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-40', itemId: 'item-007', siteId: 'site-04', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-41', itemId: 'item-007', siteId: 'site-05', onHand: 7, minimumStock: 4, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-42', itemId: 'item-007', siteId: 'site-06', onHand: 1, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-008 Portable Work Light: [2, 1, 3, 2, 0, 1]
  { id: 'sb-43', itemId: 'item-008', siteId: 'site-01', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-44', itemId: 'item-008', siteId: 'site-02', onHand: 1, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-45', itemId: 'item-008', siteId: 'site-03', onHand: 3, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-46', itemId: 'item-008', siteId: 'site-04', onHand: 2, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-47', itemId: 'item-008', siteId: 'site-05', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-48', itemId: 'item-008', siteId: 'site-06', onHand: 1, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-009 Fuel Filter: [5, 4, 0, 2, 3, 1]
  { id: 'sb-49', itemId: 'item-009', siteId: 'site-01', onHand: 5, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-50', itemId: 'item-009', siteId: 'site-02', onHand: 4, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-51', itemId: 'item-009', siteId: 'site-03', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-52', itemId: 'item-009', siteId: 'site-04', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-53', itemId: 'item-009', siteId: 'site-05', onHand: 3, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-54', itemId: 'item-009', siteId: 'site-06', onHand: 1, minimumStock: 1, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },

  // item-010 Industrial Hose: [10, 0, 8, 5, 2, 4]
  { id: 'sb-55', itemId: 'item-010', siteId: 'site-01', onHand: 10, minimumStock: 5, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-56', itemId: 'item-010', siteId: 'site-02', onHand: 0, minimumStock: 0, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-57', itemId: 'item-010', siteId: 'site-03', onHand: 8, minimumStock: 4, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-58', itemId: 'item-010', siteId: 'site-04', onHand: 5, minimumStock: 3, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-59', itemId: 'item-010', siteId: 'site-05', onHand: 2, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
  { id: 'sb-60', itemId: 'item-010', siteId: 'site-06', onHand: 4, minimumStock: 2, inTransitIn: 0, inTransitOut: 0, updatedAt: '2026-10-31T08:00:00Z' },
];

export const INITIAL_TRANSFERS: Transfer[] = [
  {
    id: 'trf-0012',
    transferNumber: 'TRF-2026-0012',
    sourceSiteId: 'site-02',
    destinationSiteId: 'site-01',
    requestedBy: 'user-02', // Rudi Warehouse
    status: 'PENDING_APPROVAL',
    reason: 'Kebutuhan darurat penggantian hydraulic filter unit excavator EX-200 di Site 01',
    requestedAt: '2026-10-31T08:30:00Z',
    lines: [
      { itemId: 'item-001', requestedQty: 4 }
    ],
    events: [
      {
        id: 'evt-01',
        type: 'CREATED',
        actorId: 'user-02',
        timestamp: '2026-10-31T08:30:00Z',
        note: 'Transfer request diajukan dari Site 02 ke Site 01',
      }
    ],
  },
  {
    id: 'trf-0011',
    transferNumber: 'TRF-2026-0011',
    sourceSiteId: 'site-03',
    destinationSiteId: 'site-04',
    requestedBy: 'user-01',
    status: 'IN_TRANSIT',
    reason: 'Restocking V-Belt untuk armada dump truck Pontianak Hub',
    requestedAt: '2026-10-30T14:00:00Z',
    approvedBy: 'user-03',
    approvedAt: '2026-10-30T15:30:00Z',
    dispatchedAt: '2026-10-31T07:15:00Z',
    lines: [
      { itemId: 'item-003', requestedQty: 3, dispatchedQty: 3 }
    ],
    events: [
      { id: 'evt-10', type: 'CREATED', actorId: 'user-01', timestamp: '2026-10-30T14:00:00Z' },
      { id: 'evt-11', type: 'APPROVED', actorId: 'user-03', timestamp: '2026-10-30T15:30:00Z', note: 'Disetujui untuk pengiriman logistik darat' },
      { id: 'evt-12', type: 'DISPATCHED', actorId: 'user-01', timestamp: '2026-10-31T07:15:00Z', note: 'Dikirim dengan ekspedisi darat Surat Jalan #SJ-7721' },
    ],
  },
  {
    id: 'trf-0010',
    transferNumber: 'TRF-2026-0010',
    sourceSiteId: 'site-01',
    destinationSiteId: 'site-05',
    requestedBy: 'user-02',
    status: 'COMPLETED',
    reason: 'Alokasi APD Safety Helmet untuk tim kontraktor baru di Kendawangan',
    requestedAt: '2026-10-28T09:00:00Z',
    approvedBy: 'user-03',
    approvedAt: '2026-10-28T10:15:00Z',
    dispatchedAt: '2026-10-28T13:00:00Z',
    receivedAt: '2026-10-29T16:20:00Z',
    lines: [
      { itemId: 'item-005', requestedQty: 5, dispatchedQty: 5, receivedQty: 5 }
    ],
    events: [
      { id: 'evt-20', type: 'CREATED', actorId: 'user-02', timestamp: '2026-10-28T09:00:00Z' },
      { id: 'evt-21', type: 'APPROVED', actorId: 'user-03', timestamp: '2026-10-28T10:15:00Z' },
      { id: 'evt-22', type: 'DISPATCHED', actorId: 'user-02', timestamp: '2026-10-28T13:00:00Z' },
      { id: 'evt-23', type: 'RECEIVED', actorId: 'user-01', timestamp: '2026-10-29T16:20:00Z', note: 'Diterima lengkap dan kondisi baik di Site 05' },
    ],
  },
  {
    id: 'trf-0009',
    transferNumber: 'TRF-2026-0009',
    sourceSiteId: 'site-04',
    destinationSiteId: 'site-06',
    requestedBy: 'user-02',
    status: 'REJECTED',
    reason: 'Permintaan Grease Cartridge tambahan',
    rejectionReason: 'Kapasitas gudang Site 06 sedang penuh dan kuota bulanan telah tercapai',
    requestedAt: '2026-10-27T11:00:00Z',
    approvedBy: 'user-03',
    approvedAt: '2026-10-27T14:30:00Z',
    lines: [
      { itemId: 'item-007', requestedQty: 2 }
    ],
    events: [
      { id: 'evt-30', type: 'CREATED', actorId: 'user-02', timestamp: '2026-10-27T11:00:00Z' },
      { id: 'evt-31', type: 'REJECTED', actorId: 'user-03', timestamp: '2026-10-27T14:30:00Z', note: 'Ditolak: Kapasitas gudang Site 06 sedang penuh' },
    ],
  },
];

export const INITIAL_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: 'tx-001',
    transactionNumber: 'TX-2026-0091',
    type: 'GOODS_RECEIPT',
    itemId: 'item-001',
    siteId: 'site-02',
    quantity: 10,
    direction: 'IN',
    referenceNumber: 'PO-REC-4410',
    note: 'Penerimaan batch spare part rutin supplier PT Mitra Mandiri',
    actorId: 'user-02',
    createdAt: '2026-10-29T11:20:00Z',
    syncStatus: 'SYNCED',
  },
  {
    id: 'tx-002',
    transactionNumber: 'TX-2026-0092',
    type: 'TRANSFER_DISPATCH',
    itemId: 'item-005',
    siteId: 'site-01',
    quantity: 5,
    direction: 'OUT',
    referenceNumber: 'TRF-2026-0010',
    note: 'Pengiriman APD Safety Helmet ke Site 05',
    actorId: 'user-02',
    createdAt: '2026-10-28T13:00:00Z',
    syncStatus: 'SYNCED',
  },
  {
    id: 'tx-003',
    transactionNumber: 'TX-2026-0093',
    type: 'TRANSFER_RECEIPT',
    itemId: 'item-005',
    siteId: 'site-05',
    quantity: 5,
    direction: 'IN',
    referenceNumber: 'TRF-2026-0010',
    note: 'Penerimaan kiriman dari Site 01',
    actorId: 'user-01',
    createdAt: '2026-10-29T16:20:00Z',
    syncStatus: 'SYNCED',
  },
  {
    id: 'tx-004',
    transactionNumber: 'TX-2026-0094',
    type: 'GOODS_ISSUE',
    itemId: 'item-007',
    siteId: 'site-01',
    quantity: 2,
    direction: 'OUT',
    referenceNumber: 'WO-2026-881',
    note: 'Pengeluaran grease cartridge untuk maintenance berkala Excavator EX-04',
    actorId: 'user-02',
    createdAt: '2026-10-30T09:15:00Z',
    syncStatus: 'SYNCED',
  },
  {
    id: 'tx-005',
    transactionNumber: 'TX-2026-0095',
    type: 'TRANSFER_DISPATCH',
    itemId: 'item-003',
    siteId: 'site-03',
    quantity: 3,
    direction: 'OUT',
    referenceNumber: 'TRF-2026-0011',
    note: 'Pengiriman transfer V-Belt ke Site 04 Pontianak Hub',
    actorId: 'user-01',
    createdAt: '2026-10-31T07:15:00Z',
    syncStatus: 'SYNCED',
  },
];

export const INITIAL_USERS: DemoUser[] = [
  {
    id: 'user-01',
    name: 'Demo Administrator',
    email: 'admin@fpe.demo',
    role: 'ADMIN',
    siteIds: ['site-01', 'site-02', 'site-03', 'site-04', 'site-05', 'site-06'],
    active: true,
  },
  {
    id: 'user-02',
    name: 'Rudi Warehouse',
    email: 'rudi.warehouse@fpe.demo',
    role: 'WAREHOUSE_STAFF',
    siteIds: ['site-01'],
    active: true,
  },
  {
    id: 'user-03',
    name: 'Siti Approver',
    email: 'siti.approver@fpe.demo',
    role: 'SITE_APPROVER',
    siteIds: ['site-01', 'site-02'],
    active: true,
  },
  {
    id: 'user-04',
    name: 'Budi Management',
    email: 'budi.management@fpe.demo',
    role: 'MANAGEMENT',
    siteIds: ['site-01', 'site-02', 'site-03', 'site-04', 'site-05', 'site-06'],
    active: true,
  },
];

export const INITIAL_STOCK_COUNT_SESSIONS: StockCountSession[] = [
  {
    id: 'sc-001',
    sessionNumber: 'SO-2026-001',
    siteId: 'site-01',
    status: 'APPLIED',
    createdBy: 'user-02',
    createdAt: '2026-10-25T08:00:00Z',
    appliedAt: '2026-10-25T14:30:00Z',
    appliedBy: 'user-03',
    lines: [
      { itemId: 'item-001', systemQty: 3, physicalQty: 2, variance: -1 },
      { itemId: 'item-005', systemQty: 18, physicalQty: 18, variance: 0 },
    ],
  },
];

export const INITIAL_SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'sync-conflict-01',
    type: 'ISSUE',
    description: 'Pengeluaran Portable Work Light (2 unit) saat offline di Site 05',
    siteId: 'site-05',
    actorId: 'user-02',
    createdAt: '2026-10-31T06:10:00Z',
    status: 'CONFLICT',
    payload: {
      itemId: 'item-008',
      quantity: 2,
      siteId: 'site-05',
      note: 'Pencatatan lokal dengan snapshot offline lama, saldo fisik tersisa di sistem adalah 0 unit',
    },
    conflictReason: 'Stok on-hand di server saat rekonsiliasi (0 unit) kurang dari kuantitas yang dikeluarkan (2 unit). Perlu review supervisor.',
  },
];
