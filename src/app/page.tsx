'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Bot,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  TrendingUp,
  Pill,
  Stethoscope,
  Building2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
  Receipt,
  QrCode,
  Banknote,
  Calendar,
  AlertTriangle,
  ChevronRight,
  FileText,
  UserPlus,
  LogIn,
  Activity,
  Newspaper,
  Globe,
  Dna,
  ExternalLink
} from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const session = localStorage.getItem('mediagnotek_user_session');
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed?.name || parsed?.email) {
            setIsLoggedIn(true);
            setUserName(parsed.name || parsed.email.split('@')[0]);
          }
        }
      } catch (e) {
        console.warn('Failed reading session on homepage:', e);
      }
    }
  }, []);

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
      {/* ===================== NAVBAR (FIXED ON DESKTOP, HIDDEN ON MOBILE) ===================== */}
      <header className="landing-topbar" style={{
        backgroundColor: 'rgba(250, 248, 244, 0.94)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1.8px solid #1E1E1E',
        padding: '14px 20px'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/logo-mediagnotek.png"
              alt="MediagnoTek Logo"
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#18181B', letterSpacing: '-0.4px', display: 'block', lineHeight: 1.1 }}>
                MediagnoTek
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#166534', letterSpacing: '0.2px' }}>
                ● Pharmacy & Health OS
              </span>
            </div>
          </Link>

          {/* Navigation Links (Hidden on small mobile) */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }} className="hidden-mobile">
            <a href="#fitur" style={{ color: '#18181B', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              Fitur Utama
            </a>
            <a href="#visual-3d" style={{ color: '#0284C7', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none' }}>
              Atlas Anatomi 3D
            </a>
            <a href="#berita" style={{ color: '#15803D', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none' }}>
              Warta & Berita
            </a>
            <a href="#alur" style={{ color: '#4B5563', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
              Alur Apotek
            </a>
            <a href="#keunggulan" style={{ color: '#4B5563', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
              Keunggulan
            </a>
          </nav>


          {/* Auth Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="nav-pill-join"
                style={{
                  padding: '7px 18px',
                  fontSize: '0.84rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  borderColor: '#15803D'
                }}
              >
                <LayoutDashboard size={15} />
                <span>Buka Dashboard ({userName ? userName.split(' ')[0] : 'Sesi Aktif'})</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="nav-pill-join"
                style={{ padding: '7px 18px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Login</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* ===================== HERO SECTION ===================== */}
      <main className="landing-main" style={{ flex: 1, position: 'relative' }}>
        <section className="hero-section-padding" style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '48px 20px 40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Top Pill Announcement */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #1E1E1E',
            padding: '5px 12px',
            borderRadius: '9999px',
            boxShadow: '1.5px 2px 0px #1E1E1E',
            marginBottom: '18px',
            maxWidth: '100%',
            justifyContent: 'center'
          }}>
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #166534',
              borderRadius: '9999px',
              padding: '2px 7px',
              fontSize: '0.7rem',
              fontWeight: 800
            }}>
              VERSI BETA 1.0
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#18181B' }}>
              Sistem Cerdas Faskes dengan Bantuan AI Klinis
            </span>
          </div>

          {/* Main Headline H1 */}
          <h1 style={{
            fontSize: 'clamp(1.85rem, 5vw, 3.6rem)',
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: '-1px',
            color: '#18181B',
            maxWidth: '960px',
            margin: '0 auto 18px auto'
          }}>
            Sistem Cerdas Berbasis <i><u>Artificial Intelligence</u></i> (AI) dengan Panduan Klinis untuk Fasilitas Kesehatan
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
            color: '#4B5563',
            lineHeight: 1.6,
            maxWidth: '780px',
            margin: '0 auto 30px auto'
          }}>
            <strong>MediagnoTek</strong> adalah sistem cerdas berbasis kecerdasan buatan (AI) yang dirancang dengan panduan klinis terstandarisasi untuk fasilitas kesehatan (faskes) termasuk administrasi data keuangan dan pasien.
          </p>

          {/* Action CTA Buttons */}
          <div className="hero-cta-group" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '36px',
            width: '100%'
          }}>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="neo-btn-primary hero-cta-btn"
                  style={{
                    padding: '13px 30px',
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <LayoutDashboard size={20} strokeWidth={2.4} />
                  <span>Lanjutkan ke Dashboard Faskes</span>
                </Link>
                <Link
                  href="/dashboard/anatomi"
                  className="hero-cta-btn"
                  style={{
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    border: '1.8px solid #1E1E1E',
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '2px 2px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Activity size={19} strokeWidth={2.2} />
                  <span>Atlas Anatomi 3D</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="neo-btn-primary hero-cta-btn"
                  style={{
                    padding: '13px 28px',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <UserPlus size={19} strokeWidth={2.4} />
                  <span>Daftar Akun (Sign Up)</span>
                </Link>

                <Link
                  href="/login"
                  className="hero-cta-btn"
                  style={{
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    border: '1.8px solid #1E1E1E',
                    backgroundColor: '#FEF3D6',
                    color: '#18181B',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '2px 2px 0px #1E1E1E',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <LogIn size={19} strokeWidth={2.2} />
                  <span>Masuk Dashboard</span>
                </Link>
              </>
            )}
          </div>


          {/* ===================== HERO DASHBOARD SHOWCASE CARD (DESKTOP) ===================== */}
          <div className="showcase-desktop" style={{
            width: '100%',
            maxWidth: '1080px',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E1E1E',
            borderRadius: '20px',
            boxShadow: '4px 6px 0px #1E1E1E',
            overflow: 'hidden',
            textAlign: 'left',
            marginBottom: '40px'
          }}>
            {/* Window Topbar */}
            <div style={{
              backgroundColor: '#FAF8F4',
              borderBottom: '1.8px solid #1E1E1E',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444', border: '1px solid #1E1E1E', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B', border: '1px solid #1E1E1E', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981', border: '1px solid #1E1E1E', display: 'inline-block' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#18181B', marginLeft: '6px' }}>
                  Apotek Sehat Farma • Sesi Operasional Aktif
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #1E1E1E'
                }}>
                  ● FastAPI Backend Connected
                </span>
              </div>
            </div>

            {/* Showcase Inside Grid: 4 Metric Cards */}
            <div style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              borderBottom: '1.8px solid #E5E7EB'
            }}>
              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.74rem', color: '#6B7280', fontWeight: 700 }}>OMZET TRANSAKSI HARI INI</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#18181B', margin: '4px 0' }}>Rp 1.486.000</div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>↑ 8 Transaksi Lunas</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#DCFCE7', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.74rem', color: '#166534', fontWeight: 800 }}>SKRINING RESEP PASIEN</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#14532D', margin: '4px 0' }}>100% Aman</div>
                <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 700 }}>✓ Alergi Tervalidasi Otomatis</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#FEF3C7', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.74rem', color: '#92400E', fontWeight: 800 }}>KONTROL FEFO GUDANG</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#78350F', margin: '4px 0' }}>2 Batch Expired</div>
                <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>⚠️ Prioritaskan Penjualan</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#FAF8F4', border: '1.5px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.74rem', color: '#6B7280', fontWeight: 700 }}>PASIEN TERDAFTAR</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#18181B', margin: '4px 0' }}>1.428 Pasien</div>
                <div style={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 700 }}>Lengkap NIK & Catatan Medis</div>
              </div>
            </div>

            {/* Showcase Inside Grid: Split Simulation Preview */}
            <div style={{
              padding: '20px',
              backgroundColor: '#FAF8F4',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '16px'
            }}>
              {/* Left Widget: Kasir & Resep Skrining */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.8px solid #1E1E1E',
                padding: '16px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShoppingCart size={16} /> Kasir & Penebusan Resep
                  </span>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#FEF3D6', padding: '2px 8px', borderRadius: '6px', border: '1px solid #1E1E1E', fontWeight: 700 }}>
                    TRX-9481
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#4B5563', marginBottom: '10px' }}>
                  Pasien: <strong>Budi Santoso</strong> • dr. H. Susanto, Sp.PD
                </div>
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#DCFCE7',
                  border: '1.2px solid #166534',
                  fontSize: '0.76rem',
                  color: '#14532D',
                  marginBottom: '10px',
                  fontWeight: 700
                }}>
                  ✓ Skrining Alergi: Amoxicillin tidak ada dalam resep ini. Obat (Metformin & Amlodipine) aman ditebus!
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #E5E7EB' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Total (Metode QRIS):</span>
                  <span style={{ fontSize: '0.98rem', fontWeight: 900, color: '#15803D' }}>Rp 620.000</span>
                </div>
              </div>

              {/* Right Widget: Asisten AI Apoteker */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.8px solid #1E1E1E',
                padding: '16px',
                boxShadow: '2px 2px 0px #1E1E1E'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Bot size={16} color="#92400E" /> Konseling Farmasi AI
                  </span>
                  <span style={{ fontSize: '0.7rem', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '6px', border: '1px solid #1E1E1E', fontWeight: 700 }}>
                    Aktif
                  </span>
                </div>
                <div style={{
                  backgroundColor: '#FAF8F4',
                  borderRadius: '8px',
                  padding: '10px',
                  border: '1.2px solid #E5E7EB',
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  color: '#18181B',
                  marginBottom: '10px'
                }}>
                  <strong>Apoteker:</strong> "Apakah aman jika Metformin 500mg dikombinasikan dengan Amlodipine 10mg?"<br />
                  <strong style={{ color: '#0284C7' }}>AI Apoteker:</strong> "Aman tanpa interaksi merugikan langsung. Disarankan minum Metformin sesudah makan dan Amlodipine pada malam hari."
                </div>
                <Link
                  href="/dashboard/ai-analisa"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#18181B',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Coba Konseling AI Lengkap <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* ===================== SIMPLIFIED HERO CARD FOR MOBILE ===================== */}
          <div className="showcase-mobile" style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            border: '2px solid #1E1E1E',
            borderRadius: '16px',
            boxShadow: '3px 4px 0px #1E1E1E',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '28px'
          }}>
            {/* Top status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#18181B' }}>Apotek Sehat Farma</span>
              </div>
              <span style={{ fontSize: '0.68rem', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px', border: '1px solid #166534' }}>
                POS Aktif
              </span>
            </div>

            {/* 2 Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px 10px', backgroundColor: '#FAF8F4', borderRadius: '10px', border: '1.2px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700 }}>OMZET HARI INI</div>
                <div style={{ fontSize: '1.08rem', fontWeight: 900, color: '#18181B', marginTop: '2px' }}>Rp 1.486.000</div>
              </div>
              <div style={{ padding: '8px 10px', backgroundColor: '#DCFCE7', borderRadius: '10px', border: '1.2px solid #1E1E1E' }}>
                <div style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 800 }}>SKRINING RESEP</div>
                <div style={{ fontSize: '1.08rem', fontWeight: 900, color: '#14532D', marginTop: '2px' }}>100% Aman</div>
              </div>
            </div>

            {/* Quick action bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              backgroundColor: '#FEF3D6',
              borderRadius: '10px',
              border: '1.2px solid #1E1E1E'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#18181B' }}>
                <ShoppingCart size={15} />
                <span>Penebusan Resep & Kasir</span>
              </div>
              <Link href="/dashboard/kasir" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#18181B', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Buka <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* ===================== LOGO PARTNER STRIP ===================== */}
          <div style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>
            <div style={{
              fontSize: '0.78rem',
              color: '#6B7280',
              fontWeight: 800,
              marginBottom: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}>
              Diintegrasikan Untuk Ekosistem Fasilitas Kesehatan
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Pill size={16} strokeWidth={2.4} color="#15803D" />
                <span>Jejaring Apotek & Farmasi</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Stethoscope size={16} strokeWidth={2.4} color="#1D4ED8" />
                <span>Klinik Pratama & Dokter</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '0.88rem',
                backgroundColor: '#FFFFFF',
                border: '1.8px solid #1E1E1E',
                padding: '8px 16px',
                borderRadius: '12px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Building2 size={16} strokeWidth={2.4} color="#B45309" />
                <span>Instalasi Farmasi RS</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SECTION FITUR UTAMA ===================== */}
        <section id="fitur" style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '60px 20px 80px 20px',
          borderTop: '1.8px dashed #D1D5DB'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="tag-yellow" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '12px' }}>
              Panduan Klinis & Layanan Faskes Terpadu
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 900,
              color: '#18181B',
              letterSpacing: '-0.8px',
              marginTop: '10px',
              marginBottom: '12px'
            }}>
              Solusi Klinis & Operasional untuk Fasilitas Kesehatan
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.98rem', maxWidth: '680px', margin: '0 auto' }}>
              Semua modul terintegrasi dengan panduan klinis terstandarisasi: Dari skrining interaksi obat, kasir resep terproteksi, alokasi stok FEFO, hingga rekam keselamatan pasien di faskes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '20px'
          }}>
            {/* Fitur 1: Kasir & POS Resep */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#DCFCE7',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <ShoppingCart size={22} strokeWidth={2.3} color="#15803D" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Kasir & Penebusan Resep (POS)
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Dukungan resep dokter maupun obat bebas (OTC), cetak etiket aturan pakai obat otomatis, serta pembayaran instan QRIS dan Tunai.
              </p>
              <Link href="/dashboard/kasir" style={{ color: '#18181B', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Buka Kasir Apotek <span>→</span>
              </Link>
            </div>

            {/* Fitur 2: Stok & FEFO */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FEF3C7',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Package size={22} strokeWidth={2.3} color="#B45309" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Kontrol Stok FEFO & Expired
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Lacak batch obat berdasarkan First Expired First Out. Deteksi dini obat mendekati kadaluwarsa (&lt; 60 hari) dan peringatan stok menipis (defecta).
              </p>
              <Link href="/dashboard/stok" style={{ color: '#18181B', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Kelola Inventori & FEFO <span>→</span>
              </Link>
            </div>

            {/* Fitur 3: Rekam Pasien & Alergi */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#E0E7FF',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Users size={22} strokeWidth={2.3} color="#3730A3" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Buku Pasien & Skrining Alergi
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Simpan data pasien lengkap dengan riwayat alergi obat dan penyakit kronis. Mencegah kesalahan peracikan fatal secara proaktif.
              </p>
              <Link href="/dashboard/pasien" style={{ color: '#18181B', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Lihat Buku Data Pasien <span>→</span>
              </Link>
            </div>

            {/* Fitur 4: AI Analisa Apoteker */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FEF3D6',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Bot size={22} strokeWidth={2.3} color="#92400E" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Asisten AI Klinis Apoteker
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Asisten interaktif berstandar ICD-10 untuk mengecek potensi interaksi antar obat, penyesuaian dosis khusus, dan panduan konseling farmasi.
              </p>
              <Link href="/dashboard/ai-analisa" style={{ color: '#18181B', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Mulai Tanya Jawab AI <span>→</span>
              </Link>
            </div>

            {/* Fitur 5: Keuangan & Laba Rugi */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#E0F2FE',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Wallet size={22} strokeWidth={2.3} color="#0369A1" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Laporan Keuangan & HPP
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Rekapitulasi otomatis arus kas masuk per metode (QRIS vs Tunai), kalkulasi HPP obat dari PBF, dan persentase margin keuntungan harian.
              </p>
              <Link href="/dashboard/keuangan" style={{ color: '#18181B', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Buka Laporan Keuangan <span>→</span>
              </Link>
            </div>

            {/* Fitur 6: Visual & Tren Statistik */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#F3E8FF',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <TrendingUp size={22} strokeWidth={2.3} color="#7E22CE" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Grafik Tren & Visual Data
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Visualisasi interaktif pola penyakit musiman, tren resep bulanan, dan evaluasi keparahan kasus klinis faskes.
              </p>
              <Link href="/dashboard/visual" style={{ color: '#18181B', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Eksplorasi Grafik Data <span>→</span>
              </Link>
            </div>

            {/* Fitur 7: Atlas Anatomi 3D & Pemetaan Farmakologi */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#E0F2FE',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Activity size={22} strokeWidth={2.3} color="#0284C7" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Atlas Visualisasi Anatomi 3D
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Visualisasi 3D organ tubuh manusia interaktif 360° berbasis Three.js WebGL, 16 organ prosedural, pemetaan lapisan sistem, dan diagnosa farmakologi presisi.
              </p>
              <Link href="/dashboard/anatomi" style={{ color: '#0284C7', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Jelajahi Anatomi 3D <span>→</span>
              </Link>
            </div>

            {/* Fitur 8: Warta & Berita Kesehatan Terkini */}
            <div className="neo-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF', boxShadow: '2.5px 3px 0px #1E1E1E' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#DCFCE7',
                border: '1.8px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}>
                <Newspaper size={22} strokeWidth={2.3} color="#15803D" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181B', marginBottom: '8px' }}>
                Warta & Berita Kesehatan RI
              </h3>
              <p style={{ color: '#52525B', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '18px' }}>
                Sindikasi berita medis real-time seputar kebijakan Kemenkes & BPJS, riset penyakit epidemi, obat & farmasi, serta teknologi faskes Indonesia.
              </p>
              <Link href="/dashboard/berita" style={{ color: '#15803D', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Baca Warta Medis <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ===================== SECTION HIGHLIGHT: VISUALISASI ANATOMI 3D ===================== */}
        <section id="visual-3d" style={{
          backgroundColor: '#FAF8F4',
          borderTop: '1.8px solid #1E1E1E',
          padding: '70px 20px 80px 20px'
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
              gap: '36px',
              alignItems: 'center'
            }}>
              {/* Kolom Kiri: Penjelasan & Poin Fitur Anatomi 3D */}
              <div>
                <span className="tag-cyan" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} /> THREE.JS WEBGL 3D ANATOMICAL ENGINE
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 900,
                  color: '#18181B',
                  letterSpacing: '-0.8px',
                  lineHeight: 1.2,
                  marginTop: '10px',
                  marginBottom: '16px'
                }}>
                  Atlas Anatomi Tubuh 3D & Pemetaan Farmakoterapi
                </h2>
                <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                  Eksplorasi visual 16 organ tubuh manusia secara 3D interaktif 360°, lengkap dengan pemisahan lapisan sistem biologis, deskripsi patologi penyakit, dan rekomendasi terapi obat berstandar klinis.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#DCFCE7',
                      border: '1.4px solid #1E1E1E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <CheckCircle2 size={16} color="#15803D" strokeWidth={2.5} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: '#18181B' }}>16 Organ Prosedural Beresolusi Tinggi</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.86rem', color: '#6B7280', lineHeight: 1.5 }}>
                        Otak, Paru-paru, Jantung, Mata, Hati, Lambung, Ginjal, Tiroid, Esofagus, Limpa, Pankreas, Empedu, Usus Halus, Usus Besar, Kandung Kemih, dan Tulang Belakang.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#E0F2FE',
                      border: '1.4px solid #1E1E1E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <CheckCircle2 size={16} color="#0369A1" strokeWidth={2.5} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: '#18181B' }}>Filter Lapisan Sistem & Kunci Organ Target</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.86rem', color: '#6B7280', lineHeight: 1.5 }}>
                        Saring lapisan sistem saraf, pencernaan, respirasi, hingga kardiovaskular. Kunci organ target secara langsung dengan kontrol reset silang (✕) yang intuitif.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#FEF3C7',
                      border: '1.4px solid #1E1E1E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <CheckCircle2 size={16} color="#B45309" strokeWidth={2.5} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: '#18181B' }}>Model Pria/Wanita & Mode Hologram/X-Ray</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.86rem', color: '#6B7280', lineHeight: 1.5 }}>
                        Dukungan model 3D anatomi pria dan wanita, simulasi denyut jantung real-time, ekspansi pernapasan paru, serta mode visual Hologram Glass, X-Ray Mesh, dan Solid Body.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="/dashboard/anatomi"
                    className="neo-btn-primary"
                    style={{ padding: '12px 26px', fontSize: '0.92rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Activity size={18} strokeWidth={2.4} />
                    <span>Buka Atlas Anatomi 3D</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="neo-btn-secondary"
                    style={{ padding: '12px 22px', fontSize: '0.92rem', fontWeight: 800 }}
                  >
                    Masuk ke Dashboard
                  </Link>
                </div>
              </div>

              {/* Kolom Kanan: Visual Card Mockup 3D Anatomi */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '2px solid #1E1E1E',
                boxShadow: '4px 6px 0px #1E1E1E',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Mockup Header */}
                <div style={{
                  backgroundColor: '#FAF8F4',
                  borderBottom: '1.8px solid #1E1E1E',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284C7', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#18181B' }}>
                      3D WebGL Canvas • Jantung (Cor) & Kardiovaskular
                    </span>
                  </div>
                  <span style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.70rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid #1E1E1E'
                  }}>
                    ● 60 FPS Real-time
                  </span>
                </div>

                {/* Mockup 3D Preview Frame (Hanya Gambar Jantung di dalam Bingkai) */}
                <div style={{
                  padding: '36px 24px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '320px'
                }}>
                  <div style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '28px',
                    backgroundColor: '#FEF2F2',
                    border: '2.5px solid #EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 0px #EF4444'
                  }}>
                    <img
                      src="/images/organs/heart.svg"
                      alt="3D Heart Anatomy"
                      style={{ width: '135px', height: '135px', objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Mockup Footer Quick Link */}
                <div style={{
                  padding: '12px 18px',
                  backgroundColor: '#FAF8F4',
                  borderTop: '1.6px solid #1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                    16 Organ Aktif Tersedia
                  </span>
                  <Link href="/dashboard/anatomi" style={{ fontSize: '0.80rem', fontWeight: 800, color: '#0284C7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Interaksi 360° Sekarang <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SECTION HIGHLIGHT: WARTA & BERITA KESEHATAN ===================== */}
        <section id="berita" style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1.8px solid #1E1E1E',
          padding: '70px 20px 80px 20px'
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '38px' }}>
              <div>
                <span className="tag-yellow" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} /> KANAL BERITA & INFORMASI MEDIS TERKINI
                </span>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 900,
                  color: '#18181B',
                  letterSpacing: '-0.8px',
                  lineHeight: 1.2,
                  marginTop: '10px',
                  marginBottom: '8px'
                }}>
                  Warta Kesehatan & Kebijakan Medis Indonesia
                </h2>
                <p style={{ color: '#6B7280', fontSize: '0.98rem', maxWidth: '640px', margin: 0 }}>
                  Update harian seputar regulasi Kemenkes, integrasi BPJS Kesehatan, tren obat & farmasi, serta temuan riset klinis di Indonesia.
                </p>
              </div>

              <Link
                href="/dashboard/berita"
                className="neo-btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.88rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Newspaper size={16} />
                <span>Lihat Semua Berita Live</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* 3 Featured News Preview Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: '22px'
            }}>
              {/* Berita 1 */}
              <div className="neo-card" style={{
                backgroundColor: '#FAF8F4',
                padding: '22px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                boxShadow: '3px 3px 0px #1E1E1E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#E0E7FF', color: '#3730A3', padding: '3px 9px', borderRadius: '6px', border: '1px solid #1E1E1E' }}>
                      Kemenkes & Regulasi
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Hari Ini
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#18181B', marginBottom: '10px', lineHeight: 1.4 }}>
                    Standardisasi Rekam Medis Elektronik Terintegrasi SatuSehat Kemenkes
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#52525B', lineHeight: 1.55, margin: 0 }}>
                    Kementerian Kesehatan RI mendorong percepatan implementasi rekam medis digital dan kesiapsiagaan sistem informasi seluruh apotek dan faskes nasional.
                  </p>
                </div>
                <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px dashed #D1D5DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563' }}>Sumber: Warta Nasional</span>
                  <Link href="/dashboard/berita" style={{ fontSize: '0.80rem', fontWeight: 800, color: '#0284C7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>

              {/* Berita 2 */}
              <div className="neo-card" style={{
                backgroundColor: '#FAF8F4',
                padding: '22px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                boxShadow: '3px 3px 0px #1E1E1E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 9px', borderRadius: '6px', border: '1px solid #1E1E1E' }}>
                      Obat & Farmasi
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Terkini
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#18181B', marginBottom: '10px', lineHeight: 1.4 }}>
                    Pedoman Keamanan Interaksi Polifarmasi Pasien Geriatri di Apotek
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#52525B', lineHeight: 1.55, margin: 0 }}>
                    Ikatan Apoteker Indonesia (IAI) merilis panduan skrining interaksi obat kombinasi hipertensi dan diabetes melitus guna menekan risiko efek samping fatal.
                  </p>
                </div>
                <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px dashed #D1D5DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563' }}>Sumber: Farmasi Indonesia</span>
                  <Link href="/dashboard/berita" style={{ fontSize: '0.80rem', fontWeight: 800, color: '#0284C7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>

              {/* Berita 3 */}
              <div className="neo-card" style={{
                backgroundColor: '#FAF8F4',
                padding: '22px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                boxShadow: '3px 3px 0px #1E1E1E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 9px', borderRadius: '6px', border: '1px solid #1E1E1E' }}>
                      Klinis & Rumah Sakit
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Update
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#18181B', marginBottom: '10px', lineHeight: 1.4 }}>
                    Strategi Penurunan Angka Resistensi Antimikroba (AMR) Nasional
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#52525B', lineHeight: 1.55, margin: 0 }}>
                    Pengetatan peresepan antibiotik golongan tinggi dan pengawasan dispensing obat keras oleh tenaga farmasi di instalasi rawat jalan.
                  </p>
                </div>
                <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px dashed #D1D5DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563' }}>Sumber: Medika Pos</span>
                  <Link href="/dashboard/berita" style={{ fontSize: '0.80rem', fontWeight: 800, color: '#0284C7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SECTION ALUR OPERASIONAL ===================== */}
        <section id="alur" style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1.8px solid #1E1E1E',
          borderBottom: '1.8px solid #1E1E1E',
          padding: '60px 20px 70px 20px'
        }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '44px' }}>
              <span className="tag-cyan" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '12px' }}>
                Alur Kerja Apotek
              </span>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 900,
                color: '#18181B',
                letterSpacing: '-0.8px',
                marginTop: '10px',
                marginBottom: '12px'
              }}>
                4 Langkah Mudah Penebusan Resep & Transaksi
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.98rem', maxWidth: '640px', margin: '0 auto' }}>
                Bagaimana sistem melindungi apoteker dan mempercepat pelayanan kepada pasien.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
              gap: '20px'
            }}>
              {/* Step 1 */}
              <div style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: '#FAF8F4',
                boxShadow: '2px 3px 0px #1E1E1E',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '20px',
                  backgroundColor: '#FEF3D6',
                  color: '#18181B',
                  border: '1.8px solid #1E1E1E',
                  borderRadius: '9999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem'
                }}>
                  1
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', marginBottom: '8px' }}>
                  Pilih Data Pasien
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.5 }}>
                  Cari nama atau NIK pasien terdaftar untuk memuat riwayat pengobatan dan riwayat alergi obat sebelumnya.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: '#FAF8F4',
                boxShadow: '2px 3px 0px #1E1E1E',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '20px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  border: '1.8px solid #1E1E1E',
                  borderRadius: '9999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem'
                }}>
                  2
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', marginBottom: '8px' }}>
                  Validasi Skrining Otomatis
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.5 }}>
                  Sistem langsung mendeteksi kontraindikasi alergi dan interaksi antar obat secara real-time saat obat dimasukkan.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: '#FAF8F4',
                boxShadow: '2px 3px 0px #1E1E1E',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '20px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  border: '1.8px solid #1E1E1E',
                  borderRadius: '9999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem'
                }}>
                  3
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', marginBottom: '8px' }}>
                  Alokasi Stok FEFO
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.5 }}>
                  Stok otomatis terpotong dari batch yang mendekati expired terlebih dahulu, menghindari kerugian obat basi.
                </p>
              </div>

              {/* Step 4 */}
              <div style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: '#FAF8F4',
                boxShadow: '2px 3px 0px #1E1E1E',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '20px',
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
                  border: '1.8px solid #1E1E1E',
                  borderRadius: '9999px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem'
                }}>
                  4
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '8px', marginBottom: '8px' }}>
                  Bayar & Cetak Etiket
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.5 }}>
                  Terima pembayaran QRIS atau Tunai, cetak struk nota belanja serta etiket aturan minum obat pasien.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== SECTION KEUNGGULAN (COMPARISON) ===================== */}
        <section id="keunggulan" style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '70px 20px 80px 20px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="tag-yellow" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '12px' }}>
              Perbandingan Sistem
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 900,
              color: '#18181B',
              letterSpacing: '-0.8px',
              marginTop: '10px'
            }}>
              Mengapa Apotek Modern Memilih MediagnoTek?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '24px'
          }}>
            {/* Box Cara Manual / Lama */}
            <div style={{
              padding: '28px',
              borderRadius: '18px',
              border: '1.8px solid #DC2626',
              backgroundColor: '#FEF2F2',
              boxShadow: '3px 3px 0px #DC2626'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: 800, fontSize: '1.05rem', marginBottom: '16px' }}>
                <AlertTriangle size={20} />
                Sistem Apotek Konvensional / Manual
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#7F1D1D' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✕</span> Stok kadaluwarsa tidak terpantau hingga obat basi di rak gudang.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✕</span> Risiko fatal salah menyerahkan obat yang kontraindikasi dengan alergi pasien.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✕</span> Kasir terpisah dari kartu stok sehingga selisih fisik obat sering terjadi.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✕</span> Pencatatan uang tunai dan QRIS tercampur tanpa kalkulasi HPP dan laba bersih.
                </li>
              </ul>
            </div>

            {/* Box Dengan MediagnoTek */}
            <div style={{
              padding: '28px',
              borderRadius: '18px',
              border: '2px solid #166534',
              backgroundColor: '#DCFCE7',
              boxShadow: '3px 4px 0px #166534'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 900, fontSize: '1.05rem', marginBottom: '16px' }}>
                <CheckCircle2 size={20} />
                Dengan MediagnoTek Pharmacy OS
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#14532D' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✓</span> Peringatan dini FEFO otomatis &lt; 60 hari sebelum expired dan defecta stok.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✓</span> Skrining alergi real-time langsung memblokir peracikan obat berisiko.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✓</span> Kasir otomatis memotong stok batch obat yang paling awal kadaluwarsa.
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span>✓</span> Laporan keuangan harian terpisah rapi antara QRIS dan Kas Tunai Kasir.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===================== FINAL CALL TO ACTION ===================== */}
        <section style={{
          backgroundColor: '#FAF8F4',
          borderTop: '1.8px solid #1E1E1E',
          padding: '60px 20px 70px 20px'
        }}>
          <div style={{
            maxWidth: '860px',
            margin: '0 auto',
            backgroundColor: '#FEF3D6',
            border: '2px solid #1E1E1E',
            borderRadius: '24px',
            padding: '40px 28px',
            textAlign: 'center',
            boxShadow: '4px 5px 0px #1E1E1E'
          }}>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', fontWeight: 900, color: '#18181B', letterSpacing: '-0.6px', marginBottom: '12px' }}>
              Mulai Modernisasi Apotek & Faskes Anda Hari Ini
            </h2>
            <p style={{ color: '#4B5563', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 26px auto', lineHeight: 1.6 }}>
              Akses demo instan tanpa ribet. Pantau inventori FEFO, layani pasien dengan skrining cerdas, dan tingkatkan profit faskes Anda.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="neo-btn-primary"
                  style={{ padding: '13px 32px', fontSize: '0.96rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <LayoutDashboard size={18} />
                  <span>Buka Dashboard Faskes</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="neo-btn-primary"
                    style={{ padding: '13px 30px', fontSize: '0.96rem', fontWeight: 800 }}
                  >
                    Daftar Akun Faskes (Sign Up)
                  </Link>
                  <Link
                    href="/login"
                    className="neo-btn-secondary"
                    style={{ padding: '13px 28px', fontSize: '0.96rem', fontWeight: 800 }}
                  >
                    Masuk ke Akun (Login)
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1.8px solid #1E1E1E',
        padding: '30px 20px'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo-mediagnotek.png"
              alt="MediagnoTek Logo"
              style={{
                width: '34px',
                height: '34px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <div>
              <span style={{ fontWeight: 900, fontSize: '0.98rem', color: '#18181B', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.2 }}>
                MediagnoTek
              </span>
              <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                Sistem Operasional Apotek & AI Klinis — Hak Cipta © {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <a href="#fitur" style={{ color: '#4B5563', fontSize: '0.86rem', textDecoration: 'none', fontWeight: 600 }}>
              Fitur Utama
            </a>
            <a href="#alur" style={{ color: '#4B5563', fontSize: '0.86rem', textDecoration: 'none', fontWeight: 600 }}>
              Alur Pelayanan
            </a>
            <a href="#keunggulan" style={{ color: '#4B5563', fontSize: '0.86rem', textDecoration: 'none', fontWeight: 600 }}>
              Keunggulan
            </a>
            {isLoggedIn ? (
              <Link href="/dashboard" style={{ color: '#15803D', fontSize: '0.86rem', textDecoration: 'none', fontWeight: 800 }}>
                Buka Dashboard →
              </Link>
            ) : (
              <Link href="/login" style={{ color: '#18181B', fontSize: '0.86rem', textDecoration: 'none', fontWeight: 800 }}>
                Masuk Akun →
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
