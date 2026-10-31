# 02 --- Scope & Feature Matrix (Professional)

## 1. Scope boundary

Demo merepresentasikan **Phase 1 --- Warehouse & Inventory** dan paket
**Professional**. Batas cakupan proposal adalah hingga enam site.

## 2. Professional feature matrix

  -----------------------------------------------------------------------
  Area                    Professional scope      Demo implementation
  ----------------------- ----------------------- -----------------------
  Master item             Item, category, unit,   CRUD simulatif
                          code, part number       

  Site / warehouse        Multi-site up to 6      Site selector + site
                          sites                   summary

  Goods receiving         Record incoming goods   Form + stock ledger
                                                  update

  Goods issuing           Record outgoing goods   Form + stock ledger
                                                  update

  Stock transfer          Request, approval,      Full interactive
                          shipment, receiving,    workflow
                          status                  

  Role-based approval     Role-based for main     Role switcher +
                          transactions            permission guard
                                                  simulation

  Stock opname            Physical count and      Create count session +
                          discrepancy             variance result

  Minimum stock           Alert below threshold   Alert center +
                          per site                dashboard warning

  Management dashboard    Cross-site visibility   KPI cards, charts, site
                                                  breakdown, pending
                                                  transfer

  Reports                 Cross-site reporting    Filters + CSV export

  Transaction history     Complete history,       Search/filter/sort +
                          filter, export          CSV export

  QR labels               Printable QR labels     Print-friendly QR label
                          (PDF)                   page; browser print to
                                                  PDF

  Read-only API           Documented read-only    Optional static API
                          API                     reference screen; no
                                                  real API

  Offline-first           Selected local          Offline toggle + local
                          transactions, later     queue + sync simulation
                          sync                    

  Deployment/training     Included in commercial  Not part of frontend
                          delivery                prototype
  -----------------------------------------------------------------------

## 3. Explicit exclusions from Professional

Do not implement as active features: - Inventory valuation / stock value
analytics. - Stock aging / inventory age analysis. - Slow-moving or
dead-stock analytics. - Camera-based barcode/QR scanning. - Advanced
multi-level or rule-based approval engine. - Complete purchase
requisition, purchase order, supplier quotation, procurement workflow. -
Maintenance and spare-part management as a dedicated module. - Asset
management. - Integrated mining supply chain analytics. - Demand
forecasting or replenishment recommendation.

These belong to Advanced or later phases as described in the proposal.

## 4. Phase boundary

  Phase     Description                                  Demo status
  --------- -------------------------------------------- --------------
  Phase 1   Warehouse & Inventory                        In scope
  Phase 2   Procurement & Purchasing                     Out of scope
  Phase 3   Maintenance & Spare Part Management          Out of scope
  Phase 4   Operational & Asset Management               Out of scope
  Phase 5   Integrated Mining Supply Chain & Analytics   Out of scope

## 5. Feature priority

### P0 --- Must be demonstrable

-   Dashboard with six-site view and site filter.
-   Inventory list with stock by site.
-   Item detail with stock breakdown and movement history.
-   Inbound and outbound forms.
-   Complete transfer lifecycle.
-   Approval inbox.
-   Stock opname.
-   Minimum stock alerts.
-   Transaction history and filters.
-   Role switching and visible permissions.
-   Offline simulation for permitted operations.
-   Responsive layout and realistic sample data.

### P1 --- Important supporting capabilities

-   CSV export for reports and history.
-   Printable QR labels.
-   User and role management screen.
-   Supplier master data as reference information only.
-   Sync queue and last synced status.
-   Demo reset / restore seed data.
-   Static read-only API reference page (optional).

### P2 --- Polish

-   Command/search palette.
-   Keyboard-friendly forms.
-   Helpful empty states and contextual tips.
-   Print styles.
-   Subtle micro-interactions.

## 6. Demo versus production truth

  -----------------------------------------------------------------------
  Capability              Demo behavior           Production requirement
  ----------------------- ----------------------- -----------------------
  Authentication          Local role selector     Secure identity
                                                  provider/auth backend

  Authorization           Client-side             Server-side
                          route/action guards     authorization

  Data storage            LocalStorage or         Central database
                          IndexedDB               

  Multi-site data         One browser's local     Shared central data
                          sample dataset          

  Offline                 Browser-local queue     Durable offline
                          simulation              storage, conflict
                                                  strategy, sync service

  Approval                Local state transition  Server-side workflow
                                                  and audit

  Export                  Browser-generated CSV   Server-side reporting
                                                  as needed

  QR                      Generate/print labels   Stable item identity
                                                  and print templates

  API                     Static mock reference   Authenticated read-only
                                                  API implementation
  -----------------------------------------------------------------------

Never describe demo behavior as production-ready infrastructure.
