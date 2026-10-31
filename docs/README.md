# FPE Warehouse & Inventory Management --- Demo Documentation Kit

Dokumentasi kerja untuk membangun **frontend-only interactive demo**
paket Professional dari proposal Multi-Site Warehouse & Inventory
Management System untuk PT FAMOES PRATAMA ENGINEERING (FPE).

## Tujuan

Membantu AI Antigravity membangun prototype web yang: - Menampilkan
pengalaman aplikasi enterprise yang konsisten dan meyakinkan. -
Mendemonstrasikan pengendalian inventory lintas hingga enam site. -
Memperlihatkan workflow transfer barang dari request sampai receiving. -
Menampilkan role-based access, stock opname, minimum-stock alerts,
dashboard, reports, transaction history, QR label printing, dan simulasi
offline-first. - Dapat didemonstrasikan tanpa backend menggunakan data
simulasi yang konsisten.

## Cara menggunakan dokumen

Baca berurutan:

1.  `01-PRODUCT-BRIEF.md` --- konteks produk, tujuan demo, target
    pengguna.
2.  `02-SCOPE-FEATURE-MATRIX.md` --- batasan paket Professional dan
    daftar fitur.
3.  `03-UX-UI-DESIGN-SYSTEM.md` --- visual direction, komponen,
    responsive behavior.
4.  `04-INFORMATION-ARCHITECTURE.md` --- navigasi, route, struktur
    halaman.
5.  `05-BUSINESS-RULES-AND-WORKFLOWS.md` --- aturan bisnis dan alur
    transaksi.
6.  `06-DATA-MODEL-AND-MOCK-DATA.md` --- entitas, seed data, konsistensi
    angka.
7.  `07-DEMO-SCENARIOS-AND-ACCEPTANCE.md` --- skenario presentasi dan
    acceptance criteria.
8.  `08-ANTIGRAVITY-IMPLEMENTATION-GUIDE.md` --- instruksi eksekusi
    untuk AI Antigravity.
9.  `09-ASSUMPTIONS-AND-OPEN-DECISIONS.md` --- asumsi yang belum
    divalidasi.

## Prinsip penting

-   **Professional is the product boundary.** Jangan membangun fitur
    Advanced atau Phase 2--5 sebagai fitur aktif.
-   **Frontend-only means simulated behavior.** Gunakan local state dan
    local persistence. Jangan mengklaim ada backend, API server,
    database terpusat, autentikasi aman, atau sinkronisasi multi-device.
-   **Sample data is fictional.** Semua nama site, pengguna, stok,
    transaksi, KPI, dan angka pada demo harus diberi konteks sebagai
    data simulasi.
-   **Do not invent client facts.** Proposal menyebut hingga enam site,
    tetapi nama site, daftar item, saldo stok, dan approval matrix
    aktual perlu dikonfirmasi saat discovery.
-   **No false operational claims.** Status lintas site saat offline
    harus menampilkan last synced time dan pending queue.
-   **Keep the UI demonstrable.** Setiap tombol utama harus bekerja
    secara lokal atau diberi status disabled dengan alasan yang jelas.
    Hindari dead-end controls.

## Suggested build order

1.  Project shell, sidebar, header, role switcher, responsive layout.
2.  Dashboard + site filter + inventory list/detail.
3.  Inbound, outbound, transfer workflow.
4.  Approval inbox + role-based visibility.
5.  Stock opname.
6.  Reports + transaction history + export.
7.  Minimum stock notifications + QR print.
8.  Offline simulation + sync queue.
9.  Polish, empty/loading/error states, demo reset, QA.

## Source of truth

Proposal yang menjadi dasar:
`[DRAFT] PROPOSAL MULTI-SITE WAREHOUSE & INVENTORY MANAGEMENT SYSTEM`.

Jika ada konflik antara dokumen demo dan proposal, proposal menjadi
acuan ruang lingkup komersial. Dokumen ini menambahkan keputusan desain
untuk kebutuhan prototype; tambahan tersebut tidak otomatis menjadi
komitmen implementasi produksi.
