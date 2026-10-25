'use client';

import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowDownUp,
  Tag,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { MedicineStock } from '@/lib/api';

const INITIAL_STOCKS: MedicineStock[] = [
  {
    id: 1,
    kode_obat: 'OBT-001',
    nama: 'Paracetamol 500mg',
    kategori: 'Analgesik & Antipiretik',
    golongan: 'Bebas',
    bentuk: 'Tablet',
    satuan: 'Strip (10 Tab)',
    stok: 120,
    min_stok: 30,
    harga_beli: 4500,
    harga_jual: 8000,
    batch_no: 'BATCH-PCT-2401',
    expired_date: '2027-08-15',
    lokasi_rak: 'Rak A-01'
  },
  {
    id: 2,
    kode_obat: 'OBT-002',
    nama: 'Amoxicillin Trihydrate 500mg',
    kategori: 'Antibiotik Penicillin',
    golongan: 'Keras',
    bentuk: 'Kapsul',
    satuan: 'Strip (10 Kapsul)',
    stok: 14,
    min_stok: 25,
    harga_beli: 8500,
    harga_jual: 14000,
    batch_no: 'BATCH-AMX-2309',
    expired_date: '2026-11-20', // Mendekati kadaluwarsa (< 30 hari dari 23 Okt 2026)
    lokasi_rak: 'Rak B-03'
  },
  {
    id: 3,
    kode_obat: 'OBT-003',
    nama: 'Metformin HCl 500mg',
    kategori: 'Antidiabetes Oral',
    golongan: 'Keras',
    bentuk: 'Tablet',
    satuan: 'Strip (10 Tab)',
    stok: 85,
    min_stok: 40,
    harga_beli: 3200,
    harga_jual: 6500,
    batch_no: 'BATCH-MET-2405',
    expired_date: '2027-04-10',
    lokasi_rak: 'Rak C-02'
  },
  {
    id: 4,
    kode_obat: 'OBT-004',
    nama: 'Amlodipine Besylate 10mg',
    kategori: 'Antihipertensi (CCB)',
    golongan: 'Keras',
    bentuk: 'Tablet',
    satuan: 'Strip (10 Tab)',
    stok: 9,
    min_stok: 20,
    harga_beli: 7000,
    harga_jual: 12500,
    batch_no: 'BATCH-AML-2312',
    expired_date: '2027-01-15',
    lokasi_rak: 'Rak C-05'
  },
  {
    id: 5,
    kode_obat: 'OBT-005',
    nama: 'Cetirizine HCl 10mg',
    kategori: 'Antihistamin / Alergi',
    golongan: 'Bebas Terbatas',
    bentuk: 'Tablet Salut',
    satuan: 'Strip (10 Tab)',
    stok: 52,
    min_stok: 20,
    harga_beli: 5000,
    harga_jual: 9000,
    batch_no: 'BATCH-CTZ-2408',
    expired_date: '2028-02-28',
    lokasi_rak: 'Rak A-04'
  },
  {
    id: 6,
    kode_obat: 'OBT-006',
    nama: 'Antasida Doen Suspensi 60ml',
    kategori: 'Antasida Lambung',
    golongan: 'Bebas',
    bentuk: 'Sirup Suspensi',
    satuan: 'Botol',
    stok: 4,
    min_stok: 15,
    harga_beli: 6000,
    harga_jual: 10500,
    batch_no: 'BATCH-ATD-2305',
    expired_date: '2026-11-05', // Segera Expired!
    lokasi_rak: 'Rak D-01'
  }
];

