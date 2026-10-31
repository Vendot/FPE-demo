# 03 --- UX / UI Design System

## 1. Design direction

**Direction:** modern enterprise operations software --- clean, precise,
calm, data-dense but readable.

Avoid: - Consumer fintech look. - Excessive gradients, glassmorphism,
oversized cards, decorative illustrations. - Overly dark interface that
reduces table readability. - Tiny typography and dense unstructured
tables. - Generic dashboard full of meaningless charts.

The product should feel credible for engineering, mining,
heavy-equipment, and warehouse operations.

## 2. Suggested visual language

Palette (implementation may refine shades while preserving intent): -
Primary navy: `#17324D` --- sidebar, primary actions, headings. - Deep
navy: `#10263A` --- emphasis. - Accent teal: `#0F8B8D` ---
positive/active operations. - Background: `#F5F7FA`. - Surface:
`#FFFFFF`. - Border: `#E3E8EF`. - Text primary: `#172B3A`. - Text
secondary: `#64748B`. - Success: `#16845B`. - Warning: `#C98216`. -
Danger: `#C44949`. - Info: `#3478B8`.

Use semantic colors consistently. Do not rely on color alone to
communicate status.

## 3. Typography

-   Use a highly readable sans-serif (Inter or system sans).
-   Page title: 24--28px desktop, 21--24px mobile.
-   Section title: 16--18px.
-   Body: 14px.
-   Table: 13--14px.
-   Helper text: 12--13px.
-   Numeric KPI: 26--32px with tabular numerals.

## 4. Layout

### Desktop

-   Fixed/collapsible left sidebar: approximately 248px expanded.
-   Top bar: breadcrumb, global search, active site context, connection
    status, notification, profile/role.
-   Main content max width around 1440px; use available width for
    tables.
-   Page content padding 24--32px.
-   Use consistent 8px spacing scale.

### Tablet

-   Collapsible sidebar or drawer.
-   Preserve key table columns; allow horizontal scroll only where
    necessary.
-   Filters should wrap naturally.

### Mobile

-   Sidebar becomes drawer or bottom navigation for primary sections.
-   Forms use one column.
-   Tables become compact cards or horizontally scrollable with pinned
    primary identifier.
-   Primary actions remain reachable.
-   Show site context prominently.

## 5. Global application shell

Header should show: - Product name / FPE identity. - Current site
context: `All Sites` or selected site. - Connection state: `Online` /
`Offline`. - Pending sync count when relevant. - Notification center. -
Current demo user and role switcher.

Add a persistent small demo indicator such as `DEMO ENVIRONMENT` to
prevent sample data being mistaken for production.

## 6. Navigation proposal

1.  Overview
    -   Dashboard
2.  Inventory
    -   Items
    -   Stock by Site
    -   Goods Receiving
    -   Goods Issuing
    -   Stock Opname
3.  Transfers
    -   Transfer List
    -   Create Transfer
    -   Approval Inbox
4.  Reports
    -   Stock Report
    -   Transaction History
5.  Administration
    -   Sites & Warehouses
    -   Users & Roles
    -   QR Label Printing
6.  System
    -   Sync Center
    -   Demo Settings

Keep navigation labels in Bahasa Indonesia or concise bilingual labels
consistently. Recommended UI language: Bahasa Indonesia, with standard
technical terms retained where common (Dashboard, Stock Opname,
Transfer).

## 7. Component standards

Build reusable components: - `AppShell`, `Sidebar`, `Topbar`,
`PageHeader`. - `KpiCard`, `StatusBadge`, `SiteBadge`. - `DataTable`,
`TableToolbar`, `FilterBar`, `Pagination`. - `EmptyState`, `ErrorState`,
`Skeleton`. - `ConfirmDialog`, `Drawer`, `Toast`. - `FormField`,
`SearchSelect`, `QuantityInput`. - `StockLevelIndicator`,
`SyncStatusIndicator`. - `ActivityTimeline`, `ApprovalPanel`.

## 8. Status vocabulary

Use consistent labels: - Draft --- Draft - Pending Approval --- Menunggu
Persetujuan - Approved --- Disetujui - Rejected --- Ditolak - In Transit
--- Dalam Pengiriman - Partially Received --- Diterima Sebagian -
Completed --- Selesai - Cancelled --- Dibatalkan - Pending Sync ---
Menunggu Sinkronisasi - Synced --- Tersinkronisasi - Conflict --- Perlu
Rekonsiliasi

## 9. Form UX

-   Clearly mark required fields.
-   Show units beside quantity fields.
-   Validate quantity \> 0.
-   Prevent selecting the same source and destination site.
-   Show available stock before outbound or transfer request.
-   Explain why an action is disabled.
-   Confirm irreversible transitions.
-   Preserve form values after validation errors.
-   Display success feedback with a link to the created record.

## 10. Dashboard UX

Dashboard should answer: 1. How much stock is recorded across sites? 2.
Which site has the most stock risk? 3. Which items are below minimum? 4.
Which transfers need attention? 5. What has changed recently? 6. When
was cross-site data last synchronized?

Do not add stock value or stock aging widgets; these are Advanced scope.

## 11. Charts

Use only charts that answer operational questions: - Stock quantity by
site. - Inbound vs outbound movement over time. - Transfer status
distribution. - Low-stock items by site.

Charts must use the same underlying mock dataset as tables and KPI
cards. Avoid random chart values.

## 12. Accessibility

-   Semantic headings and form labels.
-   Keyboard navigation for menus, dialogs, and forms.
-   Visible focus states.
-   Contrast appropriate for small text.
-   Status text plus icon/shape, not color alone.
-   Respect reduced motion preferences.
