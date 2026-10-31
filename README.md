# FPE Multi-Site Warehouse & Inventory Management System (Demo Prototype)

Interactive frontend-only prototype paket **Professional** dari proposal Multi-Site Warehouse & Inventory Management System untuk **PT FAMOES PRATAMA ENGINEERING (FPE)**.

> **Catatan Demo:** Seluruh data dalam prototipe ini adalah **data simulasi** untuk keperluan presentasi komersial & operasional, bukan data riil perusahaan. Tidak ada backend terpusat atau API server aktif; seluruh state dikelola dan dipersistensikan secara lokal pada browser (LocalStorage).

---

## 🚀 Cara Menjalankan Aplikasi

Pastikan Node.js (v18+) dan npm telah terpasang di sistem Anda.

1. **Install dependensi:**
   ```bash
   npm install
   ```

2. **Jalankan dev server:**
   ```bash
   npm run dev
   ```

3. Buka browser pada alamat:
   **`http://localhost:5173`** (atau `http://127.0.0.1:5173`)

4. **Build untuk produksi:**
   ```bash
   npm run build
   ```

5. **Jalankan verifikasi test cases otomatis (TC-01 s.d. TC-16):**
   ```bash
   npx tsx verify-scenarios.ts
   ```

---

## 🎯 Panduan Persona Demo & Hak Akses (RBAC)

Di pojok kanan atas aplikasi terdapat **Role Switcher** untuk mensimulasikan kontrol otorisasi:

| Nama Pengguna | Role | Lingkup Site | Kewenangan Utama |
|---|---|---|---|
| **Demo Administrator** | `ADMIN` | Semua 6 Site | Akses penuh seluruh modul, approval transfer, penyesuaian opname, konfigurasi |
| **Rudi Warehouse** | `WAREHOUSE_STAFF` | Site 01 (Ketapang) | Input penerimaan/pengeluaran barang, ajukan transfer, dispatch & receive, hitung opname fisik |
| **Siti Approver** | `SITE_APPROVER` | Site 01 & Site 02 | Otorisasi persetujuan / penolakan transfer (Approval Inbox), setujui penyesuaian stock opname |
| **Budi Management** | `MANAGEMENT` | Semua 6 Site | Read-only konsolidasian: Dashboard eksekutif, Laporan Stok lintas site, Riwayat Transaksi |

---

## 🔄 Simulasi Offline-First & Sinkronisasi

Di topbar terdapat tombol **Online / Simulasi Offline**:
- **Saat Mode Offline Aktif:**
  - Banner peringatan data *stale* muncul.
  - Staf gudang tetap dapat mencatat **Goods Receiving**, **Goods Issuing**, dan **Stock Opname**. Transaksi ini otomatis masuk ke **Pending Sync Queue** dengan status *Pending Sync*.
  - Tindakan persetujuan transfer (**Approval**) otomatis dinonaktifkan dengan penjelasan pencegahan inkonsistensi multi-site.
- **Saat Kembali Online:**
  - Masuk ke menu **System > Sync Center**.
  - Klik **"Sinkronisasi Sekarang"** untuk memproses antrean transaksi lokal ke buku besar pusat.
  - Terdapat contoh kasus **Konflik Sinkronisasi** (stok habis saat offline) yang dapat di-review transparan.

---

## 📋 Skenario Presentasi Klien (8–12 Menit)

1. **Dashboard Konsolidasi 6 Site:**
   - Tunjukkan metrik gabungan (SKU, Total Unit Tercatat, Item di Bawah Minimum).
   - Tunjukkan tabel ringkasan 6 site (Site 01 Ketapang s.d. Site 06 Sandai).
   - Gunakan filter site di topbar untuk menunjukkan isolasi data per lokasi operasional.
2. **Katalog Item & Matriks Stok:**
   - Buka **Item Master > Hydraulic Filter (SP-0001)**.
   - Perlihatkan perbandingan saldo fisik: Site 01 rendah (2 unit, min: 5), sedangkan Site 02 surplus (12 unit).
   - Tunjukkan label QR yang otomatis ter-generate dan siap dicetak ke PDF/stiker.
3. **Alur Transfer Antar-Site (End-to-End):**
   - Buat permohonan transfer 4 unit dari Site 02 ke Site 01.
   - Ganti role ke **Siti Approver** -> Buka **Approval Inbox** -> Klik **Setujui (Approve)**.
   - Ganti role ke **Rudi Warehouse** di Site Asal -> Klik **Konfirmasi Dispatch (Kirim Barang)**. Perhatikan stok Site 02 berkurang dan masuk ke *In-Transit*.
   - Konfirmasi penerimaan di Site Tujuan (**Receive**) -> Stok Site 01 bertambah menjadi 6 unit dan status transfer menjadi *Completed*.
4. **Stock Opname & Rekonsiliasi Fisik:**
   - Buka **Inventory > Stock Opname** -> Buat sesi perhitungan fisik di Site 01.
   - Masukkan selisih hitungan fisik -> Submit -> Approver menyetujui penyesuaian -> Saldo buku besar ter-update.
5. **Pelaporan & Audit Trail:**
   - Buka **Reports > Laporan Stok** & **Riwayat Transaksi**.
   - Terapkan filter lalu klik **Ekspor CSV** untuk mendemonstrasikan integrasi spreadsheet.

---

## 🛡️ Batasan Ruang Lingkup (Scope Guard)

Prototipe ini secara ketat mematuhi batasan paket **Professional (Phase 1)**:
- ❌ Tidak menyertakan modul pengadaan komprehensif (PO/PR/Vendor Quotation - Phase 2).
- ❌ Tidak menyertakan modul breakdown pemeliharaan unit alat berat (Phase 3).
- ❌ Tidak menyertakan valuasi nilai persediaan finansial (Valuation) atau stock aging / dead stock (fitur paket Advanced).
- ❌ Tidak menggunakan camera smartphone scanner langsung (menggunakan cetak label QR untuk scanner industri).
