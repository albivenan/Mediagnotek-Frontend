'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Dna,
  Pill,
  Microscope,
  Bot,
  Zap,
  Package,
  LineChart,
  Users,
  ShoppingCart,
  History,
  AlertTriangle,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Menu,
  Wallet,
  Building2,
  User,
  HelpCircle,
  X,
  ShieldCheck,
  Info
} from 'lucide-react';
import { apiGetCurrentUser } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Sidebar status: default open di desktop, persisten via localStorage
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Popup Pemberitahuan Mode Beta (Muncul pertama kali load dashboard, tidak bisa hilang sendiri, tutup via tombol silang)
  const [showBetaModal, setShowBetaModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenModal = sessionStorage.getItem('mediagnotek_beta_modal_seen');
      if (!hasSeenModal) {
        setShowBetaModal(true);
      }
    }
  }, []);

  const handleCloseBetaModal = () => {
    setShowBetaModal(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mediagnotek_beta_modal_seen', 'true');
    }
  };

  // Sync sidebar state dari localStorage saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      const savedState = localStorage.getItem('mediagnotek_sidebar_open');
      if (savedState !== null) {
        setSidebarOpen(isMobile ? false : savedState === 'true');
      } else {
        setSidebarOpen(!isMobile);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mediagnotek_sidebar_open', String(next));
      }
      return next;
    });
  };


  const [faskesName, setFaskesName] = useState('');
  const [userSession, setUserSession] = useState<{
    id?: number | string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  }>({
    name: '',
    email: '',
    role: 'APOTEKER',
    avatar: null
  });

  // Load sessions on mount & sync dynamically when changed
  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      if (typeof window === 'undefined') return;

      let currentName = '';
      let currentEmail = '';
      let currentRole = 'APOTEKER';
      let currentAvatar: string | null = null;
      let currentFaskes = '';
      let userId: number | undefined = undefined;

      // 1. Read user session from localStorage
      try {
        const savedUser = localStorage.getItem('mediagnotek_user_session');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser?.name) currentName = parsedUser.name;
          if (parsedUser?.email) currentEmail = parsedUser.email;
          if (parsedUser?.role) currentRole = parsedUser.role;
          if (parsedUser?.avatar) currentAvatar = parsedUser.avatar;
          if (parsedUser?.facility_name) currentFaskes = parsedUser.facility_name;
          if (parsedUser?.id && !isNaN(Number(parsedUser.id))) userId = Number(parsedUser.id);
        }
      } catch (err) {
        console.warn('Error reading mediagnotek_user_session:', err);
      }

      // 2. Read faskes session from localStorage
      try {
        const savedSession = localStorage.getItem('mediagnotek_faskes_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed?.faskes_profile?.nama_faskes && !currentFaskes) {
            currentFaskes = parsed.faskes_profile.nama_faskes;
          }
          if (!currentName && parsed?.faskes_profile?.penanggung_jawab) {
            currentName = parsed.faskes_profile.penanggung_jawab;
          }
          if (!currentEmail && parsed?.email) {
            currentEmail = parsed.email;
          }
          if (!currentAvatar && parsed?.faskes_profile?.foto_faskes_url) {
            currentAvatar = parsed.faskes_profile.foto_faskes_url;
          }
        }
      } catch (err) {
        console.warn('Error reading mediagnotek_faskes_session:', err);
      }

      // 3. If still empty, check backend if userId exists
      if (!currentName && userId) {
        try {
          const apiUser = await apiGetCurrentUser(userId);
          if (apiUser?.nama_lengkap) {
            currentName = apiUser.nama_lengkap;
            if (!currentEmail && apiUser.email) currentEmail = apiUser.email;
            if (apiUser.role) currentRole = apiUser.role;
            if (!currentFaskes && apiUser.facility_name) currentFaskes = apiUser.facility_name;
            if (!currentAvatar && apiUser.avatar_url) currentAvatar = apiUser.avatar_url;
          }
        } catch (apiErr) {
          console.warn('Failed to fetch user from backend /auth/me:', apiErr);
        }
      }

      if (!isMounted) return;

      // 4. Strict Production Route Guard: Redirect to /login if unauthenticated
      if (!currentEmail && !currentName) {
        router.push('/login');
        return;
      }

      setUserSession({
        name: currentName || 'Pengguna',
        email: currentEmail || '',
        role: currentRole || 'APOTEKER',
        avatar: currentAvatar
      });

      if (currentFaskes) {
        setFaskesName(currentFaskes);
      }
    };


    loadSession();
    window.addEventListener('storage', loadSession);
    window.addEventListener('mediagnotek_session_updated', loadSession);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadSession);
      window.removeEventListener('mediagnotek_session_updated', loadSession);
    };
  }, []);

  // Hanya tutup drawer otomatis saat navigasi jika pada layar mobile (< 768px)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);


  const navSections = [
    {
      title: 'Pelayanan Apotek (Front Office)',
      items: [
        { label: 'Overview Apotek', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Kasir & Resep (POS)', href: '/dashboard/kasir', icon: ShoppingCart },
        { label: 'Buku Data Pasien', href: '/dashboard/pasien', icon: Users },
      ]
    },
    {
      title: 'Inventori & Logistik (Back Office)',
      items: [
        {
          label: 'Stok & FEFO Obat',
          href: '/dashboard/stok',
          icon: Package,
          badge: '2 Exp',
          badgeColor: '#EF4444'
        },
        { label: 'Katalog Farmasi', href: '/dashboard/obat', icon: Pill },
      ]
    },
    {
      title: 'Klinis & Konseling AI',
      items: [
        { label: 'Asisten AI Apoteker', href: '/dashboard/ai-analisa', icon: Bot },
        { label: 'Katalog Penyakit', href: '/dashboard/penyakit', icon: Dna },
      ]
    },
    {
      title: 'Laporan & Tren',
      items: [
        { label: 'Analisa & Visual', href: '/dashboard/visual', icon: LineChart },
        { label: 'Laporan Keuangan', href: '/dashboard/keuangan', icon: Wallet },
      ]
    },
    {
      title: 'Bantuan & SOP',
      items: [
        { label: 'Petunjuk & Alur', href: '/dashboard/petunjuk', icon: HelpCircle },
      ]
    }
  ];

  const allNavItems = navSections.flatMap((s) => s.items);

  return (
    <div
      suppressHydrationWarning
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--warm-bg)',
        color: 'var(--warm-text)',
        position: 'relative'
      }}
    >
      {/* Backdrop overlay saat sidebar terbuka di layar mobile / tablet */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="dashboard-sidebar-backdrop"
          title="Tutup Menu"
        />
      )}

      {/* Sidebar in Neo-Brutalist Style with Fixed Height & Collapsible Toggle */}
      <aside
        className={`dashboard-sidebar-drawer ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: sidebarOpen ? '280px' : '0px',
          minWidth: sidebarOpen ? '280px' : '0px',
          backgroundColor: '#FFFFFF',
          borderRight: sidebarOpen ? '1.8px solid #1E1E1E' : 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          zIndex: 50,
          flexShrink: 0,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          visibility: sidebarOpen ? 'visible' : 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        {/* Sidebar Brand Logo & Close Toggle */}
        <div style={{
          padding: '18px 16px',
          borderBottom: '1.8px solid #1E1E1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', minWidth: 0 }}>
            <img
              src="/logo-mediagnotek.png"
              alt="MediagnoTek Logo"
              style={{
                width: '44px',
                height: '44px',
                objectFit: 'contain',
                flexShrink: 0
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181B', lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                MediagnoTek
              </div>
              <div style={{ fontSize: '0.68rem', color: '#166534', marginTop: '3px', fontWeight: 700 }}>
                ● Pharmacy Management
              </div>
            </div>
          </Link>

          {/* Toggle Close Button (Hanya tampil di mobile/tablet untuk menutup drawer) */}
          <button
            className="md-hidden-desktop"
            onClick={handleToggleSidebar}
            title="Tutup Sidebar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1.5px solid #1E1E1E',
              backgroundColor: '#FAF8F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#18181B',
              boxShadow: '1px 1px 0px #1E1E1E',
              flexShrink: 0
            }}
          >
            <PanelLeftClose size={18} strokeWidth={2.2} />
          </button>

        </div>


        {/* Sidebar Navigation Menu - Grouped clean scroll */}
        <nav style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto'
        }}>
          {navSections.map((section, sIdx) => (
            <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#9CA3AF',
                padding: '0 12px 4px 12px',
                letterSpacing: '0.6px',
                textTransform: 'uppercase'
              }}>
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? '#18181B' : '#4B5563',
                      backgroundColor: isActive ? '#FEF3D6' : 'transparent',
                      border: isActive ? '1.8px solid #1E1E1E' : '1.8px solid transparent',
                      boxShadow: isActive ? '2px 2px 0px #1E1E1E' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComponent
                        size={18}
                        strokeWidth={isActive ? 2.3 : 1.9}
                        style={{
                          color: isActive ? '#18181B' : '#4B5563',
                          flexShrink: 0
                        }}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span style={{
                        backgroundColor: item.badgeColor || '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        border: '1px solid #1E1E1E'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div style={{ padding: '16px', borderTop: '1.8px solid #1E1E1E' }}>
          <div style={{
            padding: '10px 12px',
            backgroundColor: '#FAF8F4',
            border: '1.5px solid #1E1E1E',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '1.5px 2px 0px #1E1E1E'
          }}>
            <Link
              href="/dashboard/profil"
              title="Lihat & Edit Profil Fasilitas Kesehatan"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: 1,
                minWidth: 0,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: pathname === '/dashboard/profil' ? '#FEF3D6' : '#DCFCE7',
                border: '1.5px solid #1E1E1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: pathname === '/dashboard/profil' ? '#18181B' : '#166534',
                boxShadow: '1px 1px 0px #1E1E1E',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                overflow: 'hidden'
              }}>
                {userSession.avatar ? (
                  <img src={userSession.avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={18} strokeWidth={2.2} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#18181B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={userSession.name}>
                  {userSession.name || 'Memuat Profil...'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ● {userSession.role || 'APOTEKER'} {faskesName ? `• ${faskesName.replace(' (Beta Demo)', '')}` : ''}
                </div>
              </div>
            </Link>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('mediagnotek_user_session');
                  window.location.href = '/login';
                }
              }}
              title="Keluar / Ganti Akun"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1.2px solid #1E1E1E',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                boxShadow: '1px 1px 0px #1E1E1E'
              }}
            >
              <LogOut size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace - Independent scroll area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Top Header */}
        <header
          className="dashboard-top-header"
          style={{
            height: '66px',
            minHeight: '66px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1.8px solid #1E1E1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Toolbar Button: Toggle Collapse/Expand Sidebar Menu */}
            <button
              suppressHydrationWarning
              onClick={handleToggleSidebar}
              title={sidebarOpen ? "Tutup Sidebar Menu (Sembunyikan)" : "Buka Sidebar Menu (Tampilkan)"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '10px',
                border: '1.8px solid #1E1E1E',
                backgroundColor: sidebarOpen ? '#FEF3D6' : '#FFFFFF',
                color: '#18181B',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '1.5px 1.5px 0px #1E1E1E',
                transition: 'all 0.15s ease'
              }}
            >
              {sidebarOpen ? <PanelLeftClose size={17} strokeWidth={2.2} /> : <PanelLeft size={17} strokeWidth={2.2} />}
              <span>{sidebarOpen ? 'Tutup Menu' : 'Menu'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="header-breadcrumb-prefix" style={{ fontSize: '0.88rem', color: '#6B7280', fontWeight: 500 }}>Dashboard /</span>
              <span style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#18181B',
                backgroundColor: '#FEF3D6',
                border: '1.2px solid #1E1E1E',
                padding: '3px 10px',
                borderRadius: '9999px',
                maxWidth: '180px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {(pathname === '/dashboard/petunjuk' || pathname === '/dashboard/panduan')
                  ? 'Petunjuk & Alur'
                  : (allNavItems.find(n => n.href === pathname)?.label || 'Overview Apotek')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>


            <div
              className="header-badge-status"
              title="Shared Beta Active: Semua akun terdaftar berbagi akses ke database operasional Apotek Sehat Farma"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: '#DCFCE7',
                border: '1.5px solid #1E1E1E',
                color: '#166534',
                fontSize: '0.78rem',
                fontWeight: 700,
                boxShadow: '1.5px 2px 0px #1E1E1E'
              }}
            >
              ● Shared Beta Active
            </div>
          </div>
        </header>


        {/* Dynamic Page Content */}
        <main
          className="dashboard-main-content"
          style={{
            flex: 1,
            padding: '28px',
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          {children}
        </main>

        {/* Dashboard Unified Neo-Brutalist Footer */}
        <footer
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1.8px solid #1E1E1E',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.82rem',
            color: '#4B5563',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/logo-mediagnotek.png"
              alt="MediagnoTek Logo"
              style={{
                width: '22px',
                height: '22px',
                objectFit: 'contain'
              }}
            />
            <strong style={{ color: '#18181B', fontWeight: 800 }}>MediagnoTek Pharmacy OS</strong>
            <span style={{ color: '#9CA3AF' }}>—</span>
            <span>Versi Beta 1.0</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: '#FEF3D6',
              border: '1px solid #1E1E1E',
              color: '#92400E',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}>
              ● Faskes: {faskesName || 'Apotek Sehat Farma'}
            </span>
            <span style={{ color: '#6B7280' }}>
              Hak Cipta © {new Date().getFullYear()} MediagnoTek. All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>

      {/* ===================== POPUP PEMBERITAHUAN MODE BETA ===================== */}
      {showBetaModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="neo-card"
            style={{
              position: 'relative',
              backgroundColor: '#FFFFFF',
              width: '92vw',
              maxWidth: '860px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              border: '3px solid #1E1E1E',
              boxShadow: '10px 10px 0px #1E1E1E',
              padding: '36px',
              animation: 'fadeIn 0.25s ease-out'
            }}
          >
            {/* Header Modal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#FEF3D6',
                  border: '2.2px solid #1E1E1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '3px 3px 0px #1E1E1E'
                }}
              >
                <AlertTriangle size={32} color="#D97706" strokeWidth={2.4} />
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#DBEAFE',
                    color: '#1E40AF',
                    border: '1.2px solid #1E1E1E',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginBottom: '4px'
                  }}
                >
                  PENGUMUMAN PENTING SISTEM
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#18181B', margin: 0, letterSpacing: '-0.5px' }}>
                  MediagnoTek Masih dalam Mode Beta
                </h2>
              </div>
            </div>

            {/* Isi Pengumuman */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '1rem', color: '#374151', lineHeight: 1.65 }}>
              <p style={{ margin: 0 }}>
                Selamat datang di platform <strong>MediagnoTek</strong> (Sistem Informasi Manajemen Apotek & Asisten Klinis AI). Mohon perhatikan beberapa poin penting selama tahap pengujian publik ini:
              </p>

              {/* Point 1: Data Bersama */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: '2px solid #1E1E1E',
                  backgroundColor: '#FEF9C3',
                  boxShadow: '3px 3px 0px #1E1E1E',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  <Users size={24} color="#854D0E" strokeWidth={2.4} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 900, color: '#713F12' }}>
                    Semua Data Dapat Diakses Bersama (Shared Environment)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#854D0E' }}>
                    Seluruh pengguna akun yang login berbagi akses ke basis data operasional yang sama (daftar pasien, stok obat, riwayat resep, dan kasir) guna memudahkan simulasi alur kerja multi-apoteker.
                  </p>
                </div>
              </div>

              {/* Point 2: Keamanan Data Login (Bold sesuai permintaan) */}
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '14px',
                  border: '2px solid #1E1E1E',
                  backgroundColor: '#DCFCE7',
                  boxShadow: '3px 3px 0px #1E1E1E',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  <ShieldCheck size={26} color="#166534" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 900, color: '#14532D' }}>
                    <strong>DATA REGISTER DAN LOGIN TETAP AMAN</strong>
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: '#166534' }}>
                    <strong>Meskipun data operasional apotek bersifat bersama, seluruh kredensial akun, password, dan informasi pendaftaran faskes Anda dienkripsi serta tersimpan secara aman dalam database privat dan tidak dapat diakses atau disalahgunakan oleh pengguna lain.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Modal Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '18px', borderTop: '2px solid #1E1E1E' }}>
              <button
                onClick={handleCloseBetaModal}
                className="neo-btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Saya Mengerti & Lanjutkan</span>
                <X size={18} strokeWidth={2.6} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

