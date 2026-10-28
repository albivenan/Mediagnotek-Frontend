import { apiGetCurrentUser } from './api';

export interface UnifiedFaskesProfile {
  id: string;
  email: string;
  role: string;
  faskes_profile: {
    nama_faskes: string;
    tipe_faskes: 'Apotek' | 'Klinik' | 'Rumah Sakit';
    nomor_izin_operasional: string;
    penanggung_jawab: string;
    nomor_telepon: string;
    foto_faskes_url: string;
    alamat_lengkap: string;
    kota: string;
    provinsi: string;
  };
  created_at: string;
}

export interface UnifiedStockBatch {
  id: number;
  kode_batch: string;
  nama: string;
  kategori: string;
  golongan: 'Bebas' | 'Bebas Terbatas' | 'Keras' | 'Psikotropika';
  stok: number;
  min_stok: number;
  satuan: string;
  harga_beli: number;
  harga_jual: number;
  expired_date: string;
  suplier: string;
  lokasi_rak: string;
}

export interface UnifiedPatient {
  id: number;
  nama: string;
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  telepon: string;
  alamat: string;
  alergi_obat: string[];
  riwayat_penyakit?: string[];
  catatan_medis?: string;
  waktu_kunjungan?: string;
  penyakit_diderita?: string;
  status_pembelian?: 'Lunas' | 'Belum Lunas';
  keterangan_pembelian?: string;
}

export interface UnifiedFinancialTransaction {
  id: string;
  waktu: string;
  tanggal: string; // YYYY-MM-DD
  pasien: string;
  pasien_id?: number;
  dokter?: string;
  kasir?: string;
  tipe: 'Resep' | 'Obat Bebas (OTC)';
  metode: 'QRIS' | 'Tunai' | 'Debit / Transfer' | 'Klaim Asuransi';
  items: string;
  jumlahItem: number;
  omzet: number;
  hpp: number;
  labaKotor: number;
  marginPersen: number;
  status: 'Lunas' | 'Pending' | 'Retur';
  skrining?: 'Aman' | 'Peringatan' | 'Perlu Perhatian';
}

export const INITIAL_STOCKS_SEED: UnifiedStockBatch[] = [
  {
    id: 1,
    kode_batch: 'BATCH-PCM-2401',
    nama: 'Paracetamol 500mg',
    kategori: 'Analgesik & Antipiretik',
    golongan: 'Bebas',
    stok: 120,
    min_stok: 30,
    satuan: 'Strip (10 Tab)',
    harga_beli: 4500,
    harga_jual: 8000,
    expired_date: '2027-08-15',
    suplier: 'PT Kimia Farma Trading',
    lokasi_rak: 'Rak A-01'
  },
  {
    id: 2,
    kode_batch: 'BATCH-AMX-2309',
    nama: 'Amoxicillin Trihydrate 500mg',
    kategori: 'Antibiotik',
    golongan: 'Keras',
    stok: 45,
    min_stok: 25,
    satuan: 'Strip (10 Kapsul)',
    harga_beli: 8500,
    harga_jual: 14000,
    expired_date: '2026-11-20',
    suplier: 'PT Enseval Putera Megatrading',
    lokasi_rak: 'Rak B-04'
  },
  {
    id: 3,
    kode_batch: 'BATCH-MET-2402',
    nama: 'Metformin HCl 500mg',
    kategori: 'Antidiabetes Oral',
    golongan: 'Keras',
    stok: 85,
    min_stok: 40,
    satuan: 'Strip (10 Tab)',
    harga_beli: 3800,
    harga_jual: 6500,
    expired_date: '2027-11-10',
    suplier: 'PT Anugrah Argon Medica',
    lokasi_rak: 'Rak C-02'
  },
  {
    id: 4,
    kode_batch: 'BATCH-AML-2403',
    nama: 'Amlodipine Besylate 10mg',
    kategori: 'Antihipertensi',
    golongan: 'Keras',
    stok: 18,
    min_stok: 20,
    satuan: 'Strip (10 Tab)',
    harga_beli: 7000,
    harga_jual: 12500,
    expired_date: '2027-05-01',
    suplier: 'PT Bina San Prima',
    lokasi_rak: 'Rak C-05'
  },
  {
    id: 5,
    kode_batch: 'BATCH-CET-2311',
    nama: 'Cetirizine HCl 10mg',
    kategori: 'Antihistamin / Alergi',
    golongan: 'Bebas Terbatas',
    stok: 52,
    min_stok: 20,
    satuan: 'Strip (10 Tab)',
    harga_beli: 5000,
    harga_jual: 9000,
    expired_date: '2026-12-05',
    suplier: 'PT Kalbe Farma Distribusi',
    lokasi_rak: 'Rak A-08'
  },
  {
    id: 6,
    kode_batch: 'BATCH-ANT-2210',
    nama: 'Antasida Doen Suspensi 60ml',
    kategori: 'Antasida & Ulkus',
    golongan: 'Bebas',
    stok: 30,
    min_stok: 15,
    satuan: 'Botol / Sirup',
    harga_beli: 6500,
    harga_jual: 11000,
    expired_date: '2027-03-10',
    suplier: 'PT Kimia Farma Trading',
    lokasi_rak: 'Rak D-01'
  }
];

