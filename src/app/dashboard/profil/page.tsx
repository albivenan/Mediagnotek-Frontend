'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  KeyRound,
  User,
  Phone,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Printer,
  Save,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { apiUpdateUserProfile, apiGetCurrentUser } from '@/lib/api';

interface FaskesSessionData {
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

const DEFAULT_PROFILE: FaskesSessionData = {
  id: 'FSK-2026-089',
  email: 'admin@apoteksehat.com',
  role: 'FASKES_ADMIN',
  faskes_profile: {
    nama_faskes: 'Apotek Sehat Farma',
    tipe_faskes: 'Apotek',
    nomor_izin_operasional: 'SIA-3273/2026/089-DINKES',
    penanggung_jawab: 'apt. Sarah Safitri, S.Farm',
    nomor_telepon: '081234567890',
    foto_faskes_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=80',
    alamat_lengkap: 'Jl. Merdeka No. 45, RT 02 / RW 05, Kel. Babakan Ciamis',
    kota: 'Bandung',
    provinsi: 'Jawa Barat'
  },
  created_at: '2026-01-15T08:30:00.000Z'
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<FaskesSessionData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Form edit states
  const [namaFaskes, setNamaFaskes] = useState('');
  const [tipeFaskes, setTipeFaskes] = useState<'Apotek' | 'Klinik' | 'Rumah Sakit'>('Apotek');
  const [nomorIzin, setNomorIzin] = useState('');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [kota, setKota] = useState('');
  const [provinsi, setProvinsi] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (typeof window === 'undefined') return;

      let loadedProfile: FaskesSessionData | null = null;
      const stored = localStorage.getItem('mediagnotek_faskes_session');
      if (stored) {
        try {
          loadedProfile = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse faskes session', e);
        }
      }

      const userStored = localStorage.getItem('mediagnotek_user_session');
      let userObj: any = null;
      if (userStored) {
        try {
          userObj = JSON.parse(userStored);
        } catch (_) {}
      }

      if (!loadedProfile && !userObj) {
        try {
          const apiUser = await apiGetCurrentUser();
          if (apiUser) {
            loadedProfile = {
              id: `FSK-${apiUser.facility_id || '001'}`,
              email: apiUser.email,
              role: apiUser.role,
              faskes_profile: {
                nama_faskes: apiUser.facility_name || 'Apotek Sehat Farma',
                tipe_faskes: 'Apotek',
                nomor_izin_operasional: 'SIA-3273/2026/089-DINKES',
                penanggung_jawab: apiUser.nama_lengkap,
                nomor_telepon: '081234567890',
                foto_faskes_url: apiUser.avatar_url || '',
                alamat_lengkap: 'Jl. Merdeka No. 45, Bandung',
                kota: 'Bandung',
                provinsi: 'Jawa Barat'
              },
              created_at: new Date().toISOString()
            };
          }
        } catch (_) {}
      }

      const finalProfile = loadedProfile || DEFAULT_PROFILE;
      if (userObj?.name && finalProfile.faskes_profile) {
        finalProfile.faskes_profile.penanggung_jawab = userObj.name;
      }
      if (userObj?.email) {
        finalProfile.email = userObj.email;
      }

      setProfileData(finalProfile);
      fillFormFromProfile(finalProfile);
    };

