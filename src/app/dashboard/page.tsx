'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Users,
  ShoppingCart,
  Zap,
  Bot,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  Pill,
  Clock,
  Search,
  Filter,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';

interface TransactionRecord {
  id: string;
  waktu: string;
  pasien: string;
  tipe: 'Penebusan Resep' | 'Obat Bebas (OTC)';
  dokter?: string;
  items: string;
  itemCount: number;
  total: number;
  status: 'Lunas' | 'Pending' | 'Batal';
  skrining: 'Aman' | 'Peringatan' | 'Perlu Perhatian';
  kasir: string;
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  { id: 'TRX-9481', waktu: '14:45 WIB', pasien: 'Budi Santoso', tipe: 'Penebusan Resep', dokter: 'dr. H. Susanto, Sp.PD', items: 'Metformin HCl 500mg, Amlodipine 10mg', itemCount: 2, total: 620000, status: 'Lunas', skrining: 'Aman', kasir: 'Apt. Sarah' },
  { id: 'TRX-9480', waktu: '14:20 WIB', pasien: 'Siti Rahmawati', tipe: 'Penebusan Resep', dokter: 'dr. Anita, Sp.A', items: 'Antasida Suspensi 60ml, Vitamin B-Complex', itemCount: 2, total: 45000, status: 'Lunas', skrining: 'Aman', kasir: 'Apt. Sarah' },
  { id: 'TRX-9479', waktu: '13:50 WIB', pasien: 'Ahmad Fauzi', tipe: 'Penebusan Resep', dokter: 'dr. H. Susanto, Sp.PD', items: 'Metformin HCl 500mg (60 tab)', itemCount: 1, total: 390000, status: 'Lunas', skrining: 'Aman', kasir: 'Rian (Kasir)' },
  { id: 'TRX-9478', waktu: '13:15 WIB', pasien: 'Umum (Walk-in)', tipe: 'Obat Bebas (OTC)', items: 'Paracetamol 500mg (2 strip)', itemCount: 1, total: 16000, status: 'Lunas', skrining: 'Aman', kasir: 'Rian (Kasir)' },
  { id: 'TRX-9477', waktu: '12:40 WIB', pasien: 'Dewi Lestari', tipe: 'Penebusan Resep', dokter: 'dr. Bambang, Sp.P', items: 'Cetirizine 10mg, Salbutamol Inhaler', itemCount: 2, total: 145000, status: 'Lunas', skrining: 'Peringatan', kasir: 'Apt. Sarah' },
  { id: 'TRX-9476', waktu: '11:25 WIB', pasien: 'Hendro Wicaksono', tipe: 'Obat Bebas (OTC)', items: 'Minyak Kayu Putih 120ml, Tolak Angin Box', itemCount: 2, total: 58000, status: 'Lunas', skrining: 'Aman', kasir: 'Rian (Kasir)' },
  { id: 'TRX-9475', waktu: '10:50 WIB', pasien: 'Ratna Juwita', tipe: 'Penebusan Resep', dokter: 'dr. Lestari, Sp.OG', items: 'Folavit 400mcg, Kalsium Laktat', itemCount: 2, total: 85000, status: 'Pending', skrining: 'Aman', kasir: 'Apt. Sarah' },
  { id: 'TRX-9474', waktu: '09:30 WIB', pasien: 'Wahyu Hidayat', tipe: 'Obat Bebas (OTC)', items: 'Promag Tablet (3 strip)', itemCount: 1, total: 27000, status: 'Lunas', skrining: 'Aman', kasir: 'Rian (Kasir)' },
];

