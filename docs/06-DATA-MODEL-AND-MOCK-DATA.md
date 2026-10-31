# 06 --- Data Model & Mock Data

## 1. Data principles

-   Use one shared seed dataset for all pages.
-   KPI cards, charts, item tables, reports, and transaction history
    must derive from the same data.
-   Avoid hard-coded dashboard totals that contradict transaction
    records.
-   Store timestamps in ISO 8601.
-   Use integer quantities for countable items; use decimal quantities
    only if unit rules require it.
-   Use fictional demo data and display a persistent `Data Simulasi`
    indicator.

## 2. Suggested frontend entities

### Site

``` ts
type Site = {
  id: string;
  code: string;
  name: string;
  locationLabel: string;
  status: "active" | "inactive";
  lastSyncedAt: string;
};
```

### Item

``` ts
type Item = {
  id: string;
  code: string;
  name: string;
  partNumber: string;
  categoryId: string;
  unit: string;
  description?: string;
  qrValue: string;
  active: boolean;
};
```

### Category

``` ts
type Category = {
  id: string;
  name: string;
};
```

### StockBalance

``` ts
type StockBalance = {
  id: string;
  itemId: string;
  siteId: string;
  onHand: number;
  minimumStock: number;
  inTransitIn: number;
  inTransitOut: number;
  updatedAt: string;
};
```

### InventoryTransaction

``` ts
type InventoryTransaction = {
  id: string;
  transactionNumber: string;
  type: "GOODS_RECEIPT" | "GOODS_ISSUE" | "TRANSFER_DISPATCH" |
        "TRANSFER_RECEIPT" | "STOCK_ADJUSTMENT";
  itemId: string;
  siteId: string;
  quantity: number;
  direction: "IN" | "OUT" | "ADJUSTMENT";
  referenceId?: string;
  referenceNumber?: string;
  note?: string;
  actorId: string;
  createdAt: string;
  syncStatus: "SYNCED" | "PENDING_SYNC" | "CONFLICT";
};
```

### Transfer

``` ts
type TransferStatus =
  | "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
  | "IN_TRANSIT" | "PARTIALLY_RECEIVED" | "COMPLETED" | "CANCELLED";

type Transfer = {
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
  lines: Array<{
    itemId: string;
    requestedQty: number;
    dispatchedQty?: number;
    receivedQty?: number;
  }>;
  events: Array<{
    id: string;
    type: string;
    actorId: string;
    timestamp: string;
    note?: string;
  }>;
};
```

### StockCountSession

``` ts
type StockCountSession = {
  id: string;
  sessionNumber: string;
  siteId: string;
  status: "DRAFT" | "COUNTING" | "SUBMITTED" | "APPROVED" | "APPLIED";
  createdBy: string;
  createdAt: string;
  lines: Array<{
    itemId: string;
    systemQty: number;
    physicalQty?: number;
    variance?: number;
  }>;
};
```

### User

``` ts
type DemoRole = "ADMIN" | "WAREHOUSE_STAFF" | "SITE_APPROVER" | "MANAGEMENT";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  siteIds: string[];
  active: boolean;
};
```

## 3. Six fictional sites

Use fictional labels; do not imply these are FPE's actual site names.

  ID        Code    Demo name      Location label
  --------- ------- -------------- ------------------
  site-01   ST-01   Site Alpha     Kalimantan Barat
  site-02   ST-02   Site Bravo     Kalimantan Barat
  site-03   ST-03   Site Charlie   Kalimantan Barat
  site-04   ST-04   Site Delta     Kalimantan Barat
  site-05   ST-05   Site Echo      Kalimantan Barat
  site-06   ST-06   Site Foxtrot   Kalimantan Barat

Use a neutral label such as `Lokasi Operasional 01` if the client should
not see invented names. Recommended for client-facing demo: Site
01--Site 06.

