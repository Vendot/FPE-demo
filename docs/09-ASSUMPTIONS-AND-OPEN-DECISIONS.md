# 09 --- Assumptions & Open Decisions

## 1. Why this document exists

Proposal intentionally leaves several operational details for discovery.
The demo needs reasonable defaults, but defaults must not be mistaken
for confirmed FPE requirements.

## 2. Assumptions used by the prototype

  -----------------------------------------------------------------------
  Topic                   Demo assumption         Must be validated
  ----------------------- ----------------------- -----------------------
  Number of sites         Six demo sites          Actual active sites and
                                                  rollout sequence

  Site names              Site 01--Site 06        Official site and
                                                  warehouse names

  Warehouse structure     One logical warehouse   Multiple
                          per site                warehouses/storage
                                                  locations per site

  Item master             10 fictional items      Actual item categories,
                                                  codes, part numbers,
                                                  units

  Stock data              Fictional opening       Actual opening stock
                          balances                and reconciliation
                                                  method

  Roles                   Admin, Warehouse Staff, Actual organization and
                          Site Approver,          approval matrix
                          Management              

  Transfer approval       Site Approver can       Who approves
                          approve                 source/destination
                                                  transfer

  Goods receipt approval  Direct save for demo    Whether receiving needs
                                                  approval

  Goods issue approval    Direct save for demo    Whether issue needs
                                                  approval

  Negative stock          Prevented               Final policy for
                                                  exceptional cases

  Partial receiving       Supported in demo       Actual discrepancy and
                                                  claim process

  Offline transfer        Record local event;     Exact offline events
                          update central status   and conflict policy
                          after sync              

  Offline persistence     Browser-local           Device/browser
                                                  constraints and data
                                                  retention

  QR label                Printable label with    Label size, encoding,
                          item identifier         printer requirements

  API                     Static reference only   Actual API consumers,
                          in demo                 auth, schema, rate
                                                  limits

  Report export           CSV                     Required Excel/PDF
                                                  templates

  User devices            Responsive browser      Desktop/mobile
                                                  availability per site
  -----------------------------------------------------------------------

## 3. Important discovery questions

### Organization and sites

1.  What are the official names and codes of all active sites?
2.  Does each site have one warehouse or multiple storage locations?
3.  Are there central warehouses or transit locations?

### Item master

4.  Which item types are included in the first rollout?
5.  Which fields are mandatory: item code, part number, category, unit,
    brand, specification?
6.  Are there duplicate codes or inconsistent units?
7.  Are serial number, batch, or expiry-date tracking required? These
    are not assumed in this demo.

### Stock rules

8.  Can stock ever go negative?
9.  Is minimum stock configured per item per site?
10. How are damaged, reserved, borrowed, or currently used items
    represented?
11. Is in-transit stock counted in company-wide stock summaries?

### Workflow and approval

12. Which transactions require approval?
13. Who can request, approve, dispatch, and receive transfers?
14. Can the requester approve their own request?
15. How are partial receiving, missing goods, and damaged goods handled?
16. Are there approval limits by quantity, item category, or site?

### Offline and synchronization

17. Which exact operations must work offline?
18. Which devices and browsers are used?
19. How long may a device remain offline?
20. What should happen when two offline users create conflicting
    transactions?
21. What is the agreed rule when a queued transaction would cause
    negative stock?

### Reporting and integration

22. What reports are required by management?
23. Are exports required in Excel or PDF templates?
24. Which systems may consume the read-only API?
25. What authentication and network restrictions apply to the API?

### Infrastructure and security

26. Is cloud hosting allowed or is on-premise deployment required?
27. Are there company policies for user access, password, backup, and
    retention?
28. Are shared devices used at warehouses?
29. What audit information must be retained?

## 4. Decisions that should not be silently made by AI

AI Antigravity must not decide these as confirmed business rules: -
Exact approval hierarchy. - Whether receiving/issuing requires
approval. - Whether partial receiving closes a transfer or creates a
remainder transfer. - Whether negative stock is allowed. - Whether items
require serial/batch tracking. - Whether a site contains multiple
warehouses. - Final offline conflict resolution. - Final data retention
and security policies.

For the demo, use the defaults documented elsewhere and label them as
demo assumptions.

## 5. Proposal-derived facts versus demo choices

### Directly supported by proposal

-   Phase 1 focuses on Warehouse & Inventory.
-   System is web-based and centralized for up to six sites.
-   Professional price is Rp68 million, excluding VAT.
-   Professional includes transfer request, approval, shipment,
    receiving, and status.
-   Role-based approval for main transactions.
-   Minimum-stock warning per site.
-   Management dashboard and cross-site reports.
-   Complete transaction history with filters and export.
-   Printable QR labels.
-   Read-only documented API.
-   Selected transactions can be recorded offline and synchronized
    later.
-   Approval and current cross-site dashboard are unavailable offline.
-   Procurement workflow, inventory value, stock aging, slow-moving
    analysis, and camera scanning are outside Professional.

### Added for frontend demo

-   Fictional site names and item master.
-   Sample stock balances and transfer records.
-   Demo personas and provisional role matrix.
-   Specific route names and page composition.
-   Local browser persistence.
-   Offline toggle and simulated sync queue.
-   Example conflict case.
-   Static API reference page (optional).
-   UI colors, typography, and component design.

These added decisions are prototype scaffolding, not client-approved
requirements.
