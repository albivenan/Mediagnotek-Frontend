const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mediagnotek-backend.vercel.app/api/v1';

export interface Disease {
  id: number;
  nama: string;
  deskripsi: string;
  penyebab?: string;
  gejala_teks?: string;
  symptoms?: { id: number; nama: string }[];
  drugs?: Drug[];
}

export interface Drug {
  id: number;
  nama: string;
  deskripsi: string;
  kategori?: string;
  dosis_standar?: string;
  dosis?: string;
  peringatan?: string;
  efek_samping?: string;
  merek_dagang?: string;
  rxcui?: string;
  diseases?: Disease[];
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
  waktu_kunjungan?: string; // misal: '2026-10-27 14:30'
  penyakit_diderita?: string; // Diagnosis / keluhan saat ini, misal: 'Hipertensi Primer, Sakit Kepala'
  status_pembelian?: 'Lunas' | 'Belum Lunas';
  keterangan_pembelian?: string; // misal: 'Sisa tagihan Rp 45.000 (Tenggat 30 Okt 2026)'
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

export async function getDiseaseDetail(diseaseId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/diseases/${diseaseId}`);
    if (!res.ok) throw new Error('Failed to fetch disease detail');
    return await res.json();
  } catch (error) {
    console.warn('API Error:', error);
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

export async function getDrugDetail(drugId: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/drugs/${drugId}`);
    if (!res.ok) throw new Error('Failed to fetch drug detail');
    return await res.json();
  } catch (error) {
    console.warn('API Error:', error);
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

// Authentication APIs
export async function apiGoogleAuth(data: { id_token?: string; email: string; name: string; picture?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Google Auth Failed');
    return await res.json();
  } catch (error) {
    console.warn('Backend Auth API unreachable, using client auth handler:', error);
    return null;
  }
}

export async function apiLogin(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.detail || 'Gagal login. Email atau kata sandi tidak cocok.' };
    }
    return { success: true, ...data };
  } catch (error: any) {
    console.error('Backend Login API error:', error);
    return { success: false, error: 'Tidak dapat terhubung ke server backend. Pastikan server aktif dan koneksi internet stabil.' };
  }
}

export async function apiRegister(payload: {
  email: string;
  password: string;
  nama_lengkap: string;
  role?: string;
  nama_faskes?: string;
  tipe_faskes?: string;
  nomor_izin_operasional?: string;
  nomor_telepon?: string;
  alamat_lengkap?: string;
  kota?: string;
  provinsi?: string;
  foto_faskes_url?: string;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data?.detail || 'Gagal melakukan pendaftaran akun.' };
    }
    return { success: true, ...data };
  } catch (error: any) {
    console.error('Backend Register API error:', error);
    return { success: false, error: 'Tidak dapat terhubung ke server backend. Pastikan server aktif dan koneksi internet stabil.' };
  }
}


export async function apiGetCurrentUser(userId?: number) {
  try {
    const url = userId ? `${API_BASE_URL}/auth/me?user_id=${userId}` : `${API_BASE_URL}/auth/me`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('Backend /auth/me unreachable:', error);
    return null;
  }
}

export async function apiUpdateUserProfile(data: {
  nama_lengkap?: string;
  email?: string;
  role?: string;
  facility_name?: string;
  avatar_url?: string;
}, userId?: number) {
  try {
    const url = userId ? `${API_BASE_URL}/auth/me?user_id=${userId}` : `${API_BASE_URL}/auth/me`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn('Backend PUT /auth/me unreachable:', error);
    return null;
  }
}

// AI Clinical Chat API
export interface AIChatPayload {
  message: string;
  patient_context?: any;
  attachment?: {
    name: string;
    type: string;
    dataUrl?: string;
  };
  api_key?: string;
}

export interface AIChatResponse {
  reply: string;
  icd_code: string;
  confidence: string;
  provider: string;
  timestamp: string;
}

export async function apiSendAiChatMessage(payload: AIChatPayload): Promise<AIChatResponse | null> {
  // 1. Coba panggil Next.js API Route internal (/api/ai/chat) yang selalu aktif bersama web
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Next.js /api/ai/chat endpoint unavailable, trying backend port 8000...', err);
  }

  // 2. Coba panggil FastAPI Backend jika aktif di port 8000
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend AI Chat API unreachable:', error);
  }

  return null;
}

// ==================== PATIENTS API (DATABASE SYNC) ====================
export async function apiGetPatients(search?: string): Promise<Patient[] | null> {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    const res = await fetch(`${API_BASE_URL}/patients?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend GET /patients unreachable, falling back to local:', error);
  }
  return null;
}

export async function apiCreatePatient(payload: any): Promise<Patient | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend POST /patients unreachable:', error);
  }
  return null;
}

export async function apiUpdatePatient(patientId: number, payload: any): Promise<Patient | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(`Backend PUT /patients/${patientId} unreachable:`, error);
  }
  return null;
}

export async function apiDeletePatient(patientId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.warn(`Backend DELETE /patients/${patientId} unreachable:`, error);
    return false;
  }
}

// ==================== BATCH STOCKS API (DATABASE SYNC) ====================
export async function apiGetStocks(search?: string): Promise<MedicineStock[] | null> {
  try {
    const query = new URLSearchParams();
    if (search) query.append('search', search);
    const res = await fetch(`${API_BASE_URL}/batches?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend GET /batches unreachable, falling back to local:', error);
  }
  return null;
}

export async function apiCreateStock(payload: any): Promise<MedicineStock | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend POST /batches unreachable:', error);
  }
  return null;
}

export async function apiUpdateStock(batchId: number, payload: any): Promise<MedicineStock | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(`Backend PUT /batches/${batchId} unreachable:`, error);
  }
  return null;
}

export async function apiDeleteStock(batchId: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/batches/${batchId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.warn(`Backend DELETE /batches/${batchId} unreachable:`, error);
    return false;
  }
}

export async function apiCreateTransaction(payload: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend POST /transactions unreachable:', error);
  }
  return null;
}

export async function apiGetTransactions(page = 1, size = 50, search?: string) {
  try {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) query.append('search', search);
    const res = await fetch(`${API_BASE_URL}/transactions?${query.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('Backend GET /transactions unreachable:', error);
  }
  return null;
}


