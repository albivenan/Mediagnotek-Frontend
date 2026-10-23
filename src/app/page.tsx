import Link from 'next/link';
import {
  LayoutDashboard,
  Dna,
  Microscope,
  Pill,
  Bot,
  Zap,
  Package,
  LineChart,
  Users,
  ShoppingCart,
  ShieldCheck,
  Building2,
  Stethoscope,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--warm-bg)',
      color: 'var(--warm-text)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* ===================== NAVBAR ===================== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(250, 248, 244, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        padding: '16px 32px'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: '#FEF3D6',
              border: '1.8px solid #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '1.5px 2px 0px #1E1E1E'
            }}>
              {/* 6-dot icon like SlotCal */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1E1E1E">
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="12" cy="6" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <circle cx="6" cy="14" r="2.5" />
                <circle cx="12" cy="14" r="2.5" />
                <circle cx="18" cy="14" r="2.5" />
              </svg>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', letterSpacing: '-0.4px' }}>
              MediagnoTek
            </span>
          </Link>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px'
          }} className="hidden-mobile">
            <Link href="/" style={{ color: '#18181B', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
              Home
            </Link>
            <Link href="/dashboard" style={{ color: '#4B5563', fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none' }}>
              Dashboard
            </Link>
          </nav>

          {/* Auth Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/login" className="nav-pill-login">
              Login
            </Link>
            <Link href="/register" className="nav-pill-join">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <main style={{ flex: 1, position: 'relative' }}>
        <section style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 24px 30px 24px',
          position: 'relative',
          minHeight: '700px'
        }}>
          {/* FLOATING CARD 1: TOP LEFT (Meeting Card + Hand Doodle) */}
          <div style={{
            position: 'absolute',
            top: '25px',
            left: '35px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }} className="hero-floating-card top-left-card">
            {/* Hand Doodle SVG on the left */}
            <div style={{ transform: 'rotate(-6deg)', opacity: 0.95, marginRight: '2px' }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hand waving / flower stem doodle */}
                <path d="M16 34c-3-3-5-7-5-12 0-2 1.2-3 2.5-3s2 1 2.5 2v-9c0-1.2 1-2 2-2s2 0.8 2 2v6" />
                <path d="M20 12c0-1.2 1-2 2-2s2 0.8 2 2v6" />
                <path d="M24 14c0-1.2 1-2 2-2s2 0.8 2 2v5" />
                <path d="M28 17c0-1.2 1-2 2-2s2 0.8 2 2v7c0 6-4 10-9 12" />
                <path d="M12 26c2.5 3 6 6 11 6.5" />
              </svg>
            </div>

            {/* Skrining Resep & Alergi Pasien Card */}
            <div className="neo-card animate-float" style={{
              width: '230px',
              padding: '16px 18px',
              backgroundColor: '#FFFFFF',
              boxShadow: '2.5px 3px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3D6',
                    border: '1.2px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '1px 1px 0px #1E1E1E'
                  }}>
                    <ShieldCheck size={16} strokeWidth={2.2} color="#18181B" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#18181B' }}>Skrining Resep</div>
                    <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700 }}>● Validasi Otomatis</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#18181B', margin: '12px 0 10px 0' }}>
                Alergi: Aman
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="tag-yellow" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Deep Learning</span>
                <span className="tag-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Interaksi</span>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 2: TOP RIGHT (Progress Chart) */}
          <div style={{
            position: 'absolute',
            top: '25px',
            right: '40px',
            zIndex: 10
          }} className="hero-floating-card top-right-card">
            <div className="neo-card animate-float-reverse" style={{
              width: '215px',
              padding: '16px 18px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#18181B' }}>Progress</span>
                <span style={{ fontSize: '1.2rem', color: '#6B7280', lineHeight: 0.5, cursor: 'pointer', letterSpacing: '1px' }}>···</span>
              </div>

              {/* Progress SVG Wave Chart exactly like reference */}
              <div style={{
                width: '100%',
                height: '66px',
                border: '1.8px solid #1E1E1E',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                position: 'relative'
              }}>
                <svg viewBox="0 0 160 55" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                  {/* Wave Yellow Fill */}
                  <path
                    d="M 0 32 L 20 28 L 42 16 L 68 25 L 94 20 L 122 10 L 145 9 L 160 10 L 160 55 L 0 55 Z"
                    fill="#FDE68A"
                  />
                  {/* Wave Black Stroke Line */}
                  <path
                    d="M 0 32 L 20 28 L 42 16 L 68 25 L 94 20 L 122 10 L 145 9 L 160 10"
                    fill="none"
                    stroke="#1E1E1E"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 3: BOTTOM LEFT (Inventori FEFO Pill) */}
          <div style={{
            position: 'absolute',
            top: '390px',
            left: '55px',
            zIndex: 10
          }} className="hero-floating-card bottom-left-card">
            <div className="neo-card animate-float-reverse" style={{
              padding: '12px 20px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              boxShadow: '2.5px 3px 0px #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FEF3C7',
                border: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '1px 1.5px 0px #1E1E1E'
              }}>
                <Package size={18} strokeWidth={2.3} color="#18181B" />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#18181B' }}>
                  Kontrol Stok FEFO
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  ● Deteksi Dini Kadaluwarsa
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 4: BOTTOM RIGHT (Instansi Faskes: Apotek, Klinik & RS) */}
          <div style={{
            position: 'absolute',
            top: '320px',
            right: '40px',
            zIndex: 10
          }} className="hero-floating-card bottom-right-card">
            <div className="neo-card animate-float" style={{
              width: '260px',
              padding: '16px 18px',
              backgroundColor: '#FFFFFF',
              boxShadow: '2.5px 3.5px 0px #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3D6',
                    border: '1.5px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '1px 1px 0px #1E1E1E'
                  }}>
                    <Building2 size={16} strokeWidth={2.2} color="#18181B" />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#18181B' }}>
                    Ekosistem Faskes
                  </span>
                </div>
                <span style={{ fontSize: '0.68rem', backgroundColor: '#DCFCE7', color: '#15803D', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', border: '1px solid #1E1E1E' }}>
                  TERUJI
                </span>
              </div>

              <div style={{
                backgroundColor: '#FAF8F4',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '12px',
                border: '1.2px solid #1E1E1E'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#18181B' }}>
                  Apotek • Klinik • RS
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: '2px' }}>
                  Standar ICD-10 & Farmakologi Nasional
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    backgroundColor: '#E0E7FF',
                    border: '1.2px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Pill size={14} color="#3730A3" strokeWidth={2.3} />
                  </span>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    backgroundColor: '#DCFCE7',
                    border: '1.2px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Stethoscope size={14} color="#166534" strokeWidth={2.3} />
                  </span>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    backgroundColor: '#FEF3D6',
                    border: '1.2px solid #1E1E1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShieldCheck size={14} color="#B45309" strokeWidth={2.3} />
                  </span>
                </div>

                <Link href="/dashboard" style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #1E1E1E',
                  backgroundColor: '#FEF3D6',
                  color: '#18181B',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  boxShadow: '1.5px 1.5px 0px #1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Dashboard <ArrowRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </div>

          {/* ===================== HERO CENTER CONTENT ===================== */}
          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            textAlign: 'center',
            paddingTop: '20px',
            paddingBottom: '20px',
            zIndex: 5
          }}>
            {/* Medical Neo Badge Above Title */}
            <div className="animate-wiggle" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
              backgroundColor: '#FEF3D6',
              border: '2px solid #1E1E1E',
              borderRadius: '14px',
              boxShadow: '2.5px 3px 0px #1E1E1E',
              marginBottom: '22px',
              cursor: 'pointer'
            }}>
              <Dna size={26} strokeWidth={2.3} color="#18181B" />
            </div>

            {/* Main Headline H1 */}
            <h1 style={{
              fontSize: 'clamp(2.3rem, 4.5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.2px',
              color: '#18181B',
              marginBottom: '20px'
            }}>
              Sistem Analisa Medis Penyakit & Obat Berbasis Deep Learning
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.05rem',
              color: '#52525B',
              lineHeight: 1.65,
              maxWidth: '640px',
              margin: '0 auto 36px auto'
            }}>
              <strong>MediagnoTek</strong> adalah media dan sistem cerdas analisis medis penyakit serta farmasi berbasis <em>Deep Learning</em>. Diperuntukkan secara terpadu untuk <strong>Apotek</strong>, <strong>Klinik</strong>, bahkan <strong>Rumah Sakit</strong> — menghadirkan skrining interaksi obat, deteksi alergi pasien, prediksi kebutuhan stok, dan katalog klinis akurat.
            </p>

            {/* Dual CTA Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <Link
                href="/dashboard"
                className="neo-btn-primary"
                style={{
                  padding: '13px 28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.96rem',
                  fontWeight: 800
                }}
              >
                <LayoutDashboard size={19} strokeWidth={2.3} />
                <span>Masuk Dashboard Apotek</span>
              </Link>
              <Link
                href="/dashboard/ai-analisa"
                className="neo-btn-secondary"
                style={{
                  padding: '13px 28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.96rem',
                  fontWeight: 800
                }}
              >
                <Bot size={19} strokeWidth={2.3} />
                <span>AI Analisa & Diagnosis</span>
              </Link>
            </div>
          </div>

          {/* ===================== LOGO PARTNER STRIP ===================== */}
          <div style={{
            marginTop: '70px',
            marginBottom: '10px',
            textAlign: 'center',
            zIndex: 5
          }}>
            <div style={{
              fontSize: '0.82rem',
              color: '#6B7280',
              fontWeight: 700,
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              Diintegrasikan Untuk Ekosistem Fasilitas Kesehatan
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              opacity: 0.95
            }}>
              {/* Partner 1: Apotek Retail */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: '#18181B',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <span style={{
                  backgroundColor: '#DCFCE7',
                  border: '1.2px solid #1E1E1E',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '7px',
                  flexShrink: 0
                }}>
                  <Pill size={15} strokeWidth={2.4} color="#15803D" />
                </span>
                Jejaring Apotek & Farmasi
              </div>

              {/* Partner 2: Klinik Pratama */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: '#18181B',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <span style={{
                  backgroundColor: '#DBEAFE',
                  border: '1.2px solid #1E1E1E',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '7px',
                  flexShrink: 0
                }}>
                  <Stethoscope size={15} strokeWidth={2.4} color="#1D4ED8" />
                </span>
                Klinik Pratama & Utama
              </div>

              {/* Partner 3: Rumah Sakit */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: '#18181B',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <span style={{
                  backgroundColor: '#FEF3D6',
                  border: '1.2px solid #1E1E1E',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '7px',
                  flexShrink: 0
                }}>
                  <Building2 size={15} strokeWidth={2.4} color="#B45309" />
                </span>
                Instalasi Farmasi Rumah Sakit
              </div>

              {/* Partner 4: Laboratorium Medis */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: '#18181B',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <span style={{
                  backgroundColor: '#FEE2E2',
                  border: '1.2px solid #1E1E1E',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '7px',
                  flexShrink: 0
                }}>
                  <Microscope size={15} strokeWidth={2.4} color="#B91C1C" />
                </span>
                Laboratorium Diagnostik
              </div>
            </div>
          </div>
        </section>

        {/* ===================== EXTENDED FEATURE SECTION (COHESIVE STYLE) ===================== */}
        <section id="fitur" style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '70px 24px 100px 24px',
          borderTop: '1px dashed #D1D5DB',
          marginTop: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="tag-yellow" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '14px' }}>
              Fitur Lengkap MediagnoTek
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
              fontWeight: 800,
              color: '#18181B',
              letterSpacing: '-0.8px',
              marginTop: '10px',
              marginBottom: '12px'
            }}>
              Dirancang untuk Akurasi & Kecepatan Diagnostik
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Kombinasi komputasi cerdas, katalog data medis komprehensif, dan antarmuka ramah pengguna.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {/* Feature Card 1: Deep Learning Penyakit */}
            <div className="neo-card" style={{ padding: '32px 28px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '13px',
                backgroundColor: '#FEF3D6',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Dna size={24} strokeWidth={2.2} color="#18181B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                Katalog Penyakit & ICD-10
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Database terstruktur memuat ribuan penyakit dengan indikasi klinis, komplikasi, klasifikasi standar ICD, dan panduan penanganan awal.
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/dashboard/penyakit" style={{
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Eksplorasi Katalog <span>→</span>
                </Link>
              </div>
            </div>

            {/* Feature Card 2: AI Analisa Gejala */}
            <div className="neo-card" style={{ padding: '32px 28px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '13px',
                backgroundColor: '#DCFCE7',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Bot size={24} strokeWidth={2.2} color="#18181B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                AI Analisa Gejala Klinis
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Modul penalaran cerdas untuk menghitung probabilitas diagnosis awal berdasarkan keluhan pasien dan parameter riwayat medis.
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/dashboard/ai-analisa" style={{
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Coba Analisa AI <span>→</span>
                </Link>
              </div>
            </div>

            {/* Feature Card 3: Kasir & Penebusan Resep POS */}
            <div className="neo-card" style={{ padding: '32px 28px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '13px',
                backgroundColor: '#FEF3D6',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <ShoppingCart size={24} strokeWidth={2.2} color="#18181B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                Kasir & Penebusan Resep (POS)
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Layanan transaksi apotek terpadu untuk resep dokter dan obat bebas, lengkap dengan cetak etiket aturan pakai obat secara otomatis.
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/dashboard/kasir" style={{
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Buka Kasir Resep <span>→</span>
                </Link>
              </div>
            </div>

            {/* Feature Card 4: Inventori FEFO Apotek */}
            <div className="neo-card" style={{ padding: '32px 28px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '13px',
                backgroundColor: '#FEF3C7',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Package size={24} strokeWidth={2.2} color="#18181B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                Inventori & Kontrol FEFO
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Manajemen nomor batch, masa kedaluwarsa First-Expired First-Out, dan deteksi otomatis stok menipis (defekta apotek).
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/dashboard/stok" style={{
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Kelola Stok Obat <span>→</span>
                </Link>
              </div>
            </div>

            {/* Feature Card 5: Rekam Medis & Pasien */}
            <div className="neo-card" style={{ padding: '32px 28px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '13px',
                backgroundColor: '#E0E7FF',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Users size={24} strokeWidth={2.2} color="#18181B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                Buku Pasien & Peringatan Alergi
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Penyimpanan profil pasien dengan rekam alergi obat, riwayat penyakit kronis, dan rekam jejak penebusan resep sebelumnya.
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/dashboard/pasien" style={{
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Buka Data Pasien <span>→</span>
                </Link>
              </div>
            </div>

            {/* Feature Card 6: Visualisasi & Statistik Kasus */}
            <div className="neo-card" style={{ padding: '32px 28px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '13px',
                backgroundColor: '#E0F2FE',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <LineChart size={24} strokeWidth={2.2} color="#18181B" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181B', marginBottom: '10px' }}>
                Visualisasi & Statistik Kasus
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Grafik interaktif tren sebaran penyakit, konsumsi obat apotek, korelasi faktor risiko, dan estimasi beban penanganan secara real-time.
              </p>
              <div style={{ marginTop: '20px' }}>
                <Link href="/dashboard/visual" style={{
                  color: '#18181B',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Buka Grafik Visual <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer style={{
        borderTop: '1.8px solid #1E1E1E',
        backgroundColor: '#FAF8F4',
        padding: '36px 32px',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#FEF3D6',
              border: '1.5px solid #1E1E1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>M</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#18181B' }}>
              MediagnoTek © {new Date().getFullYear()}
            </span>
            <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>— All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={{ color: '#6B7280', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500 }}>
              Privacy Policy
            </Link>
            <Link href="/" style={{ color: '#6B7280', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 500 }}>
              Terms of Service
            </Link>
            <Link href="/dashboard" style={{ color: '#18181B', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

      {/* Responsive CSS for Tablet & Mobile screens */}
      <style>{`
        @media (max-width: 1024px) {
          .hero-floating-card {
            position: static !important;
            margin: 12px auto !important;
            display: flex !important;
            justify-content: center !important;
          }
          .top-left-card, .top-right-card, .bottom-left-card, .bottom-right-card {
            position: static !important;
          }
        }
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