export const INITIAL_PATIENTS_SEED: UnifiedPatient[] = [
  {
    id: 1,
    nama: 'Budi Santoso',
    nik: '3273011405800001',
    tanggal_lahir: '1980-05-14',
    jenis_kelamin: 'L',
    telepon: '0812-3456-7890',
    alamat: 'Jl. Sukajadi No. 112, Kota Bandung',
    alergi_obat: ['Amoxicillin', 'Penicillin'],
    riwayat_penyakit: ['Diabetes Melitus Tipe 2', 'Hipertensi'],
    catatan_medis: 'Rutin tebus obat Metformin 500mg dan Amlodipine 10mg setiap awal bulan.',
    waktu_kunjungan: '2026-10-29 08:30',
    penyakit_diderita: 'Kontrol Gula Darah & Tekanan Darah Tinggi',
    status_pembelian: 'Lunas',
    keterangan_pembelian: 'Pembelian rutin Metformin & Amlodipine (Lunas via QRIS)'
  },
  {
    id: 2,
    nama: 'Siti Rahmawati',
    nik: '3273022208920004',
    tanggal_lahir: '1992-08-22',
    jenis_kelamin: 'P',
    telepon: '0813-9876-5432',
    alamat: 'Jl. Buah Batu No. 45, Kota Bandung',
    alergi_obat: ['Aspirin', 'Ibuprofen (NSAID)'],
    riwayat_penyakit: ['Gastritis Kronis (Maag)'],
    catatan_medis: 'Hindari pemberian obat pereda nyeri golongan NSAID karena memicu nyeri lambung akut.',
    waktu_kunjungan: '2026-10-28 16:15',
    penyakit_diderita: 'Dispepsia Akut & Nyeri Ulu Hati',
    status_pembelian: 'Belum Lunas',
    keterangan_pembelian: 'Kurang bayar Rp 25.000 untuk resep Antasida Doen Suspensi (Janji bayar sore ini)'
  },
  {
    id: 3,
    nama: 'Ahmad Fauzi',
    nik: '3273051011750002',
    tanggal_lahir: '1975-11-10',
    jenis_kelamin: 'L',
    telepon: '0857-1122-3344',
    alamat: 'Komp. Antapani Mas Blok C-14, Bandung',
    alergi_obat: [],
    riwayat_penyakit: ['Hiperkolesterolemia'],
    catatan_medis: 'Tidak memiliki riwayat alergi obat. Konsumsi Simvastatin 20mg malam hari.',
    waktu_kunjungan: '2026-10-28 10:05',
    penyakit_diderita: 'Kolesterol Tinggi & Pegal Tengkuk',
    status_pembelian: 'Lunas',
    keterangan_pembelian: 'Lunas Tunai Rp 85.000'
  },
  {
    id: 4,
    nama: 'Dewi Lestari',
    nik: '3273080303880009',
    tanggal_lahir: '1988-03-03',
    jenis_kelamin: 'P',
    telepon: '0821-5566-7788',
    alamat: 'Jl. Dago Asri II No. 8, Bandung',
    alergi_obat: ['Kotrimoksazol (Sulfa)', 'Ciprofloxacin'],
    riwayat_penyakit: ['Asma Bronkial', 'Rhinitis Alergi'],
    catatan_medis: 'Reaksi ruam kulit gatal hebat jika terpapar antibiotik golongan Sulfonamida.',
    waktu_kunjungan: '2026-10-27 19:20',
    penyakit_diderita: 'Serangan Rhinitis Alergi & Sesak Ringan',
    status_pembelian: 'Lunas',
    keterangan_pembelian: 'Lunas Transfer Debit BCA'
  }
];

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getRelativeDateString(daysAgo: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - daysAgo);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Initial transactions synced with real HPP from INITIAL_STOCKS_SEED and relative to current date so filters always work
export function getInitialTransactionsSeed(): UnifiedFinancialTransaction[] {
  const today = getTodayDateString();
  const yesterday = getRelativeDateString(1);
  const twoDaysAgo = getRelativeDateString(2);
  const fourDaysAgo = getRelativeDateString(4);

  // Item 1: Metformin (30 * 6500 = 195.000, HPP: 30 * 3800 = 114.000) + Amlodipine (30 * 12500 = 375.000, HPP: 30 * 7000 = 210.000) + Tuslah 5.000
  // Omzet = 575.000, HPP = 324.000, Laba Kotor = 251.000, Margin = 43.7%
  return [
    {
      id: 'INV-2026-0941',
      waktu: '14:45 WIB',
      tanggal: today,
      pasien: 'Budi Santoso',
      pasien_id: 1,
      dokter: 'dr. H. Susanto, Sp.PD',
      kasir: 'Apt. Penanggung Jawab',
      tipe: 'Resep',
      metode: 'QRIS',
      items: 'Metformin HCl 500mg (30), Amlodipine Besylate 10mg (30)',
      jumlahItem: 2,
      omzet: 575000,
      hpp: 324000,
      labaKotor: 251000,
      marginPersen: 43.7,
      status: 'Lunas',
      skrining: 'Aman'
    },
    {
      id: 'INV-2026-0940',
      waktu: '13:15 WIB',
      tanggal: today,
      pasien: 'Pasien Umum (Walk-in)',
      kasir: 'Apt. Penanggung Jawab',
      tipe: 'Obat Bebas (OTC)',
      metode: 'Tunai',
      items: 'Paracetamol 500mg (2 Strip)',
      jumlahItem: 1,
      omzet: 16000,
      hpp: 9000,
      labaKotor: 7000,
      marginPersen: 43.8,
      status: 'Lunas',
      skrining: 'Aman'
    },
    {
      id: 'INV-2026-0939',
      waktu: '16:20 WIB',
      tanggal: yesterday,
      pasien: 'Siti Rahmawati',
      pasien_id: 2,
      dokter: 'dr. Anita, Sp.PD',
      kasir: 'Apt. Penanggung Jawab',
      tipe: 'Resep',
      metode: 'Tunai',
      items: 'Antasida Doen Suspensi 60ml (2 Botol)',
      jumlahItem: 1,
      omzet: 27000,
      hpp: 13000,
      labaKotor: 14000,
      marginPersen: 51.9,
      status: 'Pending',
      skrining: 'Aman'
    },
    {
      id: 'INV-2026-0938',
      waktu: '10:05 WIB',
      tanggal: twoDaysAgo,
      pasien: 'Ahmad Fauzi',
      pasien_id: 3,
      dokter: 'dr. H. Susanto, Sp.PD',
      kasir: 'Apt. Penanggung Jawab',
      tipe: 'Resep',
      metode: 'Tunai',
      items: 'Metformin HCl 500mg (10 Strip)',
      jumlahItem: 1,
      omzet: 70000,
      hpp: 38000,
      labaKotor: 32000,
      marginPersen: 45.7,
      status: 'Lunas',
      skrining: 'Aman'
    },
    {
      id: 'INV-2026-0937',
      waktu: '19:20 WIB',
      tanggal: fourDaysAgo,
      pasien: 'Dewi Lestari',
      pasien_id: 4,
      dokter: 'dr. Bambang, Sp.P',
      kasir: 'Apt. Penanggung Jawab',
      tipe: 'Resep',
      metode: 'Debit / Transfer',
      items: 'Cetirizine HCl 10mg (5 Strip)',
      jumlahItem: 1,
      omzet: 50000,
      hpp: 25000,
      labaKotor: 25000,
      marginPersen: 50.0,
      status: 'Lunas',
      skrining: 'Peringatan'
    }
  ];
}