export default function DashboardOverviewPage() {
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterSkrining, setFilterSkrining] = useState('ALL');

  const stats = [
    { label: 'Total Pasien Terdaftar', value: '1,428', change: '+18 pasien minggu ini', icon: Users, href: '/dashboard/pasien' },
    { label: 'Transaksi Resep Hari Ini', value: '47 Resep', change: '100% tervalidasi aman', icon: ShoppingCart, href: '/dashboard/kasir' },
    { label: 'Stok Obat Menipis (Defecta)', value: '3 SKU', change: 'Perlu order ke PBF', icon: AlertTriangle, href: '/dashboard/stok', alert: true },
    { label: 'Mendekati Expired (FEFO)', value: '2 Batch', change: '< 60 hari ke depan', icon: Calendar, href: '/dashboard/stok', warn: true },
  ];

  const criticalAlerts = [
    { title: 'Amoxicillin Trihydrate 500mg', desc: 'Batch: BATCH-AMX-2309 kadaluwarsa pada 20 Nov 2026 (< 30 hari). Prioritaskan FEFO atau koordinasi retur.', type: 'danger' },
    { title: 'Amlodipine Besylate 10mg', desc: 'Sisa stok tinggal 9 strip (Batas minimum: 20 strip). Masuk daftar defecta apotek.', type: 'warning' },
  ];

  const filteredTransactions = INITIAL_TRANSACTIONS.filter((trx) => {
    const matchSearch =
      trx.id.toLowerCase().includes(search.toLowerCase()) ||
      trx.pasien.toLowerCase().includes(search.toLowerCase()) ||
      trx.items.toLowerCase().includes(search.toLowerCase()) ||
      (trx.dokter && trx.dokter.toLowerCase().includes(search.toLowerCase()));

    const matchTipe = filterTipe === 'ALL' || trx.tipe === filterTipe;
    const matchStatus = filterStatus === 'ALL' || trx.status === filterStatus;
    const matchSkrining = filterSkrining === 'ALL' || trx.skrining === filterSkrining;

    return matchSearch && matchTipe && matchStatus && matchSkrining;
  });

  const totalOmzetFiltered = filteredTransactions.reduce((acc, curr) => acc + curr.total, 0);

  const handleResetFilter = () => {
    setSearch('');
    setFilterTipe('ALL');
    setFilterStatus('ALL');
    setFilterSkrining('ALL');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Banner Welcome in Neo-Brutalist Style */}
      <div className="neo-card" style={{
        padding: '28px 32px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '3px 4px 0px #1E1E1E'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span className="tag-yellow">Sistem Manajemen Apotek & Farmasi</span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>MediagnoTek Pharmacy OS</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Selamat Datang di MediagnoTek Apotek
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.5 }}>
            Sistem operasional apotek terpadu: Pengawasan stok obat FEFO & kadaluwarsa, rekam medis pasien & skrining alergi, serta kasir penebusan resep.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard/kasir" className="neo-btn-primary" style={{ padding: '12px 24px', fontSize: '0.92rem' }}>
            <ShoppingCart size={18} strokeWidth={2.2} />
            Buka Kasir & Resep
          </Link>
          <Link href="/dashboard/pasien" className="neo-btn-secondary" style={{ padding: '12px 24px', fontSize: '0.92rem' }}>
            <Users size={18} strokeWidth={2} />
            Data Pasien
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {stats.map((st, i) => {
          const IconComp = st.icon;
          return (
            <Link key={i} href={st.href} style={{ textDecoration: 'none' }}>
              <div className="neo-card" style={{
                padding: '22px 24px',
                backgroundColor: '#FFFFFF',
                boxShadow: '2.5px 3px 0px #1E1E1E',
                borderColor: st.alert ? '#DC2626' : st.warn ? '#D97706' : '#1E1E1E',
                transition: 'transform 0.1s ease',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.88rem', color: '#6B7280', fontWeight: 600 }}>{st.label}</span>
                  <IconComp
                    size={24}
                    strokeWidth={2}
                    style={{ color: st.alert ? '#DC2626' : st.warn ? '#D97706' : '#18181B' }}
                  />
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#18181B', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                  {st.value}
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: st.alert ? '#991B1B' : st.warn ? '#92400E' : '#4B5563',
                  border: '1px solid #E5E7EB',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: st.alert ? '#FEE2E2' : st.warn ? '#FEF3C7' : '#FAF8F4'
                }}>
                  {st.change}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Alerts Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {criticalAlerts.map((ca, idx) => (
          <div
            key={idx}
            className="neo-card"
            style={{
              padding: '18px 22px',
              backgroundColor: ca.type === 'danger' ? '#FEF2F2' : '#FFFBEB',
              borderColor: ca.type === 'danger' ? '#DC2626' : '#D97706',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: ca.type === 'danger' ? '#991B1B' : '#92400E', fontSize: '0.92rem' }}>
              <AlertTriangle size={18} />
              Peringatan Inventori: {ca.title}
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '0.84rem', color: '#374151', lineHeight: 1.4 }}>
              {ca.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tabel Transaksi & Pelayanan Resep Terkini */}
      <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', margin: 0 }}>
              Aktivitas Penebusan Resep & Transaksi Terkini
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#6B7280' }}>
              Menampilkan {filteredTransactions.length} dari {INITIAL_TRANSACTIONS.length} transaksi • Subtotal Terpilih: <strong>Rp {totalOmzetFiltered.toLocaleString('id-ID')}</strong>
            </p>
          </div>
          <Link href="/dashboard/kasir" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#18181B', textDecoration: 'underline' }}>
            Buka Kasir Lengkap →
          </Link>
        </div>

        {/* Filter Bar Lengkap */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '18px', backgroundColor: '#FAF8F4', padding: '14px', borderRadius: '12px', border: '1.5px solid #1E1E1E' }}>
          {/* Input Search */}
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Cari ID TRX, Nama Pasien, Dokter, Obat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-neo"
              style={{ paddingLeft: '36px', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          {/* Filter Tipe Transaksi */}
          <div style={{ minWidth: '160px' }}>
            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value)}
              className="form-input-neo"
              style={{ width: '100%', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="ALL">Semua Tipe Transaksi</option>
              <option value="Penebusan Resep">📋 Penebusan Resep</option>
              <option value="Obat Bebas (OTC)">💊 Obat Bebas (OTC)</option>
            </select>
          </div>

          {/* Filter Status Bayar */}
          <div style={{ minWidth: '140px' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input-neo"
              style={{ width: '100%', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="ALL">Semua Status Bayar</option>
              <option value="Lunas">Lunas</option>
              <option value="Pending">Pending</option>
              <option value="Batal">Batal</option>
            </select>
          </div>

          {/* Filter Skrining Alergi */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={filterSkrining}
              onChange={(e) => setFilterSkrining(e.target.value)}
              className="form-input-neo"
              style={{ width: '100%', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <option value="ALL">Semua Status Skrining</option>
              <option value="Aman">✓ Aman</option>
              <option value="Peringatan">⚠️ Peringatan</option>
            </select>
          </div>

          {/* Reset Button */}
          {(search || filterTipe !== 'ALL' || filterStatus !== 'ALL' || filterSkrining !== 'ALL') && (
            <button
              onClick={handleResetFilter}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        {/* Tabel dengan Kolom No Urut (Angka) */}
        <div style={{ overflowX: 'auto', border: '1.8px solid #1E1E1E', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FEF3D6', borderBottom: '2px solid #1E1E1E' }}>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center', width: '50px' }}>NO</th>
                <th style={{ padding: '12px 14px', fontWeight: 800 }}>ID TRX & WAKTU</th>
                <th style={{ padding: '12px 14px', fontWeight: 800 }}>PASIEN & DOKTER</th>
                <th style={{ padding: '12px 14px', fontWeight: 800 }}>TIPE</th>
                <th style={{ padding: '12px 14px', fontWeight: 800 }}>DAFTAR OBAT</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center' }}>QTY</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>TOTAL (RP)</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center' }}>SKRINING</th>
                <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'center' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((trx, index) => (
                <tr key={trx.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAF8F4' }}>
                  {/* Kolom Angka / Nomor Urut */}
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: '#6B7280', fontSize: '0.85rem' }}>
                    {index + 1}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, color: '#18181B' }}>{trx.id}</div>
                    <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px' }}>{trx.waktu} • {trx.kasir}</div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 800, color: '#18181B' }}>{trx.pasien}</div>
                    <div style={{ fontSize: '0.74rem', color: '#4B5563', marginTop: '2px' }}>
                      {trx.dokter ? `Perujuk: ${trx.dokter}` : 'Pembelian Langsung'}
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      backgroundColor: trx.tipe === 'Penebusan Resep' ? '#E0E7FF' : '#DCFCE7',
                      color: trx.tipe === 'Penebusan Resep' ? '#3730A3' : '#166534',
                      border: '1px solid #1E1E1E',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}>
                      {trx.tipe}
                    </span>
                  </td>

                  <td style={{ padding: '12px 14px', color: '#374151', fontSize: '0.82rem', maxWidth: '280px' }}>
                    {trx.items}
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>
                    {trx.itemCount} item
                  </td>

                  <td style={{ padding: '12px 14px', fontWeight: 900, textAlign: 'right', color: '#18181B' }}>
                    Rp {trx.total.toLocaleString('id-ID')}
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {trx.skrining === 'Aman' ? (
                      <span style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #16A34A', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                        ✓ Aman
                      </span>
                    ) : (
                      <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                        ⚠️ Peringatan
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: trx.status === 'Lunas' ? '#F0FDF4' : '#FEF2F2',
                      color: trx.status === 'Lunas' ? '#15803D' : '#B91C1C',
                      border: '1px solid #1E1E1E',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800
                    }}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: '#6B7280', fontSize: '0.9rem' }}>
                    Tidak ada transaksi yang cocok dengan kriteria pencarian dan filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
