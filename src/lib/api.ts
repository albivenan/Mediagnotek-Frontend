// API Client Helper for MediagnoTek FastAPI Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Disease {
  id: number;
  nama: string;
  deskripsi: string;
}

export interface Drug {
  id: number;
  nama: string;
  kategori: string;
  deskripsi: string;
  dosis_standar: string;
  rxcui?: string;
}

export interface DrugInteraction {
  drug1_nama: string;
  drug2_nama: string;
  severity: 'Tinggi' | 'Sedang' | 'Ringan' | string;
  deskripsi: string;
}

export interface DiagnosisPrediction {
  penyakit: string;
  confidence: number;
  deskripsi: string;
}

export interface FaskesAccount {
  id: string;
  email: string;
  auth_provider: 'email' | 'google';
  google_id?: string;
  role: 'FASKES_ADMIN';
  faskes_profile: {
    nama_faskes: string;
    tipe_faskes: 'Apotek' | 'Klinik' | 'Rumah Sakit';
    nomor_izin_operasional: string;
    penanggung_jawab: string;
    nomor_telepon: string;
    foto_faskes_url?: string;
    alamat_lengkap: string;
    kota: string;
    provinsi: string;
  };
  created_at: string;
}

export interface Patient {
  id: number;
  nama: string;
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  telepon: string;
  alamat: string;
  alergi_obat: string[];
  catatan_medis?: string;
  riwayat_penyakit?: string[];
}

export interface MedicineStock {
  id: number;
  kode_obat: string;
  nama: string;
  kategori: string;
  golongan: 'Bebas' | 'Bebas Terbatas' | 'Keras' | 'Psikotropika';
  bentuk: string; // Tablet, Sirup, Salep, dll
  satuan: string; // Strip, Botol, Box
  stok: number;
  min_stok: number;
  harga_beli: number;
  harga_jual: number;
  batch_no: string;
  expired_date: string;
  lokasi_rak: string;
}

export interface PrescriptionItem {
  drug_id: number;
  drug_nama: string;
  jumlah: number;
  satuan?: string;
  signa: string; // Aturan pakai: misal '3 x 1 Tablet sesudah makan'
  harga: number;
}


export interface PrescriptionTransaction {
  id: string;
  tanggal: string;
  tipe: 'Resep' | 'Non-Resep';
  pasien_id?: number;
  pasien_nama: string;
  dokter_perujuk?: string;
  items: PrescriptionItem[];
  total_harga: number;
  status_pembayaran: 'Lunas' | 'Belum Lunas';
  catatan_apoteker?: string;
}

export interface StockPredictionItem {
  drug_id: number;
  drug_nama: string;
  tanggal: string;
  stok_masuk: number;
  stok_keluar: number;
  sisa: number;
}

// Diseases
export async function getDiseases(search?: string, page = 1, size = 20) {
  try {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) query.append('search', search);
    const res = await fetch(`${API_BASE_URL}/diseases?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch diseases');
    return await res.json();
  } catch (error) {
    console.warn('API Error (using fallback data):', error);
    return null;
  }
}

// Drugs
export async function getDrugs(search?: string, page = 1, size = 20) {
  try {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) query.append('search', search);
    const res = await fetch(`${API_BASE_URL}/drugs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch drugs');
    return await res.json();
  } catch (error) {
    console.warn('API Error (using fallback data):', error);
    return null;
  }
}

// Check Drug Interactions
export async function checkInteractions(drugIds: number[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/interactions/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drug_ids: drugIds }),
    });
    if (!res.ok) throw new Error('Failed to check interactions');
    return await res.json();
  } catch (error) {
    console.warn('API Error (using fallback data):', error);
    return null;
  }
}

// Diagnose
export async function runDiagnosis(symptoms: string[]) {
  try {
    const res = await fetch(`${API_BASE_URL}/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gejala: symptoms }),
    });
    if (!res.ok) throw new Error('Failed to run diagnosis');
    return await res.json();
  } catch (error) {
    console.warn('API Error (using fallback data):', error);
    return null;
  }
}

// Stock Prediction
export async function predictStock(drugId: number, periodDays = 30) {
  try {
    const res = await fetch(`${API_BASE_URL}/stock/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drug_id: drugId, period_days: periodDays }),
    });
    if (!res.ok) throw new Error('Failed to predict stock');
    return await res.json();
  } catch (error) {
    console.warn('API Error (using fallback data):', error);
    return null;
  }
}