// ==================== PROFILE SYNC (NO HARDCODE MISMATCH) ====================
export function getFaskesProfileSync(): UnifiedFaskesProfile {
  let faskesParsed: any = null;
  let userParsed: any = null;

  if (typeof window !== 'undefined') {
    try {
      const rawFaskes = localStorage.getItem('mediagnotek_faskes_session');
      if (rawFaskes) faskesParsed = JSON.parse(rawFaskes);
    } catch {}

    try {
      const rawUser = localStorage.getItem('mediagnotek_user_session');
      if (rawUser) userParsed = JSON.parse(rawUser);
    } catch {}
  }

  const fp = faskesParsed?.faskes_profile || {};

  const resolvedProfile: UnifiedFaskesProfile = {
    id: faskesParsed?.id || (userParsed?.facility_id ? `FSK-${userParsed.facility_id}` : 'FSK-001'),
    email: faskesParsed?.email || userParsed?.email || '',
    role: faskesParsed?.role || userParsed?.role || 'FASKES_ADMIN',
    faskes_profile: {
      nama_faskes: fp.nama_faskes || userParsed?.facility_name || '',
      tipe_faskes: fp.tipe_faskes || 'Apotek',
      nomor_izin_operasional: fp.nomor_izin_operasional || '',
      penanggung_jawab: fp.penanggung_jawab || userParsed?.name || '',
      nomor_telepon: fp.nomor_telepon || '',
      foto_faskes_url: fp.foto_faskes_url || userParsed?.avatar || '',
      alamat_lengkap: fp.alamat_lengkap || '',
      kota: fp.kota || '',
      provinsi: fp.provinsi || ''
    },
    created_at: faskesParsed?.created_at || userParsed?.login_time || new Date().toISOString()
  };

  return resolvedProfile;
}

