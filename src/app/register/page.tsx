'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  KeyRound,
  User,
  MapPin,
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Phone,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  // Step state (Step 1: Akun & Akses, Step 2: Profil Faskes, Lokasi & Foto)
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profil Faskes State
  const [namaFaskes, setNamaFaskes] = useState('');
  const [tipeFaskes, setTipeFaskes] = useState<'Apotek' | 'Klinik' | 'Rumah Sakit'>('Apotek');
  const [nomorIzin, setNomorIzin] = useState('');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [kota, setKota] = useState('Bandung');
  const [provinsi, setProvinsi] = useState('Jawa Barat');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Google SSO Simulation
  const handleGoogleSignup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEmail('faskes.resmi@gmail.com');
      setNamaFaskes('Apotek Medika Utama (via Google)');
      setFotoPreview('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&auto=format&fit=crop&q=80');
      setIsLoading(false);
      setCurrentStep(2);
    }, 600);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Harap lengkapi email dan kata sandi.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaFaskes || !alamatLengkap || !penanggungJawab) {
      setErrorMessage('Harap lengkapi informasi fasilitas kesehatan.');
      return;
    }

    setIsLoading(true);

    const faskesData = {
      id: `FSK-${Date.now().toString().slice(-4)}`,
      email,
      role: 'FASKES_ADMIN',
      faskes_profile: {
        nama_faskes: namaFaskes,
        tipe_faskes: tipeFaskes,
        nomor_izin_operasional: nomorIzin || 'SIA-3273/2026/089',
        penanggung_jawab: penanggungJawab,
        nomor_telepon: telepon || '081234567890',
        foto_faskes_url: fotoPreview || '',
        alamat_lengkap: alamatLengkap,
        kota,
        provinsi
      },
      created_at: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('mediagnotek_faskes_session', JSON.stringify(faskesData));
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--warm-bg)',
      color: 'var(--warm-text)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative'
    }}>
      {/* Back Button */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px'
      }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1.8px solid #1E1E1E',
          backgroundColor: '#FFFFFF',
          color: '#18181B',
          fontWeight: 700,
          fontSize: '0.86rem',
          textDecoration: 'none',
          boxShadow: '2px 2px 0px #1E1E1E'
        }}>
          <ArrowLeft size={16} strokeWidth={2.4} />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="neo-card" style={{
        width: '100%',
        maxWidth: currentStep === 1 ? '480px' : '580px',
        padding: '36px 32px',
        backgroundColor: '#FFFFFF',
        boxShadow: '4px 5px 0px #1E1E1E',
        borderRadius: '18px',
        zIndex: 10,
        transition: 'all 0.2s ease'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            backgroundColor: '#DCFCE7',
            border: '2px solid #1E1E1E',
            boxShadow: '2px 2.5px 0px #1E1E1E',
            marginBottom: '12px'
          }}>
            <Building2 size={24} strokeWidth={2.2} color="#166534" />
          </div>

          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            color: '#18181B',
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}>
            Pendaftaran Akun Fasilitas Kesehatan
          </h1>
          <p style={{ color: '#52525B', fontSize: '0.88rem', margin: 0 }}>
            Satu akun resmi Faskes untuk Apotek, Klinik, atau Rumah Sakit
          </p>

          {/* Stepper Indikator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: currentStep === 1 ? '#18181B' : '#059669'
            }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep === 1 ? '#FEF3D6' : '#DCFCE7',
                border: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1px 1px 0px #1E1E1E'
              }}>
                1
              </span>
              Kredensial Akses
            </div>

            <div style={{ width: '32px', height: '2px', backgroundColor: '#1E1E1E' }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: currentStep === 2 ? '#18181B' : '#9CA3AF'
            }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentStep === 2 ? '#FEF3D6' : '#FAF8F4',
                border: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1px 1px 0px #1E1E1E'
              }}>
                2
              </span>
              Profil & Foto Faskes
            </div>
          </div>
        </div>

        {errorMessage && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1.8px solid #DC2626',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#991B1B',
            fontSize: '0.84rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ================= STEP 1: AKUN & GOOGLE SSO ================= */}
        {currentStep === 1 && (
          <div>
            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: '#18181B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '2.5px 2.5px 0px #1E1E1E',
                marginBottom: '18px',
                transition: 'all 0.1s ease'
              }}
            >
              {/* Google 4-Color SVG Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.99 0 12s.45 3.84 1.25 5.43l4.03-3.14z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Daftar Cepat dengan Akun Google</span>
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '18px 0',
              color: '#9CA3AF',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <div style={{ flex: 1, height: '1.2px', backgroundColor: '#E5E7EB' }} />
              <span style={{ padding: '0 10px', textTransform: 'uppercase' }}>atau dengan email</span>
              <div style={{ flex: 1, height: '1.2px', backgroundColor: '#E5E7EB' }} />
            </div>

            <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '5px' }}>
                  Alamat Email Faskes Resmi *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
                  <input
                    type="email"
                    required
                    placeholder="faskes@apoteksehat.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%', paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '5px' }}>
                  Kata Sandi *
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
                  <input
                    type="password"
                    required
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%', paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '5px' }}>
                  Ulangi Kata Sandi *
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
                  <input
                    type="password"
                    required
                    placeholder="Konfirmasi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input-neo"
                    style={{ width: '100%', paddingLeft: '36px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  backgroundColor: '#FEF3D6',
                  fontWeight: 900,
                  fontSize: '0.96rem',
                  color: '#18181B',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '3px 3px 0px #1E1E1E'
                }}
              >
                <span>Lanjut ke Profil & Lokasi Faskes</span>
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: PROFIL, FOTO & LOKASI FASKES ================= */}
        {currentStep === 2 && (
          <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Tipe Faskes Selection */}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                  Nama Faskes / Usaha *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Apotek Farma Sehat"
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
                  placeholder="SIA-3273/2026/xxx"
                  value={nomorIzin}
                  onChange={(e) => setNomorIzin(e.target.value)}
                  className="form-input-neo"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Penanggung Jawab & WhatsApp */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                  Penanggung Jawab Medis (PJ/APA) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="apt. Sarah Safitri, S.Farm"
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
                  placeholder="081234567890"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="form-input-neo"
                  style={{ width: '100%' }}
                />
              </div>
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
                  width: '64px',
                  height: '64px',
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
                    <Camera size={24} color="#9CA3AF" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="foto-faskes"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="foto-faskes"
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
                    <Upload size={14} /> Pilih Foto Faskes
                  </label>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '4px' }}>
                    Format JPG/PNG untuk kop etiket obat & profil dashboard.
                  </div>
                </div>
              </div>
            </div>

            {/* Alamat Lengkap & Kota */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginBottom: '4px' }}>
                Alamat Lengkap Lokasi Faskes *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Jl. Merdeka No. 45, RT 02 / RW 05, Kel. Babakan Ciamis"
                value={alamatLengkap}
                onChange={(e) => setAlamatLengkap(e.target.value)}
                className="form-input-neo"
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

            {/* Buttons Back & Submit */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
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
                ← Kembali
              </button>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '2px solid #1E1E1E',
                  backgroundColor: '#DCFCE7',
                  fontWeight: 900,
                  fontSize: '0.96rem',
                  color: '#14532D',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '3px 3px 0px #1E1E1E'
                }}
              >
                <CheckCircle2 size={18} strokeWidth={2.4} />
                <span>{isLoading ? 'Mendaftarkan Akun Faskes...' : 'Selesaikan Pendaftaran & Masuk'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1.5px dashed #D1D5DB',
          fontSize: '0.86rem',
          color: '#6B7280'
        }}>
          Fasilitas kesehatan sudah memiliki akun?{' '}
          <Link href="/login" style={{ color: '#18181B', fontWeight: 800, textDecoration: 'underline' }}>
            Masuk ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
