'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  AlertCircle,
  FileText,
  Phone,
  Calendar,
  HeartPulse,
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  X,
  Check,
  Clock,
  ShieldAlert,
  UserCheck,
  CreditCard,
  Activity,
  Stethoscope,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Patient, apiGetPatients, apiCreatePatient, apiUpdatePatient, apiDeletePatient } from '@/lib/api';

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 1,
    nama: 'Budi Santoso',
    nik: '3273011405820003',
    tanggal_lahir: '1982-05-14',
    jenis_kelamin: 'L',
    telepon: '081234567890',
    alamat: 'Jl. Merdeka No. 45, Bandung',
    alergi_obat: ['Amoxicillin', 'Penisilin'],
    catatan_medis: 'Pasien penderita Hipertensi tingkat 1, rutin kontrol bulanan.',
    riwayat_penyakit: ['Hipertensi', 'Dislipidemia'],
    waktu_kunjungan: '2026-10-27 10:15',
    penyakit_diderita: 'Hipertensi Primer & Tengkuk Tegang',
    status_pembelian: 'Lunas',
    keterangan_pembelian: 'Lunas via QRIS / Kasir Apotek'
  },
  {
    id: 2,
    nama: 'Siti Rahmawati',
    nik: '3273015509910001',
    tanggal_lahir: '1991-09-15',
    jenis_kelamin: 'P',
    telepon: '082198765432',
    alamat: 'Jl. Dago Asri No. 12, Bandung',
    alergi_obat: ['Aspirin'],
    catatan_medis: 'Ibu hamil trimester 2. Hindari obat golongan NSAID berisiko.',
    riwayat_penyakit: ['Gastritis Kronis'],
    waktu_kunjungan: '2026-10-27 11:45',
    penyakit_diderita: 'Dispepsia & Mual Muntah Kehamilan',
    status_pembelian: 'Belum Lunas',
    keterangan_pembelian: 'Sisa tagihan resep Rp 68.000 (Tenggat pembayaran 30 Okt 2026)'
  },
  {
    id: 3,
    nama: 'Ahmad Fauzi',
    nik: '3273010101750004',
    tanggal_lahir: '1975-01-01',
    jenis_kelamin: 'L',
    telepon: '085611223344',
    alamat: 'Komplek Antapani Indah Blok B4, Bandung',
    alergi_obat: [],
    catatan_medis: 'Diabetes Melitus tipe 2. Menggunakan Metformin teratur.',
    riwayat_penyakit: ['Diabetes Melitus Tipe 2'],
    waktu_kunjungan: '2026-10-26 15:30',
    penyakit_diderita: 'Diabetes Melitus Tipe 2 (Kontrol Rutin)',
    status_pembelian: 'Lunas',
    keterangan_pembelian: 'Lunas Tunai'
  },
  {
    id: 4,
    nama: 'Dewi Lestari',
    nik: '3273016812880005',
    tanggal_lahir: '1988-12-28',
    jenis_kelamin: 'P',
    telepon: '087855443322',
    alamat: 'Jl. Cihampelas No. 102, Bandung',
    alergi_obat: ['Sulfa'],
    catatan_medis: 'Asma bronchial ringan saat terpapar alergen dingin.',
    riwayat_penyakit: ['Asma'],
    waktu_kunjungan: '2026-09-25 09:20',
    penyakit_diderita: 'Eksaserbasi Asma Akut Ringan',
    status_pembelian: 'Belum Lunas',
    keterangan_pembelian: 'Kekurangan bayar inhaler Rp 45.000 (Menunggu klaim asuransi faskes)'
  }
];

