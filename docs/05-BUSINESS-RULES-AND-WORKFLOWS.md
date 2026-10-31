# 05 --- Business Rules & Workflows

## 1. General inventory rules

1.  Every stock balance belongs to an item and a site/warehouse.
2.  Every stock-changing operation creates a transaction record.
3.  Stock movement must be traceable by transaction ID, user, timestamp,
    type, site, quantity, and reference.
4.  Do not silently overwrite historical transactions.
5.  Quantity must be greater than zero.
6.  A stock balance must not become negative unless the final
    client-approved business rule explicitly allows it. Demo default:
    prevent negative stock.
7.  Distinguish:
    -   **On-hand:** quantity physically recorded at a site.
    -   **In transit:** quantity dispatched but not yet received at
        destination.
    -   **Available:** on-hand quantity not otherwise reserved/blocked.
        Professional proposal does not promise full reservation
        workflow; do not introduce a complex reservation engine.
8.  Cross-site dashboard data must show last sync time.
9.  All values in the demo are fictional.

## 2. Transfer workflow

Professional transfer lifecycle:

`Draft → Pending Approval → Approved → In Transit → Completed`

Alternative terminal state: `Rejected` or `Cancelled`.

### Step A --- Request

-   Requester selects source site and destination site.
-   Source and destination must differ.
-   Add one or more item lines.
-   Quantity must be positive.
-   Validate current source on-hand quantity.
-   Add business reason/reference.
-   Submit request; status becomes `Pending Approval`.

### Step B --- Approval

-   Authorized approver reviews request.
-   Approver can approve or reject.
-   Rejection requires a reason.
-   Approval action must create a timeline event.
-   Demo permission is role-based; exact role matrix is provisional.

### Step C --- Dispatch / shipment

-   Warehouse staff at source confirms dispatch.
-   Capture dispatch date/time and optional delivery reference.
-   Decrease source on-hand stock at dispatch.
-   Increase in-transit quantity.
-   Status becomes `In Transit`.
-   Dispatch cannot occur before approval.

### Step D --- Receiving

-   Destination warehouse confirms received quantity.
-   Received quantity cannot exceed dispatched quantity.
-   If received quantity equals dispatched quantity: status `Completed`.
-   If received quantity is lower: status `Partially Received`;
    remaining quantity is flagged for follow-up.
-   On receipt, reduce in-transit quantity and increase destination
    on-hand stock by received quantity.
-   Record receiver, timestamp, and note.
-   If discrepancy exists, preserve it in the transfer record.

### Stock accounting example

Initial: - Site A on-hand: 20 units - Site B on-hand: 5 units - In
transit: 0

Request 6 units A → B: - Before approval: no stock changes. - After
approval: no stock changes. - After dispatch: A = 14, B = 5, in transit
= 6. - After receiving 6: A = 14, B = 11, in transit = 0.

## 3. Goods receiving workflow

1.  Select receiving site.
2.  Select item.
3.  Enter quantity, date, reference/document, notes.
4.  Validate positive quantity.
5.  Save transaction.
6.  Increase on-hand stock at selected site.
7.  Add `GOODS_RECEIPT` ledger entry.
8.  If offline, save locally and mark `Pending Sync`; do not imply
    central stock has updated.

For demo simplicity, inbound may be recorded by a permitted warehouse
role. Whether receiving requires approval must be confirmed with FPE.

## 4. Goods issuing workflow

1.  Select issuing site.
2.  Select item.
3.  Display on-hand quantity.
4.  Enter quantity and purpose/reference.
5.  Validate quantity does not exceed available on-hand stock.
6.  Save transaction.
7.  Decrease on-hand stock.
8.  Add `GOODS_ISSUE` ledger entry.
9.  If offline, save locally and mark `Pending Sync`.

For demo simplicity, issue may be recorded by a permitted warehouse
role. Whether issue requires approval must be confirmed with FPE.

## 5. Stock opname workflow

1.  Create count session for a site.
2.  Add items to count.
3.  Display system quantity as a reference.
4.  Enter physical quantity.
5.  Calculate variance: `physical quantity - system quantity`.
6.  Submit count session.
7.  Review discrepancies.
8.  Apply approved adjustment to stock ledger.
9.  Preserve original system quantity, physical count, variance,
    reviewer, and timestamp.

Do not adjust stock merely because a count was entered; adjustment
should happen after the demo's review/approval step.

## 6. Minimum stock rules

-   Minimum stock is configured per item per site.
-   Alert condition: `onHand <= minimumStock`.
-   Alert should identify item, site, on-hand quantity, minimum
    threshold, and severity.
-   Do not aggregate away the site context.
-   Professional includes warnings below threshold per site. Do not
    build Advanced analytics or forecasting.

## 7. Approval and role rules (provisional demo matrix)

  -------------------------------------------------------------------------------
  Action                   Warehouse  Site Approver     Management          Admin
                               Staff                               
  ------------------- -------------- -------------- -------------- --------------
  View dashboard        Limited/site            Yes            Yes            Yes

  View inventory                Site         Site /      All sites      All sites
                                     assigned scope                

  Create                         Yes            Yes             No            Yes
  receiving/issuing                                                

  Create transfer                Yes            Yes             No            Yes
  request                                                          

  Approve/reject                  No            Yes      Read-only   Configurable
  transfer                                                         

  Dispatch transfer      Source site            Yes             No            Yes

  Confirm receiving      Destination            Yes             No            Yes
                                site                               

  Create stock opname            Yes            Yes             No            Yes

  Review/apply                    No            Yes      Read-only            Yes
  adjustment                                                       

  Manage master items             No        Limited             No            Yes

  View/export reports     Site scope     Site scope      All sites      All sites

  Manage users/roles              No             No             No            Yes
  -------------------------------------------------------------------------------

This matrix is only a prototype default. Proposal confirms role-based
approval but does not define exact permissions or separation-of-duties
policy. Validate before production.

## 8. Offline-first behavior

Proposal identifies these offline-supported activities: - Goods
receiving and issuing: local recording, sync when online. - Stock
opname: local count recording, reconciliation after sync. - Transfer:
record event locally; central status updates after sync.

Not available offline: - Approval transactions. - Current cross-site
dashboard.

Demo behavior: - Toggle Online/Offline in the top bar or Sync Center. -
When offline, permitted forms remain usable. - Newly created records
receive a local ID and `Pending Sync` state. - Pending records appear in
Sync Center. - Approval actions are disabled offline with an
explanation. - Cross-site data shows last synchronized timestamp and
stale-data warning. - When online, `Sync Now` simulates queue
processing. - Never claim this is real multi-device synchronization.

## 9. Conflict simulation

Provide one optional seeded conflict record: - A local transaction was
recorded using an older stock snapshot. - On reconnect, the demo flags a
conflict requiring review. - Do not silently overwrite either record. -
Provide a simple review panel explaining the discrepancy. - This is a
visual workflow simulation, not a complete distributed
conflict-resolution engine.

## 10. Audit trail

Each event should include: - Event ID. - Entity type and entity ID. -
Action. - Actor/user. - Site context. - Timestamp. - Before/after
summary when applicable. - Note/reason where relevant.

Transaction history is included in Professional. A more detailed
immutable change log is an Advanced distinction; do not present the demo
as implementing a production-grade immutable audit system.
