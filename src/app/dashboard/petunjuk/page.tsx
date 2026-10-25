'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Printer,
  ChevronDown,
  ChevronUp,
  Package,
  ShoppingCart,
  Bot,
  Users,
  Wallet,
  LineChart,
  Building2,
  ExternalLink,
  Keyboard,
  Compass,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  RotateCcw,
  Check
} from 'lucide-react';

interface WorkflowStep {
  step: number;
  title: string;
  shortDesc: string;
  role: string;
  badge: string;
  color: string;
  route: string;
  routeName: string;
  inputs: string[];
  processes: string[];
  outputs: string[];
  proTips: string;
}

interface ModuleGuide {
  id: string;
  title: string;
  category: string;
  icon: any;
  color: string;
  route: string;
  description: string;
  keyFeatures: string[];
  steps: { title: string; desc: string }[];
  importantNotes: string[];
}

interface FaqItem {
  id: string;
  question: string;
  category: string;
  answer: string;
  relatedRoute?: string;
  relatedName?: string;
}

export default function PetunjukPage() {
  const [activeTab, setActiveTab] = useState<'flow' | 'modules' | 'faq' | 'shortcuts'>('flow');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(1);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('stok');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Master Data: 5 Langkah Alur Operasional Apotek
  const workflowSteps: WorkflowStep[] = [
    {
      step: 1,
      title: 'Penerimaan Stok & Input Faktur PBF',
      shortDesc: 'Registrasi obat baru/restock, input HPP modal, batch, dan tanggal kedaluwarsa dengan sistem FEFO.',
      role: 'Tenaga Teknis Farmasi (TTF) / Bagian Gudang',
      badge: 'Logistik Masuk',
      color: '#3B82F6',
      route: '/dashboard/stok',
      routeName: 'Manajemen Stok Obat',
      inputs: [
        'Faktur Fisik dari Pedagang Besar Farmasi (PBF)',
        'Nomor Batch pabrikan & Tanggal Kedaluwarsa (ED)',
        'Harga Beli Bersih per Satuan (HPP dasar setelah diskon faktur)'
      ],
      processes: [
        'Cek fisik barang vs kesesuaian faktur (segel, jumlah, kondisi fisik)',
        'Input obat ke sistem melalui menu Stok Obat (/dashboard/stok)',
        'Sistem otomatis mengurutkan prioritas pengeluaran berdasarkan FEFO (First Expired, First Out)',
        'Tentukan persentase margin keuntungan (markup) untuk membentuk Harga Jual Konsumen'
      ],
      outputs: [
        'Stok fisik sinkron dengan kartu stok digital',
        'Nilai aset inventori apotek tercatat akurat di Buku Keuangan',
        'Notifikasi peringatan otomatis aktif jika obat mendekati ED < 90 hari'
      ],
      proTips: 'Selalu gunakan HPP neto (sudah dipotong diskon reguler PBF + PPN 11%) agar margin laba kotor di laporan keuangan akurat.'
    },
    {
      step: 2,
      title: 'Registrasi Pasien & Skrining Data',
      shortDesc: 'Pencatatan identitas pasien, riwayat alergi obat, dan tracking rekam medis farmasi sebelum dilayani.',
      role: 'Apoteker / Asisten Apoteker',
      badge: 'Skrining Awal',
      color: '#10B981',
      route: '/dashboard/pasien',
      routeName: 'Buku Data Pasien',
      inputs: [
        'Nama Lengkap Pasien & Nomor Telepon/WhatsApp',
        'Usia, Jenis Kelamin, dan Berat Badan (terutama pasien anak/lansia)',
        'Catatan Riwayat Alergi (misal: Alergi Amoksisilin, NSAID, dsb)'
      ],
      processes: [
        'Cari apakah pasien sudah terdaftar di sistem untuk melihat riwayat sebelumnya',
        'Jika pasien baru, input biodata dan riwayat penyakit komorbid (Hipertensi, DM)',
        'Pastikan catatan alergi tercatat jelas untuk memicu peringatan kontraindikasi saat transaksi'
      ],
      outputs: [
        'Nomor Rekam Medis Pasien (RM Farmasi) terbit',
        'Profil kesehatan siap ditautkan ke transaksi kasir dan resep dokter'
      ],
      proTips: 'Catat nomor WhatsApp aktif pasien agar memudahkan pengiriman reminder jadwal minum obat kronis (Hipertensi/Diabetes).'
    },
    {
      step: 3,
      title: 'Pelayanan Resep & Kasir POS',
      shortDesc: 'Penebusan resep dokter atau pembelian bebas (OTC), kalkulasi harga otomatis, dan cetak struk kasir.',
      role: 'Kasir / Petugas Farmasi',
      badge: 'Transaksi POS',
      color: '#F59E0B',
      route: '/dashboard/kasir',
      routeName: 'Kasir POS & Resep',
      inputs: [
        'Resep Fisik Dokter atau Permintaan Pasien (Swamedikasi/OTC)',
        'Identitas Pasien terdaftar',
        'Pilihan metode bayar (Tunai, QRIS, atau Transfer Bank)'
      ],
      processes: [
        'Scan barcode atau ketik nama obat pada kolom pencarian cepat',
        'Pilih jenis penjualan: Resep Racikan, Resep Paten, atau Obat Bebas (OTC)',
        'Sistem memotong stok otomatis dari batch dengan tanggal expired terdekat (FEFO)',
        'Sistem menghitung total belanja, diskon, dan kembalian secara presisi'
      ],
      outputs: [
        'Struk Kasir Resmi dengan Kop Apotek tercetak untuk pasien',
        'Stok obat berkurang seketika secara real-time',
        'Arsip transaksi otomatis masuk ke Buku Kas & Laporan Penjualan'
      ],
      proTips: 'Gunakan tombol F2 untuk fokus langsung ke kolom pencarian obat di meja kasir demi efisiensi antrean pelanggan.'
    },
    {
      step: 4,
      title: 'Asistensi AI Klinis & Telaah Resep',
      shortDesc: 'Analisis interaksi obat, skrining dosis lazim, konfirmasi ICD-10, dan konsultasi interaktif apoteker.',
      role: 'Apoteker Penanggung Jawab (APA) & Dokter Faskes',
      badge: 'Klinis & Diagnostik',
      color: '#8B5CF6',
      route: '/dashboard/ai-analisa',
      routeName: 'Asisten AI Apoteker',
      inputs: [
        'Daftar obat yang diresepkan bersamaan (Polifarmasi)',
        'Keluhan gejala klinis pasien atau foto berkas resep / hasil laboratorium',
        'Kondisi khusus pasien (Ibu hamil/menyusui, gangguan ginjal/hepar)'
      ],
      processes: [
        'Ketik pertanyaan klinis atau unggah berkas resep ke Asisten AI',
        'Buka Mode Layar Penuh (Room Chat) untuk diskusi klinis komprehensif tanpa distraksi',
        'AI melakukan telaah potensi interaksi obat (Mayor, Moderat, Minor) dan duplikasi terapi',
        'AI memetakan dugaan diagnosa dengan kode standar internasional ICD-10'
      ],
      outputs: [
        'Rekomendasi telaah klinis apoteker yang terdokumentasi',
        'Pencegahan Kejadian Tidak Diinginkan (KTD) akibat interaksi obat berisiko',
        'KIE (Komunikasi, Informasi, dan Edukasi) farmasi yang lebih presisi ke pasien'
      ],
      proTips: 'Tekan tombol Fullscreen di pojok kanan atas chat AI saat berkonsultasi mendalam agar tampilan menyerupai workstation klinis modern.'
    },
    {
      step: 5,
      title: 'Evaluasi Finansial, HPP & Tren Apotek',
      shortDesc: 'Rekapitulasi omzet penjualan, perhitungan laba kotor otomatis (Omzet − HPP), dan pemantauan tren morbiditas.',
      role: 'Pemilik Sarana Apotek (PSA) / Pengelola Keuangan',
      badge: 'Pelaporan & Audit',
      color: '#EC4899',
      route: '/dashboard/keuangan',
      routeName: 'Laporan Keuangan & HPP',
      inputs: [
        'Seluruh histori transaksi penjualan kasir periode berjalan',
        'Data HPP per item yang telah terekam saat transaksi',
        'Filter rentang tanggal (Hari Ini, 7 Hari, Bulan Ini, atau Kustom)'
      ],
      processes: [
        'Buka menu Laporan Keuangan (/dashboard/keuangan) untuk melihat KPI omzet, HPP, dan margin kotor',
        'Gunakan filter lanjutan: filter kasir, filter jenis pembayaran, dan filter margin laba',
        'Buka menu Analisa & Visual (/dashboard/visual) untuk melihat 10 penyakit dan obat terlaris',
        'Ekspor data transaksi dalam format CSV/Excel untuk rekonsiliasi akuntansi'
      ],
      outputs: [
        'Laporan Laba Kotor yang siap dilaporkan ke pimpinan/PSA',
        'Insight produk mana yang paling berkontribusi pada profitabilitas apotek',
        'Proyeksi kebutuhan stok untuk pengadaan PBF periode berikutnya'
      ],
      proTips: 'Lakukan evaluasi margin mingguan. Jika rata-rata margin di bawah 20%, evaluasi kembali diskon penjualan atau negosiasi diskon pembelian ke PBF.'
    }
  ];

  // Master Data: 7 Modul Lengkap
  const moduleGuides: ModuleGuide[] = [
    {
      id: 'stok',
      title: 'Manajemen Stok & Inventori Obat',
      category: 'stok',
      icon: Package,
      color: '#3B82F6',
      route: '/dashboard/stok',
      description: 'Pusat pengelolaan master data obat, stok fisik, batch number, tanggal kedaluwarsa, dan penetapan harga beli (HPP) modal.',
      keyFeatures: [
        'Prinsip FEFO (First Expired First Out) otomatis',
        'Peringatan dini obat kedaluwarsa (<90 hari & <30 hari)',
        'Pencatatan HPP Modal, PPN, dan Harga Jual',
        'Stok Minimum Alert untuk mencegah kehabisan stok'
      ],
      steps: [
        {
          title: '1. Menambahkan Obat Baru',
          desc: 'Klik tombol "+ Tambah Obat" di pojok kanan atas. Isi nama obat, golongan (Keras/Bebas/Narkotika), satuan terkecil (Strip/Botol/Tablet), dan pabrik produsen.'
        },
        {
          title: '2. Memasukkan Batch & Harga Modal',
          desc: 'Masukkan nomor batch faktur PBF, tanggal kedaluwarsa fisik, harga beli neto (HPP modal), dan margin keuntungan yang diinginkan.'
        },
        {
          title: '3. Penyesuaian & Opname Stok',
          desc: 'Gunakan fitur penyesuaian stok jika terdapat selisih fisik obat saat stock opname periodik apotek.'
        }
      ],
      importantNotes: [
        'Jangan menghapus obat yang sudah pernah memiliki riwayat transaksi kasir agar histori laporan keuangan tetap terjaga.',
        'Selalu cek kesesuaian nomor batch antara fisik box obat dengan data yang diinput ke sistem.'
      ]
    },
    {
      id: 'kasir',
      title: 'Kasir POS & Penebusan Resep',
      category: 'kasir',
      icon: ShoppingCart,
      color: '#F59E0B',
      route: '/dashboard/kasir',
      description: 'Point of Sales cepat untuk melayani pembelian obat bebas (OTC), resep dokter reguler, dan resep racikan apotek.',
      keyFeatures: [
        'Pencarian kilat obat via nama atau barcode scanner',
        'Dukungan kalkulasi resep racikan & paten',
        'Metode pembayaran multi-channel (Tunai, QRIS, Transfer)',
        'Cetak struk belanja thermal otomatis dengan kop resmi'
      ],
      steps: [
        {
          title: '1. Memilih Pasien & Jenis Transaksi',
          desc: 'Ketik nama pasien di kolom pasien atau pilih "Pelanggan Umum (Walk-in)" jika pembelian tanpa resep.'
        },
        {
          title: '2. Memasukkan Item Obat',
          desc: 'Tekan F2 atau klik pada kolom pencarian, ketik nama obat, tekan Enter untuk memasukkan ke keranjang kasir. Tentukan jumlah pesanan.'
        },
        {
          title: '3. Memilih Metode Pembayaran & Cetak',
          desc: 'Pilih metode bayar, masukkan nominal uang diterima, lalu klik "Proses Pembayaran". Struk kasir akan langsung siap dicetak.'
        }
      ],
      importantNotes: [
        'Jika pasien menebus resep antibiotik, pastikan informasi lama konsumsi obat habis tercatat pada aturan pakai.',
        'Sistem otomatis memblokir penjualan jika stok obat di sistem bernilai 0 (nol).'
      ]
    },
    {
      id: 'ai',
      title: 'Asisten AI Apoteker & Klinis',
      category: 'ai',
      icon: Bot,
      color: '#8B5CF6',
      route: '/dashboard/ai-analisa',
      description: 'Kecerdasan buatan klinis untuk telaah resep dokter, skrining interaksi polifarmasi, deteksi kontraindikasi, dan kode ICD-10.',
      keyFeatures: [
        'Mode Layar Penuh (Room Chat) bebas distraksi',
        'Analisis interaksi obat tingkat keparahan tinggi & sedang',
        'Pemetaan gejala ke kode standar medis ICD-10',
        'Dukungan unggah berkas resep & ringkasan hasil lab'
      ],
      steps: [
        {
          title: '1. Memulai Sesi Konsultasi',
          desc: 'Buka menu Asisten AI, pilih topik siap pakai (contoh: "Cek Interaksi Obat", "Telaah Resep Hipertensi", atau "Rekomendasi Swamedikasi").'
        },
        {
          title: '2. Memasukkan Data Klinis / Unggah Resep',
          desc: 'Ketik obat-obatan yang dikonsumsi pasien atau lampirkan foto resep dokter melalui tombol unggah.'
        },
        {
          title: '3. Menggunakan Mode Layar Penuh',
          desc: 'Klik tombol "Mode Penuh" di pojok kanan atas untuk membuka ruang kerja chat yang luas seperti aplikasi perpesanan modern.'
        }
      ],
      importantNotes: [
        'AI bertindak sebagai asisten pendukung keputusan klinis (Clinical Decision Support), keputusan akhir pengeluaran obat tetap berada di tangan Apoteker Penanggung Jawab.',
        'Semua percakapan aman dan tersimpan dalam sesi lokal fasilitas kesehatan Anda.'
      ]
    },
    {
      id: 'pasien',
      title: 'Buku Rekam Data Pasien',
      category: 'pasien',
      icon: Users,
      color: '#10B981',
      route: '/dashboard/pasien',
      description: 'Database rekam farmasi pasien, histori pengobatan masa lalu, catatan alergi obat, dan pemantauan pasien penyakit kronis.',
      keyFeatures: [
        'Pencatatan riwayat alergi obat dengan penanda khusus',
        'Histori seluruh struk dan transaksi yang pernah dilakukan pasien',
        'Pencarian cepat berdasarkan Nama, No. HP, atau No. Rekam Medis',
        'Catatan pemantauan terapi obat (PTO) oleh apoteker'
      ],
      steps: [
        {
          title: '1. Pendaftaran Pasien Baru',
          desc: 'Klik "Daftar Pasien Baru", isi identitas dasar meliputi nama, tanggal lahir, jenis kelamin, alamat, dan nomor kontak.'
        },
        {
          title: '2. Mengisi Catatan Alergi & Riwayat Kronis',
          desc: 'Tuliskan secara spesifik zat aktif atau obat yang menyebabkan reaksi alergi (misal: "Alergi Penisilin - Gatal & Ruam").'
        },
        {
          title: '3. Melihat Rekam Jejak Penebusan',
          desc: 'Klik profil pasien untuk melihat seluruh daftar obat yang pernah ditebus dalam kurun waktu 1 tahun terakhir.'
        }
      ],
      importantNotes: [
        'Pastikan data kontak (Nomor WhatsApp) valid agar apoteker dapat melakukan monitoring efek samping obat (MESO) jika diperlukan.'
      ]
    },
    {
      id: 'keuangan',
      title: 'Laporan Keuangan, Omzet & HPP',
      category: 'keuangan',
      icon: Wallet,
      color: '#EC4899',
      route: '/dashboard/keuangan',
      description: 'Pusat audit finansial apotek yang menghitung omzet kotor, total modal pengadaan (HPP), laba kotor, dan margin keuntungan secara otomatis.',
      keyFeatures: [
        'Kalkulasi Laba Kotor otomatis = Total Omzet Penjualan dikurangi Total HPP',
        'Filter periode fleksibel (Hari Ini, 7 Hari, 30 Hari, atau Rentang Kustom)',
        'Filter transaksi berdasarkan kasir, metode pembayaran, dan rentang persentase margin',
        'Ekspor laporan lengkap ke file CSV/Excel untuk akuntansi'
      ],
      steps: [
        {
          title: '1. Meninjau Ringkasan Finansial',
          desc: 'Perhatikan 4 kartu ringkasan di atas: Total Omzet, Total Modal HPP, Laba Kotor, dan Rata-rata Margin Persentase.'
        },
        {
          title: '2. Memanfaatkan Filter Lanjutan',
          desc: 'Gunakan tombol filter untuk memilah transaksi berdasarkan kasir yang bertugas, rentang profitabilitas, atau metode pembayaran QRIS.'
        },
        {
          title: '3. Mengunduh Rekap CSV',
          desc: 'Klik tombol "Unduh CSV" di kanan atas tabel transaksi untuk menyimpan arsip pembukuan kasir ke perangkat Anda.'
        }
      ],
      importantNotes: [
        'Nilai Laba Kotor adalah laba sebelum dikurangi biaya operasional apotek (listrik, sewa tempat, gaji staf).',
        'Jika ada transaksi dengan margin 0% atau negatif, periksa apakah harga modal obat di master stok telah diisi dengan benar.'
      ]
    },
    {
      id: 'visual',
      title: 'Analisa & Visualisasi Tren Kesehatan',
      category: 'keuangan',
      icon: LineChart,
      color: '#06B6D4',
      route: '/dashboard/visual',
      description: 'Dashboard visual statistik penyakit terbanyak, tren kunjungan pasien, distribusi usia demografi, dan obat yang paling sering diresepkan.',
      keyFeatures: [
        'Diagram 10 Penyakit/Diagnosa Terbanyak (Top 10 Morbidity)',
        'Filter demografi usia (Anak-anak, Dewasa, Lansia)',
        'Tingkat keparahan kasus (Ringan, Sedang, Kritis)',
        'Ekspor visual data tren ke format CSV'
      ],
      steps: [
        {
          title: '1. Memilih Rentang Periode Analisa',
          desc: 'Pilih periode waktu (7 Hari Terakhir, 30 Hari, atau Kuartal Ini) untuk melihat tren fluktuasi kasus.'
        },
        {
          title: '2. Menyaring Kategori Spesifik',
          desc: 'Gunakan filter kategori (misal: Penyakit Saluran Pernapasan / ISPA) untuk memproyeksikan kebutuhan stok obat flu & batuk menjelang musim pancaroba.'
        }
      ],
      importantNotes: [
        'Data tren ini sangat berguna untuk perencanaan pengadaan obat (RKO) ke distributor PBF agar tidak terjadi over-stock atau dead-stock.'
      ]
    },
    {
      id: 'profil',
      title: 'Profil Fasilitas Kesehatan & Kop Resep',
      category: 'stok',
      icon: Building2,
      color: '#D97706',
      route: '/dashboard/profil',
      description: 'Pengaturan identitas resmi faskes/apotek, nomor izin operasional (SIA & SIPA), alamat, dan kop otomatis untuk resep & struk.',
      keyFeatures: [
        'Pengaturan Nama Faskes, Alamat, Telepon, dan Email',
        'Pencatatan Nomor SIA (Surat Izin Apotek) & SIPA Apoteker',
        'Live Preview Kop Resep & Struk Kasir Resmi',
        'Tersinkronisasi otomatis ke seluruh modul aplikasi'
      ],
      steps: [
        {
          title: '1. Membuka Halaman Profil',
          desc: 'Klik nama apotek di pojok kiri bawah sidebar atau kunjungi tautan /dashboard/profil.'
        },
        {
          title: '2. Memperbarui Data Legalitas',
          desc: 'Ketik nama Apoteker Pengelola Apotek (APA) beserta nomor SIPA aktif agar struk kasir dan resep sah secara hukum farmasi.'
        },
        {
          title: '3. Memeriksa Live Preview Kop',
          desc: 'Perhatikan tampilan pratinjau di sisi kanan layar untuk memastikan tata letak kop resep dan struk kasir sudah rapi.'
        }
      ],
      importantNotes: [
        'Perubahan nama faskes dan alamat di halaman ini akan langsung otomatis terpasang pada cetakan struk kasir di modul Kasir POS.'
      ]
    }
  ];

  // Master Data: FAQ Apotek
  const faqList: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'Bagaimana logika perhitungan Modal (HPP) dan Laba Kotor di MediagnoTek?',
      category: 'keuangan',
      answer: 'HPP (Harga Pokok Penjualan) adalah harga modal beli obat dari distributor (PBF) setelah dipotong diskon dan ditambah PPN. Ketika obat terjual di kasir, sistem mencatat HPP obat tersebut. Laba Kotor dihitung dengan rumus: Laba Kotor = Total Omzet Penjualan − Total HPP. Persentase Margin dihitung dengan: (Laba Kotor ÷ Total Omzet) × 100%.',
      relatedRoute: '/dashboard/keuangan',
      relatedName: 'Buka Laporan Keuangan'
    },
    {
      id: 'faq-2',
      question: 'Bagaimana cara sistem mengelola obat yang mendekati tanggal kedaluwarsa?',
      category: 'stok',
      answer: 'MediagnoTek menerapkan metode FEFO (First Expired, First Out). Obat yang memiliki tanggal kedaluwarsa paling dekat akan diprioritaskan keluar saat kasir melakukan transaksi. Sistem juga memberikan label peringatan warna kuning untuk obat ED < 90 hari, dan label merah untuk obat ED < 30 hari di halaman Stok Obat.',
      relatedRoute: '/dashboard/stok',
      relatedName: 'Lihat Stok Obat'
    },
    {
      id: 'faq-3',
      question: 'Apakah hasil analisa dan rekomendasi dari Asisten AI Apoteker bisa langsung diberikan ke pasien?',
      category: 'ai',
      answer: 'Tidak. Asisten AI MediagnoTek bertindak sebagai Clinical Decision Support System (alat bantu telaah klinis). Apoteker Penanggung Jawab (APA) atau dokter tetap wajib meninjau dan memvalidasi setiap rekomendasi dosis, interaksi, atau diagnosa sebelum disampaikan kepada pasien demi kepatuhan SOP kefarmasian.',
      relatedRoute: '/dashboard/ai-analisa',
      relatedName: 'Konsultasi AI'
    },
    {
      id: 'faq-4',
      question: 'Bagaimana cara mengubah nama dan alamat apotek yang tercetak pada struk belanja kasir?',
      category: 'profil',
      answer: 'Buka menu Profil Faskes di /dashboard/profil. Anda dapat mengubah Nama Apotek, Alamat Lengkap, Nomor Telepon, Nama Apoteker Pengelola Apotek (APA), dan Nomor SIPA. Perubahan akan langsung tersimpan dan langsung diterapkan pada setiap cetakan struk kasir.',
      relatedRoute: '/dashboard/profil',
      relatedName: 'Edit Profil Faskes'
    },
    {
      id: 'faq-5',
      question: 'Bagaimana jika stok fisik di apotek tidak sesuai dengan angka yang ada di aplikasi?',
      category: 'stok',
      answer: 'Gunakan fitur Penyesuaian Stok (Stock Adjustment) di halaman Stok Obat. Anda dapat melakukan Stock Opname berkala dan menginput jumlah fisik aktual beserta alasan penyesuaian (misal: barang rusak, botol pecah, atau selisih pencatatan).',
      relatedRoute: '/dashboard/stok',
      relatedName: 'Buka Inventori Stok'
    },
    {
      id: 'faq-6',
      question: 'Bagaimana cara mencari rekam medis dan histori obat yang pernah dibeli pasien tertentu?',
      category: 'pasien',
      answer: 'Kunjungi menu Pasien di /dashboard/pasien. Ketik nama atau nomor telepon pasien pada kolom pencarian. Klik nama pasien untuk membuka profil lengkap yang berisi riwayat alergi obat, riwayat penebusan resep, dan tanggal kunjungan terakhir.',
      relatedRoute: '/dashboard/pasien',
      relatedName: 'Cek Buku Pasien'
    },
    {
      id: 'faq-7',
      question: 'Apakah saya bisa mengekspor laporan transaksi keuangan ke Excel?',
      category: 'keuangan',
      answer: 'Bisa. Di halaman Laporan Keuangan (/dashboard/keuangan), terapkan filter tanggal yang diinginkan, kemudian klik tombol "Unduh CSV" di atas tabel transaksi. File CSV tersebut dapat langsung dibuka menggunakan Microsoft Excel, Google Sheets, atau software akuntansi lainnya.',
      relatedRoute: '/dashboard/keuangan',
      relatedName: 'Ekspor Data Keuangan'
    }
  ];

  // Master Data: Pintasan Keyboard
  const shortcutList = [
    { key: 'F2', desc: 'Fokus langsung ke kolom pencarian obat di Kasir POS', context: 'Kasir POS' },
    { key: 'Enter', desc: 'Menambahkan item obat terpilih ke keranjang belanja', context: 'Kasir POS' },
    { key: 'ESC', desc: 'Keluar dari mode layar penuh (Full Screen Chat) di AI Analisa', context: 'Asisten AI' },
    { key: 'Ctrl + P', desc: 'Mencetak halaman aktif atau pratinjau struk / laporan', context: 'Global' },
    { key: 'Alt + S', desc: 'Navigasi cepat membuka / menutup Sidebar Menu', context: 'Navigasi' },
    { key: 'Tab', desc: 'Pindah ke field input berikutnya secara berurutan', context: 'Formulir' }
  ];

  // Filtering Logic
  const filteredModules = useMemo(() => {
    return moduleGuides.filter(m => {
      const matchQuery = !searchQuery || 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.keyFeatures.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategoryFilter === 'all' || m.category === selectedCategoryFilter;
      return matchQuery && matchCat;
    });
  }, [searchQuery, selectedCategoryFilter]);

  const filteredFaqs = useMemo(() => {
    return faqList.filter(f => {
      const matchQuery = !searchQuery ||
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategoryFilter === 'all' || f.category === selectedCategoryFilter;
      return matchQuery && matchCat;
    });
  }, [searchQuery, selectedCategoryFilter]);

  const currentStepData = workflowSteps.find(s => s.step === selectedFlowStep) || workflowSteps[0];
  const currentModuleData = moduleGuides.find(m => m.id === selectedModuleId) || moduleGuides[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
      
      {/* 1. Header Banner Petunjuk */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1.8px solid #1E1E1E',
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: '3px 3px 0px #1E1E1E',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF9EE 100%)'
      }}>
        <div style={{ flex: '1 1 450px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3D6', border: '1.2px solid #1E1E1E', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800, color: '#92400E', marginBottom: '10px' }}>
            <Compass size={14} strokeWidth={2.4} />
            PANDUAN OPERASIONAL & WORKFLOW SISTEM
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
            Petunjuk & Alur Aplikasi MediagnoTek
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.5, margin: 0, maxWidth: '720px' }}>
            Pelajari alur kerja end-to-end apotek modern: mulai dari penerimaan faktur obat PBF, skrining resep, pelayanan kasir POS, telaah klinis AI, hingga pembukuan laba kotor HPP.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1.8px solid #1E1E1E',
              backgroundColor: '#FFFFFF',
              color: '#18181B',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '2px 2px 0px #1E1E1E',
              transition: 'all 0.15s ease'
            }}
          >
            <Printer size={16} strokeWidth={2.2} />
            Cetak Panduan
          </button>
          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: '1.8px solid #1E1E1E',
              backgroundColor: '#FEF3D6',
              color: '#18181B',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}
          >
            Kembali ke Dashboard
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </div>

      {/* 2. Live Search & Category Chips */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1.8px solid #1E1E1E',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '2px 2px 0px #1E1E1E',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
          <input
            type="text"
            placeholder="Cari petunjuk atau alur (contoh: cara input HPP, resep racikan, mode chat AI, FEFO, cetak struk)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: '10px',
              border: '1.8px solid #1E1E1E',
              backgroundColor: '#FAF8F4',
              color: '#18181B',
              fontSize: '0.92rem',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '0.8rem',
                color: '#6B7280',
                cursor: 'pointer',
                fontWeight: 700,
                padding: '4px 8px'
              }}
            >
              Reset ✕
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6B7280', marginRight: '4px' }}>Filter Topik:</span>
          {[
            { id: 'all', label: 'Semua Panduan' },
            { id: 'stok', label: 'Stok & FEFO' },
            { id: 'kasir', label: 'Kasir & Resep' },
            { id: 'ai', label: 'AI Analisa' },
            { id: 'pasien', label: 'Buku Pasien' },
            { id: 'keuangan', label: 'Keuangan & HPP' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: selectedCategoryFilter === cat.id ? '#1E1E1E' : '#FFFFFF',
                color: selectedCategoryFilter === cat.id ? '#FFFFFF' : '#18181B',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid #1E1E1E',
        paddingBottom: '2px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'flow', label: '1. Peta Alur Operasional (Blueprint)', icon: Compass },
          { id: 'modules', label: '2. Panduan Lengkap Per Modul', icon: BookOpen },
          { id: 'faq', label: '3. FAQ & Solusi Kendala Apotek', icon: HelpCircle },
          { id: 'shortcuts', label: '4. Pintasan Keyboard & Tips', icon: Keyboard }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                borderRadius: '12px 12px 0 0',
                border: '1.8px solid #1E1E1E',
                borderBottom: isActive ? '2px solid #FAF8F4' : '1.8px solid #1E1E1E',
                backgroundColor: isActive ? '#FEF3D6' : '#FFFFFF',
                color: '#18181B',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginBottom: '-2px',
                boxShadow: isActive ? '0px -2px 0px #1E1E1E' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} strokeWidth={2.4} color={isActive ? '#B45309' : '#4B5563'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PETA ALUR OPERASIONAL APOTEK (INTERACTIVE WORKFLOW) */}
      {activeTab === 'flow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Workflow Stepper Bar */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #1E1E1E',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '3px 3px 0px #1E1E1E'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '14px' }}>
              Tahapan Alur Kerja Operasional Apotek (Klik Tahap untuk Melihat Rincian):
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {workflowSteps.map((step) => {
                const isSelected = selectedFlowStep === step.step;
                return (
                  <div
                    key={step.step}
                    onClick={() => setSelectedFlowStep(step.step)}
                    style={{
                      border: '1.8px solid #1E1E1E',
                      borderRadius: '12px',
                      padding: '14px',
                      backgroundColor: isSelected ? '#FEF3D6' : '#FAF8F4',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '3px 3px 0px #1E1E1E' : '1px 1px 0px #1E1E1E',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#1E1E1E' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#1E1E1E',
                        border: '1.2px solid #1E1E1E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 900
                      }}>
                        {step.step}
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        border: '1px solid #1E1E1E',
                        backgroundColor: isSelected ? '#FFFFFF' : '#FEF9EE'
                      }}>
                        {step.badge}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181B', lineHeight: 1.3 }}>
                      {step.title}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.3 }}>
                      {step.role}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Card for Selected Flow Step */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #1E1E1E',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '4px 4px 0px #1E1E1E',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', borderBottom: '1.8px solid #E5E7EB', paddingBottom: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3D6', border: '1.2px solid #1E1E1E', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#92400E', marginBottom: '8px' }}>
                  LANGKAH KE-{currentStepData.step} DARI 5
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', margin: '0 0 6px 0' }}>
                  {currentStepData.title}
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                  {currentStepData.shortDesc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  href={currentStepData.route}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1.8px solid #1E1E1E',
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '2px 2px 0px #1E1E1E'
                  }}
                >
                  <span>Buka Modul {currentStepData.routeName}</span>
                  <ExternalLink size={15} strokeWidth={2.4} />
                </Link>
              </div>
            </div>

            {/* 3 Pillars: Input -> Process -> Output */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {/* Pillar 1: Dokumen / Input Diperlukan */}
              <div style={{
                backgroundColor: '#FAF8F4',
                border: '1.5px solid #1E1E1E',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <FileText size={18} color="#3B82F6" strokeWidth={2.4} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B' }}>
                    1. Input / Dokumen Awal
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#374151', lineHeight: 1.45 }}>
                  {currentStepData.inputs.map((inp, idx) => (
                    <li key={idx}><strong>{inp}</strong></li>
                  ))}
                </ul>
              </div>

              {/* Pillar 2: Proses yang Dilakukan */}
              <div style={{
                backgroundColor: '#FAF8F4',
                border: '1.5px solid #1E1E1E',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Zap size={18} color="#F59E0B" strokeWidth={2.4} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B' }}>
                    2. Proses Eksekusi Sistem
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#374151', lineHeight: 1.45 }}>
                  {currentStepData.processes.map((pro, idx) => (
                    <li key={idx}>{pro}</li>
                  ))}
                </ul>
              </div>

              {/* Pillar 3: Hasil / Output yang Didapat */}
              <div style={{
                backgroundColor: '#FAF8F4',
                border: '1.5px solid #1E1E1E',
                borderRadius: '12px',
                padding: '18px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle2 size={18} color="#10B981" strokeWidth={2.4} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B' }}>
                    3. Output & Dampak Data
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#374151', lineHeight: 1.45 }}>
                  {currentStepData.outputs.map((out, idx) => (
                    <li key={idx} style={{ color: '#166534', fontWeight: 600 }}>{out}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pro Tip Box */}
            <div style={{
              backgroundColor: '#FEF3D6',
              border: '1.5px solid #1E1E1E',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}>
              <Sparkles size={20} color="#B45309" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: '#78350F', lineHeight: 1.45 }}>
                <strong>Tips Apoteker Pengelola:</strong> {currentStepData.proTips}
              </div>
            </div>

            {/* Quick Flow Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #E5E7EB' }}>
              <button
                disabled={selectedFlowStep === 1}
                onClick={() => setSelectedFlowStep(prev => Math.max(1, prev - 1))}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1.2px solid #1E1E1E',
                  backgroundColor: selectedFlowStep === 1 ? '#F3F4F6' : '#FFFFFF',
                  color: selectedFlowStep === 1 ? '#9CA3AF' : '#18181B',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: selectedFlowStep === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Tahap Sebelumnya
              </button>

              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280' }}>
                Langkah {selectedFlowStep} dari 5
              </div>

              <button
                disabled={selectedFlowStep === 5}
                onClick={() => setSelectedFlowStep(prev => Math.min(5, prev + 1))}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1.2px solid #1E1E1E',
                  backgroundColor: selectedFlowStep === 5 ? '#F3F4F6' : '#FFFFFF',
                  color: selectedFlowStep === 5 ? '#9CA3AF' : '#18181B',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: selectedFlowStep === 5 ? 'not-allowed' : 'pointer'
                }}
              >
                Tahap Berikutnya →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN LENGKAP PER MODUL */}
      {activeTab === 'modules' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '20px' }}>
          
          {/* Module Selector List */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #1E1E1E',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '3px 3px 0px #1E1E1E',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            height: 'fit-content'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', padding: '6px 8px' }}>
              Daftar Modul Aplikasi ({filteredModules.length})
            </div>

            {filteredModules.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedModuleId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModuleId(m.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #1E1E1E',
                    backgroundColor: isSelected ? '#FEF3D6' : '#FAF8F4',
                    color: '#18181B',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '2px 2px 0px #1E1E1E' : 'none',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1.2px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={16} strokeWidth={2.4} color={m.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                      {m.route}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Module Detailed Instructions Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #1E1E1E',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '4px 4px 0px #1E1E1E',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', borderBottom: '1.8px solid #E5E7EB', paddingBottom: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#E0F2FE', border: '1.2px solid #1E1E1E', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#0369A1', marginBottom: '8px' }}>
                  PETUNJUK MODUL
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', margin: '0 0 6px 0' }}>
                  {currentModuleData.title}
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                  {currentModuleData.description}
                </p>
              </div>

              <Link
                href={currentModuleData.route}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  border: '1.8px solid #1E1E1E',
                  backgroundColor: '#FEF3D6',
                  color: '#18181B',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '2px 2px 0px #1E1E1E'
                }}
              >
                Buka Halaman Modul ↗
              </Link>
            </div>

            {/* Fitur Utama */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                Kemampuan & Fitur Unggulan:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {currentModuleData.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.2px solid #1E1E1E',
                      backgroundColor: '#FAF8F4',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#18181B'
                    }}
                  >
                    <CheckCircle2 size={16} color="#10B981" strokeWidth={2.4} style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Langkah Operasional 1, 2, 3 */}
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B', marginBottom: '12px' }}>
                Langkah-Langkah Penggunaan (SOP Praktis):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentModuleData.steps.map((st, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1.5px solid #1E1E1E',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '2px 2px 0px #1E1E1E'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                      {st.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
                      {st.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan Penting / Warning */}
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #1E1E1E',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertCircle size={18} color="#EF4444" strokeWidth={2.4} />
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#991B1B' }}>
                  Perhatian Penting untuk Staf:
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#7F1D1D', lineHeight: 1.45 }}>
                {currentModuleData.importantNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAQ & KENDALA APOTEK (INTERACTIVE ACCORDION) */}
      {activeTab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #1E1E1E',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '3px 3px 0px #1E1E1E',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', margin: '0 0 4px 0' }}>
                Pusat Bantuan & Pertanyaan Sering Diajukan (FAQ)
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
                Temukan solusi cepat untuk pertanyaan seputar teknis farmasi, rumus HPP modal, dan aturan pemakaian aplikasi.
              </p>
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', border: '1.2px solid #1E1E1E', padding: '4px 10px', borderRadius: '9999px' }}>
              {filteredFaqs.length} Topik Tersedia
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.8px solid #1E1E1E',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: isOpen ? '3px 3px 0px #1E1E1E' : '1.5px 1.5px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isOpen ? '#FEF3D6' : '#FFFFFF',
                      border: 'none',
                      borderBottom: isOpen ? '1.5px solid #1E1E1E' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <HelpCircle size={18} strokeWidth={2.4} color={isOpen ? '#B45309' : '#6B7280'} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#18181B' }}>
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? <ChevronUp size={18} strokeWidth={2.4} /> : <ChevronDown size={18} strokeWidth={2.4} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '18px 24px', backgroundColor: '#FAF8F4', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>
                        {faq.answer}
                      </p>

                      {faq.relatedRoute && (
                        <div>
                          <Link
                            href={faq.relatedRoute}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              color: '#1E1E1E',
                              textDecoration: 'none',
                              backgroundColor: '#FFFFFF',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              border: '1.2px solid #1E1E1E',
                              boxShadow: '1px 1px 0px #1E1E1E'
                            }}
                          >
                            <span>{faq.relatedName}</span>
                            <ArrowRight size={13} strokeWidth={2.4} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PINTASAN KEYBOARD & TIPS KECEPATAN */}
      {activeTab === 'shortcuts' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.8px solid #1E1E1E',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '4px 4px 0px #1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3D6', border: '1.2px solid #1E1E1E', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#92400E', marginBottom: '8px' }}>
              EFISIENSI & AKURASI KERJA
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#18181B', margin: '0 0 6px 0' }}>
              Pintasan Keyboard (Cheat Sheet) & Tips Apoteker
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
              Gunakan kombinasi tombol cepat berikut untuk melayani antrean pasien lebih cepat tanpa perlu bergantung pada mouse.
            </p>
          </div>

          <div style={{
            border: '1.8px solid #1E1E1E',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAF8F4', borderBottom: '1.8px solid #1E1E1E' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: '#18181B', width: '180px' }}>Tombol Pintas</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: '#18181B' }}>Fungsi / Aksi</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, color: '#18181B', width: '160px' }}>Modul Terkait</th>
                </tr>
              </thead>
              <tbody>
                {shortcutList.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: idx === shortcutList.length - 1 ? 'none' : '1px solid #E5E7EB',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4'
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <kbd style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1.5px solid #1E1E1E',
                        backgroundColor: '#FEF3D6',
                        color: '#18181B',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        boxShadow: '1.5px 1.5px 0px #1E1E1E'
                      }}>
                        {item.key}
                      </kbd>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>
                      {item.desc}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #1E1E1E',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {item.context}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 3 Golden Rules */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            <div style={{ border: '1.5px solid #1E1E1E', borderRadius: '12px', padding: '16px', backgroundColor: '#F0FDF4' }}>
              <div style={{ fontWeight: 800, color: '#166534', marginBottom: '6px', fontSize: '0.88rem' }}>
                1. Prinsip FEFO Mutlak
              </div>
              <div style={{ fontSize: '0.8rem', color: '#14532D', lineHeight: 1.45 }}>
                Selalu prioritaskan pengeluaran obat dengan ED terdekat saat kasir melayani transaksi guna meminimalkan kerugian akibat obat kedaluwarsa.
              </div>
            </div>

            <div style={{ border: '1.5px solid #1E1E1E', borderRadius: '12px', padding: '16px', backgroundColor: '#EFF6FF' }}>
              <div style={{ fontWeight: 800, color: '#1E40AF', marginBottom: '6px', fontSize: '0.88rem' }}>
                2. Verifikasi Alergi Pasien
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1E3A8A', lineHeight: 1.45 }}>
                Tanyakan kembali riwayat alergi saat menyerahkan antibiotik atau obat golongan NSAID untuk memastikan keselamatan pasien (patient safety).
              </div>
            </div>

            <div style={{ border: '1.5px solid #1E1E1E', borderRadius: '12px', padding: '16px', backgroundColor: '#FEF3D6' }}>
              <div style={{ fontWeight: 800, color: '#92400E', marginBottom: '6px', fontSize: '0.88rem' }}>
                3. Audit Laporan Harian
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78350F', lineHeight: 1.45 }}>
                Lakukan rekonsiliasi kas fisik di akhir shift dengan total omzet yang tercatat pada menu Laporan Keuangan untuk menjaga transparansi pembukuan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Need Help Banner Footer */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1.8px solid #1E1E1E',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '3px 3px 0px #1E1E1E',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#FEF3D6',
            border: '1.8px solid #1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Bot size={22} color="#B45309" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#18181B' }}>
              Perlu Bimbingan Langsung untuk Kasus Medis Tertentu?
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
              Gunakan Asisten AI Apoteker untuk konsultasi interaktif mengenai interaksi obat, dosis anak, atau skrining resep.
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/ai-analisa"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '10px',
            border: '1.8px solid #1E1E1E',
            backgroundColor: '#1E1E1E',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '2px 2px 0px #D97706'
          }}
        >
          <span>Buka Asisten AI Apoteker</span>
          <ArrowRight size={15} strokeWidth={2.4} />
        </Link>
      </div>

    </div>
  );
}
