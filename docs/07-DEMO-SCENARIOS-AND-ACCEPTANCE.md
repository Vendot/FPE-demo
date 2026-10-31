# 07 --- Demo Scenarios & Acceptance Criteria

## 1. Recommended client presentation flow (8--12 minutes)

### Opening --- operational visibility

1.  Open Dashboard.
2.  Show six-site summary.
3.  Point out low-stock items and transfer statuses.
4.  Explain that total company stock does not always mean an item is
    operationally available at the site that needs it.
5.  Open Hydraulic Filter detail and compare balances across sites.

Narrative: Site 01 has low stock, while Site 02 has available units. The
system makes that visibility explicit.

### Transfer lifecycle

1.  Switch to Warehouse Staff at Site 01.
2.  Create transfer request from Site 02 to Site 01 for Hydraulic
    Filter.
3.  Submit request.
4.  Switch to Site Approver.
5.  Open Approval Inbox and approve.
6.  Switch to Warehouse Staff at source Site 02.
7.  Dispatch the transfer.
8.  Switch to destination Site 01 and confirm receiving.
9.  Return to dashboard and item detail; verify updated stock and
    transaction history.

### Stock opname

1.  Open Stock Opname.
2.  Create count session for Site 01.
3.  Enter a physical quantity that differs from system quantity.
4.  Submit for review.
5.  Approve/apply adjustment.
6.  Show variance and ledger history.

### Offline-first simulation

1.  Toggle demo to Offline.
2.  Attempt to open Approval Inbox action; show it is unavailable
    offline.
3.  Record a permitted goods issue or stock count.
4.  Show `Pending Sync` queue.
5.  Show dashboard's last synced timestamp and stale-data warning.
6.  Toggle Online and select `Sync Now`.
7.  Show queued transaction as synced.

### Management reporting

1.  Switch to Management.
2.  Open cross-site Stock Report.
3.  Filter by site/category.
4.  Export CSV.
5.  Open Transaction History and filter by transfer or goods issue.

## 2. Acceptance criteria

### Application shell

-   [ ] All main pages share the same sidebar and topbar.
-   [ ] Current role and site context are visible.
-   [ ] Demo environment indicator is visible.
-   [ ] Online/offline state is visible.
-   [ ] Responsive layout works at desktop, tablet, and mobile widths.

### Dashboard

-   [ ] Six sites are represented.
-   [ ] Site filter changes the visible data.
-   [ ] KPI cards derive from seed data.
-   [ ] Low-stock alerts link to relevant item/site.
-   [ ] Pending and in-transit transfers are shown.
-   [ ] Last sync timestamp is visible.
-   [ ] No Advanced-only analytics are displayed.

### Inventory

-   [ ] Search by item name, code, and part number works.
-   [ ] Category and site filters work.
-   [ ] Item detail shows stock per site.
-   [ ] Minimum stock status is calculated per item/site.
-   [ ] Goods receiving increases the selected site's stock.
-   [ ] Goods issuing decreases stock and prevents negative balance.
-   [ ] Every successful stock change creates a history record.

### Transfer

-   [ ] Source and destination cannot be the same.
-   [ ] Request requires at least one valid item line.
-   [ ] Request cannot exceed source stock.
-   [ ] New request appears in Pending Approval.
-   [ ] Only permitted role can approve/reject.
-   [ ] Rejection requires a reason.
-   [ ] Dispatch requires approved status.
-   [ ] Dispatch moves stock from on-hand to in-transit.
-   [ ] Receiving updates destination stock and in-transit balance.
-   [ ] Partial receiving is represented correctly.
-   [ ] Transfer timeline shows actor and timestamp.

### Stock opname

-   [ ] Count session is site-specific.
-   [ ] Physical count can differ from system quantity.
-   [ ] Variance is calculated correctly.
-   [ ] Adjustment requires review/approval.
-   [ ] Applied adjustment updates stock and transaction history.

### Reporting

-   [ ] Filters update report rows.
-   [ ] CSV export downloads the currently filtered rows.
-   [ ] Export includes relevant identifiers, date, site, item,
    quantity, type, and actor.
-   [ ] No stock valuation or stock aging report exists.

### QR label

-   [ ] User can select items.
-   [ ] Label includes item code and name.
-   [ ] QR content identifies the demo item.
-   [ ] Print layout is usable and can be saved as PDF through browser
    print.
-   [ ] No camera scanning workflow is implemented.

### Offline simulation

-   [ ] Offline mode is clearly indicated.
-   [ ] Allowed local operations can be recorded.
-   [ ] Approval actions are unavailable offline.
-   [ ] Pending queue is visible.
-   [ ] Cross-site data is marked potentially stale.
-   [ ] Online sync action updates queue state.
-   [ ] No claim of real multi-device sync is made.

### Roles

-   [ ] Role switcher changes visible permissions.
-   [ ] Unauthorized actions are hidden or disabled with explanation.
-   [ ] Management role is read-only.
-   [ ] Role switching is visibly marked as demo functionality.

### Quality

-   [ ] No dead buttons in primary flows.
-   [ ] Forms validate required fields.
-   [ ] Empty states, loading states, and error feedback are present.
-   [ ] No console errors during core demo flow.
-   [ ] Reset demo restores a known initial state.

## 3. Test cases

  -----------------------------------------------------------------------
  ID                      Scenario                Expected result
  ----------------------- ----------------------- -----------------------
  TC-01                   Search item by part     Matching item appears
                          number                  

  TC-02                   Filter stock by Site 01 Only Site 01 balances
                                                  shown

  TC-03                   Issue more than on-hand Validation prevents
                                                  save

  TC-04                   Create transfer same    Validation prevents
                          source/destination      submit

  TC-05                   Approve pending         Status becomes Approved
                          transfer as approver    

  TC-06                   Approve as warehouse    Action unavailable
                          staff                   

  TC-07                   Dispatch approved       Source decreases,
                          transfer                in-transit increases

  TC-08                   Receive dispatched      Destination increases,
                          transfer                in-transit decreases

  TC-09                   Receive more than       Validation prevents
                          dispatched              save

  TC-10                   Reject transfer without Validation requires
                          reason                  reason

  TC-11                   Apply stock opname      Balance and ledger
                          adjustment              update

  TC-12                   Offline goods issue     Local record queued as
                                                  Pending Sync

  TC-13                   Offline approval        Action blocked with
                          attempt                 explanation

  TC-14                   Sync pending records    Queue state becomes
                                                  Synced

  TC-15                   Export filtered report  CSV contains filtered
                                                  rows only

  TC-16                   Reset demo              Seed state restored
  -----------------------------------------------------------------------

## 4. Demo safeguards

-   Add `Reset Demo` action with confirmation.
-   Add a small banner: `Data simulasi — bukan data operasional FPE`.
-   Do not include real company-sensitive data.
-   Do not show a fake "connected to FPE server" status.
-   Do not fabricate real KPI improvements or savings.