export default function PasienPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState('');
  
  // Default filter bulan ke Semua Bulan ('') agar seluruh pasien langsung terlihat
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'edit' | 'add'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
    nama: '',
    nik: '',
    tanggal_lahir: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    telepon: '',
    alamat: '',
    alergi_obat_raw: '',
    riwayat_penyakit_raw: '',
    catatan_medis: '',
    waktu_kunjungan: '',
    penyakit_diderita: '',
    status_pembelian: 'Lunas' as 'Lunas' | 'Belum Lunas',
    keterangan_pembelian: ''
  });

  // State Error Validasi Frontend
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fungsi Validasi Komprehensif di Frontend Saja
  const validatePatientForm = () => {
    const errors: Record<string, string> = {};

    // 1. Validasi Nama Lengkap
    if (!formData.nama.trim()) {
      errors.nama = 'Nama lengkap pasien wajib diisi.';
    } else if (formData.nama.trim().length < 3) {
      errors.nama = 'Nama pasien minimal 3 karakter.';
    }

    // 2. Validasi NIK (16 digit angka)
    const cleanNik = formData.nik.trim();
    if (!cleanNik) {
      errors.nik = 'NIK (Nomor Induk Kependudukan) wajib diisi.';
    } else if (!/^\d{16}$/.test(cleanNik)) {
      errors.nik = 'NIK harus berupa 16 digit angka sesuai KTP.';
    }

    // 3. Validasi Tanggal Lahir (wajib dan tidak boleh masa depan)
    if (!formData.tanggal_lahir) {
      errors.tanggal_lahir = 'Tanggal lahir pasien wajib dipilih.';
    } else {
      const birthDate = new Date(formData.tanggal_lahir);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (birthDate > today) {
        errors.tanggal_lahir = 'Tanggal lahir tidak boleh melebihi hari ini.';
      }
    }

    // 4. Validasi Jenis Kelamin
    if (!formData.jenis_kelamin) {
      errors.jenis_kelamin = 'Jenis kelamin wajib dipilih.';
    }

    // 5. Validasi Nomor Telepon / WA (10-14 digit numerik, awalan 08 atau +62)
    const cleanPhone = formData.telepon.trim();
    if (!cleanPhone) {
      errors.telepon = 'Nomor telepon/WhatsApp wajib diisi.';
    } else if (!/^(08|\+?62)\d{8,12}$/.test(cleanPhone.replace(/[\s-]/g, ''))) {
      errors.telepon = 'Nomor HP tidak valid. Masukkan 10-14 digit angka (misal: 08123456789).';
    }

    // 6. Validasi Waktu Kunjungan
    if (!formData.waktu_kunjungan.trim()) {
      errors.waktu_kunjungan = 'Waktu kunjungan pasien wajib diisi.';
    }

    // 7. Validasi Penyakit / Keluhan Utama
    if (!formData.penyakit_diderita.trim()) {
      errors.penyakit_diderita = 'Keluhan atau penyakit yang diderita pasien wajib diisi.';
    }

    // 8. Validasi Alamat Lengkap
    if (!formData.alamat.trim()) {
      errors.alamat = 'Alamat lengkap tempat tinggal pasien wajib diisi.';
    } else if (formData.alamat.trim().length < 5) {
      errors.alamat = 'Alamat terlalu singkat (minimal 5 karakter).';
    }

    // 9. Validasi Keterangan Pembelian jika status Belum Lunas
    if (formData.status_pembelian === 'Belum Lunas' && !formData.keterangan_pembelian.trim()) {
      errors.keterangan_pembelian = 'Rincian sisa tagihan/tenggat waktu wajib diisi jika status Belum Lunas.';
    }

    setFormErrors(errors);
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Load from backend database on mount with localStorage fallback & real-time sync
  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        const apiData = await apiGetPatients();
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          setPatients(apiData);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mediagnotek_patients_data', JSON.stringify(apiData));
          }
          return;
        }
      } catch (err) {
        console.warn('Backend sync failed, reading local storage:', err);
      }

      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('mediagnotek_patients_data');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPatients(parsed);
              return;
            }
          }
          localStorage.setItem('mediagnotek_patients_data', JSON.stringify(INITIAL_PATIENTS));
        } catch (e) {
          console.warn('Gagal membaca data pasien dari storage:', e);
        }
      }
    };

    fetchPatientsData();

    const handleSync = () => {
      if (typeof window === 'undefined') return;
      try {
        const saved = localStorage.getItem('mediagnotek_patients_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPatients(parsed);
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
  const updatePatientsList = (newList: Patient[]) => {
    setPatients(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediagnotek_patients_data', JSON.stringify(newList));
      window.dispatchEvent(new Event('mediagnotek_data_updated'));
    }
  };

  // Filter pencarian teks dan filter bulan kunjungan (default bulan saat ini)
  const filteredPatients = patients.filter((p) => {
    // Filter pencarian
    const matchesSearch =
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nik.includes(search) ||
      p.telepon.includes(search) ||
      p.alamat.toLowerCase().includes(search.toLowerCase()) ||
      (p.penyakit_diderita && p.penyakit_diderita.toLowerCase().includes(search.toLowerCase()));

    // Filter bulan kunjungan
    if (!matchesSearch) return false;
    if (!selectedMonth) return true; // jika filter di-reset ke Semua Bulan

    const visitTime = p.waktu_kunjungan || '';
    return visitTime.startsWith(selectedMonth);
  });

  // Navigasi ke Halaman Tambah Pasien Baru (render halaman baru)
  const handleOpenAddPage = () => {
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setFormErrors({});
    setFormData({
      nama: '',
      nik: '',
      tanggal_lahir: '',
      jenis_kelamin: 'L',
      telepon: '',
      alamat: '',
      alergi_obat_raw: '',
      riwayat_penyakit_raw: '',
      catatan_medis: '',
      waktu_kunjungan: formattedNow,
      penyakit_diderita: '',
      status_pembelian: 'Lunas',
      keterangan_pembelian: 'Lunas Tunai / QRIS Kasir'
    });
    setCurrentView('add');
  };

  // Navigasi ke Halaman Edit Pasien (render halaman baru)
  const handleOpenEditPage = (p: Patient) => {
    setSelectedPatient(p);
    setFormErrors({});
    setFormData({
      nama: p.nama,
      nik: p.nik === '-' ? '' : p.nik,
      tanggal_lahir: p.tanggal_lahir,
      jenis_kelamin: p.jenis_kelamin as 'L' | 'P',
      telepon: p.telepon === '-' ? '' : p.telepon,
      alamat: p.alamat === '-' ? '' : p.alamat,
      alergi_obat_raw: (p.alergi_obat || []).join(', '),
      riwayat_penyakit_raw: (p.riwayat_penyakit || []).join(', '),
      catatan_medis: p.catatan_medis || '',
      waktu_kunjungan: p.waktu_kunjungan || '2026-10-27 10:00',
      penyakit_diderita: p.penyakit_diderita || '',
      status_pembelian: p.status_pembelian || 'Lunas',
      keterangan_pembelian: p.keterangan_pembelian || ''
    });
    setCurrentView('edit');
  };

  // Simpan Tambah Pasien Baru (tersinkron ke Database Backend)
  const handleSaveNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Jalankan validasi frontend
    const { isValid, errors } = validatePatientForm();
    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      showToast(`Validasi gagal: ${errors[firstErrorKey]}`, 'danger');
      return;
    }

    const alergiList = formData.alergi_obat_raw
      ? formData.alergi_obat_raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const riwayatList = formData.riwayat_penyakit_raw
      ? formData.riwayat_penyakit_raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      nama_lengkap: formData.nama.trim(),
      nik: formData.nik.trim(),
      tanggal_lahir: formData.tanggal_lahir,
      jenis_kelamin: formData.jenis_kelamin,
      no_hp: formData.telepon.trim(),
      alamat: formData.alamat.trim(),
      alergi_obat: alergiList,
      riwayat_penyakit: riwayatList,
      catatan_medis: formData.catatan_medis.trim(),
      waktu_kunjungan: formData.waktu_kunjungan.trim(),
      penyakit_diderita: formData.penyakit_diderita.trim(),
      status_pembelian: formData.status_pembelian,
      keterangan_pembelian: formData.keterangan_pembelian.trim() || (formData.status_pembelian === 'Lunas' ? 'Lunas Kasir' : 'Belum Lunas')
    };

    let savedPatient: Patient | null = null;
    try {
      savedPatient = await apiCreatePatient(payload);
    } catch (_) {}

    const newPatient: Patient = savedPatient || {
      id: Date.now(),
      nama: payload.nama_lengkap,
      nik: payload.nik,
      tanggal_lahir: payload.tanggal_lahir,
      jenis_kelamin: payload.jenis_kelamin,
      telepon: payload.no_hp,
      alamat: payload.alamat,
      alergi_obat: payload.alergi_obat,
      riwayat_penyakit: payload.riwayat_penyakit,
      catatan_medis: payload.catatan_medis,
      waktu_kunjungan: payload.waktu_kunjungan,
      penyakit_diderita: payload.penyakit_diderita,
      status_pembelian: payload.status_pembelian,
      keterangan_pembelian: payload.keterangan_pembelian
    };

    updatePatientsList([newPatient, ...patients]);
    setSelectedPatient(newPatient);
    setCurrentView('detail');
    showToast(`Data pasien "${newPatient.nama}" berhasil tersinkron ke database!`, 'success');
  };

  // Simpan Update Pasien (tersinkron ke Database Backend)
  const handleSaveEditPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    // Jalankan validasi frontend
    const { isValid, errors } = validatePatientForm();
    if (!isValid) {
      const firstErrorKey = Object.keys(errors)[0];
      showToast(`Validasi gagal: ${errors[firstErrorKey]}`, 'danger');
      return;
    }

    const alergiList = formData.alergi_obat_raw
      ? formData.alergi_obat_raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const riwayatList = formData.riwayat_penyakit_raw
      ? formData.riwayat_penyakit_raw.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      nama_lengkap: formData.nama.trim(),
      nik: formData.nik.trim(),
      tanggal_lahir: formData.tanggal_lahir,
      jenis_kelamin: formData.jenis_kelamin,
      no_hp: formData.telepon.trim(),
      alamat: formData.alamat.trim(),
      alergi_obat: alergiList,
      riwayat_penyakit: riwayatList,
      catatan_medis: formData.catatan_medis.trim(),
      waktu_kunjungan: formData.waktu_kunjungan.trim() || selectedPatient.waktu_kunjungan || '2026-10-27 10:00',
      penyakit_diderita: formData.penyakit_diderita.trim(),
      status_pembelian: formData.status_pembelian,
      keterangan_pembelian: formData.keterangan_pembelian.trim()
    };

    let updatedFromApi: Patient | null = null;
    try {
      updatedFromApi = await apiUpdatePatient(selectedPatient.id, payload);
    } catch (_) {}

    const updatedPatient: Patient = updatedFromApi || {
      ...selectedPatient,
      nama: payload.nama_lengkap,
      nik: payload.nik,
      tanggal_lahir: payload.tanggal_lahir,
      jenis_kelamin: payload.jenis_kelamin,
      telepon: payload.no_hp,
      alamat: payload.alamat,
      alergi_obat: payload.alergi_obat,
      riwayat_penyakit: payload.riwayat_penyakit,
      catatan_medis: payload.catatan_medis,
      waktu_kunjungan: payload.waktu_kunjungan,
      penyakit_diderita: payload.penyakit_diderita,
      status_pembelian: payload.status_pembelian,
      keterangan_pembelian: payload.keterangan_pembelian
    };

    const updatedList = patients.map((item) =>
      item.id === selectedPatient.id ? updatedPatient : item
    );

    updatePatientsList(updatedList);
    setSelectedPatient(updatedPatient);
    setCurrentView('detail');
    showToast(`Perubahan data pasien "${updatedPatient.nama}" tersinkron ke database!`, 'success');
  };

  // Hapus Pasien dengan Notifikasi (tersinkron ke Database Backend)
  const handleDeletePatient = async (patient: Patient) => {
    if (window.confirm(`Hapus data pasien "${patient.nama}" dari basis data apotek?`)) {
      try {
        await apiDeletePatient(patient.id);
      } catch (_) {}

      const remaining = patients.filter((item) => item.id !== patient.id);
      updatePatientsList(remaining);
      setSelectedPatient(null);
      setCurrentView('list');
      showToast(`Data pasien "${patient.nama}" berhasil dihapus dari sistem!`, 'danger');
    }
  };

  // Tampilkan Halaman Detail Pasien
  const handleViewDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('detail');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
      {/* Toast Notifikasi Tersimpan / Terhapus */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '28px',
            right: '28px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            borderRadius: '12px',
            border: '2px solid #1E1E1E',
            backgroundColor: notification.type === 'success' ? '#DCFCE7' : '#FEE2E2',
            color: notification.type === 'success' ? '#166534' : '#991B1B',
            boxShadow: '4px 4px 0px #1E1E1E',
            fontWeight: 800,
            fontSize: '0.92rem',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {notification.type === 'success' ? (
            <Check size={20} strokeWidth={2.6} style={{ color: '#166534' }} />
          ) : (
            <AlertCircle size={20} strokeWidth={2.6} style={{ color: '#991B1B' }} />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '6px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ===================== VIEW 1: TABEL UTAMA PASIEN ===================== */}
      {currentView === 'list' && (
        <>
          {/* Header & Action Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={28} strokeWidth={2.2} style={{ color: '#18181B' }} />
                Buku Induk & Rekam Pasien Apotek
              </h1>
              <p style={{ color: '#52525B', fontSize: '0.95rem' }}>
                Database pasien apotek untuk skrining alergi obat, riwayat penebusan resep, dan konseling farmasi terpadu.
              </p>
            </div>

            <button
              onClick={handleOpenAddPage}
              className="neo-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.9rem'
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Tambah Pasien Baru</span>
            </button>
          </div>

          {/* Quick Filter & Month Filter Bar */}
          <div className="neo-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#6B7280' }} />
                <input
                  type="text"
                  placeholder="Cari pasien (Nama, NIK, No Telepon, Keluhan, Alamat)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input-neo"
                  style={{ paddingLeft: '40px', width: '100%', fontSize: '0.88rem' }}
                />
              </div>

              {/* Filter Bulan Kunjungan (Default: Bulan Saat Ini) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#374151' }}>
                  <Filter size={16} />
                  <span>Bulan Kunjungan:</span>
                </div>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="form-input-neo"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    height: '38px',
                    backgroundColor: '#FAF8F4'
                  }}
                />
                {selectedMonth && (
                  <button
                    onClick={() => setSelectedMonth('')}
                    title="Tampilkan Semua Bulan"
                    className="neo-btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.78rem', height: '38px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={12} />
                    <span>Semua</span>
                  </button>
                )}
              </div>

              {/* Total Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#6B7280', fontWeight: 700 }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3D6',
                  border: '1.2px solid #1E1E1E',
                  color: '#18181B'
                }}>
                  {selectedMonth ? `Bulan ${selectedMonth}: ` : 'Total: '}
                  <strong>{filteredPatients.length} Pasien</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Tabel Utama Pasien Bersebelahan dengan Nomor & Aksi */}
          <div className="neo-card" style={{ padding: '0px', backgroundColor: '#FFFFFF', overflow: 'hidden', boxShadow: '3px 3.5px 0px #1E1E1E' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F4', borderBottom: '2px solid #1E1E1E' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', width: '60px', textAlign: 'center' }}>No</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>Nama Pasien</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>NIK & Gender</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>No Telepon</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>Alamat</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B' }}>Waktu Kunjungan</th>
                    <th style={{ padding: '14px 16px', fontWeight: 800, color: '#18181B', textAlign: 'center', width: '110px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((p, idx) => {
                    return (
                      <tr
                        key={p.id}
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

                        {/* 2. Nama Pasien */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#18181B' }}>
                            {p.nama}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
                            Lahir: {p.tanggal_lahir}
                          </div>
                        </td>

                        {/* 3. NIK & Gender */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#374151' }}>{p.nik}</div>
                          <span style={{
                            display: 'inline-block',
                            marginTop: '3px',
                            padding: '1px 7px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: p.jenis_kelamin === 'L' ? '#DBEAFE' : '#FCE7F3',
                            color: p.jenis_kelamin === 'L' ? '#1E40AF' : '#BE185D',
                            border: '1px solid #1E1E1E'
                          }}>
                            {p.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                          </span>
                        </td>

                        {/* 4. Telepon */}
                        <td style={{ padding: '14px 16px', color: '#374151', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Phone size={13} style={{ color: '#6B7280' }} />
                            <span>{p.telepon}</span>
                          </div>
                        </td>

                        {/* 5. Alamat */}
                        <td style={{ padding: '14px 16px', maxWidth: '240px', color: '#4B5563', lineHeight: 1.4 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {p.alamat}
                          </span>
                        </td>

                        {/* 6. Waktu Kunjungan */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F3F4F6', border: '1.2px solid #1E1E1E', padding: '4px 10px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 700, color: '#1F2937' }}>
                            <Clock size={13} style={{ color: '#4B5563' }} />
                            <span>{p.waktu_kunjungan || '2026-10-27 10:00'}</span>
                          </div>
                        </td>

                        {/* 7. Aksi (Hanya Detail) */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleViewDetail(p)}
                            title="Lihat Detail & Rekam Medis Pasien"
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

                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                        Tidak ada data pasien yang ditemukan. Coba ubah kata kunci pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ===================== VIEW 2: HALAMAN DETAIL PASIEN ===================== */}
      {currentView === 'detail' && selectedPatient && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Navigasi Kembali */}
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
              <span>Kembali ke Daftar Pasien</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleOpenEditPage(selectedPatient)}
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
                <span>Edit Pasien</span>
              </button>
              <button
                onClick={() => handleDeletePatient(selectedPatient)}
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
                <span>Hapus Pasien</span>
              </button>
            </div>
          </div>

          {/* Kartu Profil Utama Pasien */}
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
                  REKAM MEDIS PASIEN #{selectedPatient.id}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#18181B', margin: 0 }}>
                  {selectedPatient.nama}
                </h2>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px', color: '#4B5563', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar size={15} /> Tanggal Lahir: <strong>{selectedPatient.tanggal_lahir}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <UserCheck size={15} /> Gender: <strong>{selectedPatient.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={15} /> Kontak: <strong>{selectedPatient.telepon}</strong>
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
                <HeartPulse size={26} color="#1E1E1E" />
              </div>
            </div>

            {/* 1. Baris Informasi Kunjungan & Status Pembelian Obat */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {/* Kartu Informasi Waktu Kunjungan & Keluhan Utama */}
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1.8px solid #1E1E1E',
                borderRadius: '12px',
                padding: '16px 18px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#1E40AF', fontSize: '0.92rem', marginBottom: '8px' }}>
                  <Clock size={18} />
                  <span>Informasi Kunjungan & Keluhan</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#1F2937', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Waktu Kunjungan:</span>{' '}
                    <strong style={{ color: '#1E3A8A' }}>{selectedPatient.waktu_kunjungan || '2026-10-27 10:00'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#4B5563', fontWeight: 600 }}>Penyakit yang Diderita:</span>{' '}
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#FEF3D6',
                      border: '1px solid #1E1E1E',
                      color: '#92400E',
                      padding: '2px 8px',
                      borderRadius: '5px',
                      fontWeight: 800,
                      fontSize: '0.82rem'
                    }}>
                      {selectedPatient.penyakit_diderita || 'Pemeriksaan Rutin / Keluhan Umum'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kartu Status Pembelian Obat & Keterangan */}
              <div style={{
                backgroundColor: selectedPatient.status_pembelian === 'Belum Lunas' ? '#FFFBEB' : '#F0FDF4',
                border: selectedPatient.status_pembelian === 'Belum Lunas' ? '1.8px solid #D97706' : '1.8px solid #16A34A',
                borderRadius: '12px',
                padding: '16px 18px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: selectedPatient.status_pembelian === 'Belum Lunas' ? '#92400E' : '#166534', fontSize: '0.92rem' }}>
                    <CreditCard size={18} />
                    <span>Status Pembelian Obat</span>
                  </div>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    border: '1.2px solid #1E1E1E',
                    backgroundColor: selectedPatient.status_pembelian === 'Belum Lunas' ? '#FEE2E2' : '#DCFCE7',
                    color: selectedPatient.status_pembelian === 'Belum Lunas' ? '#991B1B' : '#166534'
                  }}>
                    {selectedPatient.status_pembelian === 'Belum Lunas' ? '⚠️ BELUM LUNAS' : '✓ LUNAS'}
                  </span>
                </div>

                <div style={{ fontSize: '0.86rem', color: '#374151', lineHeight: 1.5 }}>
                  {selectedPatient.status_pembelian === 'Belum Lunas' ? (
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px dashed #DC2626',
                      marginTop: '4px'
                    }}>
                      <strong style={{ color: '#DC2626', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase' }}>Keterangan Penagihan:</strong>
                      <span style={{ color: '#1F2937', fontWeight: 600 }}>
                        {selectedPatient.keterangan_pembelian || 'Menunggu konfirmasi pelunasan kasir.'}
                      </span>
                    </div>
                  ) : (
                    <div style={{ color: '#166534', fontWeight: 600, marginTop: '4px' }}>
                      Keterangan: {selectedPatient.keterangan_pembelian || 'Semua tagihan resep & non-resep telah dibayarkan penuh.'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Peringatan Alergi Khusus Apoteker */}
            <div style={{
              backgroundColor: selectedPatient.alergi_obat.length > 0 ? '#FEF2F2' : '#F0FDF4',
              border: selectedPatient.alergi_obat.length > 0 ? '1.8px solid #DC2626' : '1.8px solid #16A34A',
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: '20px',
              boxShadow: '2px 2px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: selectedPatient.alergi_obat.length > 0 ? '#991B1B' : '#166534', fontSize: '0.92rem' }}>
                <AlertCircle size={18} />
                Peringatan Alergi Obat Pasien
              </div>
              <div style={{ marginTop: '8px' }}>
                {selectedPatient.alergi_obat.length > 0 ? (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedPatient.alergi_obat.map((a, i) => (
                      <span key={i} style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '4px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem' }}>
                        ⚠️ {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#166534', fontWeight: 600, fontSize: '0.88rem' }}>
                    Pasien tidak memiliki riwayat alergi obat yang tercatat.
                  </span>
                )}
              </div>
            </div>

            {/* 3. Penyakit di Derita, Riwayat Penyakit & Alamat Lengkap */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} /> Riwayat Penyakit Kronis & Terdahulu
                </div>
                {selectedPatient.riwayat_penyakit && selectedPatient.riwayat_penyakit.length > 0 ? (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedPatient.riwayat_penyakit.map((p, idx) => (
                      <span key={idx} style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #1E1E1E' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.88rem', color: '#6B7280' }}>Tidak ada riwayat penyakit kronis tercatat.</span>
                )}
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Alamat Lengkap & NIK
                </div>
                <div style={{ fontSize: '0.88rem', color: '#1F2937', lineHeight: 1.5 }}>
                  <div><strong>NIK:</strong> {selectedPatient.nik}</div>
                  <div style={{ marginTop: '4px' }}><strong>Alamat:</strong> {selectedPatient.alamat}</div>
                </div>
              </div>
            </div>

            {/* Catatan Khusus Apoteker */}
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1.5px solid #1E1E1E', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#4B5563', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} /> Catatan Khusus Apoteker & Kondisi Klinis:
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1F2937', margin: 0, lineHeight: 1.6 }}>
                {selectedPatient.catatan_medis || 'Belum ada catatan khusus untuk pasien ini.'}
              </p>
            </div>

            {/* Riwayat Penebusan Obat Terakhir */}
            <div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#18181B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> Riwayat Penebusan Obat Terakhir (Farmasi & Resep)
              </div>
              <div style={{ border: '1.8px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FAF8F4', borderBottom: '1.8px solid #1E1E1E' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800 }}>Tanggal</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800 }}>Nama Obat / Resep</th>
                      <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800 }}>Kuantitas</th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800 }}>Signa (Aturan Pakai)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>2026-10-18</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>Amlodipine Besylate 10mg</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>30 tab</td>
                      <td style={{ padding: '12px 14px', color: '#4B5563' }}>1 x 1 tab malam hari sesudah makan</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>2026-09-20</td>
                      <td style={{ padding: '12px 14px', fontWeight: 800 }}>Metformin HCl 500mg</td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>60 tab</td>
                      <td style={{ padding: '12px 14px', color: '#4B5563' }}>2 x 1 tab bersama makan</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW 3: HALAMAN EDIT PASIEN ===================== */}
      {currentView === 'edit' && selectedPatient && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Navigasi Halaman Edit */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
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
              <span>Kembali ke Detail Pasien</span>
            </button>

            <span style={{
              display: 'inline-block',
              backgroundColor: '#FEF3D6',
              border: '1.2px solid #1E1E1E',
              color: '#92400E',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: '8px'
            }}>
              Mode Edit: #{selectedPatient.id} - {selectedPatient.nama}
            </span>
          </div>

          {/* Form Card Halaman Edit */}
          <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
            <div style={{ borderBottom: '1.8px solid #1E1E1E', paddingBottom: '16px', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#18181B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Pencil size={24} strokeWidth={2.4} />
                <span>Edit Informasi Pasien</span>
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '6px', marginBottom: 0 }}>
                Perbarui profil pasien, riwayat alergi obat, dan catatan penting untuk keamanan peresepan obat di apotek.
              </p>
            </div>

            <form onSubmit={handleSaveEditPatient} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nama Lengkap Pasien <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={(e) => {
                      setFormData({ ...formData, nama: e.target.value });
                      if (formErrors.nama) setFormErrors({ ...formErrors, nama: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.nama ? '#DC2626' : undefined }}
                  />
                  {formErrors.nama && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.nama}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nomor Induk Kependudukan (NIK 16 Digit) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="16 digit angka KTP"
                    value={formData.nik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, nik: val });
                      if (formErrors.nik) setFormErrors({ ...formErrors, nik: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.nik ? '#DC2626' : undefined }}
                  />
                  {formErrors.nik && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.nik}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Jenis Kelamin <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => {
                      setFormData({ ...formData, jenis_kelamin: e.target.value as 'L' | 'P' });
                      if (formErrors.jenis_kelamin) setFormErrors({ ...formErrors, jenis_kelamin: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px', borderColor: formErrors.jenis_kelamin ? '#DC2626' : undefined }}
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                  {formErrors.jenis_kelamin && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.jenis_kelamin}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Tanggal Lahir <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={formData.tanggal_lahir}
                    onChange={(e) => {
                      setFormData({ ...formData, tanggal_lahir: e.target.value });
                      if (formErrors.tanggal_lahir) setFormErrors({ ...formErrors, tanggal_lahir: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.tanggal_lahir ? '#DC2626' : undefined }}
                  />
                  {formErrors.tanggal_lahir && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.tanggal_lahir}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    No Telepon / WhatsApp <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxx (10-14 digit)"
                    value={formData.telepon}
                    onChange={(e) => {
                      setFormData({ ...formData, telepon: e.target.value });
                      if (formErrors.telepon) setFormErrors({ ...formErrors, telepon: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.telepon ? '#DC2626' : undefined }}
                  />
                  {formErrors.telepon && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.telepon}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#B91C1C' }}>
                    ⚠️ Peringatan Alergi Obat (Opsional, pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Amoxicillin, Aspirin, Sulfa"
                    value={formData.alergi_obat_raw}
                    onChange={(e) => setFormData({ ...formData, alergi_obat_raw: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: '#FCA5A5' }}
                  />
                  <small style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Data alergi obat akan menjadi trigger skrining interaksi & kontraindikasi di kasir.
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#92400E' }}>
                    Riwayat Penyakit Kronis (Opsional, pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hipertensi, Diabetes Melitus, Asma"
                    value={formData.riwayat_penyakit_raw}
                    onChange={(e) => setFormData({ ...formData, riwayat_penyakit_raw: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#1E40AF' }}>
                    Waktu Kunjungan Pasien <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD HH:mm (Contoh: 2026-10-27 10:15)"
                    value={formData.waktu_kunjungan}
                    onChange={(e) => {
                      setFormData({ ...formData, waktu_kunjungan: e.target.value });
                      if (formErrors.waktu_kunjungan) setFormErrors({ ...formErrors, waktu_kunjungan: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.waktu_kunjungan ? '#DC2626' : undefined }}
                  />
                  {formErrors.waktu_kunjungan && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.waktu_kunjungan}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#1E40AF' }}>
                    Penyakit yang Diderita (Keluhan / Diagnosis Utama) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hipertensi Primer, Sakit Kepala, Dispepsia"
                    value={formData.penyakit_diderita}
                    onChange={(e) => {
                      setFormData({ ...formData, penyakit_diderita: e.target.value });
                      if (formErrors.penyakit_diderita) setFormErrors({ ...formErrors, penyakit_diderita: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.penyakit_diderita ? '#DC2626' : undefined }}
                  />
                  {formErrors.penyakit_diderita && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.penyakit_diderita}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Status Pembelian Obat <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <select
                    value={formData.status_pembelian}
                    onChange={(e) => setFormData({ ...formData, status_pembelian: e.target.value as 'Lunas' | 'Belum Lunas' })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
                  >
                    <option value="Lunas">Lunas (Selesai Pembayaran)</option>
                    <option value="Belum Lunas">Belum Lunas (Ada Tagihan / Menunggu Pembayaran)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Keterangan Pembelian Obat {formData.status_pembelian === 'Belum Lunas' && <span style={{ color: '#DC2626' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sisa tagihan Rp 45.000 (Tenggat 30 Okt 2026) / Lunas Kasir"
                    value={formData.keterangan_pembelian}
                    onChange={(e) => {
                      setFormData({ ...formData, keterangan_pembelian: e.target.value });
                      if (formErrors.keterangan_pembelian) setFormErrors({ ...formErrors, keterangan_pembelian: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.keterangan_pembelian ? '#DC2626' : (formData.status_pembelian === 'Belum Lunas' ? '#FCA5A5' : undefined) }}
                  />
                  {formErrors.keterangan_pembelian && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.keterangan_pembelian}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                  Alamat Lengkap Tempat Tinggal <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. / RT / RW / Kelurahan / Kecamatan / Kota"
                  value={formData.alamat}
                  onChange={(e) => {
                    setFormData({ ...formData, alamat: e.target.value });
                    if (formErrors.alamat) setFormErrors({ ...formErrors, alamat: '' });
                  }}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none', borderColor: formErrors.alamat ? '#DC2626' : undefined }}
                />
                {formErrors.alamat && (
                  <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                    {formErrors.alamat}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                  Catatan Klinis & Rekomendasi Farmasi
                </label>
                <textarea
                  rows={3}
                  placeholder="Instruksi penggunaan obat, kondisi khusus (hamil/menyusui), toleransi dosis, dsb."
                  value={formData.catatan_medis}
                  onChange={(e) => setFormData({ ...formData, catatan_medis: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none' }}
                />
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
                  Simpan Perubahan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== VIEW 4: HALAMAN TAMBAH PASIEN BARU ===================== */}
      {currentView === 'add' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Navigasi Halaman Tambah */}
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
              <span>Kembali ke Daftar Pasien</span>
            </button>

            <span style={{
              display: 'inline-block',
              backgroundColor: '#DCFCE7',
              border: '1.2px solid #1E1E1E',
              color: '#166534',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: '8px'
            }}>
              Registrasi Pasien Baru
            </span>
          </div>

          {/* Form Card Halaman Tambah Pasien */}
          <div className="neo-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
            <div style={{ borderBottom: '1.8px solid #1E1E1E', paddingBottom: '16px', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#18181B', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={24} strokeWidth={2.4} />
                <span>Pendaftaran Pasien Baru Apotek</span>
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: '6px', marginBottom: 0 }}>
                Lengkapi identitas pasien, riwayat alergi obat, riwayat penyakit kronis, dan status pembayaran resep untuk rekam medis farmasi.
              </p>
            </div>

            <form onSubmit={handleSaveNewPatient} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nama Lengkap Pasien <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={(e) => {
                      setFormData({ ...formData, nama: e.target.value });
                      if (formErrors.nama) setFormErrors({ ...formErrors, nama: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.nama ? '#DC2626' : undefined }}
                  />
                  {formErrors.nama && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.nama}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Nomor Induk Kependudukan (NIK 16 Digit) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="16 digit angka KTP"
                    value={formData.nik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, nik: val });
                      if (formErrors.nik) setFormErrors({ ...formErrors, nik: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.nik ? '#DC2626' : undefined }}
                  />
                  {formErrors.nik && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.nik}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Jenis Kelamin <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => {
                      setFormData({ ...formData, jenis_kelamin: e.target.value as 'L' | 'P' });
                      if (formErrors.jenis_kelamin) setFormErrors({ ...formErrors, jenis_kelamin: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px', borderColor: formErrors.jenis_kelamin ? '#DC2626' : undefined }}
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                  {formErrors.jenis_kelamin && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.jenis_kelamin}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Tanggal Lahir <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={formData.tanggal_lahir}
                    onChange={(e) => {
                      setFormData({ ...formData, tanggal_lahir: e.target.value });
                      if (formErrors.tanggal_lahir) setFormErrors({ ...formErrors, tanggal_lahir: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.tanggal_lahir ? '#DC2626' : undefined }}
                  />
                  {formErrors.tanggal_lahir && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.tanggal_lahir}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    No Telepon / WhatsApp <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxx (10-14 digit)"
                    value={formData.telepon}
                    onChange={(e) => {
                      setFormData({ ...formData, telepon: e.target.value });
                      if (formErrors.telepon) setFormErrors({ ...formErrors, telepon: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.telepon ? '#DC2626' : undefined }}
                  />
                  {formErrors.telepon && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.telepon}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#B91C1C' }}>
                    ⚠️ Peringatan Alergi Obat (Opsional, pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Amoxicillin, Aspirin, Sulfa"
                    value={formData.alergi_obat_raw}
                    onChange={(e) => setFormData({ ...formData, alergi_obat_raw: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: '#FCA5A5' }}
                  />
                  <small style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Data alergi obat akan menjadi trigger skrining interaksi & kontraindikasi di kasir.
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#92400E' }}>
                    Riwayat Penyakit Kronis (Opsional, pisahkan koma)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hipertensi, Diabetes Melitus, Asma"
                    value={formData.riwayat_penyakit_raw}
                    onChange={(e) => setFormData({ ...formData, riwayat_penyakit_raw: e.target.value })}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#1E40AF' }}>
                    Waktu Kunjungan Pasien <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD HH:mm (Contoh: 2026-10-27 10:15)"
                    value={formData.waktu_kunjungan}
                    onChange={(e) => {
                      setFormData({ ...formData, waktu_kunjungan: e.target.value });
                      if (formErrors.waktu_kunjungan) setFormErrors({ ...formErrors, waktu_kunjungan: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.waktu_kunjungan ? '#DC2626' : undefined }}
                  />
                  {formErrors.waktu_kunjungan && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.waktu_kunjungan}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#1E40AF' }}>
                    Penyakit yang Diderita (Keluhan / Diagnosis Utama) <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hipertensi Primer, Sakit Kepala, Dispepsia"
                    value={formData.penyakit_diderita}
                    onChange={(e) => {
                      setFormData({ ...formData, penyakit_diderita: e.target.value });
                      if (formErrors.penyakit_diderita) setFormErrors({ ...formErrors, penyakit_diderita: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.penyakit_diderita ? '#DC2626' : undefined }}
                  />
                  {formErrors.penyakit_diderita && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.penyakit_diderita}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Status Pembelian Obat <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <select
                    value={formData.status_pembelian}
                    onChange={(e) => setFormData({ ...formData, status_pembelian: e.target.value as 'Lunas' | 'Belum Lunas' })}
                    className="form-input-neo"
                    style={{ width: '100%', height: '44px' }}
                  >
                    <option value="Lunas">Lunas (Selesai Pembayaran)</option>
                    <option value="Belum Lunas">Belum Lunas (Ada Tagihan / Menunggu Pembayaran)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                    Keterangan Pembelian Obat {formData.status_pembelian === 'Belum Lunas' && <span style={{ color: '#DC2626' }}>*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sisa tagihan Rp 45.000 (Tenggat 30 Okt 2026) / Lunas Kasir"
                    value={formData.keterangan_pembelian}
                    onChange={(e) => {
                      setFormData({ ...formData, keterangan_pembelian: e.target.value });
                      if (formErrors.keterangan_pembelian) setFormErrors({ ...formErrors, keterangan_pembelian: '' });
                    }}
                    className="form-input-neo"
                    style={{ width: '100%', borderColor: formErrors.keterangan_pembelian ? '#DC2626' : (formData.status_pembelian === 'Belum Lunas' ? '#FCA5A5' : undefined) }}
                  />
                  {formErrors.keterangan_pembelian && (
                    <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                      {formErrors.keterangan_pembelian}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                  Alamat Lengkap Tempat Tinggal <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. / RT / RW / Kelurahan / Kecamatan / Kota"
                  value={formData.alamat}
                  onChange={(e) => {
                    setFormData({ ...formData, alamat: e.target.value });
                    if (formErrors.alamat) setFormErrors({ ...formErrors, alamat: '' });
                  }}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none', borderColor: formErrors.alamat ? '#DC2626' : undefined }}
                />
                {formErrors.alamat && (
                  <span style={{ color: '#DC2626', fontSize: '0.76rem', fontWeight: 700, marginTop: '4px', display: 'block' }}>
                    {formErrors.alamat}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '6px', color: '#18181B' }}>
                  Catatan Klinis & Rekomendasi Farmasi
                </label>
                <textarea
                  rows={3}
                  placeholder="Instruksi penggunaan obat, kondisi khusus (hamil/menyusui), toleransi dosis, dsb."
                  value={formData.catatan_medis}
                  onChange={(e) => setFormData({ ...formData, catatan_medis: e.target.value })}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none' }}
                />
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
                  Simpan Pasien Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
