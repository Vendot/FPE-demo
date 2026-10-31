# 04 --- Information Architecture & Routes

## 1. Route map

Suggested routes (adapt to the repository's existing router if one
exists):

  ---------------------------------------------------------------------------
  Route                       Page                    Purpose
  --------------------------- ----------------------- -----------------------
  `/login`                    Demo Login              Choose a demo persona

  `/dashboard`                Dashboard               Management overview

  `/inventory/items`          Item List               Search and manage items

  `/inventory/items/:id`      Item Detail             Stock by site and
                                                      movement timeline

  `/inventory/stock`          Stock by Site           Browse balances by
                                                      item/site

  `/inventory/receiving`      Goods Receiving         Inbound records

  `/inventory/issuing`        Goods Issuing           Outbound records

  `/inventory/stock-opname`   Stock Opname            Count sessions and
                                                      discrepancies

  `/transfers`                Transfer List           All transfer requests
                                                      and statuses

  `/transfers/new`            Create Transfer         Request a new transfer

  `/transfers/:id`            Transfer Detail         Timeline and actions

  `/approvals`                Approval Inbox          Approve/reject pending
                                                      requests

  `/reports/stock`            Stock Report            Cross-site stock report

  `/reports/transactions`     Transaction History     Filter and export
                                                      movement history

  `/admin/sites`              Sites & Warehouses      Six demo site records

  `/admin/users`              Users & Roles           Demo user management

  `/admin/qr-labels`          QR Label Printing       Select items and print
                                                      labels

  `/system/sync`              Sync Center             Offline queue and sync
                                                      simulation

  `/system/demo-settings`     Demo Settings           Reset seed data and
                                                      scenario controls

  `/system/api-reference`     API Reference           Static read-only API
                              (optional)              documentation mock
  ---------------------------------------------------------------------------

## 2. Navigation hierarchy

### Overview

-   Dashboard

### Inventory

-   Items
-   Stock by Site
-   Goods Receiving
-   Goods Issuing
-   Stock Opname

### Transfers

-   Transfer List
-   Approval Inbox

### Reports

-   Stock Report
-   Transaction History

### Administration

-   Sites & Warehouses
-   Users & Roles
-   QR Label Printing

### System

-   Sync Center
-   Demo Settings
-   API Reference (optional)

## 3. Page-level requirements

### Dashboard

-   Global filters: date range, site, category.
-   KPI cards: total SKUs, total recorded units, low-stock item-site
    combinations, pending approvals, transfers in transit.
-   Site summary table.
-   Low-stock alert list.
-   Transfer status overview.
-   Recent transactions.
-   Last sync timestamp and stale-data indicator.

Important: `total recorded units` is a unit count, not inventory
valuation. Do not label it as total inventory value.

### Item list

Columns: - Item code - Item name - Part number - Category - Unit - Total
recorded stock - Number of sites with stock - Status / minimum-stock
indicator - Actions

Filters: - Site - Category - Stock status - Search by code/name/part
number

### Item detail

-   Item identity and description.
-   Stock balance per site.
-   Available / in-transit quantities where applicable.
-   Minimum stock per site.
-   Movement history.
-   Related transfers.
-   QR label print action.

### Stock by site

-   Matrix/table: item rows and site columns, or site-filtered table.
-   Site selector.
-   Search and category filters.
-   Highlight low stock.
-   Show last updated.

### Goods receiving

-   Create receiving record.
-   Select site, item, quantity, reference/document number, date, notes.
-   In online mode, follow configured approval policy if applicable.
-   In offline mode, permit local recording according to offline rules.
-   Show receiving history.

### Goods issuing

-   Create issuing record.
-   Select site, item, quantity, purpose/reference, date, notes.
-   Validate against available local stock.
-   In offline mode, queue local record and mark pending sync.
-   Show issuing history.

### Transfers

List: - Transfer number - Source site - Destination site - Item count -
Requested by - Current status - Created date - Next action / owner

Detail: - Item lines and quantities. - Source and destination. -
Requester. - Approval decision and note. - Dispatch information. -
Receiving confirmation and discrepancy. - Event timeline.

### Approval inbox

-   Pending requests assigned to current role.
-   Request detail and stock context.
-   Approve/reject with mandatory rejection reason.
-   Prevent self-approval in demo unless an explicit override is
    documented as a demo assumption.

### Stock opname

-   Create session by site.
-   Select item scope (all items or selected category/items).
-   Enter physical counts.
-   Calculate variance against system quantity.
-   Submit for review.
-   Apply approved adjustment to demo stock ledger.
-   Preserve count session history.

### Reports

-   Stock report by site/item/category.
-   Transaction report by date/type/site/item/user.
-   Export filtered rows as CSV.
-   Show report generation timestamp.
-   Do not include stock value or aging reports.

### QR label printing

-   Select one or more items.
-   Display item code, name, part number, and QR containing a stable
    demo item identifier or item route.
-   Provide print-friendly layout.
-   Use browser print dialog; user may choose Save as PDF.
-   Do not implement camera scanning in Professional.

### Sync center

-   Online/offline toggle for demo.
-   Pending transaction queue.
-   Per-record sync status.
-   Last successful sync timestamp.
-   Sync now action when online.
-   Conflict state example and review explanation.
-   Clearly state this is a single-browser simulation.

## 4. Global interaction behavior

-   Changing site context updates every relevant page.
-   Clicking an item opens item detail.
-   Clicking a transfer opens transfer detail.
-   Dashboard alert links to filtered item list.
-   Approval action updates transfer state and timeline.
-   Receiving a transfer updates destination stock and transfer status.
-   CSV export respects current filters.
-   Demo reset restores initial seed data.