    loadProfileData();
  }, []);

  const fillFormFromProfile = (data: FaskesSessionData) => {
    setEmail(data.email || '');
    setNamaFaskes(data.faskes_profile?.nama_faskes || '');
    setTipeFaskes(data.faskes_profile?.tipe_faskes || 'Apotek');
    setNomorIzin(data.faskes_profile?.nomor_izin_operasional || '');
    setPenanggungJawab(data.faskes_profile?.penanggung_jawab || '');
    setTelepon(data.faskes_profile?.nomor_telepon || '');
    setAlamatLengkap(data.faskes_profile?.alamat_lengkap || '');
    setKota(data.faskes_profile?.kota || '');
    setProvinsi(data.faskes_profile?.provinsi || '');
    setFotoPreview(data.faskes_profile?.foto_faskes_url || null);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const updated: FaskesSessionData = {
      ...profileData,
      email,
      faskes_profile: {
        nama_faskes: namaFaskes,
        tipe_faskes: tipeFaskes,
        nomor_izin_operasional: nomorIzin,
        penanggung_jawab: penanggungJawab,
        nomor_telepon: telepon,
        foto_faskes_url: fotoPreview || '',
        alamat_lengkap: alamatLengkap,
        kota,
        provinsi
      }
    };

    setProfileData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediagnotek_faskes_session', JSON.stringify(updated));

      // Also sync user session so dashboard sidebar immediately reflects new name/avatar
      try {
        const savedUser = localStorage.getItem('mediagnotek_user_session');
        const userObj = savedUser ? JSON.parse(savedUser) : {};
        const updatedUser = {
          ...userObj,
          name: penanggungJawab || userObj.name || 'Pengelola Farmasi',
          email: email || userObj.email || 'apoteker@faskes.id',
          avatar: fotoPreview || userObj.avatar || null,
          facility_name: namaFaskes || userObj.facility_name
        };
        localStorage.setItem('mediagnotek_user_session', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('mediagnotek_session_updated'));
      } catch (err) {
        console.error('Error syncing user session', err);
      }
    }

    // Also sync to FastAPI backend database
    try {
      await apiUpdateUserProfile({
        nama_lengkap: penanggungJawab,
        email: email,
        facility_name: namaFaskes,
        avatar_url: fotoPreview || undefined
      });
    } catch (err) {
      console.warn('Backend profile update failed:', err);
    }

    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan profil ke data bawaan simulasi?')) {
      setProfileData(DEFAULT_PROFILE);
      fillFormFromProfile(DEFAULT_PROFILE);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mediagnotek_faskes_session', JSON.stringify(DEFAULT_PROFILE));
        localStorage.removeItem('mediagnotek_user_session');
        window.dispatchEvent(new Event('mediagnotek_session_updated'));
      }
      setIsEditing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#DCFCE7',
          border: '2px solid #166534',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '3px 4px 0px #1E1E1E',
          color: '#14532D',
          fontWeight: 800,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} color="#166534" />
          <span>Profil Fasilitas Kesehatan Berhasil Disimpan & Tersinkronisasi!</span>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 900,
            color: '#18181B',
            letterSpacing: '-0.5px',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Building2 size={28} strokeWidth={2.3} />
            Profil & Legalitas Fasilitas Kesehatan
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.94rem' }}>
            Informasi entitas faskes terdaftar, penanggung jawab teknis kefarmasian, dan kop resmi etiket struk obat.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="neo-btn-primary"
              style={{ padding: '9px 20px', fontSize: '0.88rem' }}
            >
              Ubah Data Profil
            </button>
          ) : (
            <button
              onClick={() => {
                fillFormFromProfile(profileData);
                setIsEditing(false);
              }}
              style={{
                padding: '9px 18px',
                borderRadius: '9999px',
                border: '1.5px solid #1E1E1E',
                backgroundColor: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Batal Edit
            </button>
          )}

          <button
            onClick={handleResetToDefault}
            title="Reset ke data bawaan"
            style={{
              padding: '9px 14px',
              borderRadius: '9999px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: '#FAF8F4',
              color: '#4B5563',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Main Grid: Info Card & Form / Preview */}
      <div className="responsive-split-grid">
        {/* Left Column: Identitas Utama & Kop Etiket Obat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card Profil Utama */}
          <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '16px',
                backgroundColor: '#DCFCE7',
                border: '2px solid #1E1E1E',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '2px 2px 0px #1E1E1E',
                flexShrink: 0
              }}>
                {profileData.faskes_profile?.foto_faskes_url ? (
                  <img
                    src={profileData.faskes_profile.foto_faskes_url}
                    alt={profileData.faskes_profile.nama_faskes}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Building2 size={36} color="#166534" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    border: '1.2px solid #1E1E1E',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {profileData.faskes_profile?.tipe_faskes || 'Apotek'} Resmi
                  </span>
                  <span style={{
                    backgroundColor: '#FEF3D6',
                    color: '#92400E',
                    border: '1.2px solid #1E1E1E',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    ID: {profileData.id}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#18181B', margin: '4px 0 6px 0' }}>
                  {profileData.faskes_profile?.nama_faskes}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '0.8rem', fontWeight: 700 }}>
                  <ShieldCheck size={16} />
                  <span>SIA & Izin Operasional Tervalidasi</span>
                </div>
              </div>
            </div>

            {/* List Detail Legalitas */}
            <div style={{
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1.8px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>
                  NOMOR IZIN OPERASIONAL (SIA / SIPA)
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#18181B' }}>
                  {profileData.faskes_profile?.nomor_izin_operasional || '-'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>
                  PENANGGUNG JAWAB TEKNIS (PJ / APA)
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#18181B' }}>
                  {profileData.faskes_profile?.penanggung_jawab || '-'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>
                  KONTAK WHATSAPP & EMAIL OPERASIONAL
                </span>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18181B', display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span>📱 {profileData.faskes_profile?.nomor_telepon || '-'}</span>
                  <span>✉️ {profileData.email}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>
                  LOKASI & ALAMAT LENGKAP
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#374151', lineHeight: 1.5 }}>
                  📍 {profileData.faskes_profile?.alamat_lengkap}, {profileData.faskes_profile?.kota}, {profileData.faskes_profile?.provinsi}
                </span>
              </div>
            </div>
          </div>

          {/* Card Preview Kop Etiket Obat & Nota Struk */}
          <div className="neo-card" style={{ padding: '22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} />
                <span>Pratinjau Kop Etiket & Struk Kasir</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                Otomatis Masuk Struk
              </span>
            </div>

            {/* Simulasi Struk Thermal / Etiket Obat */}
            <div style={{
              backgroundColor: '#FAF8F4',
              border: '1.5px dashed #1E1E1E',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: 'monospace'
            }}>
              <div style={{ textAlign: 'center', borderBottom: '1px dashed #9CA3AF', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#18181B' }}>
                  {profileData.faskes_profile?.nama_faskes.toUpperCase()}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#4B5563', marginTop: '2px' }}>
                  SIA: {profileData.faskes_profile?.nomor_izin_operasional}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                  APA: {profileData.faskes_profile?.penanggung_jawab}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                  {profileData.faskes_profile?.alamat_lengkap}, {profileData.faskes_profile?.kota}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                  Telp: {profileData.faskes_profile?.nomor_telepon}
                </div>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#374151' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pasien: Budi Santoso</span>
                  <span>24 Okt 2026</span>
                </div>
                <div style={{ fontWeight: 800, color: '#18181B', margin: '6px 0 2px 0' }}>
                  Metformin HCl 500mg (30 Tab)
                </div>
                <div style={{ color: '#0369A1', fontWeight: 700 }}>
                  🔖 Aturan Pakai: 2 x 1 tablet sesudah makan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Edit Profil & Pengaturan Akun */}
        <div className="neo-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', boxShadow: '3px 4px 0px #1E1E1E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.8px solid #1E1E1E', paddingBottom: '14px', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', margin: 0 }}>
              {isEditing ? 'Formulir Pembaruan Data Faskes' : 'Data Kredensial & Hak Akses'}
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700 }}>
              Role: Admin Faskes
            </span>
          </div>

          {!isEditing ? (
            /* Mode Baca / Tampilan Readonly */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.2px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>EMAIL LOGIN AKUN</span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#18181B' }}>{profileData.email}</span>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.2px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>HAK AKSES / ROLE</span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#166534' }}>{profileData.role} (Akses Penuh Seluruh Modul)</span>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#FAF8F4', borderRadius: '12px', border: '1.2px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>TANGGAL TERDAFTAR DI SISTEM</span>
                <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#18181B' }}>
                  {new Date(profileData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#DCFCE7',
                borderRadius: '12px',
                border: '1.5px solid #166534',
                marginTop: '10px'
              }}>
                <div style={{ fontWeight: 800, color: '#14532D', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} />
                  Fasilitas Kesehatan Terverifikasi
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: '#166534', lineHeight: 1.45 }}>
                  Akun Anda telah tersinkronisasi penuh dengan database inventori farmasi FEFO, modul kasir POS, dan asisten AI apoteker MediagnoTek.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="neo-btn-primary"
                style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}
              >
                Ubah Informasi Profil Faskes
              </button>
            </div>
          ) : (
            /* Mode Form Edit (Menyesuaikan field pada form Register) */
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tipe Faskes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '6px' }}>
                  Jenis Fasilitas Kesehatan *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['Apotek', 'Klinik', 'Rumah Sakit'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipeFaskes(t)}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: '1.5px solid #1E1E1E',
                        backgroundColor: tipeFaskes === t ? '#DCFCE7' : '#FFFFFF',
                        fontWeight: tipeFaskes === t ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: tipeFaskes === t ? '2px 2px 0px #1E1E1E' : 'none'
                      }}
                    >
                      {t === 'Apotek' ? '💊 ' : t === 'Klinik' ? '🩺 ' : '🏥 '}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nama Faskes & No Izin */}
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                    Nama Faskes / Usaha *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaFaskes}
                    onChange={(e) => setNamaFaskes(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                    No. Izin Operasional / SIA
                  </label>
                  <input
                    type="text"
                    value={nomorIzin}
                    onChange={(e) => setNomorIzin(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Penanggung Jawab & WhatsApp */}
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                    Penanggung Jawab Medis (PJ/APA) *
                  </label>
                  <input
                    type="text"
                    required
                    value={penanggungJawab}
                    onChange={(e) => setPenanggungJawab(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                    No. WhatsApp Resmi
                  </label>
                  <input
                    type="tel"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Email Akun */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                  Alamat Email Akun Faskes *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-neo"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Foto Faskes Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                  Foto Gedung / Papan Nama / Logo Faskes
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  backgroundColor: '#FAF8F4',
                  border: '1.5px dashed #1E1E1E',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #1E1E1E',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="Preview Faskes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Camera size={22} color="#9CA3AF" />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="foto-faskes-edit"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="foto-faskes-edit"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #1E1E1E',
                        backgroundColor: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '1.5px 1.5px 0px #1E1E1E'
                      }}
                    >
                      <Upload size={14} /> Ganti Foto Faskes
                    </label>
                  </div>
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                  Alamat Lengkap Lokasi Faskes *
                </label>
                <textarea
                  rows={2}
                  required
                  value={alamatLengkap}
                  onChange={(e) => setAlamatLengkap(e.target.value)}
                  className="form-input-neo"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* Kota & Provinsi */}
              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                    Provinsi
                  </label>
                  <input
                    type="text"
                    value={provinsi}
                    onChange={(e) => setProvinsi(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Buttons Save & Cancel */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '1.8px solid #1E1E1E',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="neo-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Save size={16} />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