export async function loadFaskesProfileAsync(): Promise<UnifiedFaskesProfile> {
  const localProfile = getFaskesProfileSync();

  // Jika nama_faskes sudah ada di sesi lokal, pastikan tersimpan di mediagnotek_faskes_session dan kembalikan
  if (localProfile.faskes_profile.nama_faskes) {
    if (typeof window !== 'undefined' && !localStorage.getItem('mediagnotek_faskes_session')) {
      localStorage.setItem('mediagnotek_faskes_session', JSON.stringify(localProfile));
    }
    return localProfile;
  }

  // Coba ambil dari endpoint backend /auth/me jika sesi lokal belum lengkap
  try {
    const apiUser = await apiGetCurrentUser();
    if (apiUser) {
      const merged: UnifiedFaskesProfile = {
        id: localProfile.id || `FSK-${apiUser.facility_id || '001'}`,
        email: localProfile.email || apiUser.email || '',
        role: localProfile.role || apiUser.role || 'FASKES_ADMIN',
        faskes_profile: {
          nama_faskes: localProfile.faskes_profile.nama_faskes || apiUser.facility_name || '',
          tipe_faskes: localProfile.faskes_profile.tipe_faskes || 'Apotek',
          nomor_izin_operasional: localProfile.faskes_profile.nomor_izin_operasional || '',
          penanggung_jawab: localProfile.faskes_profile.penanggung_jawab || apiUser.nama_lengkap || '',
          nomor_telepon: localProfile.faskes_profile.nomor_telepon || '',
          foto_faskes_url: localProfile.faskes_profile.foto_faskes_url || apiUser.avatar_url || '',
          alamat_lengkap: localProfile.faskes_profile.alamat_lengkap || '',
          kota: localProfile.faskes_profile.kota || '',
          provinsi: localProfile.faskes_profile.provinsi || ''
        },
        created_at: localProfile.created_at || new Date().toISOString()
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('mediagnotek_faskes_session', JSON.stringify(merged));
      }
      return merged;
    }
  } catch {}

  return localProfile;
}

