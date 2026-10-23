'use client';

import { useState } from 'react';
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
  Banknote
} from 'lucide-react';

interface FinancialRecord {
  id: string;
  tanggal: string;
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
  { id: 'TRX-9481', tanggal: '2026-10-23 14:45', tipe: 'Penebusan Resep', pasien: 'Budi Santoso', omzet: 620000, hpp: 410000, labaKotor: 210000, marginPersen: 33.8, metode: 'QRIS', kasir: 'Apt. Sarah' },
  { id: 'TRX-9480', tanggal: '2026-10-23 14:20', tipe: 'Penebusan Resep', pasien: 'Siti Rahmawati', omzet: 45000, hpp: 28000, labaKotor: 17000, marginPersen: 37.7, metode: 'Tunai', kasir: 'Apt. Sarah' },
  { id: 'TRX-9479', tanggal: '2026-10-23 13:50', tipe: 'Penebusan Resep', pasien: 'Ahmad Fauzi', omzet: 390000, hpp: 245000, labaKotor: 145000, marginPersen: 37.1, metode: 'QRIS', kasir: 'Rian' },
  { id: 'TRX-9478', tanggal: '2026-10-23 13:15', tipe: 'Obat Bebas (OTC)', pasien: 'unknown', omzet: 16000, hpp: 9000, labaKotor: 7000, marginPersen: 43.7, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9477', tanggal: '2026-10-23 12:40', tipe: 'Penebusan Resep', pasien: 'Dewi Lestari', omzet: 145000, hpp: 92000, labaKotor: 53000, marginPersen: 36.5, metode: 'QRIS', kasir: 'Apt. Sarah' },
  { id: 'TRX-9476', tanggal: '2026-10-23 11:25', tipe: 'Obat Bebas (OTC)', pasien: 'Hendro W.', omzet: 58000, hpp: 36000, labaKotor: 22000, marginPersen: 37.9, metode: 'Tunai', kasir: 'Rian' },
  { id: 'TRX-9475', tanggal: '2026-10-23 10:50', tipe: 'Penebusan Resep', pasien: 'Ratna Juwita', omzet: 85000, hpp: 54000, labaKotor: 31000, marginPersen: 36.4, metode: 'Tunai', kasir: 'Apt. Sarah' },
  { id: 'TRX-9474', tanggal: '2026-10-23 09:30', tipe: 'Obat Bebas (OTC)', pasien: 'unknown', omzet: 27000, hpp: 16500, labaKotor: 10500, marginPersen: 38.8, metode: 'QRIS', kasir: 'Rian' },
];

export default function KeuanganPage() {
  const [filterPeriod, setFilterPeriod] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Harian');
  const [filterMetode, setFilterMetode] = useState<'ALL' | 'QRIS' | 'Tunai'>('ALL');

  const filteredRecords = INITIAL_FINANCIALS.filter((r) => {
    return filterMetode === 'ALL' || r.metode === filterMetode;
  });

  const totalOmzet = filteredRecords.reduce((acc, curr) => acc + curr.omzet, 0);
  const totalHPP = filteredRecords.reduce((acc, curr) => acc + curr.hpp, 0);
  const totalLabaKotor = filteredRecords.reduce((acc, curr) => acc + curr.labaKotor, 0);
  const avgMargin = totalOmzet > 0 ? ((totalLabaKotor / totalOmzet) * 100).toFixed(1) : '0';

  // Rekapitulasi Kas Masuk QRIS vs TUNAI
  const omzetQRIS = INITIAL_FINANCIALS.filter(r => r.metode === 'QRIS').reduce((acc, curr) => acc + curr.omzet, 0);
  const omzetTunai = INITIAL_FINANCIALS.filter(r => r.metode === 'Tunai').reduce((acc, curr) => acc + curr.omzet, 0);
  const countQRIS = INITIAL_FINANCIALS.filter(r => r.metode === 'QRIS').length;
  const countTunai = INITIAL_FINANCIALS.filter(r => r.metode === 'Tunai').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Title & Periode Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={28} strokeWidth={2.3} style={{ color: '#18181B' }} />
            Laporan Keuangan & Profit Apotek
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Analisis arus kas harian tersinkronisasi kasir (Metode: QRIS & Uang Tunai), perputaran modal HPP obat, dan estimasi margin laba kotor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['Harian', 'Mingguan', 'Bulanan'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPeriod(p)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: filterPeriod === p ? '#FEF3D6' : '#FFFFFF',
                fontWeight: filterPeriod === p ? 800 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: filterPeriod === p ? '2px 2px 0px #1E1E1E' : 'none'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards Keuangan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Total Omzet */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 700 }}>TOTAL OMZET BRUTO</span>
            <div style={{ padding: '6px', backgroundColor: '#FEF3D6', border: '1.2px solid #1E1E1E', borderRadius: '8px' }}>
              <TrendingUp size={16} color="#18181B" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Rp {totalOmzet.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
            ↑ +14.2% dibanding kemarin
          </div>
        </div>

        {/* HPP Modal Obat */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 700 }}>MODAL HPP TERJUAL</span>
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
            <span style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 800 }}>ESTIMASI LABA KOTOR</span>
            <div style={{ padding: '6px', backgroundColor: '#DCFCE7', border: '1.2px solid #16A34A', borderRadius: '8px' }}>
              <DollarSign size={16} color="#15803D" />
            </div>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803D', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Rp {totalLabaKotor.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>
            Margin Keuntungan: {avgMargin}%
          </div>
        </div>

        {/* Nilai Aset Stok Farmasi */}
        <div className="neo-card" style={{ padding: '22px 24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 700 }}>TOTAL NILAI STOK GUDANG</span>
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

      {/* Rekapitulasi Sinkronisasi 2 Metode Pembayaran Kasir: QRIS vs TUNAI */}
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
            cursor: 'pointer'
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
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{countQRIS} Transaksi Pas</div>
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
            cursor: 'pointer'
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
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{countTunai} Transaksi Cash</div>
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

      {/* Filter Bar Tabel */}
      <div className="neo-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', boxShadow: '2px 2px 0px #1E1E1E' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B' }}>Filter Metode Bayar:</span>
          <select
            value={filterMetode}
            onChange={(e) => setFilterMetode(e.target.value as any)}
            className="form-input-neo"
            style={{ fontSize: '0.84rem', cursor: 'pointer' }}
          >
            <option value="ALL">Semua Metode (QRIS & Tunai)</option>
            <option value="QRIS">📱 QRIS (Otomatis Pas)</option>
            <option value="Tunai">💵 Uang Tunai / Cash Kasir</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert('Fitur Ekspor Laporan Excel/CSV siap diunduh.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px #1E1E1E'
            }}
          >
            <Download size={15} />
            Ekspor Laporan
          </button>
        </div>
      </div>


      {/* Tabel Rincian Arus Kas & Laba Rugi Transaksi */}
      <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
        <div style={{ marginBottom: '16px', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#18181B', margin: 0 }}>
            Rincian Buku Kas Penjualan Per Nota Transaksi
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#6B7280' }}>
            Data kalkulasi otomatis laba kotor per struk (Omzet dikurangi HPP pembelian dari PBF).
          </p>
        </div>

        <div style={{ overflowX: 'auto', border: '1.8px solid #1E1E1E', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
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
              {filteredRecords.map((item, idx) => (
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
                    <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', fontSize: '0.74rem' }}>
                      {item.marginPersen}%
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.82rem', color: '#374151' }}>
                    {item.kasir}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
