# 08 --- Antigravity Implementation Guide

## 1. Mission

Build a polished, interactive, frontend-only demo of the FPE Warehouse &
Inventory Management System for the Professional package. Follow the
other documents in this kit as the product specification.

The output must be a usable web application, not a static mockup.

## 2. Before coding

1.  Inspect the repository and identify its current framework, package
    manager, routing, styling, and existing components.
2.  Preserve an existing working stack unless there is a strong
    technical reason to change it.
3.  If the repository is empty, use a modern React + TypeScript + Vite
    setup with Tailwind CSS (or the project's existing styling
    convention).
4.  Use the existing router if present; otherwise use React Router.
5.  Do not add a backend, hosted database, or external service.
6.  Summarize the discovered structure and propose a concise
    implementation plan before making broad changes.

## 3. Architecture expectations

Suggested structure (adapt to repository conventions):

``` text
src/
  app/
    App.tsx
    router.tsx
    providers/
  components/
    layout/
    data-display/
    forms/
    feedback/
    inventory/
    transfers/
  features/
    dashboard/
    inventory/
    receiving/
    issuing/
    transfers/
    approvals/
    stock-opname/
    reports/
    administration/
    sync/
  data/
    seed/
    repositories/
  domain/
    types/
    rules/
    services/
  hooks/
  lib/
  styles/
```

Separate: - UI components. - Domain types. - Business rules. - Seed
data. - Local persistence. - Demo session / role state.

Do not place all application logic in one component.

## 4. State and persistence

-   Use a centralized state approach appropriate to the project size
    (Context + reducer, Zustand, or existing state library).
-   Keep stock mutation rules in domain/service functions, not in table
    components.
-   Persist local demo state with IndexedDB or LocalStorage.
-   Add seed versioning and reset functionality.
-   Derive dashboard KPIs and report rows from canonical application
    state.
-   Ensure every mutation updates transaction history consistently.

## 5. Functional requirements

Implement the full flows specified in: -
`05-BUSINESS-RULES-AND-WORKFLOWS.md` -
`07-DEMO-SCENARIOS-AND-ACCEPTANCE.md`

At minimum, make these actions genuinely interactive: - Site filter. -
Role switcher. - Item search and filters. - Goods receiving. - Goods
issuing. - Transfer request. - Approve/reject. - Dispatch. - Receive
full/partial quantity. - Stock opname and adjustment review. - CSV
export. - QR label print. - Offline toggle and sync simulation. - Reset
demo data.

No primary action should be a decorative button.

## 6. Business logic constraints

-   Prevent negative stock by default.
-   Validate transfer quantities against source stock.
-   Do not update stock at request or approval stage.
-   On dispatch: decrement source on-hand and increase in-transit.
-   On receipt: decrease in-transit and increase destination on-hand by
    actual received quantity.
-   Prevent received quantity from exceeding dispatched quantity.
-   Partial receipt must remain visible and actionable.
-   Stock opname adjustment occurs only after review/apply.
-   Minimum stock is per item per site.
-   Offline approval is blocked.
-   Pending offline records must be visibly queued.
-   Never present stale cross-site values as real-time.

## 7. Visual quality requirements

-   Follow `03-UX-UI-DESIGN-SYSTEM.md`.
-   Create a cohesive enterprise application shell.
-   Use consistent spacing, typography, semantic colors, and status
    badges.
-   Prioritize table readability and clear site context.
-   Use realistic sample content, not lorem ipsum.
-   Provide responsive desktop/tablet/mobile layouts.
-   Include empty, validation, success, and error states.
-   Use charts only when they add operational meaning.

## 8. Demo-specific behavior

-   Show `DEMO ENVIRONMENT` or equivalent.
-   Show sample-data disclaimer.
-   Role switcher is a demo utility, not secure authentication.
-   Offline switch simulates a disconnected browser; it does not
    actually disconnect the network.
-   Sync simulation processes local pending queue only.
-   API reference, if built, is static documentation only.
-   QR print must not imply camera scanning is included.

## 9. Implementation workflow

Work in small verifiable milestones:

### Milestone 1 --- Foundation

-   App shell, route structure, navigation, theme.
-   Demo role selector and site context.
-   Seed data and persistence.
-   Responsive baseline.

### Milestone 2 --- Inventory

-   Dashboard.
-   Item list/detail.
-   Stock by site.
-   Goods receiving/issuing.

### Milestone 3 --- Transfer controls

-   Transfer list/create/detail.
-   Approval inbox.
-   Dispatch and receiving lifecycle.
-   Event timeline.

### Milestone 4 --- Control & visibility

-   Stock opname.
-   Minimum-stock alerts.
-   Reports and transaction history.
-   CSV export.
-   QR print.

### Milestone 5 --- Offline & polish

-   Offline simulation.
-   Pending sync queue.
-   Conflict example.
-   Demo reset.
-   Responsive and interaction QA.

After each milestone: 1. Run the project. 2. Check routes and primary
interactions. 3. Fix TypeScript/lint/build errors. 4. Verify
calculations against seed data. 5. Summarize completed work and
remaining issues.

## 10. Do not

-   Do not invent production API endpoints.
-   Do not create a real authentication claim.
-   Do not create a purchase order/procurement module.
-   Do not add Advanced features.
-   Do not add Phase 2--5 modules.
-   Do not use random KPI values disconnected from seed data.
-   Do not silently mutate stock.
-   Do not let every role perform every action.
-   Do not claim actual offline synchronization across devices.
-   Do not remove existing project functionality without a clear reason.

## 11. Final delivery checklist

Before declaring complete: - App starts with documented command. - Main
routes load without errors. - Core demo scenario can be completed
end-to-end. - All primary controls work. - Seed data is internally
consistent. - Reset demo works. - Responsive behavior is acceptable. -
No Advanced/Phase 2+ scope has leaked into the active product. - README
explains how to run and how to use demo roles/offline simulation.