// ==================== STOCKS SYNC ====================
export function getInitializedStocks(): UnifiedStockBatch[] {
  if (typeof window === 'undefined') return INITIAL_STOCKS_SEED;
  try {
    const raw = localStorage.getItem('mediagnotek_stocks_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s: any) => ({
          ...s,
          harga_beli: Number(s.harga_beli) || Math.round((Number(s.harga_jual) || 10000) * 0.6),
          harga_jual: Number(s.harga_jual) || 10000,
          stok: Number(s.stok) || 0,
          min_stok: Number(s.min_stok) || 15
        }));
      }
    }
    localStorage.setItem('mediagnotek_stocks_data', JSON.stringify(INITIAL_STOCKS_SEED));
  } catch {}
  return INITIAL_STOCKS_SEED;
}

export function saveStocksToStorage(stocks: UnifiedStockBatch[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mediagnotek_stocks_data', JSON.stringify(stocks));
    window.dispatchEvent(new Event('mediagnotek_data_updated'));
  } catch {}
}

// ==================== PATIENTS SYNC ====================
export function getInitializedPatients(): UnifiedPatient[] {
  if (typeof window === 'undefined') return INITIAL_PATIENTS_SEED;
  try {
    const raw = localStorage.getItem('mediagnotek_patients_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    localStorage.setItem('mediagnotek_patients_data', JSON.stringify(INITIAL_PATIENTS_SEED));
  } catch {}
  return INITIAL_PATIENTS_SEED;
}

export function savePatientsToStorage(patients: UnifiedPatient[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('mediagnotek_patients_data', JSON.stringify(patients));
    window.dispatchEvent(new Event('mediagnotek_data_updated'));
  } catch {}
}

// ==================== TRANSACTIONS SYNC ====================
export function getInitializedTransactions(): UnifiedFinancialTransaction[] {
  const seed = getInitialTransactionsSeed();
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem('mediagnotek_transactions_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const stocks = getInitializedStocks();
        // Pastikan setiap transaksi yang tersimpan memiliki perhitungan HPP & Laba Kotor yang selaras
        const normalized: UnifiedFinancialTransaction[] = parsed.map((t: any) => {
          const omzet = Number(t.omzet || t.total_harga || 0);
          let hpp = Number(t.hpp || 0);
          if (!hpp && Array.isArray(t.raw_items) && t.raw_items.length > 0) {
            hpp = t.raw_items.reduce((sum: number, it: any) => {
              const matchedStock = stocks.find(
                (s) => s.id === it.drug_id || s.nama.toLowerCase() === String(it.drug_nama || '').toLowerCase()
              );
              const modalUnit = Number(it.harga_beli) || matchedStock?.harga_beli || Math.round((Number(it.harga) || 0) * 0.6);
              return sum + modalUnit * (Number(it.jumlah) || 1);
            }, 0);
          } else if (!hpp) {
            hpp = Math.round(omzet * 0.6);
          }
          const labaKotor = omzet - hpp;
          const marginPersen = omzet > 0 ? Number(((labaKotor / omzet) * 100).toFixed(1)) : 0;

          return {
            id: t.id || `INV-${Date.now().toString().slice(-6)}`,
            waktu: t.waktu || '12:00 WIB',
            tanggal: t.tanggal ? String(t.tanggal).slice(0, 10) : getTodayDateString(),
            pasien: t.pasien || t.pasien_nama || 'Pasien Umum (Walk-in)',
            pasien_id: t.pasien_id,
            dokter: t.dokter || t.dokter_perujuk,
            kasir: t.kasir || 'Petugas Farmasi',
            tipe: t.tipe === 'Non-Resep' || t.tipe === 'Obat Bebas (OTC)' ? 'Obat Bebas (OTC)' : 'Resep',
            metode: t.metode === 'TUNAI' || t.metode === 'Tunai' ? 'Tunai' : (t.metode || 'QRIS'),
            items: typeof t.items === 'string'
              ? t.items
              : Array.isArray(t.items)
              ? t.items.map((i: any) => `${i.drug_nama} (${i.jumlah})`).join(', ')
              : 'Obat Farmasi',
            jumlahItem: Number(t.jumlahItem) || (Array.isArray(t.items) ? t.items.length : 1),
            omzet,
            hpp,
            labaKotor,
            marginPersen,
            status: t.status || t.status_pembayaran || 'Lunas',
            skrining: t.skrining || 'Aman'
          };
        });
        return normalized;
      }
    }
    localStorage.setItem('mediagnotek_transactions_data', JSON.stringify(seed));
  } catch {}
  return seed;
}