export default function StokPage() {
  const [stocks, setStocks] = useState<MedicineStock[]>(INITIAL_STOCKS);
  const [search, setSearch] = useState('');
  const [filterGolongan, setFilterGolongan] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL | LOW_STOCK | EXPIRING
  const [showAddModal, setShowAddModal] = useState(false);

  // Form New Stock
  const [formData, setFormData] = useState({
    kode_obat: '',
    nama: '',
    kategori: '',
    golongan: 'Bebas' as MedicineStock['golongan'],
    bentuk: 'Tablet',
    satuan: 'Strip (10 Tab)',
    stok: 50,
    min_stok: 20,
    harga_beli: 5000,
    harga_jual: 8000,
    batch_no: '',
    expired_date: '',
    lokasi_rak: 'Rak A-01'
  });

  // Periksa status kadaluwarsa & stok
  const now = new Date('2026-10-23');

  const checkStatus = (item: MedicineStock) => {
    const exp = new Date(item.expired_date);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 3600 * 24));

    const isLow = item.stok <= item.min_stok;
    const isExpiringSoon = diffDays <= 60 && diffDays > 0;
    const isExpired = diffDays <= 0;

    return { diffDays, isLow, isExpiringSoon, isExpired };
  };

  const filteredStocks = stocks.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_obat.toLowerCase().includes(search.toLowerCase()) ||
      item.batch_no.toLowerCase().includes(search.toLowerCase());

    const matchGol = filterGolongan === 'ALL' || item.golongan === filterGolongan;

    const { isLow, isExpiringSoon, isExpired } = checkStatus(item);
    let matchStatus = true;
    if (filterStatus === 'LOW_STOCK') matchStatus = isLow;
    if (filterStatus === 'EXPIRING') matchStatus = isExpiringSoon || isExpired;

    return matchSearch && matchGol && matchStatus;
  });

  const lowStockCount = stocks.filter((s) => s.stok <= s.min_stok).length;
  const expiringCount = stocks.filter((s) => {
    const { isExpiringSoon, isExpired } = checkStatus(s);
    return isExpiringSoon || isExpired;
  }).length;

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const newStock: MedicineStock = {
      id: Date.now(),
      kode_obat: formData.kode_obat || `OBT-${Math.floor(100 + Math.random() * 900)}`,
      nama: formData.nama,
      kategori: formData.kategori || 'Umum',
      golongan: formData.golongan,
      bentuk: formData.bentuk,
      satuan: formData.satuan,
      stok: Number(formData.stok),
      min_stok: Number(formData.min_stok),
      harga_beli: Number(formData.harga_beli),
      harga_jual: Number(formData.harga_jual),
      batch_no: formData.batch_no || `BATCH-${Date.now().toString().slice(-4)}`,
      expired_date: formData.expired_date || '2028-01-01',
      lokasi_rak: formData.lokasi_rak
    };

    setStocks([newStock, ...stocks]);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
            Inventori & Kontrol Stok Obat (FEFO)
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
            Pemantauan fisik stok obat farmasi, nomor batch, kontrol kadaluwarsa First Expired First Out (FEFO), dan batas minimum stok.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FEF3D6',
            border: '2px solid #1E1E1E',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '2.5px 2.5px 0px #1E1E1E'
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Tambah Batch Obat Baru
        </button>
      </div>

      {/* KPI Cards Ringkasan Apotek */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="neo-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', boxShadow: '2px 2px 0px #1E1E1E' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280' }}>TOTAL ITEM TERSEDIA</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#18181B', marginTop: '6px' }}>
            {stocks.length} SKU
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>
            Total fisik: {stocks.reduce((acc, curr) => acc + curr.stok, 0)} Unit
          </div>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          className="neo-card"
          style={{
            padding: '18px',
            backgroundColor: filterStatus === 'LOW_STOCK' ? '#FEF3D6' : '#FFFFFF',
            boxShadow: '2px 2px 0px #1E1E1E',
            cursor: 'pointer',
            borderColor: lowStockCount > 0 ? '#F59E0B' : '#1E1E1E'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309' }}>STOK MENIPIS (DEFECTA)</span>
            <AlertTriangle size={16} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#B45309', marginTop: '6px' }}>
            {lowStockCount} Obat
          </div>
          <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600, marginTop: '4px' }}>
            Perlu pemesanan ke distributor/PBF
          </div>
        </div>

        <div
          onClick={() => setFilterStatus(filterStatus === 'EXPIRING' ? 'ALL' : 'EXPIRING')}
          className="neo-card"
          style={{
            padding: '18px',
            backgroundColor: filterStatus === 'EXPIRING' ? '#FEE2E2' : '#FFFFFF',
            boxShadow: '2px 2px 0px #1E1E1E',
            cursor: 'pointer',
            borderColor: expiringCount > 0 ? '#DC2626' : '#1E1E1E'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#DC2626' }}>MENDEKATI EXPIRED (&lt;60 HARI)</span>
            <Calendar size={16} color="#DC2626" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#DC2626', marginTop: '6px' }}>
            {expiringCount} Batch
          </div>
          <div style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 600, marginTop: '4px' }}>
            Prioritas pengeluaran (FEFO) atau retur
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="neo-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between', boxShadow: '2px 2px 0px #1E1E1E' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '11px', color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Cari nama obat, kode SKU, atau batch no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input-neo"
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <select
            value={filterGolongan}
            onChange={(e) => setFilterGolongan(e.target.value)}
            className="form-input-neo"
            style={{ cursor: 'pointer' }}
          >
            <option value="ALL">Semua Golongan</option>
            <option value="Bebas">Obat Bebas (Hijau)</option>
            <option value="Bebas Terbatas">Obat Bebas Terbatas (Biru)</option>
            <option value="Keras">Obat Keras (Merah / K)</option>
            <option value="Psikotropika">Psikotropika</option>
          </select>
        </div>

        {filterStatus !== 'ALL' && (
          <button
            onClick={() => setFilterStatus('ALL')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: '#F3F4F6',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ✕ Reset Filter Status
          </button>
        )}
      </div>

      {/* Table Data Stok FEFO */}
      <div className="neo-card" style={{ backgroundColor: '#FFFFFF', overflow: 'hidden', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
        <div className="table-responsive-neo">
          <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FEF3D6', borderBottom: '2px solid #1E1E1E' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>KODE & NAMA OBAT</th>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>GOLONGAN</th>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>NO. BATCH & RAK</th>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>KADALUWARSA (FEFO)</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'center' }}>SISA STOK</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'right' }}>HARGA JUAL</th>
                <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'center' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((item) => {
                const { diffDays, isLow, isExpiringSoon, isExpired } = checkStatus(item);

                // Golongan badge color
                const golColor =
                  item.golongan === 'Bebas'
                    ? { bg: '#DCFCE7', text: '#15803D' }
                    : item.golongan === 'Bebas Terbatas'
                    ? { bg: '#DBEAFE', text: '#1D4ED8' }
                    : { bg: '#FEE2E2', text: '#B91C1C' };

                return (
                  <tr key={item.id} style={{ borderBottom: '1.5px solid #E5E7EB', transition: 'background-color 0.1s ease' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#18181B', fontSize: '0.94rem' }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#6B7280', marginTop: '2px' }}>
                        {item.kode_obat} • {item.bentuk} ({item.satuan})
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        backgroundColor: golColor.bg,
                        color: golColor.text,
                        border: '1.2px solid #1E1E1E',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800
                      }}>
                        {item.golongan}
                      </span>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#374151' }}>{item.batch_no}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>📍 {item.lokasi_rak}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{
                        fontWeight: 700,
                        color: isExpired ? '#DC2626' : isExpiringSoon ? '#D97706' : '#1F2937'
                      }}>
                        {item.expired_date}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>
                        {diffDays > 0 ? `${diffDays} hari lagi` : 'Sudah Lewat Expired!'}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 800,
                        color: isLow ? '#DC2626' : '#18181B'
                      }}>
                        {item.stok}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        Min: {item.min_stok}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#18181B' }}>
                        Rp {item.harga_jual.toLocaleString('id-ID')}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        HPP: Rp {item.harga_beli.toLocaleString('id-ID')}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {isExpired ? (
                        <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #DC2626', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          EXPIRED
                        </span>
                      ) : isExpiringSoon ? (
                        <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          SEGERA EXP
                        </span>
                      ) : isLow ? (
                        <span style={{ backgroundColor: '#FFEDD5', color: '#C2410C', border: '1px solid #EA580C', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          STOK TIPIS
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #16A34A', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                          AMAN
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Batch Obat */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="neo-card" style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '4px 4px 0px #1E1E1E'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '10px' }}>
              Penerimaan / Tambah Batch Obat Baru
            </h2>

            <form onSubmit={handleAddStock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Nama Obat *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cefixime 100mg"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Golongan</label>
                  <select
                    value={formData.golongan}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value as any })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  >
                    <option value="Bebas">Obat Bebas</option>
                    <option value="Bebas Terbatas">Obat Bebas Terbatas</option>
                    <option value="Keras">Obat Keras (Resep)</option>
                    <option value="Psikotropika">Psikotropika</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Bentuk Sediaan</label>
                  <select
                    value={formData.bentuk}
                    onChange={(e) => setFormData({ ...formData, bentuk: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Sirup / Suspensi">Sirup / Suspensi</option>
                    <option value="Salep / Krim">Salep / Krim</option>
                    <option value="Serbuk / Puyer">Serbuk / Puyer</option>
                    <option value="Injeksi / Infus">Injeksi / Infus</option>
                    <option value="Tetes Mata/Hidung">Tetes Mata/Hidung</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Satuan Kemasan</label>
                  <select
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  >
                    <option value="Tablet / Pcs">Tablet / Pcs (Satuan Terkecil)</option>
                    <option value="Strip (10 Tab)">Strip (Isi 10 Tablet)</option>
                    <option value="Bungkus / Sachet">Bungkus / Sachet</option>
                    <option value="Botol">Botol</option>
                    <option value="Box / Dus">Box / Dus Besar</option>
                    <option value="Tube">Tube (Salep)</option>
                    <option value="Ampul / Vial">Ampul / Vial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Harga Beli HPP (Rp)</label>
                  <input
                    type="number"
                    value={formData.harga_beli}
                    onChange={(e) => setFormData({ ...formData, harga_beli: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>Modal faktur dari PBF</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                    Harga Jual Standar (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.harga_jual}
                    onChange={(e) => setFormData({ ...formData, harga_jual: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 600 }}>
                    ℹ️ Sebagai placeholder/acuan (bisa diubah kasir)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #1E1E1E',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: '1.8px solid #1E1E1E',
                    backgroundColor: '#FEF3D6',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px #1E1E1E'
                  }}
                >
                  Simpan ke Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
