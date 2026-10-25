// API Client Helper for MediagnoTek FastAPI Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

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
    if (!res.ok) throw new Error('Login Failed');
    return await res.json();
  } catch (error) {
    console.warn('Backend Login API unreachable, using client auth handler:', error);
    return null;
  }
}

export async function apiRegister(email: string, password: string, namaLengkap: string, role = 'APOTEKER') {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nama_lengkap: namaLengkap, role }),
    });
    if (!res.ok) throw new Error('Register Failed');
    return await res.json();
  } catch (error) {
    console.warn('Backend Register API unreachable, using client auth handler:', error);
    return null;
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

