'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  Calendar,
  Filter,
  Download,
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  PieChart,
  QrCode,
  Banknote,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  User,
  ShieldCheck
} from 'lucide-react';
import { apiGetTransactions } from '@/lib/api';

interface FinancialRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD HH:mm
  tipe: 'Penebusan Resep' | 'Obat Bebas (OTC)';
  pasien: string;
  omzet: number;
  hpp: number;
  labaKotor: number;
  marginPersen: number;
  metode: 'Tunai' | 'QRIS';
  kasir: string;
}

const INITIAL_FINANCIALS: FinancialRecord[] = [
  { id: 'TRX-9485', tanggal: '2026-10-24 13:40', tipe: 'Penebusan Resep', pasien: 'Gunawan Prasetyo', omzet: 475000, hpp: 310000, labaKotor: 165000, marginPersen: 34.7, metode: 'QRIS', kasir: 'apt. Dimas' },
  { id: 'TRX-9484', tanggal: '2026-10-24 11:15', tipe: 'Obat Bebas (OTC)', pasien: 'Umum (Tanpa Nama)', omzet: 35000, hpp: 19000, labaKotor: 16000, marginPersen: 45.7, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9483', tanggal: '2026-10-24 09:20', tipe: 'Penebusan Resep', pasien: 'Hj. Mardiah', omzet: 215000, hpp: 135000, labaKotor: 80000, marginPersen: 37.2, metode: 'QRIS', kasir: 'Apt. Sarah' },
  { id: 'TRX-9482', tanggal: '2026-10-24 08:30', tipe: 'Obat Bebas (OTC)', pasien: 'Bambang S.', omzet: 64000, hpp: 36000, labaKotor: 28000, marginPersen: 43.8, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9481', tanggal: '2026-10-23 14:45', tipe: 'Penebusan Resep', pasien: 'Budi Santoso', omzet: 620000, hpp: 410000, labaKotor: 210000, marginPersen: 33.8, metode: 'QRIS', kasir: 'Apt. Sarah' },
  { id: 'TRX-9480', tanggal: '2026-10-23 14:20', tipe: 'Penebusan Resep', pasien: 'Siti Rahmawati', omzet: 45000, hpp: 28000, labaKotor: 17000, marginPersen: 37.7, metode: 'Tunai', kasir: 'Apt. Sarah' },
  { id: 'TRX-9479', tanggal: '2026-10-23 13:50', tipe: 'Penebusan Resep', pasien: 'Ahmad Fauzi', omzet: 390000, hpp: 245000, labaKotor: 145000, marginPersen: 37.1, metode: 'QRIS', kasir: 'Rian' },
  { id: 'TRX-9478', tanggal: '2026-10-23 13:15', tipe: 'Obat Bebas (OTC)', pasien: 'Umum (Tanpa Nama)', omzet: 16000, hpp: 9000, labaKotor: 7000, marginPersen: 43.7, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9477', tanggal: '2026-10-23 12:40', tipe: 'Penebusan Resep', pasien: 'Dewi Lestari', omzet: 145000, hpp: 92000, labaKotor: 53000, marginPersen: 36.5, metode: 'QRIS', kasir: 'Apt. Sarah' },
  { id: 'TRX-9476', tanggal: '2026-10-23 11:25', tipe: 'Obat Bebas (OTC)', pasien: 'Hendro W.', omzet: 58000, hpp: 36000, labaKotor: 22000, marginPersen: 37.9, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9475', tanggal: '2026-10-22 10:50', tipe: 'Penebusan Resep', pasien: 'Ratna Juwita', omzet: 85000, hpp: 54000, labaKotor: 31000, marginPersen: 36.4, metode: 'Tunai', kasir: 'Apt. Sarah' },
  { id: 'TRX-9474', tanggal: '2026-10-22 09:30', tipe: 'Obat Bebas (OTC)', pasien: 'Wahyu Nugroho', omzet: 27000, hpp: 16500, labaKotor: 10500, marginPersen: 38.8, metode: 'QRIS', kasir: 'Rian' },
  { id: 'TRX-9473', tanggal: '2026-10-21 16:10', tipe: 'Penebusan Resep', pasien: 'Kurnia Dewi', omzet: 510000, hpp: 350000, labaKotor: 160000, marginPersen: 31.4, metode: 'QRIS', kasir: 'apt. Dimas' },
  { id: 'TRX-9472', tanggal: '2026-10-20 11:45', tipe: 'Obat Bebas (OTC)', pasien: 'Umum (Tanpa Nama)', omzet: 42000, hpp: 24000, labaKotor: 18000, marginPersen: 42.8, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9471', tanggal: '2026-10-18 15:20', tipe: 'Penebusan Resep', pasien: 'Farhan Maulana', omzet: 320000, hpp: 225000, labaKotor: 95000, marginPersen: 29.7, metode: 'QRIS', kasir: 'Apt. Sarah' },
  { id: 'TRX-9470', tanggal: '2026-10-15 10:05', tipe: 'Penebusan Resep', pasien: 'Eka Susilowati', omzet: 180000, hpp: 110000, labaKotor: 70000, marginPersen: 38.9, metode: 'Tunai', kasir: 'Apt. Sarah' },
  { id: 'TRX-9469', tanggal: '2026-10-10 14:30', tipe: 'Obat Bebas (OTC)', pasien: 'Umum (Tanpa Nama)', omzet: 88000, hpp: 49000, labaKotor: 39000, marginPersen: 44.3, metode: 'QRIS', kasir: 'Rian' },
  { id: 'TRX-9468', tanggal: '2026-10-05 09:15', tipe: 'Penebusan Resep', pasien: 'Dr. Indrawan', omzet: 730000, hpp: 495000, labaKotor: 235000, marginPersen: 32.2, metode: 'QRIS', kasir: 'apt. Dimas' },
];

export default function KeuanganPage() {
  const [allRecords, setAllRecords] = useState<FinancialRecord[]>(INITIAL_FINANCIALS);

  // Load latest transactions from DB and LocalStorage
  useEffect(() => {
    async function loadTransactions() {
      const recordsMap = new Map<string, FinancialRecord>();
      INITIAL_FINANCIALS.forEach(r => recordsMap.set(r.id, r));

      // 1. Ambil dari LocalStorage
      try {
        const stored = localStorage.getItem('mediagnotek_local_transactions');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            list.forEach((item: any) => {
              if (item.id) {
                recordsMap.set(item.id, {
                  id: item.id,
                  tanggal: item.tanggal || new Date().toISOString().slice(0, 16).replace('T', ' '),
                  tipe: item.tipe || 'Penebusan Resep',
                  pasien: item.pasien || 'Pasien Umum',
                  omzet: Number(item.omzet) || 0,
                  hpp: Number(item.hpp) || Math.round((Number(item.omzet) || 0) * 0.65),
                  labaKotor: Number(item.labaKotor) || Math.round((Number(item.omzet) || 0) * 0.35),
                  marginPersen: Number(item.marginPersen) || 35.0,
                  metode: item.metode === 'Tunai' ? 'Tunai' : 'QRIS',
                  kasir: item.kasir || 'Kasir Apotek'
                });
              }
            });
          }
        }
      } catch (e) {
        console.warn('Gagal membaca transaksi lokal:', e);
      }

      // 2. Ambil dari Backend Database
      try {
        const res = await apiGetTransactions(1, 50);
        if (res && res.data && Array.isArray(res.data)) {
          res.data.forEach((trx: any) => {
            const id = trx.nomor_struk || `TRX-${trx.id}`;
            const omzet = Number(trx.total_omzet) || 0;
            const hpp = Math.round(omzet * 0.65);
            const labaKotor = omzet - hpp;
            recordsMap.set(id, {
              id,
              tanggal: trx.created_at ? trx.created_at.replace('T', ' ').slice(0, 16) : new Date().toISOString().slice(0, 16).replace('T', ' '),
              tipe: trx.jenis_transaksi === 'RESEP' ? 'Penebusan Resep' : 'Obat Bebas (OTC)',
              pasien: trx.nama_pasien || 'Pasien Umum',
              omzet,
              hpp,
              labaKotor,
              marginPersen: 35.0,
              metode: trx.metode_bayar === 'TUNAI' ? 'Tunai' : 'QRIS',
              kasir: trx.nama_kasir || 'Kasir Apotek'
            });
          });
        }
      } catch (err) {
        console.warn('Gagal sinkron transaksi dari database server:', err);
      }

      setAllRecords(Array.from(recordsMap.values()));
    }

    loadTransactions();
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'SEMUA' | 'HARI_INI' | '7_HARI' | 'BULAN_INI' | 'CUSTOM'>('SEMUA');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [filterTipe, setFilterTipe] = useState<'ALL' | 'Penebusan Resep' | 'Obat Bebas (OTC)'>('ALL');
  const [filterMetode, setFilterMetode] = useState<'ALL' | 'QRIS' | 'Tunai'>('ALL');
  const [filterKasir, setFilterKasir] = useState<string>('ALL');
  const [filterMargin, setFilterMargin] = useState<'ALL' | 'HIGH' | 'NORMAL' | 'LOW'>('ALL');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'OMZET_DESC' | 'OMZET_ASC' | 'LABA_DESC' | 'MARGIN_DESC'>('DATE_DESC');

  // Advanced Filter Drawer Toggle
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Available unique cashiers for filter dropdown
  const uniqueCashiers = useMemo(() => {
    return Array.from(new Set(allRecords.map(item => item.kasir)));
  }, [allRecords]);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return allRecords.filter((item) => {
      // 1. Search Query (ID Transaksi or Pasien)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesPasien = item.pasien.toLowerCase().includes(query);
        if (!matchesId && !matchesPasien) return false;
      }

      // 2. Period Filter
      const itemDateStr = item.tanggal.slice(0, 10); // 'YYYY-MM-DD'
      if (filterPeriod === 'HARI_INI') {
        if (itemDateStr !== '2026-10-24') return false;
      } else if (filterPeriod === '7_HARI') {
        if (itemDateStr < '2026-10-18' || itemDateStr > '2026-10-24') return false;
      } else if (filterPeriod === 'BULAN_INI') {
        if (!itemDateStr.startsWith('2026-10')) return false;
      } else if (filterPeriod === 'CUSTOM') {
        if (customStartDate && itemDateStr < customStartDate) return false;
        if (customEndDate && itemDateStr > customEndDate) return false;
      }

      // 3. Tipe Transaksi
      if (filterTipe !== 'ALL' && item.tipe !== filterTipe) {
        return false;
      }

      // 4. Metode Pembayaran
      if (filterMetode !== 'ALL' && item.metode !== filterMetode) {
        return false;
      }

      // 5. Kasir
      if (filterKasir !== 'ALL' && item.kasir !== filterKasir) {
        return false;
      }

      // 6. Rentang Margin
      if (filterMargin === 'HIGH' && item.marginPersen <= 40) return false;
      if (filterMargin === 'NORMAL' && (item.marginPersen < 30 || item.marginPersen > 40)) return false;
      if (filterMargin === 'LOW' && item.marginPersen >= 30) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'DATE_DESC') return b.tanggal.localeCompare(a.tanggal);
      if (sortBy === 'DATE_ASC') return a.tanggal.localeCompare(b.tanggal);
      if (sortBy === 'OMZET_DESC') return b.omzet - a.omzet;
      if (sortBy === 'OMZET_ASC') return a.omzet - b.omzet;
      if (sortBy === 'LABA_DESC') return b.labaKotor - a.labaKotor;
      if (sortBy === 'MARGIN_DESC') return b.marginPersen - a.marginPersen;
      return 0;
    });
  }, [searchQuery, filterPeriod, customStartDate, customEndDate, filterTipe, filterMetode, filterKasir, filterMargin, sortBy]);

  // Recalculated dynamic KPI based on active filtered data
  const totalOmzet = useMemo(() => filteredRecords.reduce((acc, curr) => acc + curr.omzet, 0), [filteredRecords]);
  const totalHPP = useMemo(() => filteredRecords.reduce((acc, curr) => acc + curr.hpp, 0), [filteredRecords]);
  const totalLabaKotor = useMemo(() => filteredRecords.reduce((acc, curr) => acc + curr.labaKotor, 0), [filteredRecords]);
  const avgMargin = totalOmzet > 0 ? ((totalLabaKotor / totalOmzet) * 100).toFixed(1) : '0';

  // Dynamic QRIS vs Cash Breakdown from filtered data
  const omzetQRIS = useMemo(() => filteredRecords.filter(r => r.metode === 'QRIS').reduce((acc, curr) => acc + curr.omzet, 0), [filteredRecords]);
  const omzetTunai = useMemo(() => filteredRecords.filter(r => r.metode === 'Tunai').reduce((acc, curr) => acc + curr.omzet, 0), [filteredRecords]);
  const countQRIS = useMemo(() => filteredRecords.filter(r => r.metode === 'QRIS').length, [filteredRecords]);
  const countTunai = useMemo(() => filteredRecords.filter(r => r.metode === 'Tunai').length, [filteredRecords]);

  // Count active filters (for badge)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (filterPeriod !== 'SEMUA') count++;
    if (filterTipe !== 'ALL') count++;
    if (filterMetode !== 'ALL') count++;
    if (filterKasir !== 'ALL') count++;
    if (filterMargin !== 'ALL') count++;
    if (sortBy !== 'DATE_DESC') count++;
    return count;
  }, [searchQuery, filterPeriod, filterTipe, filterMetode, filterKasir, filterMargin, sortBy]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterPeriod('SEMUA');
    setCustomStartDate('');
    setCustomEndDate('');
    setFilterTipe('ALL');
    setFilterMetode('ALL');
    setFilterKasir('ALL');
    setFilterMargin('ALL');
    setSortBy('DATE_DESC');
  };

  // Export to Excel (.xls) Spreadsheet Function (bukan CSV, terformat kolom murni Excel)
  const handleExportExcel = () => {
    if (filteredRecords.length === 0) {
      alert('Tidak ada data yang sesuai kriteria filter untuk diekspor.');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const filename = `Laporan_Keuangan_Apotek_Mediagnotek_${todayStr}.xls`;

    // Buat format XML/HTML Spreadsheet yang langsung dikenali Excel sebagai spreadsheet asli berkolom & ber-style
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Laporan Keuangan</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          th {
            background-color: #FEF3D6;
            color: #18181B;
            font-weight: bold;
            border: 1px solid #1E1E1E;
            padding: 8px;
            text-align: center;
          }
          td {
            border: 0.5px solid #CBD5E1;
            padding: 6px 8px;
            mso-number-format: "\\@"; /* Default text */
          }
          .num-cell {
            mso-number-format: "#\\,##0";
            text-align: right;
          }
          .center-cell {
            text-align: center;
          }
          .title-header {
            font-size: 16pt;
            font-weight: bold;
            color: #0F172A;
            text-align: center;
          }
          .sub-header {
            font-size: 10pt;
            color: #475569;
            text-align: center;
          }
          .total-row {
            background-color: #F1F5F9;
            font-weight: bold;
            border-top: 2px solid #1E1E1E;
          }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td colspan="11" class="title-header">LAPORAN KEUANGAN & PROFIT APOTEK MEDIAGNOTEK</td>
          </tr>
          <tr>
            <td colspan="11" class="sub-header">Tanggal Ekspor: ${new Date().toLocaleString('id-ID')} | Total Transaksi: ${filteredRecords.length} Nota</td>
          </tr>
          <tr><td colspan="11"></td></tr>
          <thead>
            <tr>
              <th>No</th>
              <th>ID Transaksi</th>
              <th>Tanggal & Waktu</th>
              <th>Tipe Transaksi</th>
              <th>Nama Pasien</th>
              <th>Metode Bayar</th>
              <th>Omzet Bruto (Rp)</th>
              <th>Modal HPP (Rp)</th>
              <th>Laba Kotor (Rp)</th>
              <th>Margin Laba (%)</th>
              <th>Kasir / Petugas</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map((r, i) => `
              <tr>
                <td class="center-cell">${i + 1}</td>
                <td class="center-cell" style="font-weight:bold;">${r.id}</td>
                <td>${r.tanggal}</td>
                <td>${r.tipe}</td>
                <td>${r.pasien}</td>
                <td class="center-cell">${r.metode}</td>
                <td class="num-cell">${r.omzet}</td>
                <td class="num-cell">${r.hpp}</td>
                <td class="num-cell" style="color:#15803D; font-weight:bold;">${r.labaKotor}</td>
                <td class="center-cell">${r.marginPersen}%</td>
                <td>${r.kasir}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="6" style="text-align:right; font-weight:bold;">TOTAL KESELURUHAN:</td>
              <td class="num-cell" style="font-weight:bold;">${totalOmzet}</td>
              <td class="num-cell" style="font-weight:bold;">${totalHPP}</td>
              <td class="num-cell" style="font-weight:bold; color:#15803D;">${totalLabaKotor}</td>
              <td class="center-cell" style="font-weight:bold;">${avgMargin}%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;

    // Unduh sebagai file spreadsheet Excel murni (.xls)
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Top Export Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={28} strokeWidth={2.3} style={{ color: '#18181B' }} />
            Laporan Keuangan & Profit Apotek
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.92rem' }}>
            Analisis arus kas harian tersinkronisasi kasir (QRIS & Uang Tunai), perputaran modal HPP obat, dan estimasi margin laba kotor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Tombol Ekspor Excel Utama (Bukan CSV Koma) */}
          <button
            onClick={handleExportExcel}
            className="neo-btn-primary"
            style={{
              padding: '9px 18px',
              fontSize: '0.86rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#DCFCE7',
              borderColor: '#15803D',
              color: '#15803D',
              fontWeight: 900,
              boxShadow: '2.5px 2.5px 0px #15803D'
            }}
            title="Unduh data dalam format Spreadsheet Microsoft Excel (.xls) berkolom rapi"
          >
            <FileSpreadsheet size={17} strokeWidth={2.3} />
            <span>Ekspor Excel (.xls)</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADVANCED FILTER CONSOLE (Kompleks & Lengkap)              */}
      {/* ======================================================== */}
      <div className="neo-card" style={{ padding: '18px 20px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Row 1: Search Input + Presets Periode + Advanced Toggle */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Quick Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Cari No. Nota (TRX-...) atau Nama Pasien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input-neo"
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: searchQuery ? '32px' : '12px',
                fontSize: '0.85rem',
                boxSizing: 'border-box'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Presets Periode Waktu */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { id: 'SEMUA', label: 'Semua Waktu' },
              { id: 'HARI_INI', label: 'Hari Ini' },
              { id: '7_HARI', label: '7 Hari Terakhir' },
              { id: 'BULAN_INI', label: 'Bulan Ini (Okt 2026)' },
              { id: 'CUSTOM', label: 'Rentang Kustom' }
            ].map((p) => {
              const isActive = filterPeriod === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setFilterPeriod(p.id as any)}
                  style={{
                    padding: '7px 13px',
                    borderRadius: '8px',
                    border: '1.5px solid #1E1E1E',
                    backgroundColor: isActive ? '#FEF3D6' : '#FAF8F4',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.78rem',
                    color: '#18181B',
                    cursor: 'pointer',
                    boxShadow: isActive ? '1.5px 1.5px 0px #1E1E1E' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Toggle Filter Lanjutan Button */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(prev => !prev)}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: isAdvancedOpen || activeFiltersCount > 0 ? '#FEF3D6' : '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#18181B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '1.5px 1.5px 0px #1E1E1E',
              flexShrink: 0
            }}
          >
            <SlidersHorizontal size={14} strokeWidth={2.2} />
            <span>Filter Lanjutan</span>
            {activeFiltersCount > 0 && (
              <span style={{
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '0.68rem',
                padding: '1px 6px',
                fontWeight: 800
              }}>
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown size={14} style={{ transform: isAdvancedOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Row 2: Custom Date Inputs (Muncul bila Rentang Kustom dipilih) */}
        {filterPeriod === 'CUSTOM' && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#FAF8F4',
            border: '1.5px solid #1E1E1E',
            borderRadius: '12px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
            animation: 'float-subtle 0.2s ease-out'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} />
              Pilih Rentang Tanggal:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: '#6B7280', fontWeight: 600 }}>Dari:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="form-input-neo"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: '#6B7280', fontWeight: 600 }}>Sampai:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="form-input-neo"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                />
              </div>
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => { setCustomStartDate(''); setCustomEndDate(''); }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.2px solid #1E1E1E',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset Tanggal
                </button>
              )}
            </div>
          </div>
        )}

        {/* Row 3: Extended Filter Controls (Bisa di-toggle / terbuka) */}
        {isAdvancedOpen && (
          <div style={{
            padding: '14px',
            backgroundColor: '#FAF8F4',
            border: '1.5px solid #1E1E1E',
            borderRadius: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            animation: 'float-subtle 0.2s ease-out'
          }}>
            {/* 1. Tipe Transaksi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Tipe Transaksi
              </label>
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Tipe</option>
                <option value="Penebusan Resep">Penebusan Resep</option>
                <option value="Obat Bebas (OTC)">Obat Bebas (OTC)</option>
              </select>
            </div>

            {/* 2. Metode Pembayaran */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Metode Pembayaran
              </label>
              <select
                value={filterMetode}
                onChange={(e) => setFilterMetode(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Metode</option>
                <option value="QRIS">QRIS Kasir</option>
                <option value="Tunai">Uang Tunai (Cash)</option>
              </select>
            </div>

            {/* 3. Kasir / Apoteker PJ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Petugas Kasir
              </label>
              <select
                value={filterKasir}
                onChange={(e) => setFilterKasir(e.target.value)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Kasir</option>
                {uniqueCashiers.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 4. Margin Keuntungan */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Rentang Margin
              </label>
              <select
                value={filterMargin}
                onChange={(e) => setFilterMargin(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="ALL">Semua Rentang</option>
                <option value="HIGH">Margin Tinggi (&gt; 40%)</option>
                <option value="NORMAL">Margin Normal (30% - 40%)</option>
                <option value="LOW">Margin Rendah (&lt; 30%)</option>
              </select>
            </div>

            {/* 5. Sortir Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>
                Urutkan Berdasarkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="form-input-neo"
                style={{ padding: '7px 10px', fontSize: '0.82rem' }}
              >
                <option value="DATE_DESC">Waktu Terbaru</option>
                <option value="DATE_ASC">Waktu Terlama</option>
                <option value="OMZET_DESC">Omzet Tertinggi</option>
                <option value="OMZET_ASC">Omzet Terendah</option>
                <option value="LABA_DESC">Laba Kotor Tertinggi</option>
                <option value="MARGIN_DESC">Margin Tertinggi</option>
              </select>
            </div>
          </div>
        )}

        {/* Row 4: Active Filter Chips & Reset Action */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 700 }}>
              Menampilkan <strong>{filteredRecords.length}</strong> dari {allRecords.length} transaksi:
            </span>

            {/* Chips */}
            {searchQuery && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Keyword: "{searchQuery}"
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
              </span>
            )}
            {filterPeriod !== 'SEMUA' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Periode: {filterPeriod === 'CUSTOM' ? `${customStartDate || 'Awal'} s/d ${customEndDate || 'Akhir'}` : filterPeriod}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterPeriod('SEMUA')} />
              </span>
            )}
            {filterTipe !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Tipe: {filterTipe}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterTipe('ALL')} />
              </span>
            )}
            {filterMetode !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Metode: {filterMetode}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterMetode('ALL')} />
              </span>
            )}
            {filterKasir !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Kasir: {filterKasir}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterKasir('ALL')} />
              </span>
            )}
            {filterMargin !== 'ALL' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#FEF3D6', border: '1px solid #1E1E1E', fontSize: '0.72rem', fontWeight: 700 }}>
                Margin: {filterMargin}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilterMargin('ALL')} />
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1.2px solid #DC2626',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4 KPI CARDS KEUANGAN (Tersinkronisasi Filter Aktif)       */}
      {/* ======================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Total Omzet */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL OMZET BRUTO</span>
            <div style={{ padding: '6px', backgroundColor: '#FEF3D6', border: '1.2px solid #1E1E1E', borderRadius: '8px' }}>
              <TrendingUp size={16} color="#18181B" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Rp {totalOmzet.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
            Dari {filteredRecords.length} transaksi terfilter
          </div>
        </div>

        {/* HPP Modal Obat */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>MODAL HPP TERJUAL</span>
            <div style={{ padding: '6px', backgroundColor: '#FAF8F4', border: '1.2px solid #1E1E1E', borderRadius: '8px' }}>
              <Package size={16} color="#18181B" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Rp {totalHPP.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>
            Biaya pengadaan faktur PBF
          </div>
        </div>

        {/* Laba Kotor Bersih */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E', borderColor: '#16A34A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase' }}>ESTIMASI LABA KOTOR</span>
            <div style={{ padding: '6px', backgroundColor: '#DCFCE7', border: '1.2px solid #16A34A', borderRadius: '8px' }}>
              <DollarSign size={16} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803D', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Rp {totalLabaKotor.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
            Rata-rata Margin: {avgMargin}%
          </div>
        </div>

        {/* Nilai Aset Stok Farmasi */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 800, textTransform: 'uppercase' }}>NILAI STOK GUDANG</span>
            <div style={{ padding: '6px', backgroundColor: '#E0E7FF', border: '1.2px solid #1E1E1E', borderRadius: '8px' }}>
              <PieChart size={16} color="#3730A3" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Rp 48.750.000
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 600 }}>
            Aset fisik obat terdata (FEFO)
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REKAPITULASI 2 METODE PEMBAYARAN: QRIS vs TUNAI          */}
      {/* ======================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Card Kas Masuk QRIS */}
        <div
          onClick={() => setFilterMetode(filterMetode === 'QRIS' ? 'ALL' : 'QRIS')}
          className="neo-card"
          style={{
            padding: '18px 20px',
            backgroundColor: '#FFFFFF',
            border: filterMetode === 'QRIS' ? '2.5px solid #0284C7' : '1.8px solid #1E1E1E',
            boxShadow: filterMetode === 'QRIS' ? '3px 4px 0px #0284C7' : '2px 2px 0px #1E1E1E',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#E0F2FE',
                border: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={20} color="#0284C7" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B' }}>Pembayaran QRIS</div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{countQRIS} Transaksi Terfilter</div>
              </div>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: filterMetode === 'QRIS' ? '#0284C7' : '#F3F4F6',
              color: filterMetode === 'QRIS' ? '#FFFFFF' : '#4B5563',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid #1E1E1E'
            }}>
              {filterMetode === 'QRIS' ? 'Filter Aktif' : 'Klik Filter'}
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0284C7', marginTop: '12px' }}>
            Rp {omzetQRIS.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px' }}>
            Arus kas masuk rekening QRIS apotek
          </div>
        </div>

        {/* Card Kas Masuk TUNAI */}
        <div
          onClick={() => setFilterMetode(filterMetode === 'Tunai' ? 'ALL' : 'Tunai')}
          className="neo-card"
          style={{
            padding: '18px 20px',
            backgroundColor: '#FFFFFF',
            border: filterMetode === 'Tunai' ? '2.5px solid #15803D' : '1.8px solid #1E1E1E',
            boxShadow: filterMetode === 'Tunai' ? '3px 4px 0px #15803D' : '2px 2px 0px #1E1E1E',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                border: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Banknote size={20} color="#15803D" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B' }}>Pembayaran Uang Tunai</div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{countTunai} Transaksi Terfilter</div>
              </div>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: filterMetode === 'Tunai' ? '#15803D' : '#F3F4F6',
              color: filterMetode === 'Tunai' ? '#FFFFFF' : '#4B5563',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid #1E1E1E'
            }}>
              {filterMetode === 'Tunai' ? 'Filter Aktif' : 'Klik Filter'}
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#15803D', marginTop: '12px' }}>
            Rp {omzetTunai.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px' }}>
            Total fisik uang tunai di laci kasir apotek
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABEL RINCIAN ARUS KAS & LABA RUGI TRANSAKSI             */}
      {/* ======================================================== */}
      <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
        <div style={{ marginBottom: '16px', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#18181B', margin: 0 }}>
              Rincian Buku Kas Penjualan Per Nota Transaksi
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#6B7280' }}>
              Kalkulasi otomatis laba kotor per struk (Omzet dikurangi HPP faktur pembelian).
            </p>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#18181B', backgroundColor: '#FEF3D6', border: '1.2px solid #1E1E1E', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
            Total Terfilter: {filteredRecords.length} Nota
          </div>
        </div>

        <div className="table-responsive-neo" style={{ border: '1.8px solid #1E1E1E', borderRadius: '12px' }}>
          <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FEF3D6', borderBottom: '2px solid #1E1E1E' }}>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center', width: '50px' }}>NO</th>
                <th style={{ padding: '12px 14px', fontWeight: 800 }}>WAKTU & NO NOTA</th>
                <th style={{ padding: '12px 14px', fontWeight: 800 }}>TIPE & PASIEN</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center' }}>METODE</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>OMZET (RP)</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>MODAL HPP</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>LABA KOTOR</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center' }}>MARGIN</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center' }}>KASIR</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px 20px', textAlign: 'center', color: '#6B7280' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Filter size={28} style={{ color: '#9CA3AF' }} />
                      <div style={{ fontWeight: 800, color: '#18181B', fontSize: '0.95rem' }}>Tidak ada transaksi yang cocok</div>
                      <div style={{ fontSize: '0.82rem' }}>Coba ubah kata kunci pencarian atau reset filter di atas.</div>
                      <button
                        onClick={handleResetFilters}
                        style={{
                          marginTop: '6px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid #1E1E1E',
                          backgroundColor: '#FEF3D6',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAF8F4' }}>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#6B7280' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 800, color: '#18181B' }}>{item.id}</div>
                      <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px' }}>{item.tanggal}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 800, color: '#18181B' }}>{item.pasien}</div>
                      <span style={{
                        backgroundColor: item.tipe === 'Penebusan Resep' ? '#E0E7FF' : '#DCFCE7',
                        color: item.tipe === 'Penebusan Resep' ? '#3730A3' : '#166534',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {item.tipe}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: item.metode === 'QRIS' ? '#E0F2FE' : '#DCFCE7',
                        color: item.metode === 'QRIS' ? '#0369A1' : '#15803D',
                        border: '1.2px solid #1E1E1E',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800
                      }}>
                        {item.metode === 'QRIS' ? <QrCode size={13} /> : <Banknote size={13} />}
                        {item.metode}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800 }}>
                      Rp {item.omzet.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#4B5563', fontSize: '0.84rem' }}>
                      Rp {item.hpp.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 900, color: '#15803D' }}>
                      +Rp {item.labaKotor.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: item.marginPersen >= 40 ? '#DCFCE7' : item.marginPersen >= 30 ? '#FEF3D6' : '#FEE2E2',
                        color: item.marginPersen >= 40 ? '#15803D' : item.marginPersen >= 30 ? '#92400E' : '#B91C1C',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        border: '1px solid #1E1E1E'
                      }}>
                        {item.marginPersen}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
                      {item.kasir}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