## 4. Sample categories and items

  -------------------------------------------------------------------------
  Item ID     Code        Item         Part number Category     Unit
  ----------- ----------- ------------ ----------- ------------ -----------
  item-001    SP-0001     Hydraulic    HF-2048     Spare Part   pcs
                          Filter                                

  item-002    SP-0002     Engine Oil   EOF-1102    Spare Part   pcs
                          Filter                                

  item-003    SP-0003     V-Belt       VB-880      Spare Part   pcs

  item-004    TY-0001     Heavy        HT-29.5     Tire         pcs
                          Equipment                             
                          Tire                                  

  item-005    TL-0001     Safety       PPE-H01     Safety       pcs
                          Helmet                   Equipment    

  item-006    CS-0001     Welding      WE-6013     Consumable   box
                          Electrode                             

  item-007    CS-0002     Grease       GR-400      Consumable   pcs
                          Cartridge                             

  item-008    TL-0002     Portable     PWL-20      Tools        unit
                          Work Light                            

  item-009    SP-0004     Fuel Filter  FF-390      Spare Part   pcs

  item-010    CS-0003     Industrial   IH-32       Consumable   meter
                          Hose                                  
  -------------------------------------------------------------------------

## 5. Seed stock scenario

Use these sample balances to make the multi-site story visible. Values
are illustrative and must be consistent in the implementation.

  Item                     Site 01   Site 02   Site 03   Site 04   Site 05   Site 06
  ---------------------- --------- --------- --------- --------- --------- ---------
  Hydraulic Filter               2        12         4         0         3         1
  Engine Oil Filter              8         5         2         6         0         4
  V-Belt                         1         0         5         3         2         0
  Heavy Equipment Tire           0         2         1         0         1         0
  Safety Helmet                 18        10         7        12         9         6
  Welding Electrode              4         6         3         8         2         5
  Grease Cartridge               3        11         4         2         7         1
  Portable Work Light            2         1         3         2         0         1
  Fuel Filter                    5         4         0         2         3         1
  Industrial Hose               10         0         8         5         2         4

Minimum stock should be configured per site and item. Seed at least: -
Hydraulic Filter at Site 01 below minimum (min 5, on-hand 2). - V-Belt
at Site 01 below minimum (min 3, on-hand 1). - Heavy Equipment Tire at
Site 01 at zero (min 1). - Grease Cartridge at Site 06 below minimum
(min 3, on-hand 1).

Use additional varied thresholds for other item/site combinations. Do
not assume one global minimum applies to every site.

## 6. Seed transfer scenarios

Include at least: - `TRF-2026-0012`: Site 02 → Site 01, Hydraulic
Filter, 4 units, `PENDING_APPROVAL`. - `TRF-2026-0011`: Site 03 → Site
04, V-Belt, 3 units, `IN_TRANSIT`. - `TRF-2026-0010`: Site 01 → Site 05,
Safety Helmet, 5 units, `COMPLETED`. - `TRF-2026-0009`: Site 04 → Site
06, Grease Cartridge, 2 units, `REJECTED`.

Ensure stock balances and ledger entries are internally consistent with
each seeded transfer. If maintaining exact consistency is too complex
for seed history, define the balances as the authoritative opening
snapshot and make transfer events after that snapshot explicit.

## 7. Demo users

  User                 Role              Site scope
  -------------------- ----------------- ------------------
  Demo Administrator   ADMIN             All sites
  Rudi Warehouse       WAREHOUSE_STAFF   Site 01
  Siti Approver        SITE_APPROVER     Site 01, Site 02
  Budi Management      MANAGEMENT        All sites

Provide a visible role switcher for quick presentation. This is a demo
convenience, not secure authentication.

## 8. Derived metrics

-   Total SKUs = count of active items.
-   Total recorded units = sum of `onHand` across all item/site
    balances. Do not include in-transit quantities unless the label
    explicitly says so.
-   Low-stock item-site count = count of balances where
    `onHand <= minimumStock`.
-   Pending approvals = transfers with `PENDING_APPROVAL`.
-   Transfers in transit = transfers with `IN_TRANSIT` or
    `PARTIALLY_RECEIVED`.
-   Stock availability per item/site = on-hand quantity plus clear
    in-transit context; never label in-transit stock as currently
    available at destination.

## 9. Persistence

-   Prefer IndexedDB for a richer local demo, or LocalStorage for a
    small prototype.
-   Persist selected role, site filter, edited records, and sync queue.
-   Include `Reset Demo Data` to restore the canonical seed.
-   Handle storage errors gracefully.
-   Use a seed version key so updated seed structures can reset safely.
