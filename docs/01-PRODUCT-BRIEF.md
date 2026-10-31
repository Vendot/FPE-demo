# 01 --- Product Brief

## 1. Product overview

**Nama produk demo:** FPE Warehouse & Inventory Management System\
**Client context:** PT FAMOES PRATAMA ENGINEERING\
**Provider context:** Fikri & Partners\
**Commercial package represented:** Professional --- Rp68.000.000 (belum
termasuk PPN, sesuai proposal)\
**Product type:** Web-based multi-site warehouse and inventory
management application\
**Demo type:** Interactive frontend prototype with simulated data and
behavior.

Sistem ditujukan untuk menyatukan pencatatan inventory hingga enam site
dalam satu antarmuka. Fokus utamanya bukan sekadar mengetahui total stok
perusahaan, melainkan memahami **barang apa yang tersedia, berada di
site mana, berapa jumlahnya, dan apakah barang tersebut benar-benar siap
digunakan atau dipindahkan**.

## 2. Business problem

Proposal mengidentifikasi kondisi dan hipotesis masalah berikut.
Hipotesis perlu divalidasi bersama FPE saat discovery dan tidak boleh
ditampilkan sebagai fakta terkonfirmasi:

-   Pencatatan stok mungkin masih tersebar di spreadsheet, buku, atau
    media lain.
-   Informasi transfer antar-site mungkin masih dikoordinasikan melalui
    chat atau telepon.
-   Pembelian darurat mungkin terjadi karena stok di site lain tidak
    terlihat.
-   Penyusunan laporan konsolidasi mungkin membutuhkan penggabungan data
    manual.
-   Konektivitas internet di sebagian lokasi berpotensi tidak stabil.

Konsekuensi bisnis yang ingin dikurangi: - Pembelian darurat yang
sebenarnya dapat dihindari. - Waktu administrasi untuk mencari,
mencocokkan, dan merekap data. - Keterlambatan pekerjaan akibat material
atau suku cadang tidak tersedia. - Selisih antara catatan sistem dan
stok fisik. - Ketidakjelasan status barang yang sedang ditransfer.

## 3. Product vision

Memberikan satu sumber informasi inventory yang mudah digunakan oleh
staff gudang, penanggung jawab site, dan manajemen untuk memantau stok
serta mengendalikan perpindahan barang lintas site.

## 4. Demo objectives

Pada akhir demo, stakeholder harus dapat memahami bahwa aplikasi
memungkinkan mereka:

1.  Melihat posisi stok gabungan dan stok per site.
2.  Menemukan item yang tersedia di site lain.
3.  Mencatat barang masuk dan barang keluar.
4.  Membuat transfer request antar-site.
5.  Menyetujui atau menolak transaksi sesuai role.
6.  Memantau proses transfer sampai barang diterima.
7.  Melakukan stock opname dan melihat selisih.
8.  Mengetahui item yang berada di bawah minimum stock.
9.  Melihat riwayat transaksi dengan filter dan ekspor.
10. Melakukan pencatatan lokal untuk aktivitas tertentu ketika demo
    berada pada mode offline, kemudian mensimulasikan proses
    sinkronisasi saat online kembali.

## 5. Target users

  -----------------------------------------------------------------------
  User persona            Primary need            Typical activities
  ----------------------- ----------------------- -----------------------
  Management              Melihat kondisi         Dashboard, laporan,
                          inventory lintas site   tren transaksi, alert

  Site Manager / Approver Mengendalikan transaksi Review dan approval
                          di site                 transaksi, monitor
                                                  transfer

  Warehouse Staff         Mencatat aktivitas      Inbound, outbound,
                          gudang dengan cepat     transfer
                                                  dispatch/receive, stock
                                                  opname

  System Administrator    Mengelola konfigurasi   Master item, site,
                          dasar dan pengguna      user, role, minimum
                                                  stock
  -----------------------------------------------------------------------

Nama role dan kewenangan di atas adalah rancangan demo. Approval matrix
aktual harus dikonfirmasi dengan FPE.

## 6. Package positioning

Professional adalah paket kontrol inventory lintas lokasi. Pembeda
utamanya: - Transfer antar-site dengan request, approval, shipment,
receiving, dan status. - Persetujuan berbasis role untuk transaksi
utama. - Peringatan ketika stok berada di bawah ambang minimum per
site. - Dashboard manajemen dan laporan lintas site. - Riwayat transaksi
lengkap dengan filter dan ekspor. - QR label yang dapat dicetak sebagai
PDF. - Read-only API terdokumentasi (untuk produk implementasi; demo
hanya boleh menampilkan mock documentation bila diperlukan). -
Offline-first untuk transaksi tertentu.

## 7. Product principles

-   Operational clarity over decorative dashboards.
-   Fast data entry for warehouse staff.
-   Explicit site context on every stock-related screen.
-   Clear transaction status and audit trail.
-   Never confuse total stock with available stock.
-   Show last synchronization timestamp.
-   Make approvals and restricted actions understandable.
-   Use realistic but fictional sample data.

## 8. Success criteria for the demo

Demo dianggap berhasil bila presenter dapat menyelesaikan skenario
end-to-end transfer antar-site tanpa kebingungan, menunjukkan stok
berubah sesuai status transaksi, mengganti role untuk memperlihatkan
kontrol akses, dan memperlihatkan simulasi offline yang tidak
menyesatkan.
