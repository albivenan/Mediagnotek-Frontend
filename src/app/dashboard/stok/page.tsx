'use client';

import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowDownUp,
  Tag,
  CheckCircle,
  FileSpreadsheet,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Check,
  Clock,
  ShieldAlert,
  Boxes,
  MapPin,
  Barcode,
  Coins,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { MedicineStock, apiGetStocks, apiCreateStock, apiUpdateStock, apiDeleteStock } from '@/lib/api';

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

  // View state: 'list' | 'detail' | 'edit' | 'add'
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'edit' | 'add'>('list');
  const [selectedStock, setSelectedStock] = useState<MedicineStock | null>(null);

  // Notification Toast State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (message: string, type: 'success' | 'danger' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Form State
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

  // Load from backend database on mount with localStorage fallback & real-time sync
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        const apiData = await apiGetStocks();
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          setStocks(apiData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mediagnotek_stocks_data', JSON.stringify(apiData));
          }
          return;
        }
      } catch (err) {
        console.warn('Backend sync failed, reading local storage:', err);
      }

      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('mediagnotek_stocks_data');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const normalized: MedicineStock[] = parsed.map((s: any, idx: number) => ({
                id: s.id || idx + 1,
                kode_obat: s.kode_obat || `OBT-00${s.id || idx + 1}`,
                nama: s.nama || 'Obat Farmasi',
                kategori: s.kategori || 'Obat Umum',
                golongan: s.golongan || 'Bebas',
                bentuk: s.bentuk || (String(s.satuan || '').includes('Botol') ? 'Sirup' : 'Tablet'),
                satuan: s.satuan || 'Strip (10 Tab)',
                stok: Number(s.stok) || 0,
                min_stok: Number(s.min_stok) || 15,
                harga_beli: Number(s.harga_beli) || Math.round((Number(s.harga_jual) || 10000) * 0.6),
                harga_jual: Number(s.harga_jual) || 10000,
                batch_no: s.batch_no || s.kode_batch || `BATCH-2026-0${s.id || idx + 1}`,
                expired_date: s.expired_date || '2027-06-30',
                lokasi_rak: s.lokasi_rak || 'Rak A-01'
              }));
              setStocks(normalized);
              return;
            }
          }
          // Inisialisasi localStorage jika belum ada agar Kasir & Laporan Keuangan selalu sinkron
          localStorage.setItem('mediagnotek_stocks_data', JSON.stringify(INITIAL_STOCKS));
        } catch (e) {
          console.warn('Gagal membaca data stok dari storage:', e);
        }
      }
    };

    fetchStocksData();

    const handleSync = () => {
      if (typeof window === 'undefined') return;
      try {
        const saved = localStorage.getItem('mediagnotek_stocks_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized: MedicineStock[] = parsed.map((s: any, idx: number) => ({
              id: s.id || idx + 1,
              kode_obat: s.kode_obat || `OBT-00${s.id || idx + 1}`,
              nama: s.nama || 'Obat Farmasi',
              kategori: s.kategori || 'Obat Umum',
              golongan: s.golongan || 'Bebas',
              bentuk: s.bentuk || (String(s.satuan || '').includes('Botol') ? 'Sirup' : 'Tablet'),
              satuan: s.satuan || 'Strip (10 Tab)',
              stok: Number(s.stok) || 0,
              min_stok: Number(s.min_stok) || 15,
              harga_beli: Number(s.harga_beli) || Math.round((Number(s.harga_jual) || 10000) * 0.6),
              harga_jual: Number(s.harga_jual) || 10000,
              batch_no: s.batch_no || s.kode_batch || `BATCH-2026-0${s.id || idx + 1}`,
              expired_date: s.expired_date || '2027-06-30',
              lokasi_rak: s.lokasi_rak || 'Rak A-01'
            }));
            setStocks(normalized);
          }
        }
      } catch {}
    };

    window.addEventListener('mediagnotek_data_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('mediagnotek_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Save to localStorage helper
  const updateStocksList = (newList: MedicineStock[]) => {
    setStocks(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediagnotek_stocks_data', JSON.stringify(newList));
      window.dispatchEvent(new Event('mediagnotek_data_updated'));
    }
  };

  // Periksa status kadaluwarsa & stok (basis waktu real-time hari ini, tanpa hardcode)
  const now = new Date();

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
      item.batch_no.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase()) ||
      item.lokasi_rak.toLowerCase().includes(search.toLowerCase());

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

  // Navigasi ke Halaman Tambah Stok Baru
  const handleOpenAddPage = () => {
    setFormData({
      kode_obat: `OBT-${Math.floor(100 + Math.random() * 900)}`,
      nama: '',
      kategori: '',
      golongan: 'Bebas',
      bentuk: 'Tablet',
      satuan: 'Strip (10 Tab)',
      stok: 50,
      min_stok: 20,
      harga_beli: 5000,
      harga_jual: 8000,
      batch_no: `BATCH-${Date.now().toString().slice(-4)}`,
      expired_date: '2028-01-01',
      lokasi_rak: 'Rak A-01'
    });
    setCurrentView('add');
  };

  // Navigasi ke Detail
  const handleViewDetail = (item: MedicineStock) => {
    setSelectedStock(item);
    setCurrentView('detail');
  };

  // Navigasi ke Edit
  const handleOpenEditPage = (item: MedicineStock) => {
    setSelectedStock(item);
    setFormData({
      kode_obat: item.kode_obat,
      nama: item.nama,
      kategori: item.kategori,
      golongan: item.golongan,
      bentuk: item.bentuk,
      satuan: item.satuan,
      stok: item.stok,
      min_stok: item.min_stok,
      harga_beli: item.harga_beli,
      harga_jual: item.harga_jual,
      batch_no: item.batch_no,
      expired_date: item.expired_date,
      lokasi_rak: item.lokasi_rak
    });
    setCurrentView('edit');
  };

  // Simpan Tambah Stok Baru (tersinkron ke Database Backend)
  const handleSaveNewStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      showToast('Nama obat wajib diisi!', 'danger');
      return;
    }

    const payload = {
      kode_obat: formData.kode_obat.trim() || `OBT-${Math.floor(100 + Math.random() * 900)}`,
      nama: formData.nama.trim(),
      kategori: formData.kategori.trim() || 'Umum',
      golongan: formData.golongan,
      bentuk: formData.bentuk,
      satuan: formData.satuan,
      stok: Number(formData.stok),
      min_stok: Number(formData.min_stok),
      harga_beli: Number(formData.harga_beli),
      harga_jual: Number(formData.harga_jual),
      batch_no: formData.batch_no.trim() || `BATCH-${Date.now().toString().slice(-4)}`,
      expired_date: formData.expired_date || '2028-01-01',
      lokasi_rak: formData.lokasi_rak.trim() || 'Rak A-01'
    };

    let savedStock: MedicineStock | null = null;
    try {
      savedStock = await apiCreateStock(payload);
    } catch (_) {}

    const newStock: MedicineStock = savedStock || {
      id: Date.now(),
      ...payload
    };

    const updated = [newStock, ...stocks];
    updateStocksList(updated);
    showToast(`Batch obat "${newStock.nama}" berhasil tersinkron ke database!`);
    setCurrentView('list');
  };

  // Simpan Perubahan Edit (tersinkron ke Database Backend)
  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;
    if (!formData.nama.trim()) {
      showToast('Nama obat wajib diisi!', 'danger');
      return;
    }

    const payload = {
      kode_obat: formData.kode_obat.trim(),
      nama: formData.nama.trim(),
      kategori: formData.kategori.trim() || 'Umum',
      golongan: formData.golongan,
      bentuk: formData.bentuk,
      satuan: formData.satuan,
      stok: Number(formData.stok),
      min_stok: Number(formData.min_stok),
      harga_beli: Number(formData.harga_beli),
      harga_jual: Number(formData.harga_jual),
      batch_no: formData.batch_no.trim(),
      expired_date: formData.expired_date,
      lokasi_rak: formData.lokasi_rak.trim()
    };

    let updatedFromApi: MedicineStock | null = null;
    try {
      updatedFromApi = await apiUpdateStock(selectedStock.id, payload);
    } catch (_) {}

    const updatedStock: MedicineStock = updatedFromApi || {
      ...selectedStock,
      ...payload
    };

    const updated = stocks.map((s) => (s.id === selectedStock.id ? updatedStock : s));
    updateStocksList(updated);
    setSelectedStock(updatedStock);
    showToast(`Data stok "${updatedStock.nama}" berhasil tersinkron ke database!`);
    setCurrentView('detail');
  };

  // Hapus Stok (tersinkron ke Database Backend)
  const handleDeleteStock = async (item: MedicineStock) => {
    const isConfirm = window.confirm(
      `Apakah Anda yakin ingin menghapus data stok "${item.nama}" (Batch: ${item.batch_no}) dari database?`
    );
    if (!isConfirm) return;

    try {
      await apiDeleteStock(item.id);
    } catch (_) {}

    const updated = stocks.filter((s) => s.id !== item.id);
    updateStocksList(updated);
    showToast(`Stok "${item.nama}" berhasil dihapus dari database.`, 'danger');
    if (selectedStock?.id === item.id) {
      setSelectedStock(null);
    }
    setCurrentView('list');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification Alert */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: notification.type === 'success' ? '#DCFCE7' : '#FEE2E2',
          border: `2px solid ${notification.type === 'success' ? '#166534' : '#991B1B'}`,
          color: notification.type === 'success' ? '#14532D' : '#7F1D1D',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '3px 3px 0px #1E1E1E',
          fontWeight: 800,
          fontSize: '0.88rem'
        }}>
          {notification.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '6px', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ===================== VIEW 1: DAFTAR STOK (LIST) ===================== */}
      {currentView === 'list' && (
        <>
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
              onClick={handleOpenAddPage}
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
                backgroundColor: filterStatus === 'LOW_STOCK' ? '#FFF7ED' : '#FFFFFF',
                borderColor: filterStatus === 'LOW_STOCK' ? '#EA580C' : '#1E1E1E',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EA580C' }}>STOK MENIPIS (&lt;= MIN)</span>
                <AlertTriangle size={18} color="#EA580C" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#EA580C', marginTop: '6px' }}>
                {lowStockCount} Batch
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
                Klik untuk filter stok menipis
              </div>
            </div>

            <div
              onClick={() => setFilterStatus(filterStatus === 'EXPIRING' ? 'ALL' : 'EXPIRING')}
              className="neo-card"
              style={{
                padding: '18px',
                backgroundColor: filterStatus === 'EXPIRING' ? '#FEF2F2' : '#FFFFFF',
                borderColor: filterStatus === 'EXPIRING' ? '#DC2626' : '#1E1E1E',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#DC2626' }}>SEGERA EXPIRED (&lt;= 60 HARI)</span>
                <Calendar size={18} color="#DC2626" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#DC2626', marginTop: '6px' }}>
                {expiringCount} Batch
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
                Perlu tindakan FEFO / retur distributor
              </div>
            </div>

            <div className="neo-card" style={{ padding: '18px', backgroundColor: '#FFFFFF', boxShadow: '2px 2px 0px #1E1E1E' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280' }}>ESTIMASI NILAI ASET INVENTORI</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#166534', marginTop: '6px' }}>
                Rp {stocks.reduce((acc, curr) => acc + (curr.stok * curr.harga_beli), 0).toLocaleString('id-ID')}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
                Total nilai HPP modal apotek
              </div>
            </div>
          </div>

          {/* Bar Filter & Pencarian */}
          <div className="neo-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF', boxShadow: '2px 2.5px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
                  <input
                    type="text"
                    placeholder="Cari nama obat, kode SKU, kategori, rak, atau batch..."
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: '#FEF3D6',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1.2px solid #1E1E1E',
                  color: '#18181B'
                }}>
                  Total: <strong>{filteredStocks.length} Batch</strong>
                </span>

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
            </div>
          </div>

          {/* Table Data Stok FEFO dengan Kolom No & Aksi Detail */}
          <div className="neo-card" style={{ padding: '0px', backgroundColor: '#FFFFFF', overflow: 'hidden', boxShadow: '3px 3.5px 0px #1E1E1E' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F4', borderBottom: '2px solid #1E1E1E' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', width: '60px', textAlign: 'center' }}>No</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>Kode & Nama Obat</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>Golongan</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>No. Batch & Rak</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>Kadaluwarsa (FEFO)</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', textAlign: 'center' }}>Sisa Stok</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', textAlign: 'right' }}>Harga Jual</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', textAlign: 'center', width: '110px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((item, idx) => {
                    const { diffDays, isLow, isExpiringSoon, isExpired } = checkStatus(item);

                    // Golongan badge color
                    const golColor =
                      item.golongan === 'Bebas'
                        ? { bg: '#DCFCE7', text: '#15803D' }
                        : item.golongan === 'Bebas Terbatas'
                        ? { bg: '#DBEAFE', text: '#1D4ED8' }
                        : item.golongan === 'Psikotropika'
                        ? { bg: '#F3E8FF', text: '#7E22CE' }
                        : { bg: '#FEE2E2', text: '#B91C1C' };

                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1.5px solid #F3F4F6',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FDFCF9',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {/* 1. Nomor Urut */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 800, color: '#18181B' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '26px',
                            height: '26px',
                            lineHeight: '24px',
                            borderRadius: '6px',
                            backgroundColor: '#FEF3D6',
                            border: '1.2px solid #1E1E1E',
                            fontSize: '0.78rem'
                          }}>
                            {idx + 1}
                          </span>
                        </td>

                        {/* 2. Kode & Nama Obat */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#18181B', fontSize: '0.94rem' }}>
                            {item.nama}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1F2937' }}>{item.kode_obat}</span> • {item.bentuk} ({item.satuan})
                          </div>
                        </td>

                        {/* 3. Golongan */}
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
                          <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '4px' }}>
                            {item.kategori}
                          </div>
                        </td>

                        {/* 4. No Batch & Lokasi Rak */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>{item.batch_no}</div>
                          <div style={{ fontSize: '0.75rem', color: '#4B5563', marginTop: '2px' }}>📍 {item.lokasi_rak}</div>
                        </td>

                        {/* 5. Kadaluwarsa */}
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

                        {/* 6. Sisa Stok */}
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

                        {/* 7. Harga Jual */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#18181B' }}>
                            Rp {item.harga_jual.toLocaleString('id-ID')}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                            HPP: Rp {item.harga_beli.toLocaleString('id-ID')}
                          </div>
                        </td>

                        {/* 8. Status */}
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

                        {/* 9. Aksi (Detail) */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleViewDetail(item)}
                            title="Lihat Detail Inventori Obat"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              borderRadius: '8px',
                              border: '1.2px solid #1E1E1E',
                              backgroundColor: '#E0E7FF',
                              color: '#3730A3',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              boxShadow: '1.5px 1.5px 0px #1E1E1E',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Eye size={14} strokeWidth={2.4} />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredStocks.length === 0 && (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        Tidak ada data stok obat yang cocok dengan filter atau pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===================== VIEW 2: HALAMAN DETAIL STOK OBAT ===================== */}
      {currentView === 'detail' && selectedStock && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Navigasi Kembali & Action Edit / Hapus */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <button
              onClick={() => setCurrentView('list')}
              className="neo-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.86rem',
                fontWeight: 700
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.4} />
              <span>Kembali ke Daftar Stok</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleOpenEditPage(selectedStock)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1.8px solid #1E1E1E',
                  backgroundColor: '#FEF3D6',
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '1.5px 1.5px 0px #1E1E1E'
                }}
              >
                <Pencil size={15} strokeWidth={2.2} />
                <span>Edit Batch Obat</span>
              </button>
              <button
                onClick={() => handleDeleteStock(selectedStock)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1.8px solid #1E1E1E',
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '1.5px 1.5px 0px #1E1E1E'
                }}
              >
                <Trash2 size={15} strokeWidth={2.2} />
                <span>Hapus Batch</span>
              </button>
            </div>
          </div>

          {/* Kartu Profil Utama Obat */}
          <div className="neo-card" style={{ padding: '26px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '18px', marginBottom: '22px' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#E0E7FF',
                  border: '1.2px solid #1E1E1E',
                  color: '#3730A3',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}>
                  SKU #{selectedStock.kode_obat}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#18181B', margin: 0 }}>
                  {selectedStock.nama}
                </h2>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', color: '#4B5563', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Tag size={15} /> Kategori: <strong>{selectedStock.kategori}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Boxes size={15} /> Bentuk Sediaan: <strong>{selectedStock.bentuk} ({selectedStock.satuan})</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={15} /> Lokasi Rak: <strong>{selectedStock.lokasi_rak}</strong>
                  </span>
                </div>
              </div>

              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#FEF3D6',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <Package size={26} color="#1E1E1E" />
              </div>
            </div>

            {/* 1. Baris Status Stok & Status Kadaluwarsa */}
            {(() => {
              const { diffDays, isLow, isExpiringSoon, isExpired } = checkStatus(selectedStock);
              const marginRp = selectedStock.harga_jual - selectedStock.harga_beli;
              const marginPersen = selectedStock.harga_beli > 0 ? Math.round((marginRp / selectedStock.harga_beli) * 100) : 0;

              return (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    {/* Kartu Status Fisik Stok */}
                    <div style={{
                      backgroundColor: isLow ? '#FFF7ED' : '#F0FDF4',
                      border: '1.8px solid #1E1E1E',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      boxShadow: '2px 2px 0px #1E1E1E'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: isLow ? '#C2410C' : '#166534', fontSize: '0.92rem', marginBottom: '8px' }}>
                        <Boxes size={18} />
                        STATUS FISIK STOK INVENTORI
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 900, color: isLow ? '#C2410C' : '#15803D' }}>
                          {selectedStock.stok}
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#4B5563' }}>
                          {selectedStock.satuan}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#4B5563', marginTop: '6px' }}>
                        Batas Minimum Stok: <strong>{selectedStock.min_stok} {selectedStock.satuan}</strong>
                      </div>
                      {isLow ? (
                        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFEDD5', border: '1px solid #EA580C', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#9A3412' }}>
                          <AlertTriangle size={14} /> Peringatan: Stok berada di bawah ambang batas aman!
                        </div>
                      ) : (
                        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#DCFCE7', border: '1px solid #16A34A', padding: '3px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#166534' }}>
                          <CheckCircle size={14} /> Stok dalam kondisi aman untuk pelayanan resep
                        </div>
                      )}
                    </div>

                    {/* Kartu Kontrol Kadaluwarsa (FEFO) */}
                    <div style={{
                      backgroundColor: isExpired ? '#FEF2F2' : isExpiringSoon ? '#FFFBEB' : '#EFF6FF',
                      border: '1.8px solid #1E1E1E',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      boxShadow: '2px 2px 0px #1E1E1E'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: isExpired ? '#991B1B' : isExpiringSoon ? '#92400E' : '#1E40AF', fontSize: '0.92rem', marginBottom: '8px' }}>
                        <Clock size={18} />
                        KONTROL KADALUWARSA (FEFO)
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: isExpired ? '#DC2626' : isExpiringSoon ? '#D97706' : '#1E3A8A' }}>
                        {selectedStock.expired_date}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#4B5563', marginTop: '4px' }}>
                        Nomor Batch: <strong style={{ fontFamily: 'monospace' }}>{selectedStock.batch_no}</strong>
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {isExpired ? (
                          <span style={{ color: '#DC2626', backgroundColor: '#FEE2E2', padding: '3px 8px', borderRadius: '6px', border: '1px solid #DC2626' }}>
                            ⚠️ Obat telah melewati tanggal kadaluwarsa! Segera pisahkan ke area karantina.
                          </span>
                        ) : isExpiringSoon ? (
                          <span style={{ color: '#D97706', backgroundColor: '#FEF3C7', padding: '3px 8px', borderRadius: '6px', border: '1px solid #F59E0B' }}>
                            ⏳ Tersisa {diffDays} hari lagi. Prioritaskan pengeluaran pertama (FEFO).
                          </span>
                        ) : (
                          <span style={{ color: '#15803D', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '6px', border: '1px solid #16A34A' }}>
                            ✅ Kadaluwarsa masih panjang ({diffDays} hari lagi).
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Detail Spesifikasi & Finansial */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {/* Spesifikasi Teknis Farmasi */}
                    <div style={{
                      backgroundColor: '#FAF8F4',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '18px'
                    }}>
                      <h4 style={{ margin: '0 0 14px 0', fontSize: '0.92rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={16} /> Spesifikasi Regulasi Obat
                      </h4>
                      <table style={{ width: '100%', fontSize: '0.84rem', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280', width: '40%' }}>Golongan Regulasi</td>
                            <td style={{ padding: '8px 0', fontWeight: 800, color: '#18181B' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid #1E1E1E',
                                backgroundColor: selectedStock.golongan === 'Bebas' ? '#DCFCE7' : selectedStock.golongan === 'Bebas Terbatas' ? '#DBEAFE' : '#FEE2E2',
                                color: selectedStock.golongan === 'Bebas' ? '#15803D' : selectedStock.golongan === 'Bebas Terbatas' ? '#1D4ED8' : '#B91C1C'
                              }}>
                                {selectedStock.golongan}
                              </span>
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Kategori Farmakologi</td>
                            <td style={{ padding: '8px 0', fontWeight: 700, color: '#18181B' }}>{selectedStock.kategori}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Bentuk Sediaan</td>
                            <td style={{ padding: '8px 0', fontWeight: 700, color: '#18181B' }}>{selectedStock.bentuk}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Satuan Kemasan</td>
                            <td style={{ padding: '8px 0', fontWeight: 700, color: '#18181B' }}>{selectedStock.satuan}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Lokasi Rak / Lemari</td>
                            <td style={{ padding: '8px 0', fontWeight: 700, color: '#18181B' }}>📍 {selectedStock.lokasi_rak}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Informasi Harga & Margin Apotek */}
                    <div style={{
                      backgroundColor: '#FAF8F4',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: '12px',
                      padding: '18px'
                    }}>
                      <h4 style={{ margin: '0 0 14px 0', fontSize: '0.92rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Coins size={16} /> Struktur Harga & Margin Laba
                      </h4>
                      <table style={{ width: '100%', fontSize: '0.84rem', borderCollapse: 'collapse' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280', width: '40%' }}>Harga Beli HPP (PBF)</td>
                            <td style={{ padding: '8px 0', fontWeight: 800, color: '#18181B' }}>
                              Rp {selectedStock.harga_beli.toLocaleString('id-ID')}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Harga Jual Standar</td>
                            <td style={{ padding: '8px 0', fontWeight: 800, color: '#15803D', fontSize: '0.94rem' }}>
                              Rp {selectedStock.harga_jual.toLocaleString('id-ID')}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Margin Laba Nominal</td>
                            <td style={{ padding: '8px 0', fontWeight: 800, color: '#2563EB' }}>
                              + Rp {marginRp.toLocaleString('id-ID')} / {selectedStock.satuan}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Persentase Margin</td>
                            <td style={{ padding: '8px 0', fontWeight: 800, color: '#2563EB' }}>
                              {marginPersen}%
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 0', color: '#6B7280' }}>Total Nilai Stok Fisik</td>
                            <td style={{ padding: '8px 0', fontWeight: 800, color: '#18181B' }}>
                              Rp {(selectedStock.stok * selectedStock.harga_beli).toLocaleString('id-ID')} (HPP)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ===================== VIEW 3: HALAMAN EDIT STOK OBAT ===================== */}
      {currentView === 'edit' && selectedStock && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Navigasi */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentView('detail')}
              className="neo-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.86rem',
                fontWeight: 700
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.4} />
              <span>Kembali ke Detail</span>
            </button>

            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6B7280' }}>
              Mode Edit SKU #{selectedStock.kode_obat}
            </span>
          </div>

          <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#18181B', marginBottom: '8px' }}>
              Edit Data Batch Stok Obat
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#6B7280', marginBottom: '24px' }}>
              Perbarui rincian fisik batch obat, batas stok minimum, nomor batch, atau lokasi penataan rak apotek.
            </p>

            <form onSubmit={handleUpdateStock} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Kode Obat (SKU) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kode_obat}
                    onChange={(e) => setFormData({ ...formData, kode_obat: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', fontFamily: 'monospace' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nama Lengkap Obat & Dosis <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Kategori Farmakologi
                  </label>
                  <input
                    type="text"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Golongan Regulasi
                  </label>
                  <select
                    value={formData.golongan}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value as any })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
                  >
                    <option value="Bebas">Obat Bebas (Hijau)</option>
                    <option value="Bebas Terbatas">Obat Bebas Terbatas (Biru)</option>
                    <option value="Keras">Obat Keras (Merah / K)</option>
                    <option value="Psikotropika">Psikotropika</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Bentuk Sediaan
                  </label>
                  <select
                    value={formData.bentuk}
                    onChange={(e) => setFormData({ ...formData, bentuk: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Satuan Kemasan
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
                  >
                    <option value="Tablet / Pcs">Tablet / Pcs (Satuan Terkecil)</option>
                    <option value="Strip (10 Tab)">Strip (Isi 10 Tablet)</option>
                    <option value="Strip (10 Kapsul)">Strip (Isi 10 Kapsul)</option>
                    <option value="Bungkus / Sachet">Bungkus / Sachet</option>
                    <option value="Botol">Botol</option>
                    <option value="Box / Dus">Box / Dus Besar</option>
                    <option value="Tube">Tube (Salep)</option>
                    <option value="Ampul / Vial">Ampul / Vial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nomor Batch Pabrik
                  </label>
                  <input
                    type="text"
                    value={formData.batch_no}
                    onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Tanggal Kadaluwarsa (FEFO)
                  </label>
                  <input
                    type="date"
                    value={formData.expired_date}
                    onChange={(e) => setFormData({ ...formData, expired_date: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Lokasi Rak / Lemari
                  </label>
                  <input
                    type="text"
                    value={formData.lokasi_rak}
                    onChange={(e) => setFormData({ ...formData, lokasi_rak: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Jumlah Stok Fisik
                  </label>
                  <input
                    type="number"
                    value={formData.stok}
                    onChange={(e) => setFormData({ ...formData, stok: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Batas Minimum Stok
                  </label>
                  <input
                    type="number"
                    value={formData.min_stok}
                    onChange={(e) => setFormData({ ...formData, min_stok: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Harga Beli HPP (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.harga_beli}
                    onChange={(e) => setFormData({ ...formData, harga_beli: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Harga Jual Standar (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.harga_jual}
                    onChange={(e) => setFormData({ ...formData, harga_jual: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', paddingTop: '16px', borderTop: '1.5px solid #E5E7EB' }}>
                <button
                  type="button"
                  onClick={() => setCurrentView('detail')}
                  className="neo-btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="neo-btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.88rem' }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIEW 4: HALAMAN TAMBAH BATCH STOK BARU ===================== */}
      {currentView === 'add' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Navigasi Kembali */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentView('list')}
              className="neo-btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '0.86rem',
                fontWeight: 700
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.4} />
              <span>Kembali ke Daftar Stok</span>
            </button>

            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6B7280' }}>
              Registrasi Batch Baru
            </span>
          </div>

          <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#18181B', marginBottom: '8px' }}>
              Tambah Batch Obat Baru ke Inventori
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#6B7280', marginBottom: '24px' }}>
              Masukkan data obat yang diterima dari PBF (Pedagang Besar Farmasi) untuk pencatatan FEFO yang tertib dan akurat.
            </p>

            <form onSubmit={handleSaveNewStock} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Kode Obat (SKU) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: OBT-007"
                    value={formData.kode_obat}
                    onChange={(e) => setFormData({ ...formData, kode_obat: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', fontFamily: 'monospace' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nama Lengkap Obat & Dosis <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ibuprofen 400mg"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Kategori Farmakologi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Antiinflamasi Non-Steroid (NSAID)"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Golongan Regulasi
                  </label>
                  <select
                    value={formData.golongan}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value as any })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
                  >
                    <option value="Bebas">Obat Bebas (Hijau)</option>
                    <option value="Bebas Terbatas">Obat Bebas Terbatas (Biru)</option>
                    <option value="Keras">Obat Keras (Merah / K)</option>
                    <option value="Psikotropika">Psikotropika</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Bentuk Sediaan
                  </label>
                  <select
                    value={formData.bentuk}
                    onChange={(e) => setFormData({ ...formData, bentuk: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Satuan Kemasan
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
                  >
                    <option value="Tablet / Pcs">Tablet / Pcs (Satuan Terkecil)</option>
                    <option value="Strip (10 Tab)">Strip (Isi 10 Tablet)</option>
                    <option value="Strip (10 Kapsul)">Strip (Isi 10 Kapsul)</option>
                    <option value="Bungkus / Sachet">Bungkus / Sachet</option>
                    <option value="Botol">Botol</option>
                    <option value="Box / Dus">Box / Dus Besar</option>
                    <option value="Tube">Tube (Salep)</option>
                    <option value="Ampul / Vial">Ampul / Vial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nomor Batch Pabrik
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: BATCH-IBU-2601"
                    value={formData.batch_no}
                    onChange={(e) => setFormData({ ...formData, batch_no: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Tanggal Kadaluwarsa (FEFO)
                  </label>
                  <input
                    type="date"
                    value={formData.expired_date}
                    onChange={(e) => setFormData({ ...formData, expired_date: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Lokasi Rak / Lemari
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rak B-02"
                    value={formData.lokasi_rak}
                    onChange={(e) => setFormData({ ...formData, lokasi_rak: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Jumlah Stok Fisik Awal
                  </label>
                  <input
                    type="number"
                    value={formData.stok}
                    onChange={(e) => setFormData({ ...formData, stok: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Batas Minimum Stok (Peringatan)
                  </label>
                  <input
                    type="number"
                    value={formData.min_stok}
                    onChange={(e) => setFormData({ ...formData, min_stok: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Harga Beli HPP dari PBF (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.harga_beli}
                    onChange={(e) => setFormData({ ...formData, harga_beli: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '2px', display: 'block' }}>
                    Modal faktur pembelian
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Harga Jual Standar Apotek (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.harga_jual}
                    onChange={(e) => setFormData({ ...formData, harga_jual: Number(e.target.value) })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                    min="0"
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                    ℹ️ Sebagai acuan kasir POS
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', paddingTop: '16px', borderTop: '1.5px solid #E5E7EB' }}>
                <button
                  type="button"
                  onClick={() => setCurrentView('list')}
                  className="neo-btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="neo-btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.88rem' }}
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
